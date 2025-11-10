import { useState, useEffect } from 'react';
import { supabase } from '../../../../../lib/supabase';
import { Task, Category, StaffMember } from '../types';

export const useTodoData = (projectId: string) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('project_todo')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTasks(data || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('project_todo_categories')
        .select('*')
        .eq('project_id', projectId)
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchStaff = async () => {
    try {
      const { data, error } = await supabase
        .from('staff')
        .select('id, name, position')
        .order('name', { ascending: true });

      if (error) throw error;

      setStaff(data || []);
    } catch (error) {
      console.error('Error fetching staff:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchCategories();
    fetchStaff();
  }, [projectId]);

  return {
    tasks,
    categories,
    staff,
    loading,
    fetchTasks,
    fetchCategories,
    fetchStaff,
    setTasks,
    setCategories,
    setStaff
  };
};
