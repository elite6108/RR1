// Define the form data structure for Fatality forms
export interface FatalityFormData {
  // Form specific fields
  autoId: string;
  reportType: string;
  category: string;

  // Step 1 - Details
  incidentLocation: string;
  incidentDate: string;

  // Step 2 - Description
  incidentDescription: string;

  // Step 3 - Details of Injured Person
  injuredPersonName: string;
  injuredPersonAddress: string;
  injuredPersonPhone: string;
  injuredPersonPosition: string;
  timeLost: boolean;
  timeLostStartDate: string;
  timeLostEndDate: string;
  aeHospitalName: string;
  requiredPpe: string;
  wornPpe: string;

  // Step 4 - Location of Injury
  injuryLocations: string[];

  // Step 5 - Type of Injury
  injuryTypes: string[];

  // Step 6 - First Aid
  advisedMedical: boolean;
  drugAlcoholTest: boolean;
  firstAidDetails: string;

  // Step 7 - Health & Safety
  basicCause: string;

  // Step 8 - Root Causes
  rootCauseWorkEnvironment: string[];
  rootCauseHumanFactors: string[];
  rootCausePpe: string[];
  rootCauseManagement: string[];
  rootCausePlantEquipment: string[];

  // Step 9 - Actions
  actionsTaken: string;
  actions: { title: string; dueDate: string; description: string }[];
  file_urls: string[];
}

export interface FatalityFormProps {
  onClose?: () => void;
  initialData?: any;
  isEditing?: boolean;
}
