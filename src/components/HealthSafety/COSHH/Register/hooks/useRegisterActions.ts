import { supabase } from '../../../../../lib/supabase';
import { CoshhSubstance, RegisterFormData } from '../types';

export const useRegisterActions = () => {
  
  // Delete substance
  const deleteSubstance = async (substance: CoshhSubstance): Promise<void> => {
    const { error } = await supabase
      .from('coshh_register')
      .delete()
      .eq('id', substance.id);

    if (error) throw error;
  };

  // Submit form (add/edit/review)
  const submitForm = async (
    formData: RegisterFormData,
    auditorName: string,
    modalType: 'add' | 'edit' | 'review',
    selectedSubstance?: CoshhSubstance
  ): Promise<void> => {
    const today = new Date().toISOString().split('T')[0];
    
    if (modalType === 'review' && selectedSubstance) {
      // For review modal, update the reviewed_date and set next review date based on reviewed_date
      const reviewedDate = new Date(today);
      const nextReviewDate = new Date(reviewedDate);
      nextReviewDate.setDate(reviewedDate.getDate() + 365);
      const nextReviewDateString = nextReviewDate.toISOString().split('T')[0];
      
      const { error } = await supabase
        .from('coshh_register')
        .update({ 
          reviewed_date: today,
          review_date: nextReviewDateString
        })
        .eq('id', selectedSubstance.id);
      
      if (error) throw error;
    } else {
      // For add/edit modal
      let submissionData;
      
      if (modalType === 'edit' && selectedSubstance) {
        // For edit, keep the original added_date and recalculate review_date based on it (unless already reviewed)
        const addedDate = new Date(selectedSubstance.added_date);
        const baseDate = selectedSubstance.reviewed_date ? new Date(selectedSubstance.reviewed_date) : addedDate;
        const calculatedReviewDate = new Date(baseDate);
        calculatedReviewDate.setDate(baseDate.getDate() + 365);
        
        submissionData = {
          ...formData,
          auditor: auditorName,
          review_date: formData.review_date || calculatedReviewDate.toISOString().split('T')[0]
        };
        
        const { error } = await supabase
          .from('coshh_register')
          .update(submissionData)
          .eq('id', selectedSubstance.id);
        
        if (error) throw error;
      } else {
        // For new substance, calculate review_date based on added_date (which is today)
        const addedDate = new Date(today);
        const reviewDate = new Date(addedDate);
        reviewDate.setDate(addedDate.getDate() + 365);
        
        submissionData = {
          ...formData,
          auditor: auditorName,
          added_date: today,
          review_date: reviewDate.toISOString().split('T')[0]
        };
        
        const { error } = await supabase
          .from('coshh_register')
          .insert([submissionData]);
        
        if (error) throw error;
      }
    }
  };

  return {
    deleteSubstance,
    submitForm
  };
};
