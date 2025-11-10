import { useState } from 'react';
import { supabase } from '../../../../../../../../lib/supabase';
import { MinorAccidentFormData } from '../types/MinorAccidentTypes';

export const useMinorAccidentFormSubmit = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (
    formData: MinorAccidentFormData,
    isEditing: boolean,
    initialData?: any,
    onClose?: () => void
  ) => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      const dataToSubmit = {
        auto_id: formData.autoId,
        report_type: formData.reportType,
        category: formData.category,
        incident_location: formData.incidentLocation,
        incident_date: formData.incidentDate || null,
        incident_description: formData.incidentDescription,
        injured_person_name: formData.injuredPersonName,
        injured_person_address: formData.injuredPersonAddress,
        injured_person_phone: formData.injuredPersonPhone,
        injured_person_position: formData.injuredPersonPosition,
        time_lost: formData.timeLost,
        time_lost_start_date: formData.timeLostStartDate || null,
        time_lost_end_date: formData.timeLostEndDate || null,
        ae_hospital_name: formData.aeHospitalName,
        required_ppe: formData.requiredPpe,
        worn_ppe: formData.wornPpe,
        injury_locations: formData.injuryLocations,
        injury_types: formData.injuryTypes,
        advised_medical: formData.advisedMedical,
        drug_alcohol_test: formData.drugAlcoholTest,
        first_aid_details: formData.firstAidDetails,
        basic_cause: formData.basicCause,
        root_cause_work_environment: formData.rootCauseWorkEnvironment,
        root_cause_human_factors: formData.rootCauseHumanFactors,
        root_cause_ppe: formData.rootCausePpe,
        root_cause_management: formData.rootCauseManagement,
        root_cause_plant_equipment: formData.rootCausePlantEquipment,
        actions_taken: formData.actionsTaken,
        actions: formData.actions,
        file_urls: formData.file_urls
      };

      if (isEditing && initialData?.id) {
        const { error: submitError } = await supabase
          .from('accidents_minoraccident')
          .update(dataToSubmit)
          .eq('id', initialData.id);
        if (submitError) throw submitError;
      } else {
        const { error: submitError } = await supabase
          .from('accidents_minoraccident')
          .insert([dataToSubmit]);
        if (submitError) throw submitError;
      }
      
      setIsSubmitting(false);
      setSubmitted(true);
      
      if (onClose) {
        setTimeout(() => onClose(), 1000);
      }
    } catch (err: any) {
      setIsSubmitting(false);
      setError(err?.message || 'An unknown error occurred.');
      setSubmitted(false);
    }
  };

  return { isSubmitting, submitted, error, handleSubmit, setError };
};
