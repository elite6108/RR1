import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Calendar, Clock, AlertCircle, User, Tag, DollarSign, FileText, Paperclip } from 'lucide-react';
import { Task, StaffMember, CombinedStaffUser } from '../types';

interface TaskSummaryViewProps {
  task: Task;
  staff: StaffMember[];
  combinedStaffUsers: CombinedStaffUser[];
  onClose: () => void;
}

// Helper function to generate consistent user ID hash
const getUserIdHash = (userId: string): number => {
  const hash = Math.abs(userId.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0));
  return -hash; // Return negative to distinguish from staff IDs
};

export const TaskSummaryView: React.FC<TaskSummaryViewProps> = ({ 
  task, 
  staff, 
  combinedStaffUsers, 
  onClose 
}) => {
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
      case 'critical':
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

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'over_due':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getAssignedMembers = () => {
    return task.staff_ids.map((staffId) => {
      if (staffId > 0) {
        // Regular staff member
        return staff.find((s) => s.id === staffId);
      } else {
        // User (negative ID)
        return combinedStaffUsers.find((u) => 
          u.type === 'user' && getUserIdHash(u.original_id as string) === staffId
        );
      }
    }).filter(Boolean);
  };

  return createPortal(
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 dark:bg-gray-900 dark:bg-opacity-50 overflow-y-auto h-screen w-screen flex items-center justify-center z-50">
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 max-w-4xl w-full m-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Task Summary
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 focus:outline-none"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Task Name and Status */}
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {task.title}
              </h3>
              <div className="flex items-center space-x-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getPriorityColor(task.priority)}`}>
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {task.priority}
                </span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                  {task.status.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                </span>
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
            <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              Task Information
            </h4>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3 text-sm">
              <div>
                <dt className="text-gray-500 dark:text-gray-400">Task ID:</dt>
                <dd className="text-gray-900 dark:text-white">#{task.id}</dd>
              </div>
              <div>
                <dt className="text-gray-500 dark:text-gray-400">Category:</dt>
                <dd className="text-gray-900 dark:text-white">{task.category || 'Not specified'}</dd>
              </div>
              <div>
                <dt className="text-gray-500 dark:text-gray-400">Created At:</dt>
                <dd className="text-gray-900 dark:text-white">{formatDate(task.created_at)}</dd>
              </div>
              <div>
                <dt className="text-gray-500 dark:text-gray-400">Last Updated:</dt>
                <dd className="text-gray-900 dark:text-white">{formatDate(task.updated_at)}</dd>
              </div>
              {task.due_date && (
                <div>
                  <dt className="text-gray-500 dark:text-gray-400">Due Date:</dt>
                  <dd className={`${
                    new Date(task.due_date) < new Date() 
                      ? 'text-red-600 dark:text-red-400 font-medium' 
                      : 'text-gray-900 dark:text-white'
                  }`}>
                    {new Date(task.due_date).toLocaleDateString()}
                    {new Date(task.due_date) < new Date() && ' (Overdue)'}
                  </dd>
                </div>
              )}
              {task.cost && (
                <div>
                  <dt className="text-gray-500 dark:text-gray-400">Cost:</dt>
                  <dd className="text-gray-900 dark:text-white flex items-center">
                    <DollarSign className="w-3 h-3 mr-1" />
                    £{task.cost.toFixed(2)}
                  </dd>
                </div>
              )}
            </dl>
          </div>

          {/* Assigned Members */}
          {task.staff_ids.length > 0 && (
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                <User className="w-4 h-4 mr-2" />
                Assigned To
              </h4>
              <div className="flex flex-wrap gap-2">
                {getAssignedMembers().map((member, index) => (
                  <span
                    key={index}
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      task.staff_ids[index] > 0 
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                        : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                    }`}
                  >
                    {member?.name}
                    <span className="ml-1 text-xs opacity-75">
                      ({task.staff_ids[index] > 0 ? 'Staff' : 'User'})
                    </span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {task.tags.length > 0 && (
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                <Tag className="w-4 h-4 mr-2" />
                Tags
              </h4>
              <div className="flex flex-wrap gap-2">
                {task.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-md text-sm font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {task.notes && (
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                <FileText className="w-4 h-4 mr-2" />
                Notes
              </h4>
              <div className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap">
                {task.notes}
              </div>
            </div>
          )}

          {/* Attachments */}
          {task.attachments && task.attachments.length > 0 && (
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                <Paperclip className="w-4 h-4 mr-2" />
                Attachments ({task.attachments.length})
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {task.attachments.map((attachment, index) => {
                  const isImage = attachment.file_type?.startsWith('image/') || 
                    attachment.file_name?.match(/\.(jpg|jpeg|png|gif|webp)$/i);
                  
                  return (
                    <div key={index} className="bg-white dark:bg-gray-600 rounded-lg p-3 border border-gray-200 dark:border-gray-500">
                      <div className="flex items-start space-x-3">
                        <div className="w-16 h-16 flex-shrink-0">
                          {isImage && attachment.file_url ? (
                            <img
                              src={attachment.file_url}
                              alt={attachment.display_name || attachment.file_name}
                              className="w-full h-full object-cover rounded-md cursor-pointer hover:opacity-80 transition-opacity"
                              onClick={() => window.open(attachment.file_url, '_blank')}
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                target.nextElementSibling?.classList.remove('hidden');
                              }}
                            />
                          ) : null}
                          <div className={`w-full h-full bg-gray-100 dark:bg-gray-500 rounded-md flex items-center justify-center ${isImage ? 'hidden' : ''}`}>
                            <FileText className="w-8 h-8 text-gray-400" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {attachment.display_name || attachment.file_name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {attachment.file_type || 'Unknown type'}
                          </p>
                          {attachment.file_url && (
                            <button
                              onClick={() => window.open(attachment.file_url, '_blank')}
                              className="mt-2 inline-flex items-center text-xs text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                            >
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                              Open
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-md dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
