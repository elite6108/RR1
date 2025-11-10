import React, { useState, useEffect } from 'react';
import type { LeaveEntitlement } from '../types';
import {
  FormContainer,
  FormHeader,
  FormContent,
  FormFooter,
  FormField,
  NumberInput
} from '../../../../utils/form';

interface EditEntitlementModalProps {
  showModal: boolean;
  selectedEntitlement: LeaveEntitlement | null;
  onClose: () => void;
  onSubmit: (newEntitlement: number) => void;
  loading: boolean;
}

export function EditEntitlementModal({ 
  showModal, 
  selectedEntitlement, 
  onClose, 
  onSubmit, 
  loading 
}: EditEntitlementModalProps) {
  const [newEntitlement, setNewEntitlement] = useState<number>(0);

  useEffect(() => {
    if (selectedEntitlement) {
      setNewEntitlement(selectedEntitlement.total_entitlement);
    }
  }, [selectedEntitlement]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(newEntitlement);
  };

  const handleClose = () => {
    setNewEntitlement(0);
    onClose();
  };

  if (!showModal || !selectedEntitlement) return null;

  return (
    <FormContainer isOpen={showModal} maxWidth="md">
      <FormHeader
        title="Edit Entitlement"
        onClose={handleClose}
      />
      
      <FormContent>
        <div className="mb-4">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Employee:</div>
          <div className="font-medium text-gray-900 dark:text-white">{selectedEntitlement.user_name}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">{selectedEntitlement.user_email}</div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label="Total Entitlement (Days)" required>
            <NumberInput
              value={newEntitlement}
              onChange={(e) => setNewEntitlement(parseFloat(e.target.value))}
              step={0.5}
              min={0}
              max={50}
            />
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Current: {selectedEntitlement.total_entitlement} days
              <br />
              Used: {selectedEntitlement.used_days} days
              <br />
              Remaining: {selectedEntitlement.remaining_days} days
            </div>
          </FormField>
        </form>
      </FormContent>
      
      <FormFooter
        onCancel={handleClose}
        onSubmit={() => handleSubmit({ preventDefault: () => {} } as React.FormEvent)}
        isLastStep={true}
        submitButtonText={loading ? 'Updating...' : 'Update'}
        disabled={loading}
        loading={loading}
        showPrevious={false}
      />
    </FormContainer>
  );
}
