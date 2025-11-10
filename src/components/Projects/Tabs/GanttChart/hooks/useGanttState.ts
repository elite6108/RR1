import { useState, useRef, useEffect } from 'react';
import type { GanttTask, GanttLink, FormData } from '../types';
import { getDefaultFormData } from '../utils/constants';
import { loadTasksAndLinks } from '../utils/taskOperations';

export const useGanttState = (projectId: string) => {
  const apiRef = useRef<any>();
  const [loading, setLoading] = useState(true);
  const [loadedTasks, setLoadedTasks] = useState<GanttTask[]>([]);
  const [loadedLinks, setLoadedLinks] = useState<GanttLink[]>([]);
  const [showSidebar, setShowSidebar] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [unsavedChanges, setUnsavedChanges] = useState<{ [key: number]: GanttTask }>({});
  const [hasChanges, setHasChanges] = useState(false);
  const [selectedTask, setSelectedTask] = useState<number | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(window.matchMedia('(prefers-color-scheme: dark)').matches);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormData>(getDefaultFormData());

  // Load tasks and links when component mounts
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const { tasks, links } = await loadTasksAndLinks(projectId);
        setLoadedTasks(tasks);
        setLoadedLinks(links);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [projectId]);

  // Dark mode detection
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
    
    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, []);

  const resetForm = () => {
    setFormData(getDefaultFormData());
    setEditingTaskId(null);
  };

  const closeSidebar = () => {
    setShowSidebar(false);
    resetForm();
  };

  const openNewTaskForm = () => {
    resetForm();
    setShowSidebar(true);
  };

  const openEditTaskForm = (task: GanttTask) => {
    setEditingTaskId(task.id);
    setFormData({
      text: task.text,
      description: task.description || '',
      start: task.start,
      end: task.end,
      duration: task.duration,
      progress: task.progress,
      type: task.type,
    });
    setShowSidebar(true);
  };

  const openDeleteModal = (taskId: number) => {
    setTaskToDelete(taskId);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setTaskToDelete(null);
  };

  const addUnsavedChange = (taskId: number, task: GanttTask) => {
    setUnsavedChanges(prev => ({
      ...prev,
      [taskId]: task
    }));
    setHasChanges(true);
  };

  const clearUnsavedChanges = () => {
    setUnsavedChanges({});
    setHasChanges(false);
  };

  return {
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
    isDarkMode,
    showDeleteModal,
    taskToDelete,
    formData,
    setFormData,
    
    // Actions
    resetForm,
    closeSidebar,
    openNewTaskForm,
    openEditTaskForm,
    openDeleteModal,
    closeDeleteModal,
    addUnsavedChange,
    clearUnsavedChanges,
  };
};
