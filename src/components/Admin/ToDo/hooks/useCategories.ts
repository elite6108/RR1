import { useState, useEffect } from 'react';
import { supabase } from '../../../../lib/supabase';
import type { Category } from '../types';

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('todo_categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const addCategory = async (categoryData: { name: string; icon: string }) => {
    try {
      const { error } = await supabase
        .from('todo_categories')
        .insert([{
          name: categoryData.name,
          icon: categoryData.icon
        }]);

      if (error) throw error;
      await fetchCategories();
    } catch (error) {
      console.error('Error adding category:', error);
      throw error;
    }
  };

  const updateCategory = async (categoryId: string, categoryData: { name: string; icon: string }) => {
    try {
      const { error } = await supabase
        .from('todo_categories')
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
        .from('todo')
        .update({ category: null })
        .eq('category', categoryId);

      // Then delete the category
      const { error } = await supabase
        .from('todo_categories')
        .delete()
        .eq('id', categoryId);

      if (error) throw error;
      await fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    fetchCategories,
    addCategory,
    updateCategory,
    deleteCategory
  };
};
