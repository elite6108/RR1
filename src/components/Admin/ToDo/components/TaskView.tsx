import React, { useEffect } from 'react';
import { FormContainer, FormHeader, FormContent } from '../../../../utils/form';
import type { Task } from '../types';

interface TaskViewProps {
  task: Task;
  onClose: () => void;
}

export const TaskView = ({ task, onClose }: TaskViewProps) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';

    // Cleanup function to restore scroll when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'high':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  return (
    <FormContainer isOpen={true} maxWidth="2xl">
      <FormHeader 
        title="Task Details" 
        onClose={onClose}
      />
      
      <FormContent>
        <div className="space-y-6">
          {/* Task Name and Status */}
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {task.name}
              </h3>
              <div className="flex items-center space-x-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </span>
                {task.completed && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                    Completed
                  </span>
                )}
              </div>
            </div>
            {task.description && (
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                {task.description}
              </p>
            )}
          </div>

          {/* General Information */}
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">
              Task Information
            </h4>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <div>
                <dt className="text-gray-500 dark:text-gray-400">Task ID:</dt>
                <dd className="text-gray-900 dark:text-white">{task.id}</dd>
              </div>
              <div>
                <dt className="text-gray-500 dark:text-gray-400">Priority:</dt>
                <dd className="text-gray-900 dark:text-white capitalize">{task.priority}</dd>
              </div>
              <div>
                <dt className="text-gray-500 dark:text-gray-400">Created At:</dt>
                <dd className="text-gray-900 dark:text-white">{formatDate(task.created_at)}</dd>
              </div>
              {task.due_date && (
                <div>
                  <dt className="text-gray-500 dark:text-gray-400">Due Date:</dt>
                  <dd className="text-gray-900 dark:text-white">{formatDate(task.due_date)}</dd>
                </div>
              )}
              {task.completed_at && (
                <div>
                  <dt className="text-gray-500 dark:text-gray-400">Completed At:</dt>
                  <dd className="text-gray-900 dark:text-white">{formatDate(task.completed_at)}</dd>
                </div>
              )}
              <div>
                <dt className="text-gray-500 dark:text-gray-400">Status:</dt>
                <dd className="text-gray-900 dark:text-white">{task.completed ? 'Completed' : 'In Progress'}</dd>
              </div>
            </dl>
          </div>

          {/* Notes */}
          {task.notes && (
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Notes</h4>
              <div className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap">
                {task.notes}
              </div>
            </div>
          )}
        </div>
      </FormContent>
      
      <div className="flex items-center justify-end p-6 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          Close
        </button>
      </div>
    </FormContainer>
  );
};
