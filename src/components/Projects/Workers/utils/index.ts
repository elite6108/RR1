import { supabase } from '../../../../lib/supabase';

export const getSignedImageUrl = async (filename: string | null): Promise<string | null> => {
  if (!filename) return null;
  
  try {
    const { data, error } = await supabase.storage
      .from('workers')
      .createSignedUrl(filename, 3600);
    
    if (error) {
      console.error('Error generating signed URL:', error);
      return null;
    }
      
    return data?.signedUrl || null;
  } catch (error) {
    console.error('Error generating signed URL:', error);
    return null;
  }
};

export const formatDate = (dateString: string | null) => {
  if (!dateString) return 'Not provided';

  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  });
};

export const validateFileUpload = (file: File) => {
  const allowedMimeTypes = ['image/jpg', 'image/jpeg', 'image/png', 'image/heif'];
  if (!allowedMimeTypes.includes(file.type)) {
    return 'File type not allowed. Please upload JPG, PNG or HEIF images only.';
  }

  if (file.size > 10 * 1024 * 1024) {
    return 'File size exceeds 10MB limit.';
  }

  return null;
};

export const generateFileName = (email: string, fileExtension: string) => {
  return `${email.replace('@', '_at_')}_${Date.now()}.${fileExtension}`;
};

export const isHealthQuestionnaireOverdue = (lastQuestionnaireDate: string | null): boolean => {
  if (!lastQuestionnaireDate) return true;
  
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  
  const lastDate = new Date(lastQuestionnaireDate);
  return lastDate < sixMonthsAgo;
};