import React from 'react';
import { createPortal } from 'react-dom';
import { AlertTriangle } from 'lucide-react';
import { Board, Task } from '../types';

interface DeleteConfirmModalProps {
  showDeleteModal: boolean;
  showDeleteTaskModal: boolean;
  boardToDelete: Board | null;
  taskToDelete: Task | null;
  onDeleteBoard: () => void;
  onDeleteTask: () => void;
  onClose: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  showDeleteModal,
  showDeleteTaskModal,
  boardToDelete,
  taskToDelete,
  onDeleteBoard,
  onDeleteTask,
  onClose,
}) => {
  if (showDeleteModal && boardToDelete) {
    return createPortal(
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto flex items-center justify-center z-50">
        <div className="relative bg-white rounded-lg shadow-lg-xl p-6 max-w-md w-full m-4">
          <div className="flex items-center mb-4">
            <AlertTriangle className="h-6 w-6 text-red-500 mr-2" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Delete Board
            </h3>
          </div>
          <p className="text-gray-700 mb-6">
            Are you sure you want to delete "{boardToDelete.name}"? This will
            also delete all tasks in this board.
          </p>
          <div className="flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-blue-600 dark:hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={onDeleteBoard}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 dark:bg-gray-800 dark:text-white dark:hover:bg-blue-600 dark:hover:text-white"
            >
              Delete
            </button>
          </div>
        </div>
      </div>,
      document.body
    );
  }

  if (showDeleteTaskModal && taskToDelete) {
    return createPortal(
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto flex items-center justify-center z-50">
        <div className="relative bg-white rounded-lg shadow-lg-xl p-6 max-w-md w-full m-4">
          <div className="flex items-center mb-4">
            <AlertTriangle className="h-6 w-6 text-red-500 mr-2" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Delete Task
            </h3>
          </div>
          <p className="text-gray-700 mb-6">
            Are you sure you want to delete "{taskToDelete.title}"? This action
            cannot be undone.
          </p>
          <div className="flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-blue-600 dark:hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={onDeleteTask}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 dark:bg-gray-800 dark:text-white dark:hover:bg-blue-600 dark:hover:text-white"
            >
              Delete
            </button>
          </div>
        </div>
      </div>,
      document.body
    );
  }

  return null;
};
