import { useState, useEffect } from 'react';
import { Lead, LeadStatus } from '../components/shared/types';
import { supabase } from '../../../lib/supabase';

interface UseLeadFormProps {
  leadToEdit?: Lead | null;
  initialStep?: number;
  onSuccess: () => void;
  onClose: () => void;
}

export const useLeadForm = ({ leadToEdit, initialStep = 1, onSuccess, onClose }: UseLeadFormProps) => {
  const [formData, setFormData] = useState<Partial<Lead>>({
    name: leadToEdit?.name || '',
    email: leadToEdit?.email || '',
    phone: leadToEdit?.phone || '',
    company: leadToEdit?.company || '',
    source: leadToEdit?.source || '',
    message: leadToEdit?.message || '',
    budget: leadToEdit?.budget || '',
    status: leadToEdit?.status || 'new' as LeadStatus,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const displayName = user.user_metadata?.full_name || 
                           user.user_metadata?.name || 
                           user.email?.split('@')[0] || 
                           'Unknown User';
        
        setCurrentUser({
          name: displayName,
          email: user.email || ''
        });
      }
    } catch (err) {
      console.error('Error fetching current user:', err);
      setCurrentUser({ name: 'Unknown User', email: '' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep !== 3) {
      nextStep();
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (leadToEdit) {
        const { error } = await supabase
          .from('leads')
          .update(formData)
          .eq('id', leadToEdit.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('leads').insert([formData]);
        if (error) throw error;
      }

      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  return {
    formData,
    setFormData,
    loading,
    error,
    setError,
    currentStep,
    setCurrentStep,
    currentUser,
    handleSubmit,
    handleChange,
    nextStep,
    prevStep,
  };
};
