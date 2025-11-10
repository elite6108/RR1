import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useAnnualLeaveData } from './hooks/useAnnualLeaveData';
import { LeaveEntitlementCard } from './components/LeaveEntitlementCard';
import { LeaveRequestsList } from './components/LeaveRequestsList';
import { LeaveRequestForm } from './components/LeaveRequestForm';

interface WorkerAnnualLeaveProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string;
}

export function WorkerAnnualLeave({ isOpen, onClose, userEmail }: WorkerAnnualLeaveProps) {
  const { requests, entitlement, loading, error, refetchData, setError } = useAnnualLeaveData(userEmail);
  const [showNewRequestForm, setShowNewRequestForm] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && userEmail) {
      // Clear any previous errors when opening
      setError(null);
    }
  }, [isOpen, userEmail, setError]);

  const handleRequestLeave = () => {
    setShowNewRequestForm(true);
  };

  const handleFormSuccess = () => {
    setSuccess('Leave request submitted successfully!');
    refetchData();
    
    // Clear success message after 3 seconds
    setTimeout(() => setSuccess(null), 3000);
  };

  const handleCloseForm = () => {
    setShowNewRequestForm(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Annual Leave Management
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-6">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
              <p className="text-green-800">{success}</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Leave Entitlement Summary */}
            <div className="lg:col-span-1">
              <LeaveEntitlementCard
                entitlement={entitlement}
                loading={loading}
                onRequestLeave={handleRequestLeave}
              />
            </div>

            {/* Leave Requests List */}
            <div className="lg:col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Your Leave Requests
              </h3>
              
              <LeaveRequestsList
                requests={requests}
                loading={loading}
              />
            </div>
          </div>
        </div>

        <LeaveRequestForm
          isOpen={showNewRequestForm}
          onClose={handleCloseForm}
          userEmail={userEmail}
          onSuccess={handleFormSuccess}
        />
      </div>
    </div>
  );
}