import { useState, useEffect } from 'react';
import { supabase } from '../../../../../lib/supabase';
import type { Equipment, EquipmentChecklist } from '../types';

export function useChecklists() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [checklists, setChecklists] = useState<EquipmentChecklist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [equipmentResponse, checklistsResponse] = await Promise.all([
        supabase
          .from('equipment')
          .select('*')
          .order('name', { ascending: true }),
        supabase
          .from('equipment_checklists')
          .select('*')
          .order('check_date', { ascending: false })
      ]);

      if (equipmentResponse.error) throw equipmentResponse.error;
      if (checklistsResponse.error) throw checklistsResponse.error;

      setEquipment(equipmentResponse.data || []);
      setChecklists(checklistsResponse.data || []);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while fetching data');
    } finally {
      setLoading(false);
    }
  };

  const deleteChecklist = async (checklistId: string) => {
    try {
      setError(null);
      
      const { error } = await supabase
        .from('equipment_checklists')
        .delete()
        .eq('id', checklistId);

      if (error) throw error;
      
      await fetchData();
      return true;
    } catch (err) {
      console.error('Error deleting checklist:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while deleting the checklist');
      return false;
    }
  };

  const getLastCheckInfo = (equipmentId: string) => {
    const equipmentChecklists = checklists.filter(c => c.equipment_id === equipmentId);
    if (equipmentChecklists.length === 0) return { date: null, frequency: null };
    
    const lastChecklist = equipmentChecklists[0];
    const lastCheckDate = new Date(lastChecklist.check_date);
    const today = new Date();
    let isOverdue = false;

    switch (lastChecklist.frequency) {
      case 'daily':
        isOverdue = (today.getTime() - lastCheckDate.getTime()) > 24 * 60 * 60 * 1000;
        break;
      case 'weekly':
        isOverdue = (today.getTime() - lastCheckDate.getTime()) > 7 * 24 * 60 * 60 * 1000;
        break;
      case 'monthly':
        isOverdue = (today.getTime() - lastCheckDate.getTime()) > 30 * 24 * 60 * 60 * 1000;
        break;
    }

    return {
      date: lastCheckDate.toLocaleDateString(),
      frequency: lastChecklist.frequency,
      isOverdue
    };
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    equipment,
    checklists,
    loading,
    error,
    fetchData,
    deleteChecklist,
    getLastCheckInfo,
    setError
  };
}
