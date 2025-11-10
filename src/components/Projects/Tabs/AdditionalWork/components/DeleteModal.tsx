import React from 'react';
import { Trash2 } from 'lucide-react';
import { DeleteModalProps } from '../types';

/**
 * Delete confirmation modal component
 */
const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  workToDelete,
  onConfirm,
  onCancel
}) => {
  if (!isOpen || !workToDelete) return null;

  const handleConfirm = () => {
    onConfirm(workToDelete);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-red-100 dark:bg-red-900 rounded-full p-3">
            <Trash2 className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
        </div>
        <h3 className="text-lg font-medium text-center text-gray-900 dark:text-white mb-4">
          Delete Additional Work
        </h3>
        <p className="text-center text-gray-500 dark:text-gray-400 mb-6">
          Are you sure you want to delete "{workToDelete.title}"? This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
