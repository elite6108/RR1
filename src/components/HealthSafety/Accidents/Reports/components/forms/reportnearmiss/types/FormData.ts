// Shared form data interface for both Near Miss and Dangerous Occurrence forms
export interface FormData {
  // Incident Details
  date: string;
  time: string;
  location: string;
  department: string;
  description: string;
  potentialSeverity: string;
  
  // Contributing Factors
  unsafeCondition: boolean;
  unsafeAct: boolean;
  equipmentFailure: boolean;
  lackOfProcedure: boolean;
  inadequateTraining: boolean;
  otherFactors: string;
  
  // Potential Consequences
  potentialInjuryType: string;
  potentialDamageType: string;
  potentialEnvironmentalImpact: string;
  
  // Reporting Information
  reportedBy: string;
  reportedDate: string;
  supervisorNotified: boolean;
  supervisorName: string;
  
  // Immediate Actions
  immediateActionsTaken: string;
  
  // Preventive Measures
  recommendedActions: string;
  responsiblePerson: string;
  targetCompletionDate: string;
  lessonLearned: string;

  // Form specific fields
  autoId: string;
  reportType: string;
  category: string;
  incidentLocation: string;
  incidentDate: string;
  incidentDescription: string;
  basicCause: string;
  sourceOfHazard: string;
  rootCauseWorkEnvironment: string[];
  rootCauseHumanFactors: string[];
  rootCausePpe: string[];
  rootCauseManagement: string[];
  rootCausePlantEquipment: string[];
  actionsTaken: string;
  actions: { title: string; dueDate: string; description: string }[];
  file_urls: string[];
}

export interface FormProps {
  onClose?: () => void;
  initialData?: any;
  isEditing?: boolean;
}

export interface ActionItem {
  title: string;
  dueDate: string;
  description: string;
}
