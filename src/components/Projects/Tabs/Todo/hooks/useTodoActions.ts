import { supabase } from '../../../../../lib/supabase';
import { Task, TaskFormData, CategoryFormData } from '../types';

export const useTodoActions = (projectId: string, fetchTasks: () => Promise<void>, fetchCategories: () => Promise<void>) => {
  
  const addTask = async (taskData: TaskFormData) => {
    try {
      const { error } = await supabase
        .from('project_todo')
        .insert([
          {
            name: taskData.name,
            description: taskData.description || null,
            priority: taskData.priority,
            due_date: taskData.due_date || null,
            project_id: projectId,
            completed: false,
            notes: taskData.notes || null,
            // Set default values for fields not in the form
            category: null,
            cost: null,
            staff_ids: [],
            tags: []
          }
        ]);

      if (error) throw error;
      await fetchTasks();
    } catch (error) {
      console.error('Error adding task:', error);
      throw error;
    }
  };

  const updateTask = async (taskId: string, taskData: TaskFormData) => {
    try {
      const { error } = await supabase
        .from('project_todo')
        .update({
          name: taskData.name,
          description: taskData.description || null,
          priority: taskData.priority,
          due_date: taskData.due_date || null,
          notes: taskData.notes || null,
          updated_at: new Date().toISOString()
          // Note: We don't update category, cost, staff_ids, tags since they're not in the simplified form
        })
        .eq('id', taskId);

      if (error) throw error;
      await fetchTasks();
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('project_todo')
        .delete()
        .eq('id', taskId);

      if (error) throw error;
      await fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
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
        .from('project_todo')
        .update(updateData)
        .eq('id', taskId);

      if (error) throw error;
      await fetchTasks();
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  };

  const addCategory = async (categoryData: CategoryFormData) => {
    try {
      const { error } = await supabase
        .from('project_todo_categories')
        .insert([{
          name: categoryData.name,
          icon: categoryData.icon,
          project_id: projectId
        }]);

      if (error) throw error;
      await fetchCategories();
    } catch (error) {
      console.error('Error adding category:', error);
      throw error;
    }
  };

  const updateCategory = async (categoryId: string, categoryData: CategoryFormData) => {
    try {
      const { error } = await supabase
        .from('project_todo_categories')
        .update({
          name: categoryData.name,
          icon: categoryData.icon
        })
        .eq('id', categoryId);

      if (error) throw error;
      await fetchCategories();
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  };

  const deleteCategory = async (categoryId: string) => {
    try {
      // First update all tasks with this category to have no category
      await supabase
        .from('project_todo')
        .update({ category: null })
        .eq('category', categoryId);

      // Then delete the category
      const { error } = await supabase
        .from('project_todo_categories')
        .delete()
        .eq('id', categoryId);

      if (error) throw error;
      
      await fetchTasks();
      await fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  };

  return {
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    addCategory,
    updateCategory,
    deleteCategory
  };
};
