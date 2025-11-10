import { supabase } from '../../../../lib/supabase';
import { FormData } from '../types';

export const fetchWorkerName = async (userEmail: string): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from('workers')
      .select('full_name')
      .eq('email', userEmail)
      .single();

    if (error) throw error;
    return data?.full_name || null;
  } catch (err) {
    console.error('Error fetching worker name:', err);
    return null;
  }
};

export const fetchExistingQuestionnaire = async (userEmail: string): Promise<FormData | null> => {
  try {
    console.log('DEBUG: Fetching existing questionnaire for email:', userEmail);
    
    const { data, error } = await supabase
      .from('health_questionnaires')
      .select('*')
      .eq('user_email', userEmail)
      .eq('questionnaire_type', '6-month')
      .order('submission_date', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('DEBUG: Error fetching questionnaire:', error);
      throw error;
    }

    if (!data) {
      console.log('DEBUG: No existing questionnaire found');
      return null;
    }

    console.log('DEBUG: Found existing questionnaire:', data);

    // Convert database format to FormData format
    const formData: FormData = {
      // Medical Declaration
      epilepsy: data.epilepsy || false,
      blackouts: data.blackouts || false,
      diabetes: data.diabetes || false,
      eyesight: data.eyesight || false,
      colorBlindness: data.color_blindness || false,
      hearingImpairment: data.hearing_impairment || false,
      physicalDisability: data.physical_disability || false,
      arthritis: data.arthritis || false,
      backProblems: data.back_problems || false,
      hernia: data.hernia || false,
      hypertension: data.hypertension || false,
      heartDisease: data.heart_disease || false,
      respiratoryDisease: data.respiratory_disease || false,
      medicalDetails: data.medical_details || '',
      prescribedMedications: data.prescribed_medications || '',
      
      // Occupational Health History
      hazardousMaterialExposure: data.hazardous_material_exposure || false,
      hazardousMaterialDetails: data.hazardous_material_details || '',
      workRelatedHealthProblems: data.work_related_health_problems || false,
      workRelatedHealthDetails: data.work_related_health_details || '',
      workRestrictions: data.work_restrictions || false,
      workRestrictionsDetails: data.work_restrictions_details || '',
      
      // Declaration
      fullName: data.full_name || '',
      digitalSignature: data.digital_signature || '',
      submissionDate: data.submission_date || '',
      confirmationChecked: data.confirmation_checked || false,
    };

    return formData;
  } catch (err) {
    console.error('Error fetching existing questionnaire:', err);
    return null;
  }
};

export const submitHealthQuestionnaire = async (
  formData: FormData,
  userEmail: string,
  userId: string,
  isEdit: boolean = false
): Promise<void> => {
  const currentDate = new Date().toISOString();
  console.log('DEBUG: Submitting health questionnaire with date:', currentDate, 'Edit mode:', isEdit);

  // Debug: Check if tables exist
  console.log('DEBUG: Checking database tables...');
  try {
    const { data: tables, error: tablesError } = await supabase.rpc('list_tables');

    if (tablesError) {
      console.error('DEBUG: Error listing tables:', tablesError);
    } else {
      console.log('DEBUG: Available tables:', tables);
    }
  } catch (tableErr) {
    console.error('DEBUG: Error checking tables:', tableErr);
  }

  const questionnaireData = {
    user_id: userId,
    user_email: userEmail,
    submission_date: currentDate,
    questionnaire_type: '6-month',
    // Medical Declaration
    epilepsy: formData.epilepsy,
    blackouts: formData.blackouts,
    diabetes: formData.diabetes,
    eyesight: formData.eyesight,
    color_blindness: formData.colorBlindness,
    hearing_impairment: formData.hearingImpairment,
    physical_disability: formData.physicalDisability,
    arthritis: formData.arthritis,
    back_problems: formData.backProblems,
    hernia: formData.hernia,
    hypertension: formData.hypertension,
    heart_disease: formData.heartDisease,
    respiratory_disease: formData.respiratoryDisease,
    medical_details: formData.medicalDetails,
    prescribed_medications: formData.prescribedMedications,
    // Occupational Health History
    hazardous_material_exposure: formData.hazardousMaterialExposure,
    hazardous_material_details: formData.hazardousMaterialDetails,
    work_related_health_problems: formData.workRelatedHealthProblems,
    work_related_health_details: formData.workRelatedHealthDetails,
    work_restrictions: formData.workRestrictions,
    work_restrictions_details: formData.workRestrictionsDetails,
    // Declaration
    full_name: formData.fullName,
    digital_signature: formData.digitalSignature,
    confirmation_checked: formData.confirmationChecked,
  };

  let supabaseError;

  if (isEdit) {
    // Update existing questionnaire
    console.log('DEBUG: Attempting to update existing questionnaire in health_questionnaires table');
    const { error } = await supabase
      .from('health_questionnaires')
      .update(questionnaireData)
      .eq('user_email', userEmail)
      .eq('questionnaire_type', '6-month');
    
    supabaseError = error;
  } else {
    // Insert new questionnaire
    console.log('DEBUG: Attempting to insert into health_questionnaires table');
    const { error } = await supabase
      .from('health_questionnaires')
      .insert(questionnaireData);
    
    supabaseError = error;
  }

  if (supabaseError) {
    console.error('DEBUG: Error with health questionnaire operation:', supabaseError);
    throw supabaseError;
  }
};

export const updateWorkerRecord = async (userEmail: string): Promise<void> => {
  const currentDate = new Date().toISOString();
  
  console.log('DEBUG: Recording health check for email:', userEmail);
  
  try {
    // First, check if the workers table exists and has the right structure
    console.log('DEBUG: Checking workers table structure');

    try {
      const { data: columns, error: columnsError } = await supabase
        .rpc('list_table_columns', { table_name: 'workers' });

      if (columnsError) {
        console.error('DEBUG: Error checking columns:', columnsError);
      } else {
        console.log('DEBUG: Workers table columns:', columns);
      }
    } catch (columnErr) {
      console.error('DEBUG: Error when checking columns:', columnErr);
    }

    // Check if worker exists
    const { data: existingWorker, error: checkError } = await supabase
      .from('workers')
      .select('id')
      .eq('email', userEmail)
      .maybeSingle();

    if (checkError) {
      console.error('DEBUG: Error checking for existing worker:', checkError);
      throw checkError;
    }

    if (existingWorker) {
      console.log('DEBUG: Found existing worker record, updating...');
      // Update existing worker record
      const { error: updateError } = await supabase
        .from('workers')
        .update({
          last_health_questionnaire: currentDate
        })
        .eq('email', userEmail);

      if (updateError) {
        console.error('DEBUG: Error updating worker record:', updateError);
        console.error('DEBUG: Error details:', JSON.stringify(updateError));
        throw updateError;
      } else {
        console.log('DEBUG: Worker record updated successfully');
      }
    } else {
      console.log('DEBUG: Worker record not found, creating new one...');
      // Insert new worker record
      const { error: insertError } = await supabase
        .from('workers')
        .insert([
          {
            email: userEmail,
            last_health_questionnaire: currentDate
          }
        ]);

      if (insertError) {
        console.error('DEBUG: Error inserting worker record:', insertError);
        console.error('DEBUG: Error details:', JSON.stringify(insertError));
        throw insertError;
      } else {
        console.log('DEBUG: New worker record created successfully');
      }
    }
  } catch (err) {
    console.error('DEBUG: Error in worker record update:', err);
    console.error('DEBUG: Full error object:', JSON.stringify(err));
    throw new Error(`Error updating worker record: ${err instanceof Error ? err.message : String(err)}`);
  }
};

export const recordHealthCheck = async (
  userEmail: string,
  formData: FormData
): Promise<void> => {
  const currentDate = new Date().toISOString();
  
  // Also insert into health_checks table for record-keeping
  console.log('DEBUG: Inserting into health_checks table');
  const { error: healthCheckError } = await supabase
    .from('health_checks')
    .insert([
      {
        email: userEmail,
        completed_at: currentDate,
        fit_to_work: true,
        taking_medications: formData.prescribedMedications.length > 0,
        wearing_correct_ppe: true
      }
    ]);

  if (healthCheckError) {
    console.error('DEBUG: Error recording health check:', healthCheckError);
    console.error('DEBUG: Error details:', JSON.stringify(healthCheckError));
  } else {
    console.log('DEBUG: Health check recorded successfully');
  }
};

export const recordSimpleHealthCheck = async (userEmail: string): Promise<void> => {
  try {
    // Insert directly into health_checks table
    const { error } = await supabase
      .from('health_checks')
      .insert([
        {
          email: userEmail,
          completed_at: new Date().toISOString(),
          fit_to_work: true
        }
      ]);
      
    if (error) {
      console.error('Error recording health check:', error);
      console.log('Continuing anyway - health check will be considered completed');
    } else {
      console.log('Health check recorded successfully');
    }
  } catch (err) {
    // Silently fail - just log the error
    console.error('Error recording health check:', err);
    console.log('Continuing anyway - health check will be considered completed');
  }
};
