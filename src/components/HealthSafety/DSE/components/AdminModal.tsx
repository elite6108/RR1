import React, { useState } from 'react';
import {
  FormContainer,
  FormHeader,
  FormContent,
  FormFooter,
  FormField,
  TextInput
} from '../../../../utils/form';
import { AdminModalProps } from '../types';

export function AdminModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  loading, 
  error 
}: AdminModalProps) {
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(password);
  };

  const handleClose = () => {
    setPassword('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <FormContainer isOpen={isOpen} maxWidth="md">
      <FormHeader
        title="Admin Access"
        onClose={handleClose}
      />
      
      <FormContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label="Admin Password" required error={error}>
            <TextInput
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password..."
              disabled={loading}
            />
          </FormField>
        </form>
      </FormContent>
      
      <FormFooter
        onCancel={handleClose}
        onSubmit={() => handleSubmit({ preventDefault: () => {} } as React.FormEvent)}
        isLastStep={true}
        submitButtonText={loading ? 'Verifying...' : 'Submit'}
        showPrevious={false}
        disabled={loading || !password.trim()}
        loading={loading}
      />
    </FormContainer>
  );
}
