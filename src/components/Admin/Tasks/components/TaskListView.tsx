import React from 'react';
import { Pencil, Trash2, Eye, Plus } from 'lucide-react';
import { Task, Board, StaffMember, CombinedStaffUser } from '../types';

interface TaskListViewProps {
  boards: Board[];
  tasks: Task[];
  staff: StaffMember[];
  combinedStaffUsers: CombinedStaffUser[];
  expandedBoards: Set<number>;
  activeBoardTabs: Record<number, 'open' | 'completed'>;
  onTaskClick: (task: Task) => void;
  onTaskView: (task: Task) => void;
  onDeleteTaskClick: (task: Task) => void;
  onAddTaskClick: (boardId: number) => void;
  onEditBoard: (board: Board) => void;
  onToggleBoardExpansion: (boardId: number) => void;
  onSetActiveBoardTab: (boardId: number, tab: 'open' | 'completed') => void;
}

// Helper function to generate consistent user ID hash
const getUserIdHash = (userId: string): number => {
  const hash = Math.abs(userId.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0));
  return -hash; // Return negative to distinguish from staff IDs
};

export const TaskListView = ({
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
  onEditBoard,
  onToggleBoardExpansion,
  onSetActiveBoardTab,
}) => {
  const shouldShowBoard = (board: Board) => {
    // Always show boards - even empty ones so users can add tasks to them
    return true;
  };

  const filterTasks = (boardId: number, tab: 'open' | 'completed') => {
    return tasks.filter((task) => {
      if (task.board_id !== boardId) return false;
      if (tab === 'completed') {
        return task.status === 'completed';
      } else {
        const isOverdue = task.due_date && new Date(task.due_date) < new Date();
        return (
          [
            'to_schedule',
            'booked_in',
            'in_progress',
            'purchased',
            'over_due',
          ].includes(task.status) || isOverdue
        );
      }
    });
  };

  return (
    <div className="space-y-4 fullw">
      {boards.filter(shouldShowBoard).map((board) => (
        <div
          key={board.id}
          className="border rounded-lg overflow-hidden"
          style={{ borderColor: board.border_color || '#E5E7EB' }}
        >
          <div 
            className="bg-gray-50 px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            onClick={() => onToggleBoardExpansion(board.id)}
          >
            <div className="flex items-center space-x-3">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: board.border_color || '#E5E7EB' }}
              />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {board.name}
              </h3>
              {board.description && (
                <span className="text-sm text-gray-500 dark:text-gray-300">
                  {board.description}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500 dark:text-gray-300">
                {tasks.filter((task) => task.board_id === board.id).length} tasks
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEditBoard(board);
                }}
                className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                title="Edit Board"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <svg
                className={`w-5 h-5 text-gray-400 transition-transform ${
                  expandedBoards.has(board.id) ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>

          {expandedBoards.has(board.id) && (
            <div className="bg-white dark:bg-gray-800">
              <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <nav className="flex space-x-8">
                    <button
                      onClick={() => onSetActiveBoardTab(board.id, 'open')}
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${
                        (activeBoardTabs[board.id] || 'open') === 'open'
                          ? 'border-indigo-500 text-indigo-600 dark:text-white'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-300 dark:hover:text-white'
                      }`}
                    >
                      Open Tasks ({filterTasks(board.id, 'open').length})
                    </button>
                    <button
                      onClick={() => onSetActiveBoardTab(board.id, 'completed')}
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${
                        (activeBoardTabs[board.id] || 'open') === 'completed'
                          ? 'border-indigo-500 text-indigo-600 dark:text-white'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-300 dark:hover:text-white'
                      }`}
                    >
                      Completed Tasks ({filterTasks(board.id, 'completed').length})
                    </button>
                  </nav>
                  <button
                    onClick={() => onAddTaskClick(board.id)}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Add Task
                  </button>
                </div>
              </div>

              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto relative">
                <div className="inline-block min-w-full align-middle">
                  <div className="overflow-hidden shadow-lg-sm ring-1 ring-black ring-opacity-5">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead>
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Task
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Status
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Priority
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Due Date
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Assigned To
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Notes
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-black divide-y divide-gray-200 dark:divide-gray-700">
                        {filterTasks(board.id, activeBoardTabs[board.id] || 'open')
                          .sort((a, b) => {
                            const priorityOrder = {
                              critical: 0,
                              high: 1,
                              medium: 2,
                              low: 3,
                            };
                            return (
                              priorityOrder[a.priority] -
                              priorityOrder[b.priority]
                            );
                          })
                          .map((task) => (
                            <tr
                              key={task.id}
                              className={
                                task.due_date &&
                                new Date(task.due_date) < new Date()
                                  ? 'bg-pink-50 dark:bg-pink-900/20'
                                  : ''
                              }
                            >
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  {task.title}
                                </div>
                                {task.description && (
                                  <div className="text-sm text-gray-500 dark:text-gray-200">
                                    {task.description}
                                  </div>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                                  ${
                                    task.status === 'completed'
                                      ? 'bg-green-100 text-green-800'
                                      : task.status === 'in_progress'
                                      ? 'bg-blue-100 text-blue-800'
                                      : task.status === 'over_due'
                                      ? 'bg-red-100 text-red-800'
                                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                                  }`}
                                >
                                  {task.status
                                    .replace(/_/g, ' ')
                                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                                  ${
                                    task.priority === 'critical'
                                      ? 'bg-red-100 text-red-800'
                                      : task.priority === 'high'
                                      ? 'bg-orange-100 text-orange-800'
                                      : task.priority === 'medium'
                                      ? 'bg-yellow-100 text-yellow-800'
                                      : 'bg-green-100 text-green-800 dark:bg-gray-700 dark:text-gray-200'
                                  }`}
                                >
                                  {task.priority.charAt(0).toUpperCase() +
                                    task.priority.slice(1)}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div
                                  className={`text-sm ${
                                    task.due_date &&
                                    new Date(task.due_date) < new Date()
                                      ? 'text-red-600'
                                      : 'text-gray-900 dark:text-red-400'
                                  }`}
                                >
                                  {task.due_date
                                    ? new Date(
                                        task.due_date
                                      ).toLocaleDateString()
                                    : '-'}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex flex-wrap gap-1">
                                  {task.staff_ids.map((staffId) => {
                                    // Check if it's a regular staff member (positive ID)
                                    if (staffId > 0) {
                                      const member = staff.find((s) => s.id === staffId);
                                      return (
                                        member && (
                                          <span
                                            key={staffId}
                                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                                          >
                                            {member.name}
                                            <span className="ml-1 text-xs opacity-75">(Staff)</span>
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
                                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                                          >
                                            {user.name}
                                            <span className="ml-1 text-xs opacity-75">(User)</span>
                                          </span>
                                        )
                                      );
                                    }
                                  })}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500 dark:text-gray-200">
                                  {task.notes}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div className="flex justify-end space-x-2">
                                  <button
                                    onClick={() => onTaskView(task)}
                                    className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                                    title="View Details"
                                  >
                                    <Eye className="w-5 h-5" />
                                  </button>
                                  <button
                                    onClick={() => onTaskClick(task)}
                                    className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                    title="Edit"
                                  >
                                    <Pencil className="w-5 h-5" />
                                  </button>
                                  <button
                                    onClick={() => onDeleteTaskClick(task)}
                                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                    title="Delete"
                                  >
                                    <Trash2 className="w-5 h-5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden space-y-4 p-4">
                {filterTasks(board.id, activeBoardTabs[board.id] || 'open')
                  .sort((a, b) => {
                    const priorityOrder = {
                      critical: 0,
                      high: 1,
                      medium: 2,
                      low: 3,
                    };
                    return (
                      priorityOrder[a.priority] -
                      priorityOrder[b.priority]
                    );
                  })
                  .map((task) => (
                    <div
                      key={task.id}
                      className={`bg-white dark:bg-gray-800 rounded-lg shadow-md border p-4 ${
                        task.due_date && new Date(task.due_date) < new Date()
                          ? 'border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800'
                          : 'border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      {/* Task Title and Description */}
                      <div className="mb-3">
                        <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                          {task.title}
                        </h4>
                        {task.description && (
                          <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">
                            {task.description}
                          </p>
                        )}
                      </div>

                      {/* Status and Priority Badges */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full
                          ${
                            task.status === 'completed'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                              : task.status === 'in_progress'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                              : task.status === 'over_due'
                              ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                          }`}
                        >
                          {task.status
                            .replace(/_/g, ' ')
                            .replace(/\b\w/g, (l) => l.toUpperCase())}
                        </span>
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full
                          ${
                            task.priority === 'critical'
                              ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                              : task.priority === 'high'
                              ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
                              : task.priority === 'medium'
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                              : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                          }`}
                        >
                          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                        </span>
                      </div>

                      {/* Due Date */}
                      {task.due_date && (
                        <div className="mb-3">
                          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Due: </span>
                          <span
                            className={`text-sm ${
                              new Date(task.due_date) < new Date()
                                ? 'text-red-600 dark:text-red-400 font-medium'
                                : 'text-gray-900 dark:text-white'
                            }`}
                          >
                            {new Date(task.due_date).toLocaleDateString()}
                          </span>
                        </div>
                      )}

                      {/* Assigned Staff */}
                      {task.staff_ids.length > 0 && (
                        <div className="mb-3">
                          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 block mb-1">Assigned to:</span>
                          <div className="flex flex-wrap gap-1">
                            {task.staff_ids.map((staffId) => {
                              // Check if it's a regular staff member (positive ID)
                              if (staffId > 0) {
                                const member = staff.find((s) => s.id === staffId);
                                return (
                                  member && (
                                    <span
                                      key={staffId}
                                      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                                    >
                                      {member.name}
                                      <span className="ml-1 text-xs opacity-75">(Staff)</span>
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
                                      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                                    >
                                      {user.name}
                                      <span className="ml-1 text-xs opacity-75">(User)</span>
                                    </span>
                                  )
                                );
                              }
                            })}
                          </div>
                        </div>
                      )}

                      {/* Notes */}
                      {task.notes && (
                        <div className="mb-3">
                          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 block mb-1">Notes:</span>
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            {task.notes}
                          </p>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex justify-end space-x-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                        <button
                          onClick={() => onTaskView(task)}
                          className="flex items-center px-3 py-1.5 text-xs font-medium text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/30 rounded-md transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </button>
                        <button
                          onClick={() => onTaskClick(task)}
                          className="flex items-center px-3 py-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 rounded-md transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4 mr-1" />
                          Edit
                        </button>
                        <button
                          onClick={() => onDeleteTaskClick(task)}
                          className="flex items-center px-3 py-1.5 text-xs font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 rounded-md transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
