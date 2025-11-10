import { useState, useEffect } from 'react';
import { handleIllHealthFileUpload, refreshIllHealthFileUrls } from '../utils/illHealthFileUtils';
import { IllHealthFormData } from '../types/IllHealthTypes';

export const useIllHealthFileUpload = (
  formData: IllHealthFormData,
  setFormData: React.Dispatch<React.SetStateAction<IllHealthFormData>>,
  isEditing: boolean,
  initialData?: any
) => {
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load and refresh file URLs when editing
  useEffect(() => {
    if (isEditing && initialData) {
      console.log('UseEffect: Component mounted for editing, initialData:', initialData);
      if (initialData.file_urls || initialData.fileUrls) {
        // Get the file URLs, preferring file_urls over fileUrls
        const fileUrls = (initialData.file_urls || initialData.fileUrls || []).filter((url: any) => url && url.trim() !== '');
        console.log('UseEffect: Found file URLs:', fileUrls);
        
        if (fileUrls.length > 0) {
          console.log('UseEffect: Setting file URLs in form data');
          // Set the URLs immediately first
          setFormData(prev => {
            console.log('UseEffect: Updating form data with file URLs:', fileUrls);
            return { ...prev, file_urls: fileUrls };
          });
          
          // Then refresh the signed URLs
          const refreshUrls = async () => {
            console.log('UseEffect: Starting to refresh signed URLs...');
            const newUrls = await refreshIllHealthFileUrls(fileUrls);
            console.log('UseEffect: All refreshed URLs:', newUrls);
            setFormData(prev => ({ ...prev, file_urls: newUrls }));
          };
          
          // Small delay to ensure component is mounted
          setTimeout(refreshUrls, 100);
        } else {
          console.log('UseEffect: No valid file URLs found after filtering');
        }
      } else {
        console.log('UseEffect: No file URLs field found in initialData');
      }
    }
  }, [isEditing, initialData, setFormData]);

  const handleFileUpload = async (files: FileList, fieldName: 'file_urls') => {
    const uploadedUrls = await handleIllHealthFileUpload(
      files,
      formData.autoId,
      setUploadingFiles,
      setError
    );
    
    if (uploadedUrls.length > 0) {
      // Update the form data with the new URLs
      setFormData(prev => ({
        ...prev,
        [fieldName]: [...(prev[fieldName] || []), ...uploadedUrls]
      }));
    }
  };

  return {
    uploadingFiles,
    error,
    handleFileUpload,
    setError
  };
};
