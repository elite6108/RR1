import { useState, useRef } from 'react';
import { supabase } from '../../../../lib/supabase';
import { validateFileUpload, generatePhotoFileName } from '../utils/profileUtils';

export const usePhotoUpload = (
  email: string,
  onPhotoUpdate: (filename: string) => void,
  onError: (error: string) => void
) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const setImagePreviewFromFilename = async (filename: string) => {
    if (!filename) {
      setImagePreview(null);
      return;
    }

    try {
      // Create a fresh signed URL for the photo
      const { data: signedUrlData } = await supabase.storage
        .from('workers')
        .createSignedUrl(filename, 3600); // 1 hour expiry
        
      if (signedUrlData?.signedUrl) {
        setImagePreview(signedUrlData.signedUrl);
      }
    } catch (urlError) {
      console.error('Error generating signed URL:', urlError);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    const validationError = validateFileUpload(file);
    if (validationError) {
      onError(validationError);
      return;
    }

    // Show preview of the selected image
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setImagePreview(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);

    // Upload image to storage
    setLoading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = generatePhotoFileName(email, fileExt || 'jpg');

      const { error: uploadError } = await supabase.storage
        .from('workers')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Generate a signed URL for immediate preview
      const { data: signedUrlData } = await supabase.storage
        .from('workers')
        .createSignedUrl(fileName, 3600); // 1 hour expiry

      if (signedUrlData?.signedUrl) {
        // Set image preview with the signed URL
        setImagePreview(signedUrlData.signedUrl);
      }

      // Update form data with just the filename
      onPhotoUpdate(fileName);
    } catch (error) {
      console.error('Error uploading photo:', error);
      onError('Failed to upload photo');
    } finally {
      setLoading(false);
    }
  };

  const handleRemovePhoto = async (currentPhotoUrl: string) => {
    setLoading(true);

    try {
      // Get filename from current photo URL
      const fileName = currentPhotoUrl;
      if (!fileName) return;

      // Delete from storage
      const { error: deleteError } = await supabase.storage
        .from('workers')
        .remove([fileName]);

      if (deleteError) throw deleteError;

      // Update form data and preview
      onPhotoUpdate('');
      setImagePreview(null);
    } catch (error) {
      console.error('Error removing photo:', error);
      onError('Failed to remove photo');
    } finally {
      setLoading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return {
    imagePreview,
    loading,
    fileInputRef,
    handleFileChange,
    handleRemovePhoto,
    triggerFileInput,
    setImagePreviewFromFilename
  };
};