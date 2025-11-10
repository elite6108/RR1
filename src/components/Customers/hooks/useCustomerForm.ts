import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import type { Customer } from '../../../types/database';
import type { CustomerFormData } from '../types';

export function useCustomerForm(customerToEdit?: Customer | null) {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CustomerFormData>({
    company_name: customerToEdit?.company_name || '',
    customer_name: customerToEdit?.customer_name || '',
    address_line1: customerToEdit?.address_line1 || '',
    address_line2: customerToEdit?.address_line2 || '',
    town: customerToEdit?.town || '',
    county: customerToEdit?.county || '',
    post_code: customerToEdit?.post_code || '',
    phone: customerToEdit?.phone || '',
    email: customerToEdit?.email || '',
  });

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';

    // Cleanup function to restore scroll when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    setFormData(prev => ({ ...prev, phone: value }));
  };

  const handleCountyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, county: e.target.value }));
  };

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const submitForm = async (onSuccess: () => void, onClose: () => void) => {
    setLoading(true);
    setError(null);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      let error;
      if (customerToEdit) {
        ({ error } = await supabase
          .from('customers')
          .update({
            ...formData,
            company_name: formData.company_name || null,
            address_line2: formData.address_line2 || null,
          })
          .eq('id', customerToEdit.id));
      } else {
        ({ error } = await supabase.from('customers').insert([
          {
            ...formData,
            user_id: user.id,
            company_name: formData.company_name || null,
            address_line2: formData.address_line2 || null,
          },
        ]));
      }

      if (error) throw error;

      onSuccess();
      onClose();
    } catch (err) {
      console.error('Error saving customer:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return {
    currentStep,
    loading,
    error,
    formData,
    handleChange,
    handlePhoneChange,
    handleCountyChange,
    nextStep,
    prevStep,
    submitForm
  };
}