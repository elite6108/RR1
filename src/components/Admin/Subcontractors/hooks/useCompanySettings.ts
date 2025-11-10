import { useState, useEffect } from 'react';
import { supabase } from '../../../../lib/supabase';

export const useCompanySettings = () => {
  const [companySettings, setCompanySettings] = useState<any>(null);

  const fetchCompanySettings = async () => {
    try {
      const { data, error } = await supabase
        .from('company_settings')
        .select('*')
        .single();

      if (error) throw error;
      setCompanySettings(data);
    } catch (error) {
      console.error('Error fetching company settings:', error);
    }
  };

  useEffect(() => {
    fetchCompanySettings();
  }, []);

  return {
    companySettings,
    refetch: fetchCompanySettings,
  };
};
