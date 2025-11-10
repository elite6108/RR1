import { useState, useEffect } from 'react';
import { supabase } from '../../../../../lib/supabase';
import type { FirstAidKitInspection } from '../../../../../types/database';

export function useInspections() {
  const [inspections, setInspections] = useState<FirstAidKitInspection[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInspections = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('first_aid_kit_inspections')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInspections(data || []);
    } catch (error) {
      console.error('Error fetching inspections:', error);
      setInspections([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInspections();
  }, []);

  const addInspection = async (inspection: Omit<FirstAidKitInspection, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('first_aid_kit_inspections')
        .insert([{
          ...inspection,
          user_id: user.id,
        }])
        .select()
        .single();

      if (error) throw error;
      
      setInspections(prev => [data, ...prev]);
      return data;
    } catch (error) {
      console.error('Error adding inspection:', error);
      throw error;
    }
  };

  const updateInspection = async (id: string, updates: Omit<Partial<FirstAidKitInspection>, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('first_aid_kit_inspections')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setInspections(prev => 
        prev.map(inspection => 
          inspection.id === id ? data : inspection
        )
      );
      return data;
    } catch (error) {
      console.error('Error updating inspection:', error);
      throw error;
    }
  };

  const deleteInspection = async (id: string) => {
    try {
      const { error } = await supabase
        .from('first_aid_kit_inspections')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setInspections(prev => prev.filter(inspection => inspection.id !== id));
    } catch (error) {
      console.error('Error deleting inspection:', error);
      throw error;
    }
  };

  return {
    inspections,
    loading,
    addInspection,
    updateInspection,
    deleteInspection,
    refetch: fetchInspections
  };
}
