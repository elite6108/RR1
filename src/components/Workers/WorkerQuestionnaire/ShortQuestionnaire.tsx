import React, { useState } from 'react';
import { ShortQuestionnaireProps } from './types';
import { recordSimpleHealthCheck } from './utils/supabaseHelpers';
import { HealthCheckSuccess } from './components/HealthCheckSuccess';
import { HealthCheckForm } from './components/HealthCheckForm';

export function ShortQuestionnaire({
  isOpen,
  onClose,
  userEmail,
  onScanQRCode,
}: ShortQuestionnaireProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  if (!isOpen) return null;
  
  const handleSubmit = async () => {
    setLoading(true);
    
    try {
      // Simplified approach - just record in health_checks table
      if (userEmail) {
        console.log('Health check completed for user:', userEmail);
        await recordSimpleHealthCheck(userEmail);
      }
      
      // Just call the callback directly
      if (onScanQRCode) {
        setTimeout(() => {
          onScanQRCode();
        }, 500);
      }
      
      setSuccess(true);
    } catch (err) {
      console.error('Error in health check:', err);
      // We don't show errors in this simplified version
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />

        <div className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
          <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 px-4 py-3">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
              Daily Pre-Site Health Check
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <svg 
                className="h-5 w-5" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <div className="h-full max-h-[500px] overflow-y-auto px-4 py-5 sm:p-6">
            {success ? (
              <HealthCheckSuccess />
            ) : (
              <HealthCheckForm
                loading={loading}
                onSubmit={handleSubmit}
              />
            )}
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-3 flex justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-100"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
