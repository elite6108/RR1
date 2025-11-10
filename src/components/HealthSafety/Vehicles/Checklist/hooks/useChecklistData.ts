import { useState, useEffect } from 'react';
import { supabase } from '../../../../../lib/supabase';
import { fetchVehicles, fetchVehicleChecklists } from '../../shared/utils/dataFetching';
import type { VehicleChecklist } from '../../shared/types';

export const useChecklistData = () => {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [checklists, setChecklists] = useState<VehicleChecklist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [vehiclesResponse, checklistsResponse] = await Promise.all([
        supabase
          .from('vehicles')
          .select('*')
          .order('registration', { ascending: true }),
        supabase
          .from('vehicle_checklists')
          .select('*')
          .order('check_date', { ascending: false }),
      ]);

      if (vehiclesResponse.error) throw vehiclesResponse.error;
      if (checklistsResponse.error) throw checklistsResponse.error;

      setVehicles(vehiclesResponse.data || []);
      setChecklists(checklistsResponse.data || []);
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

  const deleteChecklist = async (checklistId: string) => {
    try {
      const { error } = await supabase
        .from('vehicle_checklists')
        .delete()
        .eq('id', checklistId);

      if (error) throw error;
      
      fetchData(); // Refresh the data
    } catch (err) {
      console.error('Error deleting checklist:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while deleting the checklist');
      throw err;
    }
  };

  return {
    vehicles,
    checklists,
    loading,
    error,
    fetchData,
    deleteChecklist,
    setError
  };
};
