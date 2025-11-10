// Define the form data structure for Environmental forms
export interface EnvironmentalFormData {
  // Form specific fields
  autoId: string;
  reportType: string;
  category: string;

  // Step 1 - Details
  incidentLocation: string;
  incidentDate: string;

  // Step 2 - Description
  incidentDescription: string;

  // Step 3 - Environmental Incident
  environmentalIncidentType: string;
  severityOfIncident: string;

  // Step 4 - Root Causes
  rootCauseWorkEnvironment: string[];
  rootCauseHumanFactors: string[];
  rootCausePpe: string[];
  rootCauseManagement: string[];
  rootCausePlantEquipment: string[];

  // Step 5 - Actions
  actionsTaken: string;
  actions: { title: string; dueDate: string; description: string }[];

  // Step 6 - Documentation
  file_urls: string[];

  // Legacy fields for compatibility
  basicCause: string;
  sourceOfHazard: string;

  // Additional legacy fields from original form
  date: string;
  time: string;
  location: string;
  department: string;
  description: string;
  potentialSeverity: string;
  unsafeCondition: boolean;
  unsafeAct: boolean;
  equipmentFailure: boolean;
  lackOfProcedure: boolean;
  inadequateTraining: boolean;
  otherFactors: string;
  potentialInjuryType: string;
  potentialDamageType: string;
  potentialEnvironmentalImpact: string;
  reportedBy: string;
  reportedDate: string;
  supervisorNotified: boolean;
  supervisorName: string;
  immediateActionsTaken: string;
  recommendedActions: string;
  responsiblePerson: string;
  targetCompletionDate: string;
  lessonLearned: string;
}

export interface EnvironmentalFormProps {
  onClose?: () => void;
  initialData?: any;
  isEditing?: boolean;
}
