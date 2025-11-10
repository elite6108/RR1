import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import type { PaymentInfoData } from '../types';

export const usePaymentInfo = () => {
  const [formData, setFormData] = useState<PaymentInfoData>({
    bank_name: '',
    account_number: '',
    sort_code: '',
    terms: '',
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isEditingAccountNumber, setIsEditingAccountNumber] = useState(false);
  const [isEditingSortCode, setIsEditingSortCode] = useState(false);
  const [hasExistingAccountNumber, setHasExistingAccountNumber] = useState(false);
  const [hasExistingSortCode, setHasExistingSortCode] = useState(false);

  const fetchPaymentTerms = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('payment_terms')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      if (data) {
        setFormData({
          bank_name: data.bank_name,
          account_number: data.account_number,
          sort_code: data.sort_code,
          terms: data.terms,
        });
        setHasExistingAccountNumber(!!data.account_number);
        setHasExistingSortCode(!!data.sort_code);
      }
    } catch (err) {
      console.error('Error fetching payment terms:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'An error occurred while fetching payment terms'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditAccountNumber = () => {
    setIsEditingAccountNumber(true);
    setFormData(prev => ({ ...prev, account_number: '' }));
  };

  const handleEditSortCode = () => {
    setIsEditingSortCode(true);
    setFormData(prev => ({ ...prev, sort_code: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      // Validate required fields
      if (!formData.bank_name.trim()) throw new Error('Bank name is required');
      if (!formData.account_number.trim())
        throw new Error('Account number is required');
      if (!formData.sort_code.trim()) throw new Error('Sort code is required');
      if (!formData.terms.trim()) throw new Error('Payment terms are required');

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Check if terms already exist
      const { data: existingTerms, error: queryError } = await supabase
        .from('payment_terms')
        .select('id')
        .limit(1)
        .maybeSingle();

      if (queryError) throw queryError;

      let error;
      if (existingTerms?.id) {
        // Update existing terms
        ({ error } = await supabase
          .from('payment_terms')
          .update({ ...formData, user_id: user.id })
          .eq('id', existingTerms.id));
      } else {
        // Create new terms
        ({ error } = await supabase
          .from('payment_terms')
          .insert([{ ...formData, user_id: user.id }]));
      }

      if (error) throw error;

      setSuccess(true);
      setIsEditingAccountNumber(false);
      setIsEditingSortCode(false);
      setHasExistingAccountNumber(true);
      setHasExistingSortCode(true);
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      console.error('Error saving payment terms:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else if (typeof err === 'object' && err !== null && 'message' in err) {
        setError(err.message as string);
      } else {
        setError('An unexpected error occurred while saving payment terms');
      }
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchPaymentTerms();
  }, []);

  return {
    formData,
    loading,
    saving,
    error,
    success,
    isEditingAccountNumber,
    isEditingSortCode,
    hasExistingAccountNumber,
    hasExistingSortCode,
    handleChange,
    handleEditAccountNumber,
    handleEditSortCode,
    handleSubmit,
  };
};
