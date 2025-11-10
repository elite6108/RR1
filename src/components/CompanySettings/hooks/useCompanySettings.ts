import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import type { CompanySettings } from '../../../types/database';

export function useCompanySettings() {
  const [formData, setFormData] = useState<Partial<CompanySettings>>({
    name: '',
    address_line1: '',
    address_line2: '',
    town: '',
    county: '',
    post_code: '',
    email: '',
    phone: '',
    logo_url: '',
    vat_number: '',
    company_number: '',
    prefix: '',
    public_liability: '',
    employers_liability: '',
    products_liability: '',
    professional_indemnity: '',
    other_insurances: '',
    contractors_risk: '',
    plant_machinery: '',
    owned_plant: '',
    hired_plant: '',
    environmental_liability: '',
    latent_defects: ''
  });

  const fetchCompanySettings = async () => {
    try {
      const { data, error } = await supabase
        .from('company_settings')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      if (data) {
        setFormData(data);
      }
    } catch (err) {
      console.error('Error fetching company settings:', err);
      throw new Error('Failed to load company settings. Please try refreshing the page.');
    }
  };

  useEffect(() => {
    fetchCompanySettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const updateFormData = (updates: Partial<CompanySettings>) => {
    setFormData(prev => ({
      ...prev,
      ...updates
    }));
  };

  return {
    formData,
    handleChange,
    updateFormData,
    refetch: fetchCompanySettings
  };
}