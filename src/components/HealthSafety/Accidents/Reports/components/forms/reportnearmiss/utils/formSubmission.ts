import { supabase } from '../../../../../../../../lib/supabase';
import { FormData } from '../types/FormData';

export async function submitForm(
  formData: FormData,
  tableName: string,
  isEditing: boolean,
  initialDataId?: number
) {
  console.log('Submitting file URLs:', formData.file_urls);
  console.log('Form data autoId:', formData.autoId);
  
  // Ensure autoId is not empty before submitting
  if (!formData.autoId) {
    throw new Error('Auto ID is required but was empty. Please refresh the page and try again.');
  }

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
    file_urls: formData.file_urls
  };

  console.log('Submitting data:', dataToSubmit);
  
  if (isEditing && initialDataId) {
    const { error } = await supabase
      .from(tableName)
      .update(dataToSubmit)
      .eq('id', initialDataId);

    if (error) throw error;
  } else {
    const { error } = await supabase
      .from(tableName)
      .insert([dataToSubmit]);

    if (error) throw error;
  }
}
