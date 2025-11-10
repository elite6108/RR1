import { useState } from 'react';
import { supabase } from '../../../../lib/supabase';
import type { Supplier } from '../types';

interface UseSupplierFormProps {
  onClose: () => void;
  onSuccess: () => void;
  supplierToEdit?: Supplier | null;
}

export function useSupplierForm({ onClose, onSuccess, supplierToEdit }: UseSupplierFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: supplierToEdit?.name || '',
    address_line1: supplierToEdit?.address_line1 || '',
    address_line2: supplierToEdit?.address_line2 || '',
    town: supplierToEdit?.town || '',
    county: supplierToEdit?.county || '',
    post_code: supplierToEdit?.post_code || '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentStep !== 2) {
      nextStep();
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      let error;
      if (supplierToEdit) {
        // Update existing supplier
        ({ error } = await supabase
          .from('suppliers')
          .update({
            ...formData,
            address_line2: formData.address_line2 || null,
          })
          .eq('id', supplierToEdit.id));
      } else {
        // Create new supplier
        ({ error } = await supabase.from('suppliers').insert([
          {
            ...formData,
            user_id: user.id,
            address_line2: formData.address_line2 || null,
          },
        ]));
      }

      if (error) throw error;

      onSuccess();
      onClose();
    } catch (err) {
      console.error('Error saving supplier:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 2));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  return {
    // State
    loading,
    error,
    currentStep,
    formData,

    // Actions
    handleChange,
    handleSubmit,
    nextStep,
    prevStep,
  };
}