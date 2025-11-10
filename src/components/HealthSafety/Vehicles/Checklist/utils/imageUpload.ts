import { supabase } from '../../../../../lib/supabase';
import type { ChecklistItem } from '../../shared/types';

export const handleImageUpload = async (
  itemId: string,
  file: File,
  vehicleId: string,
  setUploadingImage: (id: string | null) => void,
  setError: (error: string | null) => void,
  setItems: React.Dispatch<React.SetStateAction<ChecklistItem[]>>
) => {
  try {
    setUploadingImage(itemId);
    setError(null);

    // Validate file type
    if (!file.type.startsWith('image/')) {
      throw new Error('Please upload an image file');
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new Error('Image size must be less than 5MB');
    }

    const fileExt = file.name.split('.').pop()?.toLowerCase() || '';
    const fileName = `${itemId}-${Date.now()}.${fileExt}`;
    const filePath = `${vehicleId}/${fileName}`;

    // Upload the file
    const { error: uploadError } = await supabase.storage
      .from('vehicle-checklist-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) throw uploadError;

    // Generate a signed URL with 1 hour expiry
    const { data } = await supabase.storage
      .from('vehicle-checklist-images')
      .createSignedUrl(filePath, 60 * 60); // 1 hour expiry

    if (!data?.signedUrl) throw new Error("Failed to generate signed URL");
    
    // Update the item with both the file path and signed URL
    setItems(prev => prev.map(item =>
      item.id === itemId
        ? { 
            ...item, 
            image_url: filePath,
            signed_url: data.signedUrl
          }
        : item
    ));
  } catch (error) {
    console.error('Error uploading image:', error);
    setError(error instanceof Error ? error.message : 'Failed to upload image');
  } finally {
    setUploadingImage(null);
  }
};

export const handleRemoveImage = (
  itemId: string,
  setItems: React.Dispatch<React.SetStateAction<ChecklistItem[]>>
) => {
  setItems(prev => prev.map(item =>
    item.id === itemId
      ? {
          ...item,
          image_url: '',
          signed_url: undefined,
        }
      : item
  ));
};

export const generateSignedUrls = async (items: ChecklistItem[]): Promise<ChecklistItem[]> => {
  return await Promise.all(
    items.map(async (item) => {
      if (item.image_url) {
        try {
          // Generate a signed URL with 1 hour expiry
          const { data } = await supabase.storage
            .from('vehicle-checklist-images')
            .createSignedUrl(item.image_url, 60 * 60); // 1 hour expiry
          
          if (data?.signedUrl) {
            return {
              ...item,
              signed_url: data.signedUrl // Store signed URL separately
            };
          }
        } catch (error) {
          console.error('Error generating signed URL:', error);
        }
      }
      return { ...item, signed_url: undefined };
    })
  );
};
