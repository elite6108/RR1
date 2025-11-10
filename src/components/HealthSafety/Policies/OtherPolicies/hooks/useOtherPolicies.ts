import React, { useState, useEffect } from 'react';
import { supabase } from '../../../../../lib/supabase';

export interface PDFFile {
  id: string;
  name: string;
  type: 'uploaded' | 'created';
  created_at: string;
  updated_at?: string;
  policy_number?: string;
  size: number;
  url: string;
  displayName?: string;
  content?: string;
  signed_url: string;
}

export const useOtherPolicies = () => {
  const [pdfFiles, setPdfFiles] = useState<PDFFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generatingPdfId, setGeneratingPdfId] = useState<string | null>(null);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  const generateSignedUrl = async (fileName: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('other-policies')
        .createSignedUrl(fileName, 60 * 60); // 1 hour expiry
      
      if (error) throw error;
      return data?.signedUrl || '';
    } catch (error) {
      console.error('Error generating signed URL:', error);
      return '';
    }
  };

  const fetchPDFFiles = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch storage files
      const { data: filesData, error: filesError } = await supabase
        .storage
        .from('other-policies')
        .list();

      if (filesError) throw filesError;

      // Fetch metadata for all files
      const { data: metadataData, error: metadataError } = await supabase
        .from('other_policy_files')
        .select('*, policy_number')
        .order('created_at', { ascending: false });

      if (metadataError) throw metadataError;

      // Combine storage files and created policies
      const pdfFiles: PDFFile[] = [];

      // Add uploaded files
      if (filesData) {
        const uploadedFiles = await Promise.all(
          filesData
            .filter(file => file.name.toLowerCase().endsWith('.pdf'))
            .map(async (file) => {
              const signedUrl = await generateSignedUrl(file.name);
              const metadata = metadataData?.find(m => m.file_name === file.name);
              return {
                id: file.id,
                name: file.name,
                policy_number: metadataData?.find(m => m.file_name === file.name)?.policy_number,
                created_at: file.created_at,
                size: file.metadata?.size || 0,
                url: signedUrl,
                signed_url: signedUrl,
                displayName: metadata?.display_name || file.name.replace(/\.pdf$/i, ''),
                type: 'uploaded' as const
              };
            })
        );
        pdfFiles.push(...uploadedFiles);
      }

      // Add created policies
      const createdPolicies = metadataData
        ?.filter(m => m.type === 'created')
        .map(policy => ({
          id: policy.id,
          name: policy.file_name,
          created_at: policy.created_at,
          updated_at: policy.updated_at,
          policy_number: policy.policy_number,
          size: 0,
          displayName: policy.display_name,
          type: 'created' as const,
          content: policy.content
        })) || [];
      pdfFiles.push(...createdPolicies);

      setPdfFiles(pdfFiles);
    } catch (err) {
      console.error('Error fetching PDF files:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while fetching PDF files');
    } finally {
      setLoading(false);
    }
  };

  // Add a function to refresh signed URLs
  const refreshSignedUrls = async () => {
    const updatedFiles = await Promise.all(
      pdfFiles.map(async (file) => {
        if (file.type === 'uploaded') {
          const signedUrl = await generateSignedUrl(file.name);
          return {
            ...file,
            url: signedUrl,
            signed_url: signedUrl,
          };
        }
        return file;
      })
    );
    setPdfFiles(updatedFiles);
  };

  useEffect(() => {
    fetchPDFFiles();
  }, []);

  // Refresh signed URLs every 45 minutes
  useEffect(() => {
    const interval = setInterval(refreshSignedUrls, 45 * 60 * 1000);
    return () => clearInterval(interval);
  }, [pdfFiles]);

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedAndFilteredFiles = React.useMemo(() => {
    let filteredFiles = [...pdfFiles];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredFiles = filteredFiles.filter(file => 
        file.displayName?.toLowerCase().includes(query) ||
        file.policy_number?.toString().includes(query)
      );
    }

    // Apply sorting
    if (sortConfig) {
      filteredFiles.sort((a, b) => {
        if (sortConfig.key === 'displayName') {
          const aValue = a.displayName || '';
          const bValue = b.displayName || '';
          return sortConfig.direction === 'asc' 
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }
        if (sortConfig.key === 'created_at') {
          const aDate = new Date(a.created_at).getTime();
          const bDate = new Date(b.created_at).getTime();
          return sortConfig.direction === 'asc' 
            ? aDate - bDate
            : bDate - aDate;
        }
        return 0;
      });
    }

    return filteredFiles;
  }, [pdfFiles, searchQuery, sortConfig]);

  return {
    pdfFiles,
    setPdfFiles,
    loading,
    setLoading,
    error,
    setError,
    generatingPdfId,
    setGeneratingPdfId,
    pdfError,
    setPdfError,
    searchQuery,
    setSearchQuery,
    sortConfig,
    setSortConfig,
    fetchPDFFiles,
    generateSignedUrl,
    handleSort,
    sortedAndFilteredFiles
  };
};
