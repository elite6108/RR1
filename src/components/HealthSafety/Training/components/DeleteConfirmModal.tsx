import React from 'react';
import { createPortal } from 'react-dom';
import { AlertTriangle } from 'lucide-react';
import type { DeleteConfirmModalProps } from '../types';

export function DeleteConfirmModal({ 
  isOpen, 
  trainingToDelete, 
  onConfirm, 
  onCancel 
}: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-lg-xl p-6 max-w-md w-full m-4">
        <div className="flex items-center justify-center mb-4">
          <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
        </div>
        
        <div className="text-center mb-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Delete Training Record
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Are you sure you want to delete this training record? This action cannot be undone.
          </p>
        </div>

        <div className="flex space-x-3 justify-center">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}