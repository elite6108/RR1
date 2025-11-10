import { useState } from 'react';
import { supabase } from '../../../../lib/supabase';
import { getSignedImageUrl, validateFileUpload, generateFileName } from '../utils';

export const useWorkerForm = (onSuccess: () => void) => {
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    email: '',
    company: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    photo_filename: '',
    photo_url: '',
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const resetForm = () => {
    setFormData({
      full_name: '',
      phone: '',
      email: '',
      company: '',
      emergency_contact_name: '',
      emergency_contact_phone: '',
      photo_filename: '',
      photo_url: '',
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }

    try {
      setUploading(true);

      const file = e.target.files[0];
      
      const validationError = validateFileUpload(file);
      if (validationError) {
        setError(validationError);
        setUploading(false);
        return;
      }
      
      const fileExt = file.name.split('.').pop();
      const fileName = generateFileName(formData.email, fileExt || '');

      const { error: uploadError } = await supabase.storage
        .from('workers')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const signedUrl = await getSignedImageUrl(fileName);

      setFormData((prev) => ({
        ...prev,
        photo_filename: fileName,
        photo_url: signedUrl || '',
      }));
    } catch (err) {
      console.error('Error uploading file:', err);
      setError('Failed to upload photo. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (editingWorkerId: string | null) => {
    try {
      setLoading(true);
      setError(null);

      const dataToSubmit = {
        ...formData,
        is_active: true,
        photo_filename: formData.photo_filename || null
      };
      
      if ('photo_url' in dataToSubmit) {
        delete (dataToSubmit as any).photo_url;
      }

      if (editingWorkerId) {
        const { error } = await supabase
          .from('workers')
          .update(dataToSubmit)
          .eq('id', editingWorkerId);

        if (error) throw error;
      } else {
        const { error } = await supabase.from('workers').insert([dataToSubmit]);

        if (error) throw error;
      }

      onSuccess();
      resetForm();
    } catch (err: any) {
      console.error('Error saving worker:', err);

      let errorMessage = 'Failed to save worker. ';

      if (err.code) {
        switch (err.code) {
          case '23505':
            errorMessage += 'A worker with this email already exists.';
            break;
          case '23502':
            errorMessage += 'Please fill in all required fields.';
            break;
          case '42P01':
            errorMessage += 'Database table not found. Please contact support.';
            break;
          case '42703':
            errorMessage += `Database error: ${
              err.message || 'Unknown column error'
            }`;
            break;
          default:
            errorMessage += err.message || `Error code: ${err.code}`;
        }
      } else if (err.message) {
        errorMessage += err.message;
      } else {
        errorMessage +=
          'Unknown error occurred. Please try again or contact support.';
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const populateFormWithWorker = async (worker: any) => {
    let photoUrl = null;
    if (worker.photo_filename) {
      try {
        photoUrl = await getSignedImageUrl(worker.photo_filename);
      } catch (err) {
        console.error('Error getting signed URL for worker edit:', worker.full_name, err);
        photoUrl = null;
      }
    }

    setFormData({
      full_name: worker.full_name || '',
      phone: worker.phone || '',
      email: worker.email || '',
      company: worker.company || '',
      emergency_contact_name: worker.emergency_contact_name || '',
      emergency_contact_phone: worker.emergency_contact_phone || '',
      photo_filename: worker.photo_filename || '',
      photo_url: photoUrl || '',
    });
  };

  return {
    formData,
    uploading,
    loading,
    error,
    handleInputChange,
    resetForm,
    handleFileUpload,
    handleSubmit,
    populateFormWithWorker,
    setError
  };
};
