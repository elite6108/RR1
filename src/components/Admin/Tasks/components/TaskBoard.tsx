import React from 'react';
import { Plus, Trash2, Eye, Pencil } from 'lucide-react';
import { Task, Board, StaffMember, CombinedStaffUser } from '../types';
import { getUserIdHash } from '../utils';

interface TaskBoardProps {
  boards: Board[];
  tasks: Task[];
  staff: StaffMember[];
  combinedStaffUsers: CombinedStaffUser[];
  expandedBoards: Set<number>;
  activeBoardTabs: Record<number, 'open' | 'completed'>;
  onTaskClick: (task: Task) => void;
  onTaskView: (task: Task) => void;
  onDeleteTaskClick: (task: Task) => void;
  onAddTaskClick: (status: Task['status']) => void;
  onToggleBoardExpansion: (boardId: number) => void;
  onSetActiveBoardTab: (boardId: number, tab: 'open' | 'completed') => void;
}

export const TaskBoard = ({
  boards,
  tasks,
  staff,
  combinedStaffUsers,
  expandedBoards,
  activeBoardTabs,
  onTaskClick,
  onTaskView,
  onDeleteTaskClick,
  onAddTaskClick,
  onToggleBoardExpansion,
  onSetActiveBoardTab,
}) => {
  const getTasksByStatus = (status: Task['status']) => {
    return tasks
      .filter((task) => task.status === status)
      .sort((a, b) => {
        const priorityOrder = {
          critical: 0,
          high: 1,
          medium: 2,
          low: 3,
        };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    }
  };

  const formatStatus = (status: string) => {
    return status
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const statusColumns: Task['status'][] = [
    'to_schedule',
    'booked_in',
    'in_progress',
    'over_due',
    'purchased',
    'completed',
  ];

  return (
    <div className="overflow-x-auto max-w-full">
      <div className="flex space-x-4 min-w-max">
        {statusColumns.map((status) => (
          <div key={status} className="flex-shrink-0 w-80">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-700 dark:text-white mb-4 flex items-center justify-between">
                <span>{formatStatus(status)}</span>
                <span className="bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 text-xs px-2 py-1 rounded-full">
                  {getTasksByStatus(status).length}
                </span>
              </h3>
              <div className="space-y-3">
                {getTasksByStatus(status).map((task) => (
                  <div
                    key={task.id}
                    className={`bg-white dark:bg-gray-600 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-200 ${
                      task.due_date && new Date(task.due_date) < new Date()
                        ? 'bg-pink-50 dark:bg-pink-900/20'
                        : ''
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                          {task.title}
                        </h4>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium mt-1 ${getPriorityColor(
                            task.priority
                          )}`}
                        >
                          {task.priority.charAt(0).toUpperCase() +
                            task.priority.slice(1)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <button
                          type="button"
                          onClick={() => onTaskView(task)}
                          className="p-1 text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-md"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onTaskClick(task)}
                          className="p-1 text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteTaskClick(task)}
                          className="p-1 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    {task.description && (
                      <p className="text-xs text-gray-500 dark:text-gray-300 mb-2 line-clamp-2">
                        {task.description}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-1 mb-2">
                      {task.staff_ids.slice(0, 2).map((staffId) => {
                        // Check if it's a regular staff member (positive ID)
                        if (staffId > 0) {
                          const member = staff.find((s) => s.id === staffId);
                          return (
                            member && (
                              <span
                                key={staffId}
                                className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-500 dark:text-blue-200"
                              >
                                {member.name.split(' ')[0]}
                              </span>
                            )
                          );
                        } else {
                          // It's a user (negative ID)
                          const user = combinedStaffUsers.find((u) => 
                            u.type === 'user' && getUserIdHash(u.original_id as string) === staffId
                          );
                          return (
                            user && (
                              <span
                                key={staffId}
                                className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-500 dark:text-green-200"
                              >
                                {user.name.split(' ')[0]}
                              </span>
                            )
                          );
                        }
                      })}
                      {task.staff_ids.length > 2 && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-gray-200 text-gray-600 dark:bg-gray-600 dark:text-gray-300">
                          +{task.staff_ids.length - 2}
                        </span>
                      )}
                    </div>
                    {task.due_date && (
                      <div
                        className={`text-xs flex items-center ${
                          new Date(task.due_date) < new Date()
                            ? 'text-red-600 dark:text-red-400'
                            : 'text-gray-500 dark:text-gray-400'
                        }`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {new Date(task.due_date).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => onAddTaskClick(status)}
                  className="w-full mt-2 flex items-center justify-center px-3 py-2 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-500 dark:text-gray-400 hover:border-indigo-500 hover:text-indigo-500 dark:hover:border-indigo-400 dark:hover:text-indigo-400"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Task
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
