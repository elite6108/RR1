import React from 'react';
import { createPortal } from 'react-dom';
import { AlertTriangle, BookMarked } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText: string;
  type?: 'danger' | 'warning' | 'info';
  loading?: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  type = 'danger',
  loading = false
}) => {
  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'danger':
        return {
          bgColor: 'bg-red-100 dark:bg-red-900/20',
          iconColor: 'text-red-600 dark:text-red-400',
          buttonColor: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
          icon: AlertTriangle
        };
      case 'warning':
        return {
          bgColor: 'bg-orange-100 dark:bg-orange-900/20',
          iconColor: 'text-orange-600 dark:text-orange-400',
          buttonColor: 'bg-orange-600 hover:bg-orange-700 focus:ring-orange-500',
          icon: AlertTriangle
        };
      case 'info':
        return {
          bgColor: 'bg-purple-100 dark:bg-purple-900',
          iconColor: 'text-purple-600 dark:text-purple-400',
          buttonColor: 'bg-purple-600 hover:bg-purple-700 focus:ring-purple-500',
          icon: BookMarked
        };
      default:
        return {
          bgColor: 'bg-red-100 dark:bg-red-900/20',
          iconColor: 'text-red-600 dark:text-red-400',
          buttonColor: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
          icon: AlertTriangle
        };
    }
  };

  const { bgColor, iconColor, buttonColor, icon: IconComponent } = getTypeStyles();

  return createPortal(
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50 p-4">
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full">
        <div className="flex items-center justify-center mb-4">
          <div className={`flex items-center justify-center w-12 h-12 mx-auto ${bgColor} rounded-full`}>
            <IconComponent className={`h-6 w-6 ${iconColor}`} />
          </div>
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white text-center mb-2">
          {title}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
          {message}
        </p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 touch-manipulation"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`px-4 py-2.5 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 flex items-center touch-manipulation ${buttonColor}`}
          >
            {loading && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            )}
            {confirmText}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
