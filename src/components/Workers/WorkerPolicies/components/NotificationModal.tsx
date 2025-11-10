import React from 'react';
import { createPortal } from 'react-dom';

interface NotificationData {
  type: 'success' | 'error';
  title: string;
  message: string;
}

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: NotificationData;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  data
}) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center mb-4">
            {data.type === 'success' ? (
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            ) : (
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            )}
            <div className="ml-3">
              <h3 className={`text-lg font-medium ${
                data.type === 'success' ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'
              }`}>
                {data.title}
              </h3>
            </div>
          </div>
          
          <div className="mb-6">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {data.message}
            </p>
          </div>
          
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                data.type === 'success'
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-red-600 text-white hover:bg-red-700'
              }`}
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};