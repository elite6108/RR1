import React, { useState } from 'react';
import type { LeaveRequest } from '../types';
import {
  FormContainer,
  FormHeader,
  FormContent,
  FormField,
  TextArea
} from '../../../../utils/form';

interface ApprovalModalProps {
  showModal: boolean;
  selectedRequest: LeaveRequest | null;
  onClose: () => void;
  onApprove: (action: 'approved' | 'denied', adminNotes: string) => void;
  loading: boolean;
}

export function ApprovalModal({ showModal, selectedRequest, onClose, onApprove, loading }: ApprovalModalProps) {
  const [adminNotes, setAdminNotes] = useState('');

  const handleClose = () => {
    setAdminNotes('');
    onClose();
  };

  const handleApproval = (action: 'approved' | 'denied') => {
    onApprove(action, adminNotes);
    setAdminNotes('');
  };

  if (!showModal || !selectedRequest) return null;

  return (
    <FormContainer isOpen={showModal} maxWidth="lg">
      <FormHeader
        title="Review Leave Request"
        onClose={handleClose}
      />
      
      <FormContent>
        <div className="space-y-4 mb-6">
          <div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Employee:</span>
            <p className="font-medium text-gray-900 dark:text-white">{selectedRequest.user_name}</p>
          </div>
          <div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Dates:</span>
            <p className="font-medium text-gray-900 dark:text-white">
              {new Date(selectedRequest.start_date).toLocaleDateString()} - {new Date(selectedRequest.end_date).toLocaleDateString()}
            </p>
          </div>
          <div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Duration:</span>
            <p className="font-medium text-gray-900 dark:text-white">{selectedRequest.total_days} day{selectedRequest.total_days !== 1 ? 's' : ''}</p>
          </div>
          {selectedRequest.reason && (
            <div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Reason:</span>
              <p className="font-medium text-gray-900 dark:text-white">{selectedRequest.reason}</p>
            </div>
          )}
        </div>

        <FormField label="Admin Notes" description="(Optional)">
          <TextArea 
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            rows={3}
            placeholder="Add any notes for the employee..."
          />
        </FormField>
      </FormContent>
      
      <div className="border-t border-gray-200 dark:border-gray-700 p-6 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
        <button
          onClick={handleClose}
          className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={() => handleApproval('denied')}
          disabled={loading}
          className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50 transition-colors"
        >
          Deny
        </button>
        <button
          onClick={() => handleApproval('approved')}
          disabled={loading}
          className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors"
        >
          Approve
        </button>
      </div>
    </FormContainer>
  );
}
