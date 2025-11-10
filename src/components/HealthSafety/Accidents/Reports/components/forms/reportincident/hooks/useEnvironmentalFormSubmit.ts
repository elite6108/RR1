import { useState } from 'react';
import { supabase } from '../../../../../../../../lib/supabase';
import { EnvironmentalFormData } from '../types/EnvironmentalTypes';

export const useEnvironmentalFormSubmit = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (
    formData: EnvironmentalFormData,
    isEditing: boolean,
    initialData?: any,
    onClose?: () => void
  ) => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      // Ensure file_urls is a proper array
      const fileUrlsToSubmit = formData.file_urls;
      console.log('Submitting file URLs:', fileUrlsToSubmit);
      
      const dataToSubmit = {
        auto_id: formData.autoId,
        report_type: formData.reportType,
        category: formData.category,
        incident_location: formData.incidentLocation,
        incident_date: formData.incidentDate || null,
        incident_description: formData.incidentDescription,
        basic_cause_of_incident: formData.basicCause,
        source_of_hazard: formData.sourceOfHazard,
        root_cause_work_environment: formData.rootCauseWorkEnvironment,
        root_cause_human_factors: formData.rootCauseHumanFactors,
        root_cause_ppe: formData.rootCausePpe,
        root_cause_management: formData.rootCauseManagement,
        root_cause_plant_equipment: formData.rootCausePlantEquipment,
        actions_taken: formData.actionsTaken,
        actions: formData.actions,
        file_urls: fileUrlsToSubmit,
        environmental_incident_type: formData.environmentalIncidentType,
        severity_of_incident: formData.severityOfIncident
      };

      console.log('Submitting data:', dataToSubmit);

      if (isEditing && initialData?.id) {
        const { error: submitError } = await supabase
          .from('accidents_environmental')
          .update(dataToSubmit)
          .eq('id', initialData.id);

        if (submitError) throw submitError;
      } else {
        const { error: submitError } = await supabase
          .from('accidents_environmental')
          .insert([dataToSubmit]);

        if (submitError) throw submitError;
      }
      
      setIsSubmitting(false);
      setSubmitted(true);
      
      if (onClose) {
        setTimeout(() => {
          onClose();
        }, 1000);
      }
    } catch (err: any) {
      console.error('Submission error:', err);
      setIsSubmitting(false);
      setError(err?.message || 'An unknown error occurred.');
      setSubmitted(false);
    }
  };

  return { handleSubmit, isSubmitting, submitted, error };
};
