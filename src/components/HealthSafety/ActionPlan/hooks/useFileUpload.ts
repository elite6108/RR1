import { useState } from 'react';
import { supabase } from '../../../../lib/supabase';
import { FilePreview } from '../types';

export const useFileUpload = () => {
  const [filePreviews, setFilePreviews] = useState<FilePreview[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingFiles(true);
    
    try {
      const newPreviews = await Promise.all(
        Array.from(files).map(async (file) => {
          const previewUrl = URL.createObjectURL(file);
          return {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            name: file.name,
            url: previewUrl,
            file: file,
            isExisting: false
          };
        })
      );

      setFilePreviews(prev => [...prev, ...newPreviews]);
    } catch (error) {
      console.error('Error creating file previews:', error);
    } finally {
      setUploadingFiles(false);
    }
  };

  const handleRemoveFile = (id: string) => {
    const fileToRemove = filePreviews.find(file => file.id === id);
    
    // Remove from file previews
    setFilePreviews(prev => prev.filter(file => file.id !== id));
    
    // If it was a blob URL, revoke it to free memory
    if (fileToRemove && !fileToRemove.isExisting) {
      URL.revokeObjectURL(fileToRemove.url);
    }
  };

  const loadExistingFiles = async (files: string[]) => {
    if (!files || files.length === 0) {
      setFilePreviews([]);
      return;
    }

    try {
      const existingFilePreviews = await Promise.all(
        files.map(async (filePath) => {
          try {
            const { data: signedUrlData, error: signedUrlError } = await supabase.storage
              .from('action-plan-files')
              .createSignedUrl(filePath, 60 * 60 * 24 * 7); // 7 days expiry

            if (signedUrlError) {
              console.error('Error creating signed URL:', signedUrlError);
              return null;
            }

            const fileName = filePath.split('/').pop() || filePath;
            return {
              id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
              name: fileName,
              url: signedUrlData.signedUrl,
              isExisting: true
            };
          } catch (error) {
            console.error('Error loading file:', error);
            return null;
          }
        })
      );

      const validPreviews = existingFilePreviews.filter(preview => preview !== null);
      setFilePreviews(validPreviews);
    } catch (error) {
      console.error('Error loading existing files:', error);
    }
  };

  const uploadFilesToStorage = async (): Promise<string[]> => {
    const uploadedFiles: string[] = [];
    
    if (filePreviews.length > 0) {
      const filesToUpload = filePreviews.filter(preview => !preview.isExisting && preview.file);
      
      for (const preview of filesToUpload) {
        if (!preview.file) continue;
        
        const fileName = `${Date.now()}_${preview.file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
        
        const { data, error } = await supabase.storage
          .from('action-plan-files')
          .upload(fileName, preview.file);
        
        if (error) {
          console.error('Error uploading file:', error);
          continue;
        }
        
        uploadedFiles.push(data.path);
      }
      
      // Add existing files to the list
      const existingFiles = filePreviews
        .filter(preview => preview.isExisting)
        .map(preview => preview.name); // For existing files, we store the file path
      
      uploadedFiles.push(...existingFiles);
    }
    
    return uploadedFiles;
  };

  const clearFiles = () => {
    // Revoke blob URLs to free memory
    filePreviews.forEach(preview => {
      if (!preview.isExisting) {
        URL.revokeObjectURL(preview.url);
      }
    });
    setFilePreviews([]);
  };

  return {
    filePreviews,
    uploadingFiles,
    handleFileUpload,
    handleRemoveFile,
    loadExistingFiles,
    uploadFilesToStorage,
    clearFiles
  };
};
