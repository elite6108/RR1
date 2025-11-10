import React from 'react';
import { FileText, Calendar, Plus, Pencil, Trash2, X } from 'lucide-react';
import { Task, Category, ViewType } from '../types';
import { getCategoryIcon, getTodayTaskCount, getNext7DaysTaskCount } from '../utils/helpers';

interface SidebarProps {
  isOpen: boolean;
  tasks: Task[];
  categories: Category[];
  currentView: ViewType;
  selectedCategory: string | null;
  onViewChange: (view: ViewType, categoryId?: string | null) => void;
  onAddCategory: () => void;
  onEditCategory: (category: Category) => void;
  onDeleteCategory: (categoryId: string) => void;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  tasks,
  categories,
  currentView,
  selectedCategory,
  onViewChange,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
  onClose
}) => {
  return (
    <div className={`
      fixed inset-y-0 left-0 z-50 w-64 bg-gray-50 dark:bg-gray-800 transform transition-transform duration-300 ease-in-out
      lg:translate-x-0 lg:static lg:inset-0 lg:z-0
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      flex flex-col rounded-l-lg lg:rounded-l-lg
      lg:h-auto h-screen
    `}>
      {/* Mobile header */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Menu</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* Navigation */}
      <div className="p-4">
        <nav className="space-y-1">
          <button
            onClick={() => onViewChange('inbox', null)}
            className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
              currentView === 'inbox'
                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200'
                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            <FileText className="mr-3 h-5 w-5" />
            Main Tasks
            <span className="ml-auto text-xs bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded-full">
              {tasks.filter(t => !t.completed).length}
            </span>
          </button>

          <button
            onClick={() => onViewChange('today', null)}
            className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
              currentView === 'today'
                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200'
                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            <Calendar className="mr-3 h-5 w-5" />
            Today
            <span className="ml-auto text-xs bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded-full">
              {getTodayTaskCount(tasks)}
            </span>
          </button>

          <button
            onClick={() => onViewChange('next7days', null)}
            className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
              currentView === 'next7days'
                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200'
                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            <Calendar className="mr-3 h-5 w-5" />
            Next 7 Days
            <span className="ml-auto text-xs bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded-full">
              {getNext7DaysTaskCount(tasks)}
            </span>
          </button>
        </nav>
      </div>

      {/* Categories */}
      <div className="flex-1 px-4 pb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">Categories</h3>
          <button
            onClick={onAddCategory}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-1">
          {categories.map((category) => {
            const IconComponent = getCategoryIcon(category.icon);
            return (
              <div
                key={category.id}
                className={`w-full flex items-center px-3 py-2 text-sm rounded-md group ${
                  currentView === 'category' && selectedCategory === category.id
                    ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                <button
                  onClick={() => onViewChange('category', category.id)}
                  className="flex-1 flex items-center min-w-0"
                >
                  <IconComponent className="mr-3 h-5 w-5 flex-shrink-0" />
                  <span className="truncate">{category.name}</span>
                </button>
                
                <button
                  onClick={() => onEditCategory(category)}
                  className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                  title="Edit"
                >
                  <Pencil className="h-5 w-5" />
                </button>

                <button
                  onClick={() => onDeleteCategory(category.id)}
                  className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                  title="Delete"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
