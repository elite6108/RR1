import { useState, useEffect } from 'react';
import { supabase } from '../../../../../lib/supabase';
import type { Equipment } from '../types';

export function useEquipment() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEquipment = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('equipment')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      setEquipment(data || []);
    } catch (err) {
      console.error('Error fetching equipment:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'An error occurred while fetching equipment'
      );
    } finally {
      setLoading(false);
    }
  };

  const deleteEquipment = async (equipmentId: string) => {
    try {
      setError(null);
      
      const { error } = await supabase
        .from('equipment')
        .delete()
        .eq('id', equipmentId);

      if (error) throw error;
      
      await fetchEquipment();
      return true;
    } catch (err) {
      console.error('Error deleting equipment:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'An error occurred while deleting the equipment'
      );
      return false;
    }
  };

  useEffect(() => {
    fetchEquipment();
  }, []);

  return {
    equipment,
    loading,
    error,
    fetchEquipment,
    deleteEquipment,
    setError
  };
}
