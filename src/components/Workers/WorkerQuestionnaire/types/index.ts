export type FormStep = 'medicalDeclaration' | 'occupationalHistory' | 'declaration';

export interface MainQuestionnaireProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string;
  onSuccess?: () => void;
  isEditMode?: boolean;
}

export interface ShortQuestionnaireProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string;
  onScanQRCode?: () => void;
}

export interface FormData {
  // Medical Declaration
  epilepsy: boolean;
  blackouts: boolean;
  diabetes: boolean;
  eyesight: boolean;
  colorBlindness: boolean;
  hearingImpairment: boolean;
  physicalDisability: boolean;
  arthritis: boolean;
  backProblems: boolean;
  hernia: boolean;
  hypertension: boolean;
  heartDisease: boolean;
  respiratoryDisease: boolean;
  medicalDetails: string;
  prescribedMedications: string;

  // Occupational Health History
  hazardousMaterialExposure: boolean;
  hazardousMaterialDetails: string;
  workRelatedHealthProblems: boolean;
  workRelatedHealthDetails: string;
  workRestrictions: boolean;
  workRestrictionsDetails: string;

  // Declaration
  fullName: string;
  digitalSignature: string;
  submissionDate: string;
  confirmationChecked: boolean;
}

export interface MedicalCondition {
  key: keyof FormData;
  label: string;
  description?: string;
}

export interface StepComponentProps {
  formData: FormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onNext?: () => void;
  onPrevious?: () => void;
}

export interface SignatureCanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  onSignatureChange: (signature: string) => void;
}

export interface HealthCheckSubmission {
  user_id: string;
  user_email: string;
  submission_date: string;
  questionnaire_type: '6-month' | 'daily';
  // Medical Declaration fields
  epilepsy: boolean;
  blackouts: boolean;
  diabetes: boolean;
  eyesight: boolean;
  color_blindness: boolean;
  hearing_impairment: boolean;
  physical_disability: boolean;
  arthritis: boolean;
  back_problems: boolean;
  hernia: boolean;
  hypertension: boolean;
  heart_disease: boolean;
  respiratory_disease: boolean;
  medical_details: string;
  prescribed_medications: string;
  // Occupational Health History
  hazardous_material_exposure: boolean;
  hazardous_material_details: string;
  work_related_health_problems: boolean;
  work_related_health_details: string;
  work_restrictions: boolean;
  work_restrictions_details: string;
  // Declaration
  full_name: string;
  digital_signature: string;
  confirmation_checked: boolean;
}
