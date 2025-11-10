import React from 'react';
import { FormData } from '../../types/FormData';
import FileUpload from '../FileUpload';

interface DocumentationStepProps {
  formData: FormData;
  setFormData: (updater: (prev: FormData) => FormData) => void;
  uploadingFiles: boolean;
  onFileUpload: (files: FileList, fieldName: 'file_urls') => void;
}

export default function DocumentationStep({
  formData,
  setFormData,
  uploadingFiles,
  onFileUpload
}: DocumentationStepProps) {
  const handleFileRemove = (index: number) => {
    setFormData(prev => ({
      ...prev,
      file_urls: prev.file_urls.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Documentation</h3>
      
      <FileUpload
        fileUrls={formData.file_urls}
        uploadingFiles={uploadingFiles}
        onFileUpload={onFileUpload}
        onFileRemove={handleFileRemove}
      />
    </div>
  );
}
