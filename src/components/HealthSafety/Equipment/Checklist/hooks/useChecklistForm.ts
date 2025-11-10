import { useState, useEffect } from 'react';
import { supabase } from '../../../../../lib/supabase';
import type { Equipment, EquipmentChecklist, ChecklistItem } from '../types';

export function useChecklistForm(equipment: Equipment, checklistToEdit?: EquipmentChecklist | null) {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [notes, setNotes] = useState('');
  const [createdByName, setCreatedByName] = useState('');
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [uploadingImage, setUploadingImage] = useState<string | null>(null);

  useEffect(() => {
    if (checklistToEdit) {
      // When editing, we need to generate signed URLs for all images
      const loadChecklistWithSignedUrls = async () => {
        const itemsWithSignedUrls = await Promise.all(
          checklistToEdit.items.map(async (item) => {
            if (item.image_url) {
              try {
                // Generate a signed URL with 1 hour expiry
                const { data } = await supabase.storage
                  .from('equipment-checklist-images')
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
        
        setItems(itemsWithSignedUrls);
        setNotes(checklistToEdit.notes || '');
        setCreatedByName(checklistToEdit.created_by_name);
        setFrequency(checklistToEdit.frequency);
      };
      
      loadChecklistWithSignedUrls();
    }
    fetchUserFullName();
  }, [checklistToEdit]);

  const fetchUserFullName = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.user_metadata?.display_name) {
        setCreatedByName(user.user_metadata.display_name);
      }
    } catch (err) {
      console.error('Error fetching user display name:', err);
    }
  };

  const handleAddItem = () => {
    setItems(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: '',
        status: 'pass',
        notes: '',
        image_url: ''
      }
    ]);
  };

  const handleImageUpload = async (itemId: string, file: File) => {
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
      const filePath = `${equipment.id}/${fileName}`;

      // Upload the file
      const { error: uploadError } = await supabase.storage
        .from('equipment-checklist-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Generate a signed URL with 1 hour expiry
      const { data } = await supabase.storage
        .from('equipment-checklist-images')
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
  
  const handleRemoveImage = (itemId: string) => {
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

  const handleRemoveItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const handleItemChange = (id: string, field: keyof ChecklistItem, value: string) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        // For name field, check if already selected
        if (field === 'name' && value) {
          const isItemAlreadySelected = prev.some(otherItem => 
            otherItem.id !== id && otherItem.name === value
          );

          if (isItemAlreadySelected) {
            setError('This item has already been selected');
            return item;
          }
          setError(null);
        }

        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  const validateStep = (step: number): boolean => {
    setError(null);
    switch(step) {
      case 1:
        if (!createdByName.trim()) {
          setError("Your name is required.");
          return false;
        }
        if (!frequency) {
          setError("Frequency is required.");
          return false;
        }
        break;
      case 2:
        if (items.length === 0) {
          setError("At least one checklist item is required.");
          return false;
        }
        if (items.some(item => !item.name.trim())) {
          setError("All checklist items must have a name.");
          return false;
        }
        break;
      // No validation needed for step 3 (Notes) as it's optional
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (onSuccess: () => void) => {
    if (!validateStep(1) || !validateStep(2)) {
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Validate form
      if (!createdByName) throw new Error('Please enter your name');
      if (items.some(item => !item.name)) throw new Error('All items must have a name');

      const status = items.some(item => item.status === 'fail') ? 'fail' : 'pass';

      // Process items to store only file paths, not signed URLs
      const processedItems = items.map(item => {
        // Remove the temporary signed_url before saving to DB
        const { signed_url, ...rest } = item;
        return rest;
      });

      let error;
      if (checklistToEdit) {
        // Update existing checklist
        ({ error } = await supabase
          .from('equipment_checklists')
          .update({
            items: processedItems,
            notes: notes || null,
            created_by_name: createdByName,
            frequency,
            status
          })
          .eq('id', checklistToEdit.id));
      } else {
        // Create new checklist
        ({ error } = await supabase
          .from('equipment_checklists')
          .insert([{
            equipment_id: equipment.id,
            user_id: user.id,
            items: processedItems,
            notes: notes || null,
            created_by_name: createdByName,
            frequency,
            status
          }]));
      }

      if (error) throw error;
      
      onSuccess();
    } catch (err) {
      console.error('Error saving checklist:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return {
    currentStep,
    loading,
    error,
    items,
    notes,
    createdByName,
    frequency,
    uploadingImage,
    setError,
    setNotes,
    setCreatedByName,
    setFrequency,
    handleAddItem,
    handleImageUpload,
    handleRemoveImage,
    handleRemoveItem,
    handleItemChange,
    handleNext,
    handlePrevious,
    handleSubmit
  };
}
