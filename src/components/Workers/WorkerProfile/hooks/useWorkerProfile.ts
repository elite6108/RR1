import { useState, useEffect } from 'react';
import { supabase } from '../../../../lib/supabase';
import { WorkerFormData, ValidationErrors, validateFormData, getTabForField } from '../utils/profileUtils';

export const useWorkerProfile = (userEmail?: string) => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  
  const [formData, setFormData] = useState<WorkerFormData>({
    full_name: '',
    email: '',
    phone: '',
    dob: '',
    national_insurance: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    photo_url: '',
    driving_licence_number: '',
  });

  const fetchWorkerProfile = async (email: string) => {
    setLoading(true);
    setError(null);

    try {
      // Get the authenticated user first to ensure we have the metadata
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      // Get the worker details
      const { data: workerData, error: workerError } = await supabase
        .from('workers')
        .select('*')
        .eq('email', email)
        .maybeSingle();

      if (workerError) throw workerError;

      if (workerData) {
        // Set form data from worker data, but prioritize the auth user full_name if available
        setFormData({
          full_name:
            authUser?.user_metadata?.full_name || workerData.full_name || '',
          email: workerData.email || email,
          phone: workerData.phone || '',
          dob: workerData.dob || '',
          national_insurance: workerData.national_insurance || '',
          emergency_contact_name: workerData.emergency_contact_name || '',
          emergency_contact_phone: workerData.emergency_contact_phone || '',
          photo_url: workerData.photo_filename || '', // Store the filename only
          driving_licence_number: workerData.driving_licence_number || '',
        });
      } else {
        // If no worker record, prioritize getting data from auth user
        if (authUser) {
          setFormData(prev => ({
            ...prev,
            full_name: authUser.user_metadata?.full_name || '',
            email: authUser.email || email,
            phone: authUser.user_metadata?.phone || '',
          }));
        }
      }
    } catch (error) {
      console.error('Error fetching worker profile:', error);
      setError('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const updateFormData = (updates: Partial<WorkerFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleSave = async (onTabSwitch?: (tab: string) => void) => {
    setValidationErrors({});
    setError(null);
    setSuccess(false);

    const errors = validateFormData(formData);

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setError('Please fill in all required fields.');
      
      // Find the first tab with an error and switch to it
      const firstErrorField = Object.keys(errors)[0];
      const targetTab = getTabForField(firstErrorField);
      if (onTabSwitch) {
        onTabSwitch(targetTab);
      }
      
      return false;
    }
    
    setSaving(true);
    
    try {
      // Check if worker record exists with this email
      const { data: existingWorker, error: checkError } = await supabase
        .from('workers')
        .select('id')
        .eq('email', formData.email)
        .maybeSingle();

      if (checkError) {
        console.error('Error checking worker record:', checkError);
        setError(`Database error when checking worker: ${checkError.message}`);
        return false;
      }

      let result;

      if (existingWorker) {
        // Update existing worker
        result = await supabase
          .from('workers')
          .update({
            full_name: formData.full_name,
            phone: formData.phone,
            dob: formData.dob,
            national_insurance: formData.national_insurance,
            emergency_contact_name: formData.emergency_contact_name,
            emergency_contact_phone: formData.emergency_contact_phone,
            photo_filename: formData.photo_url, // Note that we're storing the filename in photo_filename
            driving_licence_number: formData.driving_licence_number,
          })
          .eq('email', formData.email);
      } else {
        // Insert new worker record
        result = await supabase.from('workers').insert([
          {
            email: formData.email,
            full_name: formData.full_name,
            phone: formData.phone,
            dob: formData.dob,
            national_insurance: formData.national_insurance,
            emergency_contact_name: formData.emergency_contact_name,
            emergency_contact_phone: formData.emergency_contact_phone,
            photo_filename: formData.photo_url, // Note that we're storing the filename in photo_filename
            driving_licence_number: formData.driving_licence_number,
          },
        ]);
      }

      if (result.error) {
        console.error('Error saving worker profile:', result.error);
        
        // Check for specific error types
        if (result.error.message.includes('photo_filename')) {
          setError(`Error with photo: ${result.error.message}`);
        } else if (result.error.message.includes('duplicate key')) {
          setError('A worker with this email already exists.');
        } else if (result.error.message.includes('not-found')) {
          setError('The worker record could not be found.');
        } else if (result.error.message.includes('invalid column')) {
          setError(`Database schema error: ${result.error.message}. The 'photo_filename' column may be missing.`);
        } else {
          // Provide a more detailed error message with the actual error
          setError(`Failed to save profile data: ${result.error.message}`);
        }
        
        return false;
      }

      // Also update user_metadata in auth.users if possible
      try {
        const { error: metadataError } = await supabase.auth.updateUser({
          data: {
            full_name: formData.full_name,
            phone: formData.phone,
          },
        });
        
        if (metadataError) {
          console.error('Error updating user metadata:', metadataError);
          // Don't throw, just log a warning - the main profile was saved successfully
        }
        
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
        }, 3000);
        
        return true;
      } catch (metadataError) {
        console.error('Error updating user metadata:', metadataError);
        // Don't throw, just show success as the main profile was saved
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
        }, 3000);
        
        return true;
      }
    } catch (error: any) {
      console.error('Unexpected error saving worker profile:', error);
      // Handle unexpected errors
      if (error.message) {
        setError(`Unexpected error: ${error.message}`);
      } else {
        setError('An unexpected error occurred while saving your profile.');
      }
      
      return false;
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (userEmail) {
      fetchWorkerProfile(userEmail);
    }
  }, [userEmail]);

  return {
    formData,
    loading,
    saving,
    error,
    success,
    validationErrors,
    handleChange,
    updateFormData,
    handleSave,
    refetchProfile: () => userEmail && fetchWorkerProfile(userEmail)
  };
};