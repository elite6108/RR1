import { useState } from 'react';
import { supabase } from '../../../lib/supabase';
import type { CompanySettings } from '../../../types/database';

export function useLogoUpload(
  formData: Partial<CompanySettings>,
  updateFormData: (updates: Partial<CompanySettings>) => void
) {
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);

    try {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error(
          'Invalid file type. Please upload a JPG, PNG, or GIF image.'
        );
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        throw new Error(
          'File is too large. Maximum size allowed is 5MB.'
        );
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('You must be logged in to upload a logo.');
      }

      // Delete existing logo if there is one
      if (formData.logo_url) {
        const existingPath = formData.logo_url.split('/').pop();
        if (existingPath) {
          const { error: deleteError } = await supabase.storage
            .from('company-logos')
            .remove([existingPath]);

          if (deleteError) {
            console.error('Error deleting existing logo:', deleteError);
            // Continue with upload even if delete fails
          }
        }
      }

      // Upload new logo with a generic name
      const fileExt = file.name.split('.').pop()?.toLowerCase() || '';
      const fileName = `company-logo-${Date.now()}.${fileExt}`;
      
      const { error: uploadError, data } = await supabase.storage
        .from('company-logos')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        if (uploadError.message.includes('duplicate')) {
          throw new Error('A file with this name already exists. Please try again.');
        } else if (uploadError.message.includes('permission')) {
          throw new Error('You do not have permission to upload files.');
        } else {
          throw new Error(`Upload failed: ${uploadError.message}`);
        }
      }

      if (!data) {
        throw new Error('Upload failed: No data received from server.');
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('company-logos')
        .getPublicUrl(fileName);

      updateFormData({ logo_url: publicUrl });
    } catch (err) {
      console.error('Logo upload error:', err);
      throw err;
    } finally {
      setUploadingLogo(false);
      // Reset the file input
      e.target.value = '';
    }
  };

  return {
    uploadingLogo,
    handleLogoUpload
  };
}