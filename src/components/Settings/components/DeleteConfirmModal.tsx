import React from 'react';
import type { DeleteConfirmModalProps } from '../types';

export function DeleteConfirmModal({ 
  isOpen, 
  domainToDelete, 
  onConfirm, 
  onCancel 
}: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
      <div className="relative bg-white rounded-lg shadow-xl p-6 max-w-md w-full m-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Confirm Delete
        </h3>
        <p className="text-sm text-gray-500 mb-6">
          Are you sure you want to delete the domain "{domainToDelete}"?
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}