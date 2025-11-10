// Define the form data structure for Utility Damage forms
export interface UtilityDamageFormData {
  // Form specific fields
  autoId: string;
  reportType: string;
  category: string;

  // Step 1 - Details
  incidentLocation: string;
  incidentDate: string;

  // Step 2 - Description
  incidentDescription: string;

  // Step 3 - Health & Safety
  sourceOfHazard: string;

  // Step 4 - Root Causes
  rootCauseWorkEnvironment: string[];
  rootCauseHumanFactors: string[];
  rootCausePpe: string[];
  rootCauseManagement: string[];
  rootCausePlantEquipment: string[];

  // Step 5 - Actions
  actionsTaken: string;
  actions: { title: string; dueDate: string; description: string }[];

  // Step 6 - Utility Damage Details
  damageDetails: string;
  costEstimate: string;
  utilityCompany: string;
  referenceNumber: string;

  // Step 7 - Documentation
  file_urls: string[];
}

export interface UtilityDamageFormProps {
  onClose?: () => void;
  initialData?: any;
  isEditing?: boolean;
}
