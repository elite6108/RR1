import React from 'react';
import {
  FormContainer,
  FormHeader,
  FormContent,
  FormFooter,
  FormField,
  TextInput
} from '../../../../utils/form';

interface FileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  fileName: string;
  onFileNameChange: (name: string) => void;
  extension: string;
  loading?: boolean;
}

export const FileEditModal = ({
  isOpen,
  onClose,
  onSubmit,
  fileName,
  onFileNameChange,
  extension,
  loading = false
}) => {
  if (!isOpen) return null;

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSubmit();
    }
  };

  return (
    <FormContainer isOpen={isOpen} maxWidth="sm">
      <FormHeader
        title="Edit File Name"
        onClose={onClose}
      />
      
      <FormContent>
        <div className="space-y-3">
          <FormField label="File name (without extension)" required>
            <TextInput
              value={fileName}
              onChange={(e) => onFileNameChange(e.target.value)}
              placeholder="File name"
            />
          </FormField>
          
          {extension && (
            <FormField label="File extension (cannot be changed)">
              <TextInput
                value={extension}
                onChange={() => {}} // No-op since it's read-only
                disabled={true}
                className="bg-gray-50 dark:bg-gray-600 cursor-not-allowed"
              />
            </FormField>
          )}
          
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Final name: <span className="font-medium">{fileName.trim()}{extension}</span>
          </div>
        </div>
      </FormContent>
      
      <FormFooter
        onCancel={onClose}
        onSubmit={onSubmit}
        isLastStep={true}
        submitButtonText={loading ? 'Saving...' : 'Save'}
        disabled={!fileName.trim() || loading}
        loading={loading}
        showPrevious={false}
      />
    </FormContainer>
  );
};
