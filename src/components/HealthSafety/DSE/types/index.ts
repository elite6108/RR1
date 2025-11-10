export interface DSEAssessment {
  id: string;
  full_name: string;
  submitted_date: string;
  next_due_date: string;
  user_id: string;
}

export interface DSEFormData {
  full_name: string;
  keyboard_separate_from_screen: boolean | null;
  keyboard_tilt_legs: boolean | null;
  keyboard_posture: string;
  keyboard_comfortable: boolean | null;
  keyboard_characters_clear: boolean | null;
  mouse_position: string;
  wrist_forearm_support: boolean | null;
  mouse_smooth_speed: boolean | null;
  screen_characters_clear: boolean | null;
  screen_text_size_comfortable: boolean | null;
  screen_brightness_contrast_suitable: boolean | null;
  screen_swivel_tilt: boolean | null;
  screen_free_glare: boolean | null;
  vision_straining: boolean | null;
  desk_large_enough: boolean | null;
  reach_files_comfortably: boolean | null;
  chair_posture: string;
  chair_castor_wheels: boolean | null;
  chair_height_adjustment: boolean | null;
  chair_depth_adjustment: boolean | null;
  chair_lumbar_support: boolean | null;
  chair_adjustable_backrest: boolean | null;
  chair_adjustable_armrests: boolean | null;
  chair_backrest_support: boolean | null;
  forearms_horizontal: boolean | null;
  feet_flat_floor: boolean | null;
  room_change_position: boolean | null;
  lighting_suitable: boolean | null;
  heat_comfortable: boolean | null;
  noise_comfortable: boolean | null;
  experienced_discomfort: boolean | null;
  interested_eye_test: boolean | null;
  regular_breaks: boolean | null;
  notes: string;
}

export interface ImageOption {
  id: string;
  label: string;
}

export interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (password: string) => Promise<void>;
  loading: boolean;
  error: string;
}

export interface AssessmentsTableProps {
  assessments: DSEAssessment[];
  isAdminView: boolean;
  onViewAssessment: (assessment: DSEAssessment) => void;
  generatingPDF: boolean;
  loading: boolean;
}

export interface DSEFormProps {
  onClose: () => void;
}

export interface FormStepProps {
  formData: DSEFormData;
  setFormData: React.Dispatch<React.SetStateAction<DSEFormData>>;
}

export interface YesNoQuestionProps {
  label: string;
  value: boolean | null;
  onChange: (value: boolean) => void;
  tip?: string;
}

export interface ImageSelectionProps {
  label: string;
  images: ImageOption[];
  selectedImage: string;
  onChange: (imageId: string) => void;
  tip?: string;
}

export interface DSEHookResult {
  assessments: DSEAssessment[];
  loading: boolean;
  isAdminView: boolean;
  showAdminModal: boolean;
  adminPassword: string;
  passwordError: string;
  generatingPDF: boolean;
  setShowAdminModal: (show: boolean) => void;
  setAdminPassword: (password: string) => void;
  setPasswordError: (error: string) => void;
  handleAdminPasswordSubmit: (password: string) => Promise<void>;
  handleExitAdminView: () => void;
  handleViewAssessment: (assessment: DSEAssessment) => Promise<void>;
  fetchAssessments: () => Promise<void>;
  formatDate: (dateString: string) => string;
}

export interface DSEFormHookResult {
  currentStep: number;
  formData: DSEFormData;
  setCurrentStep: (step: number) => void;
  setFormData: React.Dispatch<React.SetStateAction<DSEFormData>>;
  handleSubmit: () => Promise<void>;
  fetchUserProfile: () => Promise<void>;
  renderYesNoQuestion: (
    label: string,
    value: boolean | null,
    onChange: (value: boolean) => void,
    tip?: string
  ) => JSX.Element;
  renderImageSelection: (
    label: string,
    images: ImageOption[],
    selectedImage: string,
    onChange: (imageId: string) => void,
    tip?: string
  ) => JSX.Element;
  getStepLabel: () => string;
}

export type FormStep = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export interface StepConfig {
  id: FormStep;
  title: string;
  label: string;
}
