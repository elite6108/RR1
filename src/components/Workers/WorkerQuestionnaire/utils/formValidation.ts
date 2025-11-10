import { FormData, FormStep } from '../types';

export const validateCurrentStep = (currentStep: FormStep, formData: FormData): string | null => {
  if (currentStep === 'declaration') {
    if (!formData.fullName.trim()) {
      return 'Please enter your full name';
    }
    if (!formData.digitalSignature.trim()) {
      return 'Please provide your digital signature';
    }
    if (!formData.confirmationChecked) {
      return 'Please confirm that the information provided is accurate';
    }
  }
  return null;
};

export const getInitialFormData = (): FormData => ({
  // Medical Declaration
  epilepsy: false,
  blackouts: false,
  diabetes: false,
  eyesight: false,
  colorBlindness: false,
  hearingImpairment: false,
  physicalDisability: false,
  arthritis: false,
  backProblems: false,
  hernia: false,
  hypertension: false,
  heartDisease: false,
  respiratoryDisease: false,
  medicalDetails: '',
  prescribedMedications: '',

  // Occupational Health History
  hazardousMaterialExposure: false,
  hazardousMaterialDetails: '',
  workRelatedHealthProblems: false,
  workRelatedHealthDetails: '',
  workRestrictions: false,
  workRestrictionsDetails: '',

  // Declaration
  fullName: '',
  digitalSignature: '',
  submissionDate: new Date().toISOString().split('T')[0],
  confirmationChecked: false,
});
