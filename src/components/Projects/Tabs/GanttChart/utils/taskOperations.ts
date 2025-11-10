import { supabase } from '../../../../../lib/supabase';
import type { GanttTask, GanttLink, FormData } from '../types';

export const loadTasksAndLinks = async (projectId: string) => {
  try {
    // Load tasks
    const { data: tasksData, error: tasksError } = await supabase
      .from('gantt_tasks')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: true });

    if (tasksError) throw tasksError;

    // Load links
    const { data: linksData, error: linksError } = await supabase
      .from('gantt_links')
      .select('*')
      .eq('project_id', projectId);

    if (linksError) throw linksError;

    let formattedTasks: GanttTask[] = [];
    let formattedLinks: GanttLink[] = [];

    if (tasksData && tasksData.length > 0) {
      formattedTasks = tasksData.map((task: any) => {
        // Ensure proper date formatting
        const startDate = new Date(task.start_date);
        const endDate = new Date(task.end_date);
        
        // Set time to midnight to avoid timezone issues
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(0, 0, 0, 0);
        
        return {
          id: task.id,
          text: task.text,
          description: task.description,
          start: startDate,
          end: endDate,
          duration: task.duration,
          progress: task.progress,
          type: task.type,
          parent: task.parent_id
        };
      });
    }

    if (linksData) {
      formattedLinks = linksData.map((link: any) => ({
        id: link.id,
        source: link.source_task_id,
        target: link.target_task_id,
        type: link.type
      }));
    }

    return { tasks: formattedTasks, links: formattedLinks };
  } catch (err) {
    console.error('Error loading tasks and links:', err);
    return { tasks: [], links: [] };
  }
};

export const createTask = async (projectId: string, taskData: FormData): Promise<GanttTask | null> => {
  try {
    const newTask = {
      project_id: projectId,
      text: taskData.text,
      description: taskData.description,
      start_date: taskData.start.toISOString(),
      end_date: taskData.end.toISOString(),
      duration: taskData.duration,
      progress: taskData.progress,
      type: taskData.type,
      parent_id: null,
    };

    const { data, error } = await supabase
      .from('gantt_tasks')
      .insert([newTask])
      .select()
      .single();

    if (error) throw error;

    const formattedTask: GanttTask = {
      id: data.id,
      text: data.text,
      description: data.description,
      start: new Date(data.start_date),
      end: new Date(data.end_date),
      duration: data.duration,
      progress: data.progress,
      type: data.type as 'task' | 'milestone' | 'summary',
      parent: data.parent_id,
    };

    return formattedTask;
  } catch (err) {
    console.error('Error creating task:', err);
    return null;
  }
};

export const updateTask = async (task: GanttTask): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('gantt_tasks')
      .update({
        text: task.text,
        description: task.description,
        start_date: task.start.toISOString(),
        end_date: task.end.toISOString(),
        duration: task.duration,
        progress: task.progress,
        type: task.type,
        parent_id: task.parent || null
      })
      .eq('id', task.id);

    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Error updating task:', err);
    return false;
  }
};

export const deleteTask = async (taskId: number): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('gantt_tasks')
      .delete()
      .eq('id', taskId);

    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Error deleting task:', err);
    return false;
  }
};

export const saveUnsavedChanges = async (projectId: string, unsavedChanges: { [key: number]: GanttTask }) => {
  try {
    for (const taskId in unsavedChanges) {
      const task = unsavedChanges[taskId];
      const updateData: any = {
        text: task.text,
        description: task.description,
        progress: task.progress,
        type: task.type
      };

      // Add date-related fields based on task type
      if (task.type === 'milestone') {
        updateData.start_date = task.start.toISOString();
      } else if (task.type === 'summary') {
        updateData.start_date = task.start.toISOString();
      } else {
        updateData.start_date = task.start.toISOString();
        updateData.end_date = task.end.toISOString();
        updateData.duration = task.duration;
      }

      const { error } = await supabase
        .from('gantt_tasks')
        .update(updateData)
        .eq('id', taskId);

      if (error) throw error;
    }

    // Refresh all tasks to ensure everything is in sync
    const { data: refreshedData, error: refreshError } = await supabase
      .from('gantt_tasks')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: true });

    if (!refreshError && refreshedData) {
      const formattedTasks = refreshedData.map((t: any) => ({
        id: t.id,
        text: t.text,
        description: t.description,
        start: new Date(t.start_date),
        end: new Date(t.end_date),
        duration: t.duration,
        progress: t.progress,
        type: t.type as 'task' | 'milestone' | 'summary',
        parent: t.parent_id
      }));

      return formattedTasks;
    }
    return null;
  } catch (err) {
    console.error('Error saving changes:', err);
    return null;
  }
};

export const updateTaskFormData = async (taskId: number, formData: FormData): Promise<boolean> => {
  try {
    // Calculate duration in days
    const durationInDays = Math.ceil(
      (formData.end.getTime() - formData.start.getTime()) / (1000 * 60 * 60 * 24)
    );

    const { error } = await supabase
      .from('gantt_tasks')
      .update({
        text: formData.text,
        description: formData.description,
        start_date: formData.start.toISOString(),
        end_date: formData.end.toISOString(),
        duration: durationInDays,
        progress: formData.progress,
        type: formData.type,
      })
      .eq('id', taskId);

    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Error updating task:', err);
    return false;
  }
};

export const updateTaskHierarchy = async (taskId: number, parentId: number | null, newType: 'task' | 'summary'): Promise<boolean> => {
  try {
    // Update the child task's parent_id
    const { error: childError } = await supabase
      .from('gantt_tasks')
      .update({
        parent_id: parentId
      })
      .eq('id', taskId);

    if (childError) throw childError;

    // Update the parent task to be a summary type
    if (parentId) {
      const { error: parentError } = await supabase
        .from('gantt_tasks')
        .update({
          type: newType
        })
        .eq('id', parentId);

      if (parentError) throw parentError;
    }

    return true;
  } catch (err) {
    console.error('Error updating task hierarchy:', err);
    return false;
  }
};
