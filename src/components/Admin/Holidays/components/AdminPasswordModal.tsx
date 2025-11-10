import React, { useState } from 'react';
import {
  FormContainer,
  FormHeader,
  FormContent,
  FormFooter,
  FormField,
  TextInput
} from '../../../../utils/form';

interface AdminPasswordModalProps {
  showModal: boolean;
  onClose: () => void;
  onSubmit: (password: string) => void;
  loading: boolean;
}

export function AdminPasswordModal({ showModal, onClose, onSubmit, loading }: AdminPasswordModalProps) {
  const [adminPassword, setAdminPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(adminPassword);
  };

  const handleClose = () => {
    setAdminPassword('');
    onClose();
  };

  if (!showModal) return null;

  return (
    <FormContainer isOpen={showModal} maxWidth="md">
      <FormHeader
        title="Admin Access"
        onClose={handleClose}
      />
      
      <FormContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label="Enter Admin Password" required>
            <TextInput
              type="password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              placeholder="Enter password..."
            />
          </FormField>
        </form>
      </FormContent>
      
      <FormFooter
        onCancel={handleClose}
        onSubmit={() => handleSubmit({ preventDefault: () => {} } as React.FormEvent)}
        isLastStep={true}
        submitButtonText="Unlock"
        showPrevious={false}
      />
    </FormContainer>
  );
}
