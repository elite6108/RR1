import React from 'react';
import {
  FormContainer,
  FormHeader,
  FormContent,
  FormFooter,
  FormField,
  TextInput
} from '../../../../utils/form';

interface FolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  title: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  submitText: string;
  loading?: boolean;
}

export const FolderModal = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  value,
  onChange,
  placeholder,
  submitText,
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
        title={title}
        onClose={onClose}
      />
      
      <FormContent>
        <FormField label="Name" required>
          <TextInput
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
          />
        </FormField>
      </FormContent>
      
      <FormFooter
        onCancel={onClose}
        onSubmit={onSubmit}
        isLastStep={true}
        submitButtonText={loading ? 'Saving...' : submitText}
        disabled={!value.trim() || loading}
        loading={loading}
        showPrevious={false}
      />
    </FormContainer>
  );
};
