import { useState, useEffect } from 'react';
import { supabase } from '../../../../lib/supabase';
import type { Task } from '../types';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('todo')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTasks(data || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (taskData: {
    name: string;
    description?: string;
    priority: Task['priority'];
    due_date?: string;
    tags: string[];
    notes?: string;
  }) => {
    try {
      const { error } = await supabase
        .from('todo')
        .insert([
          {
            name: taskData.name,
            description: taskData.description || null,
            priority: taskData.priority,
            due_date: taskData.due_date || null,
            completed: false,
            tags: taskData.tags.length > 0 ? taskData.tags : [],
            notes: taskData.notes || null
          }
        ]);

      if (error) throw error;
      await fetchTasks();
    } catch (error) {
      console.error('Error adding task:', error);
      throw error;
    }
  };

  const updateTask = async (taskId: string, taskData: {
    name: string;
    description?: string;
    priority: Task['priority'];
    due_date?: string;
    tags: string[];
    notes?: string;
  }) => {
    try {
      const { error } = await supabase
        .from('todo')
        .update({
          name: taskData.name,
          description: taskData.description || null,
          priority: taskData.priority,
          due_date: taskData.due_date || null,
          tags: taskData.tags.length > 0 ? taskData.tags : [],
          notes: taskData.notes || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', taskId);

      if (error) throw error;
      await fetchTasks();
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  };

  const toggleTask = async (taskId: string, completed: boolean) => {
    try {
      const updateData: any = { 
        completed: !completed,
        updated_at: new Date().toISOString()
      };
      
      if (!completed) {
        updateData.completed_at = new Date().toISOString();
      } else {
        updateData.completed_at = null;
      }

      const { error } = await supabase
        .from('todo')
        .update(updateData)
        .eq('id', taskId);

      if (error) throw error;
      await fetchTasks();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('todo')
        .delete()
        .eq('id', taskId);

      if (error) throw error;
      await fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return {
    tasks,
    loading,
    fetchTasks,
    addTask,
    updateTask,
    toggleTask,
    deleteTask
  };
};
