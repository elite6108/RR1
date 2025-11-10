import React from 'react';
import { ChevronLeft, Plus } from 'lucide-react';

interface TaskHeaderProps {
  setShowTasks: (show: boolean) => void;
  setShowAdminDashboard: (show: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  viewMode: 'list' | 'kanban';
  setViewMode: (mode: 'list' | 'kanban') => void;
  onAddBoard: () => void;
}

export const TaskHeader: React.FC<TaskHeaderProps> = ({
  setShowTasks,
  setShowAdminDashboard,
  searchQuery,
  setSearchQuery,
  viewMode,
  setViewMode,
  onAddBoard,
}) => {
  return (
    <>
      <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-white mb-6">
        <button
          onClick={() => {
            setShowTasks(false);
            setShowAdminDashboard(true);
          }}
          className="flex items-center text-gray-600 hover:text-gray-900 dark:text-white dark:hover:text-gray-200"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Company Section
        </button>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Company Tasks</h2>
        <p>Use this for company tasks, or to assign tasks to other users. For personal tasks, use the To Do List instead.</p>
        <br />
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search tasks by title, tags, or board name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div className="flex items-center space-x-4 flex-shrink-0">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 dark:text-white">
                View:
              </span>
              <div className="flex rounded-md shadow-sm">
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-2 text-sm font-medium rounded-l-md ${
                    viewMode === 'list'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-blue-600 dark:hover:text-white'
                  }`}
                >
                  List
                </button>
                <button
                  onClick={() => setViewMode('kanban')}
                  className={`px-3 py-2 text-sm font-medium rounded-r-md ${
                    viewMode === 'kanban'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-blue-600 dark:hover:text-white'
                  }`}
                >
                  Kanban
                </button>
              </div>
            </div>
            <button
              onClick={onAddBoard}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Board
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
