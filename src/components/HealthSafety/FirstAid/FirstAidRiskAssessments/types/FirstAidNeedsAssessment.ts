// First Aid Needs Assessment specific types
export interface FirstAidNeedsAssessment {
  id?: string;
  // Step 1 - Basic Information
  assessmentId?: string;
  assessmentDate?: string;
  assessmentTitle?: string;
  assessorName?: string;
  
  // Step 2 - Business Information
  natureOfBusiness?: string;
  numberOfEmployees?: string;
  publicVisitPremises?: string;
  
  // Step 3 - Premises/Sites
  premisesSpreadOut?: string;
  premisesSpreadDetails?: string;
  differentRiskLevels?: string;
  riskLevelsDetails?: string;
  remoteFromEmergencyServices?: string;
  remoteServicesDetails?: string;
  employeesAtSharedSites?: string;
  sharedSitesDetails?: string;
  
  // Step 4 - Hazards Part 1
  lowLevelHazards?: string[];
  customHazards?: string[];
  
  // Step 5 - Hazards Part 2
  highLevelHazards?: string[];
  customHighLevelHazards?: string[];
  
  // Step 6 - Workers Part 1
  siteWorkersCount?: string;
  workerConditions?: string[];
  inexperiencedWorkers?: string;
  inexperiencedWorkersDetails?: string;
  ageRelatedRisks?: string;
  ageRelatedRisksDetails?: string;
  
  // Step 7 - Workers Part 2
  healthConditions?: string[];
  pregnantWorkers?: string;
  pregnantWorkersDetails?: string;
  childrenOrUnder18?: string;
  childrenOrUnder18Details?: string;
  firstAiderAbsenceArrangements?: string;
  employeesAtSharedSitesStep7?: string;
  employeesAtSharedSitesDetailsStep7?: string;
  
  // Step 8 - Mental Health
  mentalHealthIncidents?: string;
  mentalHealthSickLeave?: string;
  
  // Step 9 - Previous Injuries
  previousInjuriesAwareness?: string;
  injuryTypes?: string[];
  
  // Step 10 - Nearest Emergency Facilities
  nearestHospital?: string;
  aedInformation?: string;
  
  // Step 11 - First Aid Provisions
  hasAppointedPerson?: string;
  appointedPersonList?: Array<{ id: string; fullName: string; phone: string }>;
  hasEfawFirstAider?: string;
  efawFirstAiderList?: Array<{ id: string; fullName: string; phone: string }>;
  hasFawFirstAider?: string;
  fawFirstAiderList?: Array<{ id: string; fullName: string; phone: string }>;
  hasAdditionalTrainingFirstAider?: string;
  additionalTrainingFirstAiderList?: Array<{ id: string; fullName: string; phone: string }>;
  hasMentalHealthFirstAider?: string;
  mentalHealthFirstAiderList?: Array<{ id: string; fullName: string; phone: string }>;
  
  // Step 12 - First Aid Resources Part 1
  firstAidKitsRecommendations?: string;
  additionalKitContent?: string;
  additionalRecommendations?: string;
  
  // Step 13 - First Aid Resources Part 2
  resourceCategories?: string[];
  customResourceCategories?: Array<{ value: string; label: string; description: string; icon: any }>;
  
  // Step 14 - Additional Considerations
  additionalConsiderations?: string;
  reviewDate?: string;
  
  // Dynamic fields for hazard details, worker condition details, health condition details, injury details, and resource lists
  [key: string]: any;
  
  // Assessment complete - 14 steps total
  
  // Meta fields
  currentStep: number;
  completedSteps: number[];
  status: 'draft' | 'in_progress' | 'completed' | 'under_review';
  createdAt?: string;
  updatedAt?: string;
}

export interface FirstAidNeedsAssessmentFormData {
  [key: string]: any;
}

export interface FirstAidNeedsAssessmentStepProps {
  formData: FirstAidNeedsAssessmentFormData;
  errors: Record<string, string | undefined>;
  onDataChange: (data: Partial<FirstAidNeedsAssessmentFormData>) => void;
  onValidate?: () => { isValid: boolean; errors: Record<string, string | undefined> };
}

// Constants for step labels
export const FIRST_AID_NEEDS_ASSESSMENT_STEPS = [
  'Basic Information',
  'Workplace Details', 
  'Risk Assessment',
  'Staff Information',
  'Activity Assessment',
  'Location Analysis',
  'Equipment Review',
  'Training Requirements',
  'Emergency Procedures',
  'First Aid Provision',
  'Review & Monitoring',
  'Documentation',
  'Final Review'
] as const;