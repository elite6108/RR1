import { useState, useEffect } from 'react';
import { supabase } from '../../../../../lib/supabase';
import { PDFFile } from '../types';
import { generateSignedUrl } from '../utils/pdfViewerHelpers';

export const usePolicyData = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pdfFiles, setPdfFiles] = useState<PDFFile[]>([]);

  const fetchPDFFiles = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Starting to fetch PDF files...');

      // First, check if we can access the storage bucket
      const { data: bucketData, error: bucketError } = await supabase
        .storage
        .from('hs-policies')
        .list();
      
      if (bucketError) {
        console.error('Error accessing storage bucket:', bucketError);
        throw bucketError;
      }
      console.log('Storage bucket accessed successfully');
      console.log('Files in bucket:', bucketData);

      // Fetch metadata for uploaded files and created H&S policies
      const { data: policiesData, error: metadataError } = await supabase
        .from('hs_policy_files')
        .select('*')
        .order('created_at', { ascending: false });

      if (metadataError) {
        console.error('Error fetching metadata:', metadataError);
        throw metadataError;
      }
      console.log('Metadata fetched successfully');
      console.log('Number of policies in database:', policiesData?.length || 0);
      console.log('Policies data:', policiesData);

      const metadataMap = new Map(policiesData?.filter(p => p.type === 'uploaded').map(m => [m.file_name, m.display_name]) || []);
      console.log('Metadata map created');
      console.log('Number of entries in metadata map:', metadataMap.size);
      console.log('Metadata map entries:', Array.from(metadataMap.entries()));

      // Process uploaded files with signed URLs
      const uploadedFiles = await Promise.all(
        bucketData
          ?.filter(file => file.name.toLowerCase().endsWith('.pdf'))
          .map(async (file) => {
            const signedUrl = await generateSignedUrl(file.name);
            const fileData = {
              id: file.id,
              name: file.name,
              created_at: file.created_at,
              size: file.metadata?.size || 0,
              url: signedUrl,
              signed_url: signedUrl,
              displayName: metadataMap.get(file.name) || file.name.replace(/\.pdf$/i, ''),
              type: 'uploaded' as const
            };
            console.log('Processing uploaded file:', fileData);
            return fileData;
          }) || []
      );
      console.log('Processed uploaded files');
      console.log('Number of uploaded files:', uploadedFiles.length);
      console.log('Uploaded files:', uploadedFiles);

      // Process created policies
      const createdFiles = (policiesData || [])
        .filter(policy => policy.type === 'created')
        .map(policy => {
          // Ensure we have valid content for created policies
          let content = policy.content;
          
          if (content) {
            // Verify content is valid JSON
            try {
              JSON.parse(content);
              console.log(`Policy ${policy.id} has valid JSON content`);
            } catch (err) {
              console.error(`Invalid content in policy ${policy.id}:`, err);
              content = JSON.stringify({ sections: [] });
            }
          } else {
            console.warn(`Policy ${policy.id} has no content`);
            content = JSON.stringify({ sections: [] });
          }

          const policyData = {
            id: policy.id,
            name: policy.file_name,
            displayName: policy.display_name,
            created_at: policy.created_at,
            updated_at: policy.updated_at,
            size: 0,
            url: '',
            signed_url: '',
            type: 'created' as const,
            content: content,
            policy_number: policy.policy_number
          };
          console.log('Processing created policy:', policyData.id, policyData.displayName);
          return policyData;
        });
      console.log('Processed created files');
      console.log('Number of created files:', createdFiles.length);
      console.log('Created files:', createdFiles);

      // Combine both types of files
      const allFiles = [...createdFiles, ...uploadedFiles];
      console.log('Combined all files');
      console.log('Total number of files:', allFiles.length);
      console.log('All files:', allFiles);
      
      setPdfFiles(allFiles);
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

  return {
    loading,
    error,
    pdfFiles,
    setPdfFiles,
    setError,
    fetchPDFFiles
  };
};
