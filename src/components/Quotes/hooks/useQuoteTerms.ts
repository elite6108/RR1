import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';

export const useQuoteTerms = () => {
  const [terms, setTerms] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const fetchTerms = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('quote_terms')
        .select('terms')
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      if (data) {
        setTerms(data.terms);
      }
    } catch (err) {
      console.error('Error fetching quote terms:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'An error occurred while fetching quote terms'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Check if terms already exist
      const { data: existingTerms, error: queryError } = await supabase
        .from('quote_terms')
        .select('id')
        .limit(1)
        .maybeSingle();

      if (queryError) throw queryError;

      let error;
      if (existingTerms?.id) {
        // Update existing terms
        ({ error } = await supabase
          .from('quote_terms')
          .update({ terms, user_id: user.id })
          .eq('id', existingTerms.id));
      } else {
        // Create new terms
        ({ error } = await supabase
          .from('quote_terms')
          .insert([{ terms, user_id: user.id }]));
      }

      if (error) throw error;

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      console.error('Error saving quote terms:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'An error occurred while saving quote terms'
      );
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchTerms();
  }, []);

  return {
    terms,
    setTerms,
    loading,
    saving,
    error,
    success,
    handleSubmit,
  };
};
