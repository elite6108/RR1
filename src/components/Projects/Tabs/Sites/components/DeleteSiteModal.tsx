import React from 'react';
import { createPortal } from 'react-dom';
import type { Site } from '../types';

interface DeleteSiteModalProps {
  isOpen: boolean;
  siteToDelete: Site | null;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteSiteModal({
  isOpen,
  siteToDelete,
  onClose,
  onConfirm,
}: DeleteSiteModalProps) {
  if (!isOpen || !siteToDelete) return null;

  return createPortal(
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto flex items-center justify-center z-50">
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full m-4">
        <div className="mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Confirm Delete
          </h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Are you sure you want to delete the site "{siteToDelete.name}"?
            This action cannot be undone.
          </p>
        </div>
        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:text-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
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
    </div>,
    document.body
  );
}
