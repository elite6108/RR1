import { useState, useEffect } from 'react';
import { handleSevenDayFileUpload, refreshSevenDayFileUrls } from '../utils/sevenDayFileUtils';
import { SevenDayIncapacitationFormData } from '../types/SevenDayIncapacitationTypes';

export const useSevenDayFileUpload = (
  formData: SevenDayIncapacitationFormData,
  setFormData: React.Dispatch<React.SetStateAction<SevenDayIncapacitationFormData>>,
  isEditing: boolean,
  initialData?: any
) => {
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle file URL refreshing for editing mode
  useEffect(() => {
    if (isEditing && initialData) {
      console.log('UseEffect: Processing file URLs for editing form');
      console.log('UseEffect: initialData.file_urls specifically:', initialData.file_urls);
      
      // Check for both snake_case and camelCase versions
      const fileUrlsFromDb = initialData.file_urls || initialData.fileUrls;
      
      if (fileUrlsFromDb) {
        console.log('UseEffect: Found file URLs in database:', fileUrlsFromDb);
        let fileUrls: string[] = [];
        
        if (typeof fileUrlsFromDb === 'string') {
          try {
            fileUrls = JSON.parse(fileUrlsFromDb);
            console.log('UseEffect: Parsed file URLs from string:', fileUrls);
          } catch (e) {
            console.error('UseEffect: Error parsing file_urls:', e);
            fileUrls = [];
          }
        } else if (Array.isArray(fileUrlsFromDb)) {
          fileUrls = fileUrlsFromDb;
          console.log('UseEffect: Using file URLs as array:', fileUrls);
        }
        
        // Filter valid URLs
        fileUrls = fileUrls.filter((url: any) => url && typeof url === 'string');
        console.log('UseEffect: Filtered file URLs:', fileUrls);
        
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
            const newUrls = await refreshSevenDayFileUrls(fileUrls);
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
    const uploadedUrls = await handleSevenDayFileUpload(
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
