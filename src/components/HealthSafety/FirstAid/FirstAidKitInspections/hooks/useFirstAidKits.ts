import { useState, useEffect } from 'react';
import { supabase } from '../../../../../lib/supabase';
import type { FirstAidKit } from '../../../../../types/database';

export function useFirstAidKits() {
  const [firstAidKits, setFirstAidKits] = useState<FirstAidKit[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFirstAidKits = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('first_aid_kits')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFirstAidKits(data || []);
    } catch (error) {
      console.error('Error fetching first aid kits:', error);
      setFirstAidKits([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFirstAidKits();
  }, []);

  const addFirstAidKit = async (kit: Omit<FirstAidKit, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('first_aid_kits')
        .insert([{
          ...kit,
          user_id: user.id,
        }])
        .select()
        .single();

      if (error) throw error;
      
      setFirstAidKits(prev => [data, ...prev]);
      return data;
    } catch (error) {
      console.error('Error adding first aid kit:', error);
      throw error;
    }
  };

  const updateFirstAidKit = async (id: string, updates: Omit<Partial<FirstAidKit>, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('first_aid_kits')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setFirstAidKits(prev => 
        prev.map(kit => 
          kit.id === id ? data : kit
        )
      );
      return data;
    } catch (error) {
      console.error('Error updating first aid kit:', error);
      throw error;
    }
  };

  const deleteFirstAidKit = async (id: string) => {
    try {
      const { error } = await supabase
        .from('first_aid_kits')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setFirstAidKits(prev => prev.filter(kit => kit.id !== id));
    } catch (error) {
      console.error('Error deleting first aid kit:', error);
      throw error;
    }
  };

  return {
    firstAidKits,
    loading,
    addFirstAidKit,
    updateFirstAidKit,
    deleteFirstAidKit,
    refetch: fetchFirstAidKits
  };
}
