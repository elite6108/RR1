import type { FirstAidNeedsAssessment } from '../types/FirstAidNeedsAssessment';
import { supabase } from '../../../../../lib/supabase';

/**
 * Converts camelCase field names to snake_case for database submission
 */
function camelToSnakeCase(str: string): string {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}

/**
 * Maps form field names to database column names
 */
export const FIELD_MAPPING: Record<string, string> = {
  // Step 1 - Basic Information
  assessmentId: 'assessment_id',
  assessmentDate: 'assessment_date',
  assessmentTitle: 'assessment_title',
  assessorName: 'assessor_name',
  
  // Step 2 - Business Information
  natureOfBusiness: 'nature_of_business',
  numberOfEmployees: 'number_of_employees',
  publicVisitPremises: 'public_visit_premises',
  
  // Step 3 - Premises/Sites
  premisesSpreadOut: 'premises_spread_out',
  premisesSpreadDetails: 'premises_spread_details',
  differentRiskLevels: 'different_risk_levels',
  riskLevelsDetails: 'risk_levels_details',
  remoteFromEmergencyServices: 'remote_from_emergency_services',
  remoteServicesDetails: 'remote_services_details',
  employeesAtSharedSites: 'employees_at_shared_sites',
  sharedSitesDetails: 'shared_sites_details',
  
  // Step 4 - Hazards Part 1
  lowLevelHazards: 'low_level_hazards',
  customHazards: 'custom_hazards',
  // Step 4 - Hazard Details
  chemicalsDetails: 'chemicals_details',
  confinedSpacesDetails: 'confined_spaces_details',
  electricalDetails: 'electrical_details',
  gasDetails: 'gas_details',
  manualHandlingDetails: 'manual_handling_details',
  slipsTripsDetails: 'slips_trips_details',
  hydrofluoricAcidDetails: 'hydrofluoric_acid_details',
  
  // Step 5 - Hazards Part 2
  highLevelHazards: 'high_level_hazards',
  customHighLevelHazards: 'custom_high_level_hazards',
  // Step 5 - High Level Hazard Details
  constructionDetails: 'construction_details',
  chemicalManufactureDetails: 'chemical_manufacture_details',
  warehousingDetails: 'warehousing_details',
  sharpInstrumentsDetails: 'sharp_instruments_details',
  heavyMachineryDetails: 'heavy_machinery_details',
  workAtHeightDetails: 'work_at_height_details',
  workplaceTransportDetails: 'workplace_transport_details',
  
  // Step 6 - Workers Part 1
  siteWorkersCount: 'site_workers_count',
  workerConditions: 'worker_conditions',
  inexperiencedWorkers: 'inexperienced_workers',
  inexperiencedWorkersDetails: 'inexperienced_workers_details',
  ageRelatedRisks: 'age_related_risks',
  ageRelatedRisksDetails: 'age_related_risks_details',
  // Step 6 - Worker Condition Details
  travelALotDetails: 'travel_a_lot_details',
  workRemotelyDetails: 'work_remotely_details',
  workAloneDetails: 'work_alone_details',
  workShiftsDetails: 'work_shifts_details',
  outOfHoursDetails: 'out_of_hours_details',
  othersDetails: 'others_details',
  
  // Step 7 - Workers Part 2
  healthConditions: 'health_conditions',
  pregnantWorkers: 'pregnant_workers',
  pregnantWorkersDetails: 'pregnant_workers_details',
  childrenOrUnder18: 'children_or_under_18',
  childrenOrUnder18Details: 'children_or_under_18_details',
  firstAiderAbsenceArrangements: 'first_aider_absence_arrangements',
  employeesAtSharedSitesStep7: 'employees_at_shared_sites_step7',
  employeesAtSharedSitesDetailsStep7: 'employees_at_shared_sites_details_step7',
  // Step 7 - Health Condition Details
  asthmaDetails: 'asthma_details',
  diabetesDetails: 'diabetes_details',
  severeAllergiesDetails: 'severe_allergies_details',
  epilepsyDetails: 'epilepsy_details',
  heartDiseaseDetails: 'heart_disease_details',
  otherDetails: 'other_health_details',
  
  // Step 8 - Mental Health
  mentalHealthIncidents: 'mental_health_incidents',
  mentalHealthSickLeave: 'mental_health_sick_leave',
  
  // Step 9 - Previous Injuries
  previousInjuriesAwareness: 'previous_injuries_awareness',
  injuryTypes: 'injury_types',
  // Step 9 - Injury Details
  brokenBoneDetails: 'broken_bone_details',
  bleedingDetails: 'bleeding_details',
  faintingDetails: 'fainting_details',
  burnDetails: 'burn_details',
  chokingDetails: 'choking_details',
  eyeInjuryDetails: 'eye_injury_details',
  poisoningDetails: 'poisoning_details',
  severeAllergicReactionDetails: 'severe_allergic_reaction_details',
  heartAttackDetails: 'heart_attack_details',
  strokeDetails: 'stroke_details',
  seizureDetails: 'seizure_details',
  asthmaAttackDetails: 'asthma_attack_details',
  diabeticEmergencyDetails: 'diabetic_emergency_details',
  otherInjuryDetails: 'other_injury_details',
  
  // Step 10 - Nearest Emergency Facilities
  nearestHospital: 'nearest_hospital',
  aedInformation: 'aed_information',
  
  // Step 11 - First Aid Provisions
  hasAppointedPerson: 'has_appointed_person',
  appointedPersonList: 'appointed_person_list',
  hasEfawFirstAider: 'has_efaw_first_aider',
  efawFirstAiderList: 'efaw_first_aider_list',
  hasFawFirstAider: 'has_faw_first_aider',
  fawFirstAiderList: 'faw_first_aider_list',
  hasAdditionalTrainingFirstAider: 'has_additional_training_first_aider',
  additionalTrainingFirstAiderList: 'additional_training_first_aider_list',
  hasMentalHealthFirstAider: 'has_mental_health_first_aider',
  mentalHealthFirstAiderList: 'mental_health_first_aider_list',
  
  // Step 12 - First Aid Resources Part 1
  firstAidKitsRecommendations: 'first_aid_kits_recommendations',
  additionalKitContent: 'additional_kit_content',
  additionalRecommendations: 'additional_recommendations',
  
  // Step 13 - First Aid Resources Part 2
  resourceCategories: 'resource_categories',
  customResourceCategories: 'custom_resource_categories',
  dampDustProofContainerResources: 'damp_dust_proof_container_resources',
  firstAidKitsResources: 'first_aid_kits_resources',
  travelFirstAidKitsResources: 'travel_first_aid_kits_resources',
  eyewashStationsResources: 'eyewash_stations_resources',
  defibrillatorResources: 'defibrillator_resources',
  emergencyShowerResources: 'emergency_shower_resources',
  firstAidRoomResources: 'first_aid_room_resources',
  
  // Step 14 - Additional Considerations
  additionalConsiderations: 'additional_considerations',
  reviewDate: 'review_date',
  
  // Meta fields
  currentStep: 'current_step',
  completedSteps: 'completed_steps',
  status: 'status',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  createdBy: 'created_by',
  updatedBy: 'updated_by'
};

/**
 * Transform form data from camelCase to snake_case for database submission
 */
export async function transformFormDataForDatabase(formData: FirstAidNeedsAssessment | Partial<FirstAidNeedsAssessment>): Promise<Record<string, any>> {
  const transformedData: Record<string, any> = {};
  const customResourcesData: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(formData)) {
    // Skip undefined values
    if (value === undefined) continue;
    
    // Handle custom resource fields (they end with 'Resources' and aren't in predefined mapping)
    if (key.endsWith('Resources') && !FIELD_MAPPING[key]) {
      // This is a custom resource field - store it in the custom_resources_data JSONB column
      customResourcesData[key] = value;
      continue;
    }
    
    // Handle custom hazard details (they contain 'custom_' and end with 'Details')
    if (key.includes('custom_') && key.endsWith('Details') && !FIELD_MAPPING[key]) {
      // Store custom hazard details in appropriate JSONB column
      if (key.includes('custom_high_')) {
        // This is a custom high-level hazard detail
        if (!transformedData.custom_high_level_hazard_details) {
          transformedData.custom_high_level_hazard_details = {};
        }
        transformedData.custom_high_level_hazard_details[key] = value;
      } else if (key.includes('custom_')) {
        // This is a custom low-level hazard detail
        if (!transformedData.custom_hazard_details) {
          transformedData.custom_hazard_details = {};
        }
        transformedData.custom_hazard_details[key] = value;
      }
      continue;
    }
    
    // Use explicit mapping if available, otherwise convert camelCase to snake_case
    const dbColumnName = FIELD_MAPPING[key] || camelToSnakeCase(key);
    transformedData[dbColumnName] = value;
  }
  
  // Add custom resources data if any were found
  if (Object.keys(customResourcesData).length > 0) {
    transformedData.custom_resources_data = customResourcesData;
  }
  
  // Add audit fields for RLS policy compliance
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      transformedData.created_by = user.id;
      transformedData.updated_by = user.id;
    }
  } catch (error) {
    console.error('Error getting user for audit fields:', error);
  }
  
  return transformedData;
}

/**
 * Transform database data from snake_case to camelCase for form consumption
 */
export function transformDatabaseDataForForm(dbData: Record<string, any>): FirstAidNeedsAssessment {
  const formData: FirstAidNeedsAssessment = {
    currentStep: 1,
    completedSteps: [],
    status: 'draft'
  };
  
  // Create reverse mapping
  const reversedMapping = Object.fromEntries(
    Object.entries(FIELD_MAPPING).map(([camelCase, snake_case]) => [snake_case, camelCase])
  );
  
  for (const [key, value] of Object.entries(dbData)) {
    // Skip undefined values
    if (value === undefined || value === null) continue;
    
    // Handle custom resources data
    if (key === 'custom_resources_data' && typeof value === 'object') {
      // Merge custom resources back into form data
      Object.assign(formData as any, value);
      continue;
    }
    
    // Handle custom hazard details
    if (key === 'custom_hazard_details' && typeof value === 'object') {
      // Merge custom hazard details back into form data
      Object.assign(formData as any, value);
      continue;
    }
    
    if (key === 'custom_high_level_hazard_details' && typeof value === 'object') {
      // Merge custom high-level hazard details back into form data
      Object.assign(formData as any, value);
      continue;
    }
    
    // Use explicit mapping if available, otherwise convert snake_case to camelCase
    const formFieldName = reversedMapping[key] || key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    (formData as any)[formFieldName] = value;
  }
  
  return formData;
}