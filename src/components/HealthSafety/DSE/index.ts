// Main components
export { DisplayScreenAssessment } from './DisplayScreenAssessment';
export { DSEForm } from './DSEForm';

// Sub-components
export { AdminModal } from './components/AdminModal';
export { AssessmentsTable } from './components/AssessmentsTable';

// Form step components
export {
  PersonalInfoStep,
  KeyboardStep,
  MouseStep,
  ScreenStep,
  VisionStep,
  FurnitureStep,
  EnvironmentStep,
  FeedbackStep,
  YesNoQuestion,
  ImageSelection,
} from './components/FormSteps';

// Hooks
export { useDSEAssessments } from './hooks/useDSEAssessments';
export { useDSEForm } from './hooks/useDSEForm';

// Types
export type {
  DSEAssessment,
  DSEFormData,
  ImageOption,
  AdminModalProps,
  AssessmentsTableProps,
  DSEFormProps,
  FormStepProps,
  YesNoQuestionProps,
  ImageSelectionProps,
  DSEHookResult,
  DSEFormHookResult,
  FormStep,
  StepConfig,
} from './types';

// Utils and constants
export {
  KEYBOARD_POSTURE_IMAGES,
  MOUSE_POSITION_IMAGES,
  CHAIR_POSTURE_IMAGES,
  FORM_STEPS,
  INITIAL_FORM_DATA,
  TIPS,
  EYE_TEST_INFO,
  TOTAL_STEPS,
  formatDate,
  getNextDueDate,
  getCurrentDate,
  getStepByNumber,
  isValidStep,
  calculateProgress,
} from './utils/constants';

export {
  createPdfViewerHtml,
  createIosPdfViewerHtml,
  showLoadingInNewWindow,
  generateFormattedFilename,
  isIOS,
  handlePdfGeneration,
} from './utils/pdfUtils';
