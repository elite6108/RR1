import { useState, useEffect } from 'react';
import { supabase } from '../../../../lib/supabase';
import type { CPP } from '../../../../types/database';

export function useCPPData() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cpps, setCPPs] = useState<CPP[]>([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('cpps')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCPPs(data || []);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'An error occurred while fetching data'
      );
    } finally {
      setLoading(false);
    }
  };

  const deleteCPP = async (cppId: string) => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('cpps')
        .delete()
        .eq('id', cppId);

      if (error) throw error;

      await fetchData();
    } catch (err) {
      console.error('Error deleting CPP:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'An error occurred while deleting the CPP'
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    loading,
    error,
    cpps,
    fetchData,
    deleteCPP,
  };
}
