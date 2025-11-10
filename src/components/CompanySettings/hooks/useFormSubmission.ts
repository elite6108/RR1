import { useState } from 'react';
import { supabase } from '../../../lib/supabase';
import type { CompanySettings } from '../../../types/database';

export function useFormSubmission(
  formData: Partial<CompanySettings>,
  onClose: () => void
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('You must be logged in to save company settings.');
      }

      // Check if company settings already exist
      const { data: existingSettings, error: queryError } = await supabase
        .from('company_settings')
        .select('id')
        .limit(1)
        .maybeSingle();

      if (queryError) throw queryError;

      let error;
      if (existingSettings?.id) {
        // Update existing settings
        ({ error } = await supabase
          .from('company_settings')
          .update({
            ...formData,
            user_id: user.id
          })
          .eq('id', existingSettings.id));
      } else {
        // Create new settings
        ({ error } = await supabase
          .from('company_settings')
          .insert([{
            ...formData,
            user_id: user.id
          }]));
      }

      if (error) throw error;
      
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      console.error('Save settings error:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred while saving settings.');
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return {
    loading,
    error,
    success,
    handleSubmit,
    clearError
  };
}