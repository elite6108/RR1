import React from 'react';
import { createPortal } from 'react-dom';
import type { DeleteConfirmModalProps } from '../types';

export function DeleteConfirmModal({ 
  isOpen, 
  contractToDelete, 
  onConfirm, 
  onCancel 
}: DeleteConfirmModalProps) {
  if (!isOpen || !contractToDelete) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full m-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Confirm Delete</h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Are you sure you want to delete this contract? This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
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
    </div>,
    document.body
  );
}