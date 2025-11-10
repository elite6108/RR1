import { useState, useEffect } from 'react';
import { supabase } from '../../../../lib/supabase';

interface PDFFile {
  id: string;
  name: string;
  created_at: string;
  size: number;
  url: string;
  signed_url?: string;
  displayName?: string;
  talk_id?: string;
}

export function usePDFManagement() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pdfFiles, setPdfFiles] = useState<PDFFile[]>([]);
  const [editingFile, setEditingFile] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [editingTalkId, setEditingTalkId] = useState('');
  const [savingName, setSavingName] = useState(false);

  const generateSignedUrl = async (fileName: string) => {
    try {
      const { data } = await supabase.storage
        .from('toolbox-talks')
        .createSignedUrl(fileName, 60 * 60); // 1 hour expiry
      
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

      const { data: filesData, error: filesError } = await supabase.storage
        .from('toolbox-talks')
        .list();

      if (filesError) throw filesError;

      // Get display names from metadata
      const { data: metadataData, error: metadataError } = await supabase
        .from('toolbox_talk_pdfs')
        .select('file_name, display_name, talk_id');

      if (metadataError) throw metadataError;

      const metadataMap = new Map(
        metadataData?.map((m) => [m.file_name, { display_name: m.display_name, talk_id: m.talk_id }]) || []
      );

      // Generate signed URLs for all files
      const pdfFiles = await Promise.all(
        filesData
          ?.filter((file) => file.name.toLowerCase().endsWith('.pdf'))
          .map(async (file) => {
            const signedUrl = await generateSignedUrl(file.name);
            const metadata = metadataMap.get(file.name);
            return {
              id: file.id,
              name: file.name,
              created_at: file.created_at,
              size: file.metadata?.size || 0,
              url: signedUrl,
              signed_url: signedUrl,
              displayName: metadata?.display_name || file.name.replace(/\.pdf$/i, ''),
              talk_id: metadata?.talk_id || '',
            };
          }) || []
      );

      setPdfFiles(pdfFiles);
    } catch (err) {
      console.error('Error fetching PDF files:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'An error occurred while fetching PDF files'
      );
    } finally {
      setLoading(false);
    }
  };

  // Add a function to refresh signed URLs
  const refreshSignedUrls = async () => {
    const updatedFiles = await Promise.all(
      pdfFiles.map(async (file) => {
        const signedUrl = await generateSignedUrl(file.name);
        return {
          ...file,
          url: signedUrl,
          signed_url: signedUrl,
        };
      })
    );
    setPdfFiles(updatedFiles);
  };

  // Refresh signed URLs every 45 minutes
  useEffect(() => {
    const interval = setInterval(refreshSignedUrls, 45 * 60 * 1000);
    return () => clearInterval(interval);
  }, [pdfFiles]);

  const startEditing = (file: PDFFile) => {
    setEditingFile(file.id);
    setEditingName(file.displayName || file.name);
    setEditingTalkId(file.talk_id || '');
  };

  const cancelEditing = () => {
    setEditingFile(null);
    setEditingName('');
    setEditingTalkId('');
  };

  const saveDisplayName = async (file: PDFFile, newName: string, newTalkId: string) => {
    setSavingName(true);
    try {
      // First check if a record exists
      const { data: existingRecord, error: fetchError } = await supabase
        .from('toolbox_talk_pdfs')
        .select('*')
        .eq('file_name', file.name)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;

      let error;
      if (existingRecord) {
        // Update existing record
        const { error: updateError } = await supabase
          .from('toolbox_talk_pdfs')
          .update({
            display_name: newName,
            talk_id: newTalkId
          })
          .eq('file_name', file.name);
        error = updateError;
      } else {
        // Insert new record
        const { error: insertError } = await supabase
          .from('toolbox_talk_pdfs')
          .insert({
            file_name: file.name,
            display_name: newName,
            talk_id: newTalkId
          });
        error = insertError;
      }

      if (error) throw error;

      // Update the local state
      setPdfFiles(prev => prev.map(f => 
        f.id === file.id 
          ? { ...f, displayName: newName, talk_id: newTalkId }
          : f
      ));

      setEditingFile(null);
      setEditingName('');
      setEditingTalkId('');
    } catch (err) {
      console.error('Error updating PDF name:', err);
      setError('Failed to update PDF name. Please try again.');
    } finally {
      setSavingName(false);
    }
  };

  const deleteFile = async (file: PDFFile) => {
    setLoading(true);
    setError(null);

    try {
      const { error: storageError } = await supabase.storage
        .from('toolbox-talks')
        .remove([file.name]);

      if (storageError) throw storageError;

      // Also delete metadata
      const { error: metadataError } = await supabase
        .from('toolbox_talk_pdfs')
        .delete()
        .eq('file_name', file.name);

      if (metadataError) throw metadataError;

      await fetchPDFFiles();
    } catch (err) {
      console.error('Error deleting file:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'An error occurred while deleting the file'
      );
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return {
    loading,
    error,
    setError,
    pdfFiles,
    editingFile,
    editingName,
    setEditingName,
    editingTalkId,
    setEditingTalkId,
    savingName,
    fetchPDFFiles,
    startEditing,
    cancelEditing,
    saveDisplayName,
    deleteFile,
    formatFileSize
  };
}
