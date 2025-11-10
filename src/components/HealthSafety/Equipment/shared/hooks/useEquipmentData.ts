import { useState, useEffect } from 'react';
import { supabase } from '../../../../../lib/supabase';
import { generateReminders, countOverdueChecklists } from '../utils';
import type { Equipment, EquipmentChecklist, Reminder } from '../types';

export function useEquipmentData(onOverdueChecklistsChange?: (count: number) => void) {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [checklists, setChecklists] = useState<EquipmentChecklist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reminders, setReminders] = useState<Reminder[]>([]);

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
          .order('check_date', { ascending: false }),
      ]);

      if (equipmentResponse.error) throw equipmentResponse.error;
      if (checklistsResponse.error) throw checklistsResponse.error;

      setEquipment(equipmentResponse.data || []);
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

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // Update reminders whenever equipment or checklists change
    const newReminders = generateReminders(equipment, checklists);
    setReminders(newReminders);
    
    // Count overdue checklist reminders and notify parent component
    if (onOverdueChecklistsChange) {
      const overdueCount = countOverdueChecklists(newReminders);
      onOverdueChecklistsChange(overdueCount);
    }
  }, [equipment, checklists, onOverdueChecklistsChange]);

  return {
    equipment,
    checklists,
    loading,
    error,
    reminders,
    fetchData
  };
}
