import { supabase } from '../lib/supabase';

export const verifyAdminPassword = async (password: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.functions.invoke('admin-password', {
      body: JSON.stringify({ action: 'verify', password })
    });

    if (error) throw error;
    return data.valid;
  } catch (error) {
    console.error('Error verifying admin password:', error);
    return false;
  }
};

export const updateAdminPassword = async (currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const { data, error } = await supabase.functions.invoke('admin-password', {
      body: JSON.stringify({ action: 'update', currentPassword, newPassword })
    });

    if (error) throw error;
    return data.success ? { success: true } : { success: false, error: data.error };
  } catch (error) {
    console.error('Error updating admin password:', error);
    return { success: false, error: error.message };
  }
};