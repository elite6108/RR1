import { useState, useEffect } from 'react';
import { supabase } from '../../../../../lib/supabase';
import { SignOff } from '../types';

export function useSignOffs(projectId: string) {
  const [signoffs, setSignoffs] = useState<SignOff[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSignoffs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('project_signoff')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSignoffs(data || []);
    } catch (err) {
      console.error('Error fetching signoffs:', err);
      setError('Failed to fetch signoffs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSignoffs();
  }, [projectId]);

  const createSignOff = async () => {
    try {
      const { error } = await supabase
        .from('project_signoff')
        .insert([{ project_id: projectId }]);

      if (error) throw error;
      fetchSignoffs();
    } catch (err) {
      console.error('Error creating signoff:', err);
      setError('Failed to create signoff');
    }
  };

  const deleteSignOff = async (signoffId: string) => {
    try {
      const { error } = await supabase
        .from('project_signoff')
        .delete()
        .eq('id', signoffId);

      if (error) throw error;
      fetchSignoffs();
    } catch (err) {
      console.error('Error deleting signoff:', err);
      setError('Failed to delete signoff');
    }
  };

  return {
    signoffs,
    loading,
    error,
    createSignOff,
    deleteSignOff,
    refetch: fetchSignoffs
  };
}
