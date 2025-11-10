import { supabase } from '../../../../lib/supabase';
import type { RiskAssessment } from '../../../../types/database';
import { validateAllFields } from './useFormValidation';

interface HazardItem {
  id: string;
  title: string;
  whoMightBeHarmed: string;
  howMightBeHarmed: string;
  beforeLikelihood: number;
  beforeSeverity: number;
  beforeTotal: number;
  controlMeasures: { id: string; description: string }[];
  afterLikelihood: number;
  afterSeverity: number;
  afterTotal: number;
}

interface WorkingMethodItem {
  id: string;
  number: number;
  description: string;
}

interface FormData {
  name: string;
  location: string;
  assessor: string;
  selectedPPE: string[];
  guidelines: string;
  workingMethods: WorkingMethodItem[];
  hazards: HazardItem[];
}

export const submitForm = async (
  formData: FormData,
  assessmentToEdit: RiskAssessment | null | undefined,
  onSuccess: () => void,
  onClose: () => void
): Promise<void> => {
  // Validate all fields and collect errors
  const errors = validateAllFields(formData);

  // If there are any errors, display them all
  if (errors.length > 0) {
    throw new Error(errors.join('\n'));
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  // Prepare data for database
  const riskAssessmentData = {
    name: formData.name,
    location: formData.location,
    creation_date: new Date().toISOString(),
    assessor: formData.assessor,
    ppe: formData.selectedPPE,
    guidelines: formData.guidelines || null,
    working_methods: formData.workingMethods,
    hazards: formData.hazards,
    user_id: user.id,
    review_date: (() => {
      const date = new Date();
      date.setFullYear(date.getFullYear() + 1);
      return date.toISOString();
    })()
  };

  let error;
  if (assessmentToEdit) {
    // Update existing assessment
    ({ error } = await supabase
      .from('risk_assessments')
      .update(riskAssessmentData)
      .eq('id', assessmentToEdit.id));
  } else {
    // Create new assessment
    ({ error } = await supabase
      .from('risk_assessments')
      .insert([riskAssessmentData]));
  }

  if (error) {
    console.error('Database error details:', error);
    if (error.code === '23505') {
      throw new Error('A risk assessment with this name already exists');
    } else if (error.code === '23502') {
      throw new Error('Please fill in all required fields');
    } else {
      throw new Error(`Database error: ${error.message}${error.details ? ` - ${error.details}` : ''}`);
    }
  }
  
  onSuccess();
  onClose();
};
