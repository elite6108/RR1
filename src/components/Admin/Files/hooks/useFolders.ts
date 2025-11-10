import { useState, useEffect } from 'react';
import { supabase } from '../../../../lib/supabase';
import type { CompanyFile } from '../types';

export const useFolders = () => {
  const [allFolders, setAllFolders] = useState<CompanyFile[]>([]);

  const fetchAllFolders = async () => {
    try {
      const { data, error } = await supabase
        .from('company_files')
        .select('*')
        .eq('is_folder', true)
        .order('name', { ascending: true });

      if (error) throw error;
      setAllFolders(data || []);
    } catch (error) {
      console.error('Error fetching folders:', error);
    }
  };

  useEffect(() => {
    fetchAllFolders();
  }, []);

  return {
    allFolders,
    fetchAllFolders
  };
};
