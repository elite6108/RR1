import { supabase } from '../../../../../lib/supabase';

// Function to get a signed URL for a hazard icon
export const getSignedHazardImageUrl = async (filename: string): Promise<string | null> => {
  if (!filename) return null;
  
  try {
    const { data } = await supabase.storage
      .from('signage-artwork')
      .createSignedUrl(filename, 3600);
      
    return data?.signedUrl || null;
  } catch (error) {
    console.error('Error generating signed hazard URL:', error);
    return null;
  }
};

// Function to get a signed URL for a PPE icon
export const getSignedImageUrl = async (filename: string): Promise<string | null> => {
  if (!filename) return null;
  
  try {
    const { data } = await supabase.storage
      .from('ppe-icons')
      .createSignedUrl(filename, 3600);
      
    return data?.signedUrl || null;
  } catch (error) {
    console.error('Error generating signed URL:', error);
    return null;
  }
};
