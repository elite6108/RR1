import { useState, useEffect } from 'react';
import { supabase } from '../../../../../lib/supabase';
import { AdditionalWork } from '../types';

/**
 * Hook for managing additional works data and operations
 */
export const useAdditionalWorks = (projectId: string) => {
  const [additionalWorks, setAdditionalWorks] = useState<AdditionalWork[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch additional works from database
  const fetchAdditionalWorks = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('additional_work')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setAdditionalWorks(data || []);
    } catch (err) {
      console.error('Error fetching additional works:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Create new additional work
  const createAdditionalWork = async (workData: {
    title: string;
    description: string;
    agreed_amount: number;
    agreed_with: string;
    vat_type: string;
  }) => {
    try {
      setError(null);
      
      const { error: insertError } = await supabase
        .from('additional_work')
        .insert({
          project_id: projectId,
          ...workData
        });

      if (insertError) throw insertError;
      
      await fetchAdditionalWorks(); // Refresh the list
      return { success: true };
    } catch (err) {
      console.error('Error creating additional work:', err);
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Update existing additional work
  const updateAdditionalWork = async (
    workId: string,
    workData: {
      title: string;
      description: string;
      agreed_amount: number;
      agreed_with: string;
      vat_type: string;
    }
  ) => {
    try {
      setError(null);
      
      const { error: updateError } = await supabase
        .from('additional_work')
        .update(workData)
        .eq('id', workId);

      if (updateError) throw updateError;
      
      await fetchAdditionalWorks(); // Refresh the list
      return { success: true };
    } catch (err) {
      console.error('Error updating additional work:', err);
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Delete additional work
  const deleteAdditionalWork = async (workId: string) => {
    try {
      setError(null);
      
      const { error: deleteError } = await supabase
        .from('additional_work')
        .delete()
        .eq('id', workId);

      if (deleteError) throw deleteError;
      
      await fetchAdditionalWorks(); // Refresh the list
      return { success: true };
    } catch (err) {
      console.error('Error deleting additional work:', err);
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Initial fetch on mount and when projectId changes
  useEffect(() => {
    if (projectId) {
      fetchAdditionalWorks();
    }
  }, [projectId]);

  return {
    additionalWorks,
    loading,
    error,
    setError,
    fetchAdditionalWorks,
    createAdditionalWork,
    updateAdditionalWork,
    deleteAdditionalWork,
  };
};
