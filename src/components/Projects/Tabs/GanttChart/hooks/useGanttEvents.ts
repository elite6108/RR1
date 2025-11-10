import { useCallback } from 'react';
import type { GanttTask, GanttLink, FormData } from '../types';
import { createLink, deleteLink } from '../utils/linkOperations';
import { updateTaskHierarchy } from '../utils/taskOperations';

interface UseGanttEventsProps {
  projectId: string;
  loadedTasks: GanttTask[];
  setLoadedTasks: (value: React.SetStateAction<GanttTask[]>) => void;
  loadedLinks: GanttLink[];
  setLoadedLinks: (value: React.SetStateAction<GanttLink[]>) => void;
  setSelectedTask: (taskId: number | null) => void;
  setFormData: (value: React.SetStateAction<FormData>) => void;
  addUnsavedChange: (taskId: number, task: GanttTask) => void;
  apiRef: { current: any };
}

export const useGanttEvents = ({
  projectId,
  loadedTasks,
  setLoadedTasks,
  loadedLinks,
  setLoadedLinks,
  setSelectedTask,
  setFormData,
  addUnsavedChange,
  apiRef
}: UseGanttEventsProps) => {

  const handleInit = useCallback(
    (api: any) => {
      apiRef.current = api;
      
      // Initialize with both tasks and links
      if (loadedLinks.length > 0) {
        api.exec('links', loadedLinks);
      }

      // Handle task selection
      api.on('select-task', (task: GanttTask) => {
        setSelectedTask(task.id);
        const selected = loadedTasks.find((t) => t.id === task.id);
        if (selected) {
          setFormData({
            text: selected.text,
            description: selected.description || '',
            start: selected.start,
            end: selected.end,
            duration: selected.duration,
            progress: selected.progress,
            type: selected.type,
          });
        }
      });

      // Handle task dragging and resizing
      api.on('drag-task', async (ev: any) => {
        try {
          console.log('Drag event received:', ev);
          const { id, inProgress } = ev;
          
          // Only process the event when dragging is complete
          if (inProgress) return;

          const task = loadedTasks.find(t => t.id === id);
          if (!task) {
            console.log('Task not found:', id);
            return;
          }

          // Get the current task from the Gantt API
          const currentTask = apiRef.current.getTask(id);
          if (!currentTask) {
            console.log('Could not get task from Gantt API');
            return;
          }

          console.log('Current task from API:', currentTask);

          let newStart = new Date(currentTask.start);
          let newEnd = task.end;

          // Calculate the time difference between old and new start dates
          const timeDiff = newStart.getTime() - task.start.getTime();

          // Only proceed if there's actually a change
          if (timeDiff === 0) {
            console.log('No change in position');
            return;
          }

          // Prepare the updated task based on type
          let updatedTask: GanttTask;
          if (task.type === 'milestone') {
            updatedTask = {
              ...task,
              start: newStart,
              end: newStart
            };
          } else if (task.type === 'summary') {
            updatedTask = {
              ...task,
              start: newStart
            };
          } else {
            // For regular tasks, maintain the same duration by shifting the end date
            newEnd = new Date(task.end.getTime() + timeDiff);
            const durationInDays = Math.ceil(
              (newEnd.getTime() - newStart.getTime()) / (1000 * 60 * 60 * 24)
            );
            updatedTask = {
              ...task,
              start: newStart,
              end: newEnd,
              duration: durationInDays
            };
          }

          console.log('Adding to unsaved changes:', updatedTask);

          // Add to unsaved changes
          addUnsavedChange(id, updatedTask);

          // Update local state for visual feedback
          setLoadedTasks((prev: GanttTask[]) => {
            const newTasks = prev.map((t: GanttTask) => t.id === id ? updatedTask : t);
            console.log('Updated local tasks:', newTasks);
            return newTasks;
          });

          // Update Gantt view
          if (apiRef.current) {
            apiRef.current.exec('tasks', loadedTasks.map(t => 
              t.id === id ? updatedTask : t
            ));
          }
        } catch (err) {
          console.error('Error handling drag:', err);
          // Revert the drag if there was an error
          if (apiRef.current) {
            apiRef.current.exec('tasks', loadedTasks);
          }
        }
      });

      // Track progress changes without immediate save
      api.on('progress-change', (taskId: number, progress: number) => {
        const task = loadedTasks.find(t => t.id === taskId);
        if (task) {
          const updatedTask = { ...task, progress };
          addUnsavedChange(taskId, updatedTask);
          
          // Update local state for visual feedback
          setLoadedTasks((prev: GanttTask[]) => prev.map((t: GanttTask) => 
            t.id === taskId ? updatedTask : t
          ));
        }
      });

      // Handle task deselection
      api.on('deselect-all', () => {
        setSelectedTask(null);
      });

      // Handle link creation
      api.on('link-created', async (link: GanttLink) => {
        const newLink = await createLink(projectId, link);
        if (newLink) {
          setLoadedLinks((prev: GanttLink[]) => [...prev, newLink]);
        } else {
          // Remove the link from the UI if save failed
          if (apiRef.current) {
            apiRef.current.exec('links', loadedLinks);
          }
        }
      });

      // Handle link deletion
      api.on('link-deleted', async (linkId: number) => {
        const success = await deleteLink(linkId);
        if (success) {
          setLoadedLinks((prev: GanttLink[]) => prev.filter((link: GanttLink) => link.id !== linkId));
        } else {
          // Restore the link in the UI if delete failed
          if (apiRef.current) {
            apiRef.current.exec('links', loadedLinks);
          }
        }
      });
    },
    [loadedTasks, loadedLinks, projectId, setSelectedTask, setFormData, addUnsavedChange, setLoadedTasks, setLoadedLinks, apiRef]
  );

  const handleIndentRight = async (selectedItemId: number) => {
    if (apiRef.current) {
      // Execute the indent action which will handle the parent-child relationship
      apiRef.current.exec('indent-task', { id: selectedItemId, mode: true });
      
      // Get the updated task data to save to database
      const updatedTask = apiRef.current.getTask(selectedItemId);
      if (updatedTask && updatedTask.parent) {
        const success = await updateTaskHierarchy(selectedItemId, updatedTask.parent, 'summary');
        
        if (success) {
          // Update local state for both child and parent
          setLoadedTasks((prev: GanttTask[]) => {
            const newTasks = prev.map((task: GanttTask) => {
              if (task.id === selectedItemId) {
                return { ...task, parent: updatedTask.parent };
              } else if (task.id === updatedTask.parent) {
                return { ...task, type: 'summary' as const };
              }
              return task;
            });

            // Refresh the Gantt chart with updated data
            if (apiRef.current) {
              apiRef.current.exec('tasks', newTasks);
              // Open the parent task to show its children
              apiRef.current.exec('open-task', { id: updatedTask.parent, mode: true });
            }
            return newTasks;
          });
        }
      }
    }
  };

  const handleIndentLeft = async (selectedItemId: number) => {
    if (apiRef.current) {
      // Get the current task data before outdenting
      const currentTask = apiRef.current.getTask(selectedItemId);
      const oldParentId = currentTask?.parent;

      // Execute the indent action with mode false to outdent
      apiRef.current.exec('indent-task', { id: selectedItemId, mode: false });
      
      // Get the updated task data to save to database
      const updatedTask = apiRef.current.getTask(selectedItemId);
      if (updatedTask) {
        const success = await updateTaskHierarchy(selectedItemId, updatedTask.parent || null, 'task');
        
        if (success) {
          // Check if the old parent still has children
          if (oldParentId) {
            const remainingChildren = loadedTasks.filter(task => 
              task.parent === oldParentId && task.id !== selectedItemId
            );

            // If no children remain, convert parent back to task type
            if (remainingChildren.length === 0) {
              await updateTaskHierarchy(oldParentId, null, 'task');
            }
          }
          
          // Update local state
          setLoadedTasks((prev: GanttTask[]) => {
            const newTasks = prev.map((task: GanttTask) => {
              if (task.id === selectedItemId) {
                return { ...task, parent: updatedTask.parent };
              } else if (task.id === oldParentId) {
                // Check if this parent still has children
                const stillHasChildren = prev.some((t: GanttTask) => 
                  t.parent === oldParentId && t.id !== selectedItemId
                );
                return stillHasChildren ? task : { ...task, type: 'task' as const };
              }
              return task;
            });

            // Refresh the Gantt chart with updated data
            if (apiRef.current) {
              apiRef.current.exec('tasks', newTasks);
            }
            return newTasks;
          });
        }
      }
    }
  };

  return {
    handleInit,
    handleIndentRight,
    handleIndentLeft,
  };
};
