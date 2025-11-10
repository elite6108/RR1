import React, { useState } from 'react';
import { Plus, Pencil, Trash2, ChevronDown, ChevronRight, FileText, Eye } from 'lucide-react';
import type { Task } from '../types';

interface TaskListProps {
  tasks: Task[];
  completedTasks: Task[];
  showCompleted: boolean;
  onToggleCompleted: () => void;
  onToggleTask: (taskId: string, completed: boolean) => void;
  onEditTask: (task: Task) => void;
  onViewTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onAddTask: () => void;
  onUpdateTaskName: (taskId: string, newName: string) => Promise<void>;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  completedTasks,
  showCompleted,
  onToggleCompleted,
  onToggleTask,
  onEditTask,
  onViewTask,
  onDeleteTask,
  onAddTask,
  onUpdateTaskName
}) => {
  // Inline editing states
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTaskName, setEditingTaskName] = useState('');

  // Inline editing handlers
  const handleStartInlineEdit = (task: Task) => {
    setEditingTaskId(task.id);
    setEditingTaskName(task.name);
  };

  const handleSaveInlineEdit = async () => {
    if (!editingTaskId || !editingTaskName.trim()) {
      handleCancelInlineEdit();
      return;
    }

    try {
      await onUpdateTaskName(editingTaskId, editingTaskName.trim());
    } finally {
      setEditingTaskId(null);
      setEditingTaskName('');
    }
  };

  const handleCancelInlineEdit = () => {
    setEditingTaskId(null);
    setEditingTaskName('');
  };

  const handleInlineEditKeyDown = (e: any) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSaveInlineEdit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancelInlineEdit();
    }
  };
  return (
    <div className="space-y-2">
      {/* Incomplete tasks */}
      {tasks.map((task) => (
        <div
          key={task.id}
          className="flex items-center space-x-3 py-3 sm:py-2 group hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md px-2 -mx-2"
        >
          <button
            onClick={() => onToggleTask(task.id, task.completed)}
            className="flex-shrink-0 w-6 h-6 sm:w-5 sm:h-5 rounded-full border-2 border-gray-300 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500 transition-colors"
          >
          </button>
          
          {editingTaskId === task.id ? (
            <input
              type="text"
              value={editingTaskName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditingTaskName(e.target.value)}
              onBlur={handleSaveInlineEdit}
              onKeyDown={handleInlineEditKeyDown}
              className="flex-1 text-gray-900 dark:text-white text-sm bg-transparent border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-indigo-500 px-1 py-0.5 min-w-0"
              autoFocus
            />
          ) : (
            <span 
              className="flex-1 text-gray-900 dark:text-white text-sm sm:text-sm min-w-0 break-words cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 px-1 py-0.5 rounded"
              onDoubleClick={() => handleStartInlineEdit(task)}
              title="Double-click to edit"
            >
              {task.name}
            </span>
          )}

          <button
            onClick={() => onViewTask(task)}
            className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
            title="View"
          >
            <Eye className="h-5 w-5" />
          </button>

          <button
            onClick={() => onEditTask(task)}
            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
            title="Edit"
          >
            <Pencil className="h-5 w-5" />
          </button>

          <button
            onClick={() => onDeleteTask(task.id)}
            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
            title="Delete"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      ))}

      {/* Add task button - desktop */}
      <button
        onClick={onAddTask}
        className="hidden lg:flex items-center space-x-2 py-2 px-2 -mx-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors mt-4"
      >
        <Plus className="h-5 w-5" />
        <span className="text-sm font-medium">Add task</span>
      </button>

      {/* Completed tasks */}
      {completedTasks.length > 0 && (
        <div className="mt-8">
          <button
            onClick={onToggleCompleted}
            className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 py-3 sm:py-2 px-2 -mx-2 rounded-md transition-colors w-full"
          >
            {showCompleted ? (
              <ChevronDown className="h-5 w-5" />
            ) : (
              <ChevronRight className="h-5 w-5" />
            )}
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-sm">+ {completedTasks.length} Completed Tasks</span>
            </div>
          </button>

          {showCompleted && (
            <div className="space-y-2 mt-2 ml-6">
              {completedTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center space-x-3 py-3 sm:py-2 group hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md px-2 -mx-2 opacity-60"
                >
                  <button
                    onClick={() => onToggleTask(task.id, task.completed)}
                    className="flex-shrink-0 w-6 h-6 sm:w-5 sm:h-5 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors"
                  >
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  {editingTaskId === task.id ? (
                    <input
                      type="text"
                      value={editingTaskName}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditingTaskName(e.target.value)}
                      onBlur={handleSaveInlineEdit}
                      onKeyDown={handleInlineEditKeyDown}
                      className="flex-1 text-gray-500 dark:text-gray-400 text-sm bg-transparent border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-indigo-500 px-1 py-0.5 min-w-0"
                      autoFocus
                    />
                  ) : (
                    <span 
                      className="flex-1 text-gray-500 dark:text-gray-400 text-sm line-through min-w-0 break-words cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 px-1 py-0.5 rounded opacity-60"
                      onDoubleClick={() => handleStartInlineEdit(task)}
                      title="Double-click to edit"
                    >
                      {task.name}
                    </span>
                  )}

                  <button
                    onClick={() => onViewTask(task)}
                    className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                    title="View"
                  >
                    <Eye className="h-5 w-5" />
                  </button>

                  <button
                    onClick={() => onEditTask(task)}
                    className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                    title="Edit"
                  >
                    <Pencil className="h-5 w-5" />
                  </button>

                  <button
                    onClick={() => onDeleteTask(task.id)}
                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                    title="Delete"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Empty state */}
      {tasks.length === 0 && completedTasks.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 dark:text-gray-500 mb-4">
            <FileText className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No tasks yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Get started by adding your first task.
          </p>
        </div>
      )}
    </div>
  );
};
