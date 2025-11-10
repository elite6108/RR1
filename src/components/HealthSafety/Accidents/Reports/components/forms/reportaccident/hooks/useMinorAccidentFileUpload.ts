import { useState, useEffect } from 'react';
import { handleMinorAccidentFileUpload, refreshMinorAccidentFileUrls } from '../utils/minorAccidentFileUtils';
import { MinorAccidentFormData } from '../types/MinorAccidentTypes';

export const useMinorAccidentFileUpload = (
  formData: MinorAccidentFormData,
  setFormData: React.Dispatch<React.SetStateAction<MinorAccidentFormData>>,
  isEditing: boolean,
  initialData?: any
) => {
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isEditing && initialData) {
      if (initialData.file_urls || initialData.fileUrls) {
        const fileUrls = (initialData.file_urls || initialData.fileUrls || []).filter((url: any) => url && url.trim() !== '');
        
        if (fileUrls.length > 0) {
          setFormData(prev => ({ ...prev, file_urls: fileUrls }));
          
          const refreshUrls = async () => {
            const newUrls = await refreshMinorAccidentFileUrls(fileUrls);
            setFormData(prev => ({ ...prev, file_urls: newUrls }));
          };
          
          setTimeout(refreshUrls, 100);
        }
      }
    }
  }, [isEditing, initialData, setFormData]);

  const handleFileUpload = async (files: FileList, fieldName: 'file_urls') => {
    const uploadedUrls = await handleMinorAccidentFileUpload(
      files,
      formData.autoId,
      setUploadingFiles,
      setError
    );
    
    if (uploadedUrls.length > 0) {
      setFormData(prev => ({
        ...prev,
        [fieldName]: [...(prev[fieldName] || []), ...uploadedUrls]
      }));
    }
  };

  return { uploadingFiles, error, handleFileUpload, setError };
};
