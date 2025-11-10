import React from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { Task } from '../types';

interface ViewTaskModalProps {
  isOpen: boolean;
  task: Task | null;
  onClose: () => void;
}

export const ViewTaskModal: React.FC<ViewTaskModalProps> = ({
  isOpen,
  task,
  onClose
}) => {
  if (!isOpen || !task) return null;

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString();
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return createPortal(
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-screen w-screen flex items-center justify-center z-50 p-4">
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl mx-4">
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">View Task</h3>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Step Indicator */}
          <div className="mb-8 w-full">
            <div className="flex items-center justify-between mb-4">
              <div className="text-base font-medium text-indigo-600">
                Task Details
              </div>
              <div className="text-sm text-gray-500">
                Read Only
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-indigo-600 h-2 rounded-full transition-all duration-300 ease-in-out"
                style={{ width: '100%' }}
              />
            </div>
          </div>

          {/* Task Details */}
          <div className="max-h-[500px] overflow-y-auto pr-4">
            <div className="grid grid-cols-2 gap-4 singlerow">
              <div className="fullw">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Task Name
                </label>
                <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white text-base">
                  {task.name}
                </div>
              </div>

              <div className="fullw">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white text-base min-h-[76px]">
                  {task.description || 'No description provided'}
                </div>
              </div>

              <div className="fullw">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Priority
                </label>
                <div className="w-full px-3 py-2">
                  <span className={`inline-flex px-2 py-1 rounded-md text-sm font-medium capitalize ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                </div>
              </div>

              <div className="fullw">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Due Date
                </label>
                <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white text-base">
                  {formatDate(task.due_date)}
                </div>
              </div>

              <div className="col-span-2 fullw">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Notes
                </label>
                <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white text-base min-h-[76px] whitespace-pre-wrap">
                  {task.notes || 'No notes provided'}
                </div>
              </div>

              <div className="col-span-2 fullw">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <div className="w-full px-3 py-2">
                  <span className={`inline-flex px-2 py-1 rounded-md text-sm font-medium ${
                    task.completed 
                      ? 'text-green-600 bg-green-100' 
                      : 'text-blue-600 bg-blue-100'
                  }`}>
                    {task.completed ? 'Completed' : 'In Progress'}
                  </span>
                  {task.completed && task.completed_at && (
                    <span className="ml-3 text-sm text-gray-500">
                      Completed on {formatDate(task.completed_at)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
