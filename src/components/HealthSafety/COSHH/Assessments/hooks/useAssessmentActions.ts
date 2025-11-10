import { supabase } from '../../../../../lib/supabase';
import { CoshhAssessment, AssessmentFormData } from '../types';
import { generateNextCoshhReference } from '../utils/referenceGenerator';

export const useAssessmentActions = () => {
  
  // Delete assessment
  const deleteAssessment = async (assessment: CoshhAssessment): Promise<void> => {
    const { error } = await supabase
      .from('coshh_assessments')
      .delete()
      .eq('id', assessment.id);

    if (error) throw error;
  };

  // Submit form (add/edit)
  const submitAssessment = async (
    formData: AssessmentFormData,
    isEdit: boolean = false
  ): Promise<void> => {
    try {
      const currentDate = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
      
      if (isEdit && formData.id) {
        // Update existing assessment
        const { error } = await supabase
          .from('coshh_assessments')
          .update({
            ...formData,
            assessment_date: currentDate, // Update assessment date to current date
            updated_at: new Date().toISOString()
          })
          .eq('id', formData.id);
        
        if (error) throw error;
      } else {
        // Create new assessment
        const coshhReference = await generateNextCoshhReference();
        
        const { error } = await supabase
          .from('coshh_assessments')
          .insert([{
            ...formData,
            assessment_date: currentDate, // Set assessment date to current date
            coshh_reference: coshhReference,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }]);
        
        if (error) throw error;
      }
    } catch (error) {
      console.error('Error submitting assessment:', error);
      throw error;
    }
  };

  // Import assessment from JSON
  const importAssessment = async (jsonData: any): Promise<void> => {
    try {
      // Validate the JSON data structure
      if (!jsonData.substance_name || !jsonData.supplied_by) {
        throw new Error('Invalid assessment data: missing required fields');
      }

      const coshhReference = await generateNextCoshhReference();
      
      const assessmentData = {
        ...jsonData,
        coshh_reference: coshhReference,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('coshh_assessments')
        .insert([assessmentData]);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error importing assessment:', error);
      throw error;
    }
  };

  // Export assessment to JSON
  const exportAssessment = (assessment: CoshhAssessment): void => {
    try {
      // Remove database-specific fields
      const exportData = {
        ...assessment,
        id: undefined,
        created_at: undefined,
        updated_at: undefined,
        coshh_reference: undefined // Will be regenerated on import
      };

      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `COSHH_Assessment_${assessment.substance_name.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.json`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting assessment:', error);
      throw error;
    }
  };

  return {
    deleteAssessment,
    submitAssessment,
    importAssessment,
    exportAssessment
  };
};
