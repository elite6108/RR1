import React, { useEffect } from 'react';
import { Plus } from 'lucide-react';
import 'wx-react-gantt/dist/gantt.css';
import '../../../../styles/gantt/style.css';

// Import types
import type { GanttChartTabProps } from './types';

// Import hooks
import { useGanttState } from './hooks/useGanttState';
import { useGanttEvents } from './hooks/useGanttEvents';
import { useDarkMode } from './hooks/useDarkMode';

// Import components
import { TaskFormModal } from './components/TaskFormModal';
import { DeleteConfirmationModal } from './components/DeleteConfirmationModal';
import { GanttToolbar } from './components/GanttToolbar';
import { ResponsiveMessage } from './components/ResponsiveMessage';
import { GanttView } from './components/GanttView';

// Import utilities
import { ganttStyles } from './utils/styles';
import { createTask, updateTaskFormData, deleteTask, saveUnsavedChanges } from './utils/taskOperations';

// Add custom styles to the document
const styleElement = document.createElement('style');
styleElement.textContent = ganttStyles;
document.head.appendChild(styleElement);

export function GanttChartTab({ project }: GanttChartTabProps) {
  const {
    // Refs
    apiRef,
    
    // State
    loading,
    loadedTasks,
    setLoadedTasks,
    loadedLinks,
    setLoadedLinks,
    showSidebar,
    editingTaskId,
    unsavedChanges,
    hasChanges,
    selectedTask,
    setSelectedTask,
    showDeleteModal,
    taskToDelete,
    formData,
    setFormData,
    
    // Actions
    closeSidebar,
    openNewTaskForm,
    openEditTaskForm,
    openDeleteModal,
    closeDeleteModal,
    addUnsavedChange,
    clearUnsavedChanges,
  } = useGanttState(project.id);

  // Initialize dark mode handling
  useDarkMode();

  // Initialize Gantt events
  const { handleInit, handleIndentRight, handleIndentLeft } = useGanttEvents({
    projectId: project.id,
    loadedTasks,
    setLoadedTasks,
    loadedLinks,
    setLoadedLinks,
    setSelectedTask,
    setFormData,
    addUnsavedChange,
    apiRef
  });

  // Add debug logging
  useEffect(() => {
    console.log('Current hasChanges state:', hasChanges);
    console.log('Current unsavedChanges:', unsavedChanges);
  }, [hasChanges, unsavedChanges]);
    
  // Debug selected task changes
  useEffect(() => {
    console.log('Selected task changed:', selectedTask);
  }, [selectedTask]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTaskId) {
      // Update existing task
      const success = await updateTaskFormData(editingTaskId, formData);
      if (success) {
        // Update local state and refresh Gantt chart
        setLoadedTasks(prev => {
        const durationInDays = Math.ceil(
          (formData.end.getTime() - formData.start.getTime()) / (1000 * 60 * 60 * 24)
        );

          const newTasks = prev.map(task => 
            task.id === editingTaskId 
              ? {
                  ...task,
                  text: formData.text,
                  description: formData.description,
                  start: formData.start,
                  end: formData.end,
                  duration: durationInDays,
                  progress: formData.progress,
                  type: formData.type,
                }
              : task
          );
          
          // Force Gantt chart refresh
          if (apiRef.current) {
            apiRef.current.exec('tasks', newTasks);
          }
          return newTasks;
        });
      }
    } else {
      // Create new task
      const durationInDays = Math.ceil(
        (formData.end.getTime() - formData.start.getTime()) / (1000 * 60 * 60 * 24)
      );
      const newTask = await createTask(project.id, {
        ...formData,
        duration: durationInDays
      });
      
      if (newTask) {
                // Update local state
      setLoadedTasks((prev) => {
          const newTasks = [...prev, newTask];
        // Force Gantt chart refresh by updating the tasks in the API
                  if (apiRef.current) {
                    apiRef.current.exec('tasks', newTasks);
                  }
                  return newTasks;
                });
      }
    }
    closeSidebar();
  };

  const handleSaveChanges = async () => {
    const refreshedTasks = await saveUnsavedChanges(project.id, unsavedChanges);
    if (refreshedTasks) {
      clearUnsavedChanges();
      setLoadedTasks(refreshedTasks);
      if (apiRef.current) {
        apiRef.current.exec('tasks', refreshedTasks);
      }
    }
  };

  const confirmDeleteTask = async () => {
    if (!taskToDelete) return;

    const success = await deleteTask(taskToDelete);
    if (success) {
      // Update local state to remove the deleted task
      setLoadedTasks((prev) => prev.filter((t) => t.id !== taskToDelete));
      
      // Clear any selected task in the Gantt chart
      if (apiRef.current) {
        apiRef.current.getState().selected = [];
      }
    }
    closeDeleteModal();
  };

  

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Gantt Chart - {project.name}
        </h2>
        <div className="flex items-center gap-4">
          {selectedTask && (
            <GanttToolbar
              selectedTask={selectedTask}
              apiRef={apiRef}
              onEditTask={openEditTaskForm}
              onDeleteTask={openDeleteModal}
              onIndentRight={handleIndentRight}
              onIndentLeft={handleIndentLeft}
            />
          )}
          <div className="hidden lg:flex items-center gap-2">
            {hasChanges && (
              <button
                onClick={handleSaveChanges}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Save Changes
              </button>
            )}

            <button
              onClick={openNewTaskForm}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Task
            </button>
          </div>
        </div>
      </div>

      <ResponsiveMessage />

      <GanttView
              apiRef={apiRef}
              tasks={loadedTasks}
              links={loadedLinks}
        onInit={handleInit}
      />

      <TaskFormModal
        show={showSidebar}
        editingTaskId={editingTaskId}
        formData={formData}
        setFormData={setFormData}
        onClose={closeSidebar}
        onSubmit={handleFormSubmit}
      />

      <DeleteConfirmationModal
        show={showDeleteModal}
        onConfirm={confirmDeleteTask}
        onCancel={closeDeleteModal}
      />
    </div>
  );
}
