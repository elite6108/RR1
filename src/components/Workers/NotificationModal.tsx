import { createPortal } from 'react-dom';
import { CheckCircle, XCircle, X } from 'lucide-react';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'success' | 'error';
  title: string;
  message: string;
}

export function NotificationModal({ 
  isOpen, 
  onClose, 
  type, 
  title, 
  message 
}: NotificationModalProps) {
  if (!isOpen) return null;

  const isSuccess = type === 'success';
  const Icon = isSuccess ? CheckCircle : XCircle;
  const iconColor = isSuccess ? 'text-green-500' : 'text-red-500';
  const buttonColor = isSuccess 
    ? 'bg-green-500 hover:bg-green-600 focus:ring-green-500' 
    : 'bg-red-500 hover:bg-red-600 focus:ring-red-500';

  return createPortal(
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <Icon className={`h-6 w-6 ${iconColor}`} />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="text-gray-700 dark:text-gray-300 text-center">
            {message}
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-center p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className={`px-6 py-2 text-white font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${buttonColor}`}
          >
            OK
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}