import { useState } from 'react';
import { supabase } from '../../../../lib/supabase';
import type { CompanyFile, AssignmentAction } from '../types';

export const useFileAssignment = (onAssignmentComplete: () => void) => {
  const [loading, setLoading] = useState(false);
  const [assignmentAction, setAssignmentAction] = useState<AssignmentAction | null>(null);

  const handleSetHandbook = async (file: CompanyFile) => {
    if (file.is_folder || !file.storage_path) return false;
  
    try {
      setLoading(true);
  
      // Clear all existing handbooks first
      const { error: clearError } = await supabase
        .from('company_files')
        .update({ is_employee_handbook: false })
        .eq('is_employee_handbook', true);
      
      if (clearError) throw clearError;
  
      // Set this file as the handbook
      const { error: setError } = await supabase
        .from('company_files')
        .update({ is_employee_handbook: true })
        .eq('id', file.id);
  
      if (setError) throw setError;
  
      onAssignmentComplete();
      return true;
    } catch (error) {
      console.error('Error setting employee handbook:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveHandbook = async (file: CompanyFile) => {
    try {
      setLoading(true);
  
      const { error } = await supabase
        .from('company_files')
        .update({ is_employee_handbook: false })
        .eq('id', file.id);
  
      if (error) throw error;
  
      onAssignmentComplete();
      return true;
    } catch (error) {
      console.error('Error removing employee handbook:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleSetAnnualTraining = async (file: CompanyFile) => {
    if (file.is_folder || !file.storage_path) return false;
  
    try {
      setLoading(true);
  
      // Clear all existing annual training assignments first
      const { error: clearError } = await supabase
        .from('company_files')
        .update({ is_annual_training: false })
        .eq('is_annual_training', true);
      
      if (clearError) throw clearError;
  
      // Set this file as the annual training
      const { error: setError } = await supabase
        .from('company_files')
        .update({ is_annual_training: true })
        .eq('id', file.id);
  
      if (setError) throw setError;
  
      onAssignmentComplete();
      return true;
    } catch (error) {
      console.error('Error setting annual training:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveAnnualTraining = async (file: CompanyFile) => {
    try {
      setLoading(true);
  
      const { error } = await supabase
        .from('company_files')
        .update({ is_annual_training: false })
        .eq('id', file.id);
  
      if (error) throw error;
  
      onAssignmentComplete();
      return true;
    } catch (error) {
      console.error('Error removing annual training:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const confirmAssignmentAction = async () => {
    if (!assignmentAction) return false;

    const { type, category, file } = assignmentAction;

    if (type === 'assign') {
      if (category === 'handbook') {
        return await handleSetHandbook(file);
      } else {
        return await handleSetAnnualTraining(file);
      }
    } else {
      if (category === 'handbook') {
        return await handleRemoveHandbook(file);
      } else {
        return await handleRemoveAnnualTraining(file);
      }
    }
  };

  return {
    loading,
    assignmentAction,
    setAssignmentAction,
    confirmAssignmentAction
  };
};
