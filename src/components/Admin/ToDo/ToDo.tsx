import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FileText, Plus, ChevronLeft } from 'lucide-react';
import { useTasks } from './hooks/useTasks';
import { useCategories } from './hooks/useCategories';
import { useStaff } from './hooks/useStaff';
import { getFilteredTasks, getViewTitle } from './utils/helpers';
import {
  Sidebar,
  TaskList,
  TaskModal,
  CategoryModal,
  ConfirmationModal,
  SidebarOverlay
} from './components';
import { TaskView } from './components/TaskView';
import type { TodoProps, ViewType, TaskFormData, CategoryFormData, Task, Category } from './types';

export function ToDo({ setShowToDo, setShowAdminDashboard }: TodoProps) {
  // Custom hooks
  const { tasks, loading, addTask, updateTask, toggleTask, deleteTask } = useTasks();
  const { categories, addCategory, updateCategory, deleteCategory } = useCategories();
  const { staff } = useStaff();

  // View state
  const [currentView, setCurrentView] = useState<ViewType>('inbox');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);

  // Modal states
  const [showAddTask, setShowAddTask] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showEditCategory, setShowEditCategory] = useState(false);
  const [showDeleteTask, setShowDeleteTask] = useState(false);
  const [showDeleteCategory, setShowDeleteCategory] = useState(false);
  const [showTaskView, setShowTaskView] = useState(false);
  
  // Edit states
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [viewingTask, setViewingTask] = useState<Task | null>(null);

  // Form data
  const [newTask, setNewTask] = useState<TaskFormData>({
    name: '',
    description: '',
    priority: 'medium',
    due_date: '',
    tags: [],
    notes: ''
  });

  const [editTask, setEditTask] = useState<TaskFormData>({
    name: '',
    description: '',
    priority: 'medium',
    due_date: '',
    tags: [],
    notes: ''
  });

  const [newCategory, setNewCategory] = useState<CategoryFormData>({
    name: '',
    icon: 'FileText'
  });

  const [editCategory, setEditCategory] = useState<CategoryFormData>({
    name: '',
    icon: 'FileText'
  });

  const [iconSearch, setIconSearch] = useState('');

  // Prevent body scroll when modal is open
  useEffect(() => {
    const isModalOpen = showAddTask || showAddCategory || editingTask !== null;
    
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showAddTask, showAddCategory, editingTask]);

  // Handle sidebar scroll to top on mobile when opened
  useEffect(() => {
    if (sidebarOpen) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [sidebarOpen]);

  // Task handlers
  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addTask(newTask);
      setNewTask({
        name: '',
        description: '',
        priority: 'medium',
        due_date: '',
        tags: [],
        notes: ''
      });
      setShowAddTask(false);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleUpdateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask) return;

    try {
      await updateTask(editingTask.id, editTask);
      setEditingTask(null);
      setEditTask({
        name: '',
        description: '',
        priority: 'medium',
        due_date: '',
        tags: [],
        notes: ''
      });
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  // Inline editing handler for task names
  const handleUpdateTaskName = async (taskId: string, newName: string) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (task) {
        await updateTask(taskId, {
          name: newName,
          description: task.description || '',
          priority: task.priority,
          due_date: task.due_date || '',
          tags: task.tags || [],
          notes: task.notes || ''
        });
      }
    } catch (error) {
      console.error('Error updating task name:', error);
      throw error;
    }
  };

  const startEditTask = (task: Task) => {
    setEditingTask(task);
    setEditTask({
      name: task.name,
      description: task.description || '',
      priority: task.priority,
      due_date: task.due_date || '',
      tags: task.tags || [],
      notes: task.notes || ''
    });
  };

  const handleViewTask = (task: Task) => {
    setViewingTask(task);
    setShowTaskView(true);
  };

  const handleDeleteTask = (taskId: string) => {
    setTaskToDelete(taskId);
    setShowDeleteTask(true);
  };

  const confirmDeleteTask = async () => {
    if (!taskToDelete) return;
    
    try {
      await deleteTask(taskToDelete);
    } catch (error) {
      console.error('Error deleting task:', error);
    } finally {
      setShowDeleteTask(false);
      setTaskToDelete(null);
    }
  };

  // Category handlers
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.name.trim()) return;

    try {
      await addCategory(newCategory);
      setNewCategory({ name: '', icon: 'FileText' });
      setShowAddCategory(false);
      setIconSearch('');
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const startEditCategory = (category: Category) => {
    setEditingCategory(category);
    setEditCategory({
      name: category.name,
      icon: category.icon
    });
    setShowEditCategory(true);
  };

  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;

    try {
      await updateCategory(editingCategory.id, editCategory);
      setShowEditCategory(false);
      setEditingCategory(null);
      setIconSearch('');
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  const handleDeleteCategory = (categoryId: string) => {
    setCategoryToDelete(categoryId);
    setShowDeleteCategory(true);
  };

  const confirmDeleteCategory = async () => {
    if (!categoryToDelete) return;
    
    try {
      await deleteCategory(categoryToDelete);
      
      // If we're currently viewing this category, switch to inbox
      if (selectedCategory === categoryToDelete) {
        setCurrentView('inbox');
        setSelectedCategory(null);
      }
    } catch (error) {
      console.error('Error deleting category:', error);
    } finally {
      setShowDeleteCategory(false);
      setCategoryToDelete(null);
    }
  };

  // Get filtered tasks
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
      <div className="space-y-6">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-white mb-6">
          <button
            onClick={() => {
              setShowToDo(false);
              setShowAdminDashboard();
            }}
            className="flex items-center text-gray-600 hover:text-gray-900 dark:text-white dark:hover:text-gray-200"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Company Section
          </button>
         </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">To do</h2>
        </div>
        <br></br>
      </div>

      <div className="flex mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        {/* Sidebar Overlay */}
        <SidebarOverlay isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        {/* Sidebar */}
        <Sidebar
          tasks={tasks}
          categories={categories}
          currentView={currentView}
          selectedCategory={selectedCategory}
          sidebarOpen={sidebarOpen}
          onViewChange={setCurrentView}
          onCategorySelect={setSelectedCategory}
          onSidebarClose={() => setSidebarOpen(false)}
          onAddCategory={() => setShowAddCategory(true)}
          onEditCategory={startEditCategory}
          onDeleteCategory={handleDeleteCategory}
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
            <TaskList
              tasks={incompleteTasks}
              completedTasks={completedTasks}
              showCompleted={showCompleted}
              onToggleCompleted={() => setShowCompleted(!showCompleted)}
              onToggleTask={toggleTask}
              onEditTask={startEditTask}
              onViewTask={handleViewTask}
              onDeleteTask={handleDeleteTask}
              onAddTask={() => setShowAddTask(true)}
              onUpdateTaskName={handleUpdateTaskName}
            />
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
      {showAddTask && createPortal(
        <TaskModal
          isOpen={showAddTask}
          onClose={() => {
            setShowAddTask(false);
            setNewTask({
              name: '',
              description: '',
              priority: 'medium',
              due_date: '',
              tags: [],
              notes: ''
            });
          }}
          onSubmit={handleAddTask}
          title="Add New Task"
          formData={newTask}
          onFormDataChange={setNewTask}
          submitButtonText="Add Task"
        />,
        document.body
      )}

      {editingTask && createPortal(
        <TaskModal
          isOpen={!!editingTask}
          onClose={() => {
            setEditingTask(null);
            setEditTask({
              name: '',
              description: '',
              priority: 'medium',
              due_date: '',
              tags: [],
              notes: ''
            });
          }}
          onSubmit={handleUpdateTask}
          title="Edit Task"
          formData={editTask}
          onFormDataChange={setEditTask}
          submitButtonText="Update Task"
        />,
        document.body
      )}

      {showAddCategory && createPortal(
        <CategoryModal
          isOpen={showAddCategory}
          onClose={() => {
            setShowAddCategory(false);
            setNewCategory({ name: '', icon: 'FileText' });
            setIconSearch('');
          }}
          onSubmit={handleAddCategory}
          title="Add New Category"
          formData={newCategory}
          onFormDataChange={setNewCategory}
          iconSearch={iconSearch}
          onIconSearchChange={setIconSearch}
          submitButtonText="Add Category"
        />,
        document.body
      )}

      {showEditCategory && createPortal(
        <CategoryModal
          isOpen={showEditCategory}
          onClose={() => {
            setShowEditCategory(false);
            setEditingCategory(null);
            setIconSearch('');
          }}
          onSubmit={handleUpdateCategory}
          title="Edit Category"
          formData={editCategory}
          onFormDataChange={setEditCategory}
          iconSearch={iconSearch}
          onIconSearchChange={setIconSearch}
          submitButtonText="Update Category"
        />,
        document.body
      )}

      {showDeleteTask && createPortal(
        <ConfirmationModal
          isOpen={showDeleteTask}
          onClose={() => {
            setShowDeleteTask(false);
            setTaskToDelete(null);
          }}
          onConfirm={confirmDeleteTask}
          title="Delete Task"
          message="Are you sure you want to delete this task? This action cannot be undone."
          confirmButtonText="Delete"
        />,
        document.body
      )}

      {showDeleteCategory && createPortal(
        <ConfirmationModal
          isOpen={showDeleteCategory}
          onClose={() => {
            setShowDeleteCategory(false);
            setCategoryToDelete(null);
          }}
          onConfirm={confirmDeleteCategory}
          title="Delete Category"
          message='Are you sure you want to delete this category? All tasks in this category will be moved to "No Category". This action cannot be undone.'
          confirmButtonText="Delete"
        />,
        document.body
      )}

      {showTaskView && viewingTask && createPortal(
        <TaskView
          task={viewingTask}
          onClose={() => {
            setShowTaskView(false);
            setViewingTask(null);
          }}
        />,
        document.body
      )}
    </div>
  );
}
