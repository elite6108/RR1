import { useState } from 'react';
import { uploadUtilityDamageFile } from '../utils/utilityDamageFileUtils';

export const useUtilityDamageFileUpload = () => {
  const [uploadingFiles, setUploadingFiles] = useState(false);

  const handleFileUpload = async (
    files: FileList,
    autoId: string,
    onSuccess: (urls: string[]) => void,
    onError: (error: string) => void
  ) => {
    if (!files || files.length === 0) return;
    
    try {
      setUploadingFiles(true);
      
      const uploadedUrls: string[] = [];
      
      // Create an array from FileList for easier handling
      const fileArray = Array.from(files);
      
      for (const file of fileArray) {
        const signedUrl = await uploadUtilityDamageFile(file, autoId);
        uploadedUrls.push(signedUrl);
      }
      
      onSuccess(uploadedUrls);
      
    } catch (err) {
      console.error('Error uploading files:', err);
      onError('Failed to upload files. Please try again.');
    } finally {
      setUploadingFiles(false);
    }
  };

  return { handleFileUpload, uploadingFiles };
};
