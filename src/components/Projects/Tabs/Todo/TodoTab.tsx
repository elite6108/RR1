import React, { useState, useEffect } from 'react';
import { FileText, Plus, Pencil, Trash2, ChevronRight, ChevronDown, Eye } from 'lucide-react';
import { 
  Sidebar, 
  SidebarOverlay, 
  AddTaskModal, 
  EditTaskModal, 
  ViewTaskModal,
  DeleteTaskModal, 
  AddCategoryModal, 
  EditCategoryModal, 
  DeleteCategoryModal 
} from './components';
import { useTodoData, useTodoActions } from './hooks';
import { getFilteredTasks, getViewTitle } from './utils/helpers';
import { Task, Category, ViewType, TodoTabProps } from './types';

export function TodoTab({ projectId }: TodoTabProps) {
  const { tasks, categories, loading, fetchTasks, fetchCategories } = useTodoData(projectId);
  const todoActions = useTodoActions(projectId, fetchTasks, fetchCategories);

  // UI State
  const [currentView, setCurrentView] = useState<ViewType>('inbox');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);

  // Modal States
  const [showAddTask, setShowAddTask] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [viewingTask, setViewingTask] = useState<Task | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [showEditCategory, setShowEditCategory] = useState(false);
  const [showDeleteTask, setShowDeleteTask] = useState(false);
  const [showDeleteCategory, setShowDeleteCategory] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

  // Inline editing states
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTaskName, setEditingTaskName] = useState('');

  // Prevent body scroll when modal is open
  useEffect(() => {
    const isModalOpen = showAddTask || showAddCategory || editingTask !== null || viewingTask !== null;
    
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showAddTask, showAddCategory, editingTask, viewingTask]);

  // Handle sidebar scroll to top on mobile when opened
  useEffect(() => {
    if (sidebarOpen) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [sidebarOpen]);

  const handleViewChange = (view: ViewType, categoryId?: string | null) => {
    setCurrentView(view);
    setSelectedCategory(categoryId || null);
    setSidebarOpen(false);
  };

  const handleDeleteTask = (taskId: string) => {
    setTaskToDelete(taskId);
    setShowDeleteTask(true);
  };

  const handleConfirmDeleteTask = async () => {
    if (!taskToDelete) return;
    
    try {
      await todoActions.deleteTask(taskToDelete);
    } finally {
      setShowDeleteTask(false);
      setTaskToDelete(null);
    }
  };

  const handleDeleteCategory = (categoryId: string) => {
    setCategoryToDelete(categoryId);
    setShowDeleteCategory(true);
  };

  const handleConfirmDeleteCategory = async () => {
    if (!categoryToDelete) return;
    
    try {
      await todoActions.deleteCategory(categoryToDelete);
      
      // If we're currently viewing this category, switch to inbox
      if (selectedCategory === categoryToDelete) {
        setCurrentView('inbox');
        setSelectedCategory(null);
      }
    } finally {
      setShowDeleteCategory(false);
      setCategoryToDelete(null);
    }
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setShowEditCategory(true);
  };

  const handleUpdateCategory = async (categoryId: string, data: any) => {
    await todoActions.updateCategory(categoryId, data);
    setShowEditCategory(false);
    setEditingCategory(null);
  };

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
      const task = tasks.find(t => t.id === editingTaskId);
      if (task) {
        await todoActions.updateTask(editingTaskId, {
          name: editingTaskName.trim(),
          description: task.description || '',
          priority: task.priority,
          due_date: task.due_date || '',
          notes: task.notes || ''
        });
      }
    } finally {
      setEditingTaskId(null);
      setEditingTaskName('');
    }
  };

  const handleCancelInlineEdit = () => {
    setEditingTaskId(null);
    setEditingTaskName('');
  };

  const handleInlineEditKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSaveInlineEdit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancelInlineEdit();
    }
  };

  const filteredTasks = getFilteredTasks(tasks, currentView, selectedCategory);
  const incompleteTasks = filteredTasks.filter(task => !task.completed);
  const completedTasks = filteredTasks.filter(task => task.completed);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-100 dark:bg-gray-900 relative">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">To do</h2>
      <br />
      <div className="flex mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        {/* Sidebar Overlay */}
        <SidebarOverlay isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          tasks={tasks}
          categories={categories}
          currentView={currentView}
          selectedCategory={selectedCategory}
          onViewChange={handleViewChange}
          onAddCategory={() => setShowAddCategory(true)}
          onEditCategory={handleEditCategory}
          onDeleteCategory={handleDeleteCategory}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main content */}
        <div className="flex-1 flex flex-col bg-white dark:bg-gray-800 rounded-r-lg lg:rounded-r-lg min-w-0">
          {/* Header */}
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              {/* Mobile menu button */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <FileText className="h-6 w-6" />
              </button>
              
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
                {getViewTitle(currentView, categories, selectedCategory)}
              </h1>
              
              {/* Add task button - mobile */}
              <button
                onClick={() => setShowAddTask(true)}
                className="lg:hidden text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
              >
                <Plus className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Task list */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4">
            {/* Incomplete tasks */}
            <div className="space-y-2">
              {incompleteTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center space-x-3 py-3 sm:py-2 group hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md px-2 -mx-2"
                >
                  <button
                    onClick={() => todoActions.toggleTask(task.id, task.completed)}
                    className="flex-shrink-0 w-6 h-6 sm:w-5 sm:h-5 rounded-full border-2 border-gray-300 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500 transition-colors"
                  />
                  
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
                    onClick={() => setViewingTask(task)}
                    className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                    title="View"
                  >
                    <Eye className="h-5 w-5" />
                  </button>

                  <button
                    onClick={() => setEditingTask(task)}
                    className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                    title="Edit"
                  >
                    <Pencil className="h-5 w-5" />
                  </button>

                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                    title="Delete"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add task button - desktop */}
            <button
              onClick={() => setShowAddTask(true)}
              className="hidden lg:flex items-center space-x-2 py-2 px-2 -mx-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors mt-4"
            >
              <Plus className="h-5 w-5" />
              <span className="text-sm font-medium">Add task</span>
            </button>

            {/* Completed tasks */}
            {completedTasks.length > 0 && (
              <div className="mt-8">
                <button
                  onClick={() => setShowCompleted(!showCompleted)}
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
                          onClick={() => todoActions.toggleTask(task.id, task.completed)}
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
                          onClick={() => setViewingTask(task)}
                          className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                          title="View"
                        >
                          <Eye className="h-5 w-5" />
                        </button>

                        <button
                          onClick={() => setEditingTask(task)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          title="Edit"
                        >
                          <Pencil className="h-5 w-5" />
                        </button>

                        <button
                          onClick={() => handleDeleteTask(task.id)}
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

            {incompleteTasks.length === 0 && completedTasks.length === 0 && (
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
        </div>
      </div>

      {/* Mobile floating add button */}
      <button
        onClick={() => setShowAddTask(true)}
        className="lg:hidden fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg flex items-center justify-center z-30 transition-colors"
      >
        <Plus className="h-6 w-6" />
      </button>

      {/* Modals */}
      <AddTaskModal
        isOpen={showAddTask}
        onClose={() => setShowAddTask(false)}
        onSubmit={todoActions.addTask}
      />

      <EditTaskModal
        isOpen={!!editingTask}
        task={editingTask}
        onClose={() => setEditingTask(null)}
        onSubmit={todoActions.updateTask}
      />

      <ViewTaskModal
        isOpen={!!viewingTask}
        task={viewingTask}
        onClose={() => setViewingTask(null)}
      />

      <DeleteTaskModal
        isOpen={showDeleteTask}
        onClose={() => {
                  setShowDeleteTask(false);
                  setTaskToDelete(null);
                }}
        onConfirm={handleConfirmDeleteTask}
      />

      <AddCategoryModal
        isOpen={showAddCategory}
        onClose={() => setShowAddCategory(false)}
        onSubmit={todoActions.addCategory}
      />

      <EditCategoryModal
        isOpen={showEditCategory}
        category={editingCategory}
        onClose={() => {
                    setShowEditCategory(false);
                    setEditingCategory(null);
        }}
        onSubmit={handleUpdateCategory}
      />

      <DeleteCategoryModal
        isOpen={showDeleteCategory}
        onClose={() => {
                  setShowDeleteCategory(false);
                  setCategoryToDelete(null);
                }}
        onConfirm={handleConfirmDeleteCategory}
      />
    </div>
  );
}