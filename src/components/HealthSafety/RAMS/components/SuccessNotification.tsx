import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle, X } from 'lucide-react';

interface SuccessNotificationProps {
  show: boolean;
  message: string;
  onClose: () => void;
  autoCloseDelay?: number; // Auto-close after specified milliseconds
}

export function SuccessNotification({ 
  show, 
  message, 
  onClose, 
  autoCloseDelay = 5000 
}: SuccessNotificationProps) {
  useEffect(() => {
    if (show && autoCloseDelay > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDelay);

      return () => clearTimeout(timer);
    }
  }, [show, autoCloseDelay, onClose]);

  if (!show) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 pointer-events-none">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-green-200 dark:border-green-800 max-w-md w-full pointer-events-auto animate-in slide-in-from-top-2 duration-300">
        <div className="flex items-start p-4">
          <div className="flex-shrink-0">
            <CheckCircle className="h-6 w-6 text-green-500" />
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              Success!
            </p>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
              {message}
            </p>
          </div>
          <div className="ml-4 flex-shrink-0">
            <button
              onClick={onClose}
              className="inline-flex text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 rounded-md"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
