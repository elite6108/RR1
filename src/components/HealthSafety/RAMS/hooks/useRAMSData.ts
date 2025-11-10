import { useState, useEffect } from 'react';
import { supabase } from '../../../../lib/supabase';
import type { RAMS } from '../../../../types/database';

export function useRAMSData() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ramsEntries, setRamsEntries] = useState<RAMS[]>([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('rams')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRamsEntries(data || []);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while fetching data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const deleteRAMS = async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('rams')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      await fetchData();
    } catch (err) {
      console.error('Error deleting RAMS:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while deleting the RAMS entry');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    ramsEntries,
    fetchData,
    deleteRAMS,
    setError
  };
}
