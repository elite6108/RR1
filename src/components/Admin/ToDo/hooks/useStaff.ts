import { useState, useEffect } from 'react';
import { supabase } from '../../../../lib/supabase';
import type { StaffMember } from '../types';

export const useStaff = () => {
  const [staff, setStaff] = useState<StaffMember[]>([]);

  const fetchStaff = async () => {
    try {
      const { data, error } = await supabase
        .from('staff')
        .select('id, name, position')
        .order('name', { ascending: true });

      if (error) throw error;
      setStaff(data || []);
    } catch (error) {
      console.error('Error fetching staff:', error);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  return {
    staff,
    fetchStaff
  };
};
