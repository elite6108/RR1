import type { FirstAidNeedsAssessment } from '../../../../components/HealthSafety/FirstAid/FirstAidRiskAssessments/types/FirstAidNeedsAssessment';
import type { FirstAidSection, ProcessedFirstAidData, ResourceItem, CustomResourceCategory } from '../types';

/**
 * Formats a list of hazard names only
 */
function formatHazardNames(predefinedHazards: string[], customHazards: string[]): string {
  const allHazards = [...predefinedHazards, ...customHazards];
  if (allHazards.length === 0) return 'None specified';
  return allHazards.map(hazard => toSentenceCase(hazard)).join('\n');
}

/**
 * Formats hazard details for low-level hazards
 */
function formatLowLevelHazardDetails(data: FirstAidNeedsAssessment): string {
  const details: string[] = [];
  
  // Predefined low-level hazard details
  const lowLevelHazards = data.low_level_hazards || data.lowLevelHazards || [];
  lowLevelHazards.forEach((hazard: string) => {
    const detailValue = data[`${hazard}_details` as keyof FirstAidNeedsAssessment] || data[`${hazard}Details` as keyof FirstAidNeedsAssessment] as string;
    if (detailValue) {
      details.push(`${toSentenceCase(hazard)}: ${detailValue}`);
    }
  });
  
  // Handle hydrofluoric acid details specifically
  if (data.hydrofluoric_acid_details) {
    details.push(`Hydrofluoric acid: ${data.hydrofluoric_acid_details}`);
  }
  
  // Custom low-level hazard details
  const customHazards = data.custom_hazards || data.customHazards || [];
  customHazards.forEach((hazard: string) => {
    const detailsKey = `custom_${hazard.replace(/\s+/g, '_').toLowerCase()}Details`;
    const altDetailsKey = `custom${hazard.replace(/\s+/g, '').toLowerCase()}Details`;
    const detailValue = data[detailsKey as keyof FirstAidNeedsAssessment] || data[altDetailsKey as keyof FirstAidNeedsAssessment] as string;
    if (detailValue) {
      details.push(`${toSentenceCase(hazard)}: ${detailValue}`);
    } else {
        // Fallback for jsonb custom hazard details
        const customDetails = data.custom_hazard_details || data.customHazardDetails;
        if(customDetails && typeof customDetails === 'object' && (customDetails[detailsKey] || customDetails[altDetailsKey])){
             details.push(`${toSentenceCase(hazard)}: ${customDetails[detailsKey] || customDetails[altDetailsKey]}`);
        }
    }
  });
  
  return details.length > 0 ? details.join('\n') : 'No details provided';
}

/**
 * Formats hazard details for high-level hazards
 */
function formatHighLevelHazardDetails(data: FirstAidNeedsAssessment): string {
  const details: string[] = [];
  
  // Predefined high-level hazard details
  const highLevelHazards = data.high_level_hazards || data.highLevelHazards || [];
  highLevelHazards.forEach((hazard: string) => {
    const detailValue = data[`${hazard}_details` as keyof FirstAidNeedsAssessment] || data[`${hazard}Details` as keyof FirstAidNeedsAssessment] as string;
    if (detailValue) {
      details.push(`${toSentenceCase(hazard)}: ${detailValue}`);
    }
  });
  
  // Custom high-level hazard details from JSONB
  const customHighLevelHazardDetails = data.custom_high_level_hazard_details || data.customHighLevelHazardDetails;
  if (customHighLevelHazardDetails && typeof customHighLevelHazardDetails === 'object') {
    Object.entries(customHighLevelHazardDetails).forEach(([key, value]) => {
      if (value && typeof value === 'string') {
        // Remove "Details" suffix first
        let hazardName = key.replace(/Details$/, '');
        // Remove the "custom_high_" prefix
        hazardName = hazardName.replace(/^custom_high_/, '');
        // Replace underscores with spaces
        hazardName = hazardName.replace(/_/g, ' ');
        details.push(`${toSentenceCase(hazardName)}: ${value}`);
      }
    });
  }

  // Also handle direct custom high-level hazard details from the form
  const customHighLevelHazards = data.customHighLevelHazards || data.custom_high_level_hazards || [];
  customHighLevelHazards.forEach((hazard: string) => {
    const detailsKey = `custom_high_${hazard.replace(/\s+/g, '_').toLowerCase()}Details`;
    const detailValue = data[detailsKey as keyof FirstAidNeedsAssessment] as string;
    if (detailValue) {
      details.push(`${toSentenceCase(hazard)}: ${detailValue}`);
    }
  });
  
  return details.length > 0 ? details.join('\n') : 'No details provided';
}

/**
 * Formats a list of personnel for display
 */
export function formatPersonnelList(personnel: Array<{ id: string; fullName: string; phone: string }>): string {
  if (!personnel || personnel.length === 0) return 'None appointed';
  
  return personnel
    .map(person => `${person.fullName} (${person.phone})`)
    .join('\n');
}

/**
 * Formats an array of strings into a readable list with sentence case
 */
export function formatStringArray(items: string[]): string {
  if (!items || items.length === 0) return 'None specified';
  return items.map(item => toSentenceCase(item)).join(', ');
}

/**
 * Converts text to sentence case while properly handling camelCase conversion.
 */
export function toSentenceCase(text: string): string {
  if (!text) return text;

  // Handle numeric ranges
  if (/^\d+-\d+$/.test(text) || /^\d+\+$/.test(text)) {
    return text;
  }
  
  let processedText = text;

  // Handle camelCase by inserting spaces before capital letters
  if (/[a-z]/.test(processedText) && /[A-Z]/.test(processedText)) {
    processedText = processedText.replace(/([a-z])([A-Z])/g, '$1 $2');
  }

  // Handle snake_case and slug-case by replacing underscores/hyphens with spaces
  processedText = processedText.replace(/_|-/g, ' ');

  // Capitalize the first letter and lowercase the rest of the string
  return processedText.charAt(0).toUpperCase() + processedText.slice(1).toLowerCase();
}

/**
 * Formats yes/no responses with details
 */
export function formatYesNoWithDetails(response: string, details?: string): string {
  if (!response) return 'Not specified';
  
  let result = toSentenceCase(response);
  if (details && response.toLowerCase() === 'yes') {
    result += `\nDetails: ${details}`;
  }
  return result;
}

/**
 * Processes the FirstAidNeedsAssessment data into sections for PDF generation
 */
export function processFirstAidAssessmentData(data: FirstAidNeedsAssessment): ProcessedFirstAidData {
  const sections: FirstAidSection[] = [];

  // Step 2 - Business Information
  sections.push({
    id: 'business-info',
    title: 'Business Information',
    content: [
      `Nature of business: ${data.natureOfBusiness || 'Not specified'}`,
      `Number of employees: ${data.numberOfEmployees || 'Not specified'}`,
      `Do members of the public visit your premises?: ${toSentenceCase(data.publicVisitPremises || 'Not specified')}`
    ].join('\n\n'),
    type: 'text'
  });

  // Step 3 - Premises/Sites
  const premisesResponse = data.premisesSpreadOut || '';
  let premisesFormattedResponse = toSentenceCase(premisesResponse);
  if (data.premisesSpreadDetails && premisesResponse.toLowerCase() !== 'none') {
    premisesFormattedResponse += `\nDetails: ${data.premisesSpreadDetails}`;
  }

  sections.push({
    id: 'premises-sites',
    title: 'Premises and Sites Assessment',
    content: [
      `Are the premises of your workplace spread out, e.g are there several buildings on the site or multi-floor buildings?: ${premisesFormattedResponse}`,
      `Does your workplace contain areas with different risk levels, an office and a factory?: ${formatYesNoWithDetails(data.differentRiskLevels || '', data.riskLevelsDetails)}`,
      `Is your workplace remote from emergency medical services?: ${formatYesNoWithDetails(data.remoteFromEmergencyServices || '', data.remoteServicesDetails)}`,
      `Do any of your employees work at sites occupied by other employers?: ${formatYesNoWithDetails(data.employeesAtSharedSites || '', data.sharedSitesDetails)}`
    ].join('\n\n'),
    type: 'text'
  });

  // Step 4 & 5 - Hazards
  const lowLevelHazards = data.low_level_hazards || data.lowLevelHazards || [];
  const customLowLevelHazards = data.custom_hazards || data.customHazards || [];
  const highLevelHazards = data.high_level_hazards || data.highLevelHazards || [];
  const customHighLevelHazards = data.custom_high_level_hazards || data.customHighLevelHazards || [];

  sections.push({
    id: 'hazards',
    title: 'Identified Hazards',
    content: [
      `Does your workplace have low-level hazards such as those that might be found in office and shops?: ${formatHazardNames(lowLevelHazards, customLowLevelHazards)}`,
      `Provide details of how you will account for this in your first aid provision: ${formatLowLevelHazardDetails(data)}`,
      `Does your workplace have high-level hazards such as those that might be found in a factory?: ${formatHazardNames(highLevelHazards, customHighLevelHazards)}`,
      `Provide details of how you will account for this in your first aid provision: ${formatHighLevelHazardDetails(data)}`
    ].join('\n\n'),
    type: 'text'
  });

  // Step 6 & 7 - Workers
  const workerConditionDetails: string[] = [];
  
  // Add specific worker condition details
  if (data.travelALotDetails || data.travel_a_lot_details) workerConditionDetails.push(`Travel a lot: ${data.travelALotDetails || data.travel_a_lot_details}`);
  if (data.workRemotelyDetails || data.work_remotely_details) workerConditionDetails.push(`Work remotely: ${data.workRemotelyDetails || data.work_remotely_details}`);
  if (data.workAloneDetails || data.work_alone_details) workerConditionDetails.push(`Work alone: ${data.workAloneDetails || data.work_alone_details}`);
  if (data.workShiftsDetails || data.work_shifts_details) workerConditionDetails.push(`Work shifts: ${data.workShiftsDetails || data.work_shifts_details}`);
  if (data.outOfHoursDetails || data.out_of_hours_details) workerConditionDetails.push(`Out of hours: ${data.outOfHoursDetails || data.out_of_hours_details}`);
  if (data.othersDetails || data.others_details) workerConditionDetails.push(`Others: ${data.othersDetails || data.others_details}`);
  
  // Add health condition details
  const healthConditionDetails: string[] = [];
  if (data.asthmaDetails || data.asthma_details) healthConditionDetails.push(`Asthma: ${data.asthmaDetails || data.asthma_details}`);
  if (data.diabetesDetails || data.diabetes_details) healthConditionDetails.push(`Diabetes: ${data.diabetesDetails || data.diabetes_details}`);
  if (data.severeAllergiesDetails || data.severe_allergies_details) healthConditionDetails.push(`Severe allergies: ${data.severeAllergiesDetails || data.severe_allergies_details}`);
  if (data.epilepsyDetails || data.epilepsy_details) healthConditionDetails.push(`Epilepsy: ${data.epilepsyDetails || data.epilepsy_details}`);
  if (data.heartDiseaseDetails || data.heart_disease_details) healthConditionDetails.push(`Heart disease: ${data.heartDiseaseDetails || data.heart_disease_details}`);
  if (data.otherHealthDetails || data.other_health_details) healthConditionDetails.push(`Other health conditions: ${data.otherHealthDetails || data.other_health_details}`);
  
  sections.push({
    id: 'workers',
    title: 'Workers Assessment',
    content: [
      `How many people work at the site?: ${toSentenceCase(data.siteWorkersCount || data.site_workers_count || 'Not specified')}`,
      `Do you have employees who travel a lot, work remotely, work alone, work shifts, or work out of hours?: ${formatStringArray(data.workerConditions || data.worker_conditions || [])}`,
      workerConditionDetails.length > 0 ? `Worker condition details:\n${workerConditionDetails.join('\n')}` : '',
      `Is there any inexperienced workers on site?: ${formatYesNoWithDetails(data.inexperiencedWorkers || data.inexperienced_workers || '', data.inexperiencedWorkersDetails || data.inexperienced_workers_details)}`,
      `Does the age of any of your workers increase your risk of a first aid incident?: ${formatYesNoWithDetails(data.ageRelatedRisks || data.age_related_risks || '', data.ageRelatedRisksDetails || data.age_related_risks_details)}`,
      `Any employees with disabilities, or health problems?: ${formatStringArray(data.healthConditions || data.health_conditions || [])}`,
      healthConditionDetails.length > 0 ? `Health condition details:\n${healthConditionDetails.join('\n')}` : '',
      `Is there any pregnant workers on site?: ${formatYesNoWithDetails(data.pregnantWorkers || data.pregnant_workers || '', data.pregnantWorkersDetails || data.pregnant_workers_details)}`,
      `Are there children in the workplace or any workers under 18?: ${formatYesNoWithDetails(data.childrenOrUnder18 || data.children_or_under_18 || '', data.childrenOrUnder18Details || data.children_or_under_18_details)}`,
      `What arrangements do you have to cover first aider absence such as sickness or holidays?: ${toSentenceCase(data.firstAiderAbsenceArrangements || data.first_aider_absence_arrangements || 'Not specified')}`,
      `Do any of your employees work at sites occupied by other employers?: ${formatYesNoWithDetails(data.employeesAtSharedSitesStep7 || data.employees_at_shared_sites_step7 || '', data.employeesAtSharedSitesDetailsStep7 || data.employees_at_shared_sites_details_step7)}`
    ].filter(content => content).join('\n\n'),
    type: 'text'
  });

  // Step 8 - Mental Health
  sections.push({
    id: 'mental-health',
    title: 'Mental Health Assessment',
    content: [
      `Have there been any mental health related incidents in your workplace?: ${toSentenceCase(data.mentalHealthIncidents || data.mental_health_incidents || 'Not specified')}`,
      `Have you had employees take sick leave due to mental health issues?: ${toSentenceCase(data.mentalHealthSickLeave || data.mental_health_sick_leave || 'Not specified')}`
    ].join('\n\n'),
    type: 'text'
  });

  // Step 9 - Previous Injuries
  const injuryDetails: string[] = [];
  
  // Add specific injury details
  if (data.brokenBoneDetails || data.broken_bone_details) injuryDetails.push(`Broken bone: ${data.brokenBoneDetails || data.broken_bone_details}`);
  if (data.bleedingDetails || data.bleeding_details) injuryDetails.push(`Bleeding: ${data.bleedingDetails || data.bleeding_details}`);
  if (data.faintingDetails || data.fainting_details) injuryDetails.push(`Fainting: ${data.faintingDetails || data.fainting_details}`);
  if (data.burnDetails || data.burn_details) injuryDetails.push(`Burn: ${data.burnDetails || data.burn_details}`);
  if (data.chokingDetails || data.choking_details) injuryDetails.push(`Choking: ${data.chokingDetails || data.choking_details}`);
  if (data.eyeInjuryDetails || data.eye_injury_details) injuryDetails.push(`Eye injury: ${data.eyeInjuryDetails || data.eye_injury_details}`);
  if (data.poisoningDetails || data.poisoning_details) injuryDetails.push(`Poisoning: ${data.poisoningDetails || data.poisoning_details}`);
  if (data.severeAllergicReactionDetails || data.severe_allergic_reaction_details) injuryDetails.push(`Severe allergic reaction: ${data.severeAllergicReactionDetails || data.severe_allergic_reaction_details}`);
  if (data.heartAttackDetails || data.heart_attack_details) injuryDetails.push(`Heart attack: ${data.heartAttackDetails || data.heart_attack_details}`);
  if (data.strokeDetails || data.stroke_details) injuryDetails.push(`Stroke: ${data.strokeDetails || data.stroke_details}`);
  if (data.seizureDetails || data.seizure_details) injuryDetails.push(`Seizure: ${data.seizureDetails || data.seizure_details}`);
  if (data.asthmaAttackDetails || data.asthma_attack_details) injuryDetails.push(`Asthma attack: ${data.asthmaAttackDetails || data.asthma_attack_details}`);
  if (data.diabeticEmergencyDetails || data.diabetic_emergency_details) injuryDetails.push(`Diabetic emergency: ${data.diabeticEmergencyDetails || data.diabetic_emergency_details}`);
  if (data.otherInjuryDetails || data.other_injury_details) injuryDetails.push(`Other injuries: ${data.otherInjuryDetails || data.other_injury_details}`);
  
  sections.push({
    id: 'previous-injuries',
    title: 'Previous Injuries Assessment',
    content: [
      `Are you aware of any previous injuries or health problems that have occurred in your workplace?: ${toSentenceCase(data.previousInjuriesAwareness || data.previous_injuries_awareness || 'Not specified')}`,
      `Types of injuries that have occurred: ${formatStringArray(data.injuryTypes || data.injury_types || [])}`,
      injuryDetails.length > 0 ? `Injury details:\n${injuryDetails.join('\n')}` : ''
    ].filter(content => content).join('\n\n'),
    type: 'text'
  });

  // Step 10 - Emergency Facilities
  sections.push({
    id: 'emergency-facilities',
    title: 'Nearest Emergency Facilities',
    content: [
      `What is the nearest hospital or emergency medical facility?: ${toSentenceCase(data.nearestHospital || data.nearest_hospital || 'Not specified')}`,
      `Do you have an AED (Automated External Defibrillator) on site?: ${toSentenceCase(data.aedInformation || data.aed_information || 'Not specified')}`
    ].join('\n\n'),
    type: 'text'
  });

  // Step 11 - First Aid Provisions
  const firstAidPersonnel: string[] = [];
  
  const hasAppointedPerson = data.hasAppointedPerson || data.has_appointed_person;
  const appointedPersonList = data.appointedPersonList || data.appointed_person_list;
  if ((hasAppointedPerson === 'Yes' || hasAppointedPerson === 'yes') && appointedPersonList) {
    firstAidPersonnel.push(`Do you have appointed persons?: Yes\nAppointed persons:\n${formatPersonnelList(appointedPersonList)}`);
  } else {
    firstAidPersonnel.push(`Do you have appointed persons?: ${toSentenceCase(hasAppointedPerson || 'No')}`);
  }
  
  const hasEfawFirstAider = data.hasEfawFirstAider || data.has_efaw_first_aider;
  const efawFirstAiderList = data.efawFirstAiderList || data.efaw_first_aider_list;
  if ((hasEfawFirstAider === 'Yes' || hasEfawFirstAider === 'yes') && efawFirstAiderList) {
    firstAidPersonnel.push(`Do you have EFAW (Emergency First Aid at Work) first aiders?: Yes\nEFAW first aiders:\n${formatPersonnelList(efawFirstAiderList)}`);
  } else {
    firstAidPersonnel.push(`Do you have EFAW (Emergency First Aid at Work) first aiders?: ${toSentenceCase(hasEfawFirstAider || 'No')}`);
  }
  
  const hasFawFirstAider = data.hasFawFirstAider || data.has_faw_first_aider;
  const fawFirstAiderList = data.fawFirstAiderList || data.faw_first_aider_list;
  if ((hasFawFirstAider === 'Yes' || hasFawFirstAider === 'yes') && fawFirstAiderList) {
    firstAidPersonnel.push(`Do you have FAW (First Aid at Work) first aiders?: Yes\nFAW first aiders:\n${formatPersonnelList(fawFirstAiderList)}`);
  } else {
    firstAidPersonnel.push(`Do you have FAW (First Aid at Work) first aiders?: ${toSentenceCase(hasFawFirstAider || 'No')}`);
  }
  
  const hasAdditionalTrainingFirstAider = data.hasAdditionalTrainingFirstAider || data.has_additional_training_first_aider;
  const additionalTrainingFirstAiderList = data.additionalTrainingFirstAiderList || data.additional_training_first_aider_list;
  if ((hasAdditionalTrainingFirstAider === 'Yes' || hasAdditionalTrainingFirstAider === 'yes') && additionalTrainingFirstAiderList) {
    firstAidPersonnel.push(`Do you have first aiders with additional training?: Yes\nFirst aiders with additional training:\n${formatPersonnelList(additionalTrainingFirstAiderList)}`);
  } else {
    firstAidPersonnel.push(`Do you have first aiders with additional training?: ${toSentenceCase(hasAdditionalTrainingFirstAider || 'No')}`);
  }
  
  const hasMentalHealthFirstAider = data.hasMentalHealthFirstAider || data.has_mental_health_first_aider;
  const mentalHealthFirstAiderList = data.mentalHealthFirstAiderList || data.mental_health_first_aider_list;
  if ((hasMentalHealthFirstAider === 'Yes' || hasMentalHealthFirstAider === 'yes') && mentalHealthFirstAiderList) {
    firstAidPersonnel.push(`Do you have mental health first aiders?: Yes\nMental health first aiders:\n${formatPersonnelList(mentalHealthFirstAiderList)}`);
  } else {
    firstAidPersonnel.push(`Do you have mental health first aiders?: ${toSentenceCase(hasMentalHealthFirstAider || 'No')}`);
  }

  sections.push({
    id: 'first-aid-provisions',
    title: 'First Aid Provisions',
    content: firstAidPersonnel.join('\n\n'),
    type: 'text'
  });

  // Step 12 & 13 - First Aid Resources
  const resourceDetails: string[] = [];
  
  // Add resource details for each category
  const dampDustProofContainerResources = data.damp_dust_proof_container_resources || data.dampDustProofContainerResources || [];
  if (dampDustProofContainerResources.length > 0) {
    const resources = dampDustProofContainerResources.map((r: ResourceItem) => `  - Location: ${r.location}, Responsible: ${r.personResponsible}`).join('\n');
    resourceDetails.push(`Damp/Dust Proof Container:\n${resources}`);
  }
  
  const firstAidKitsResources = data.first_aid_kits_resources || data.firstAidKitsResources || [];
  if (firstAidKitsResources.length > 0) {
    const resources = firstAidKitsResources.map((r: ResourceItem) => `  - Location: ${r.location}, Responsible: ${r.personResponsible}`).join('\n');
    resourceDetails.push(`First Aid Kits:\n${resources}`);
  }
  
  const travelFirstAidKitsResources = data.travel_first_aid_kits_resources || data.travelFirstAidKitsResources || [];
  if (travelFirstAidKitsResources.length > 0) {
    const resources = travelFirstAidKitsResources.map((r: ResourceItem) => `  - Location: ${r.location}, Responsible: ${r.personResponsible}`).join('\n');
    resourceDetails.push(`Travel First Aid Kits:\n${resources}`);
  }
  
  const eyewashStationsResources = data.eyewash_stations_resources || data.eyewashStationsResources || [];
  if (eyewashStationsResources.length > 0) {
    const resources = eyewashStationsResources.map((r: ResourceItem) => `  - Location: ${r.location}, Responsible: ${r.personResponsible}`).join('\n');
    resourceDetails.push(`Eyewash Stations:\n${resources}`);
  }
  
  const defibrillatorResources = data.defibrillator_resources || data.defibrillatorResources || [];
  if (defibrillatorResources.length > 0) {
    const resources = defibrillatorResources.map((r: ResourceItem) => `  - Location: ${r.location}, Responsible: ${r.personResponsible}`).join('\n');
    resourceDetails.push(`Defibrillator:\n${resources}`);
  }
  
  const emergencyShowerResources = data.emergency_shower_resources || data.emergencyShowerResources || [];
  if (emergencyShowerResources.length > 0) {
    const resources = emergencyShowerResources.map((r: ResourceItem) => `  - Location: ${r.location}, Responsible: ${r.personResponsible}`).join('\n');
    resourceDetails.push(`Emergency Shower:\n${resources}`);
  }
  
  const firstAidRoomResources = data.first_aid_room_resources || data.firstAidRoomResources || [];
  if (firstAidRoomResources.length > 0) {
    const resources = firstAidRoomResources.map((r: ResourceItem) => `  - Location: ${r.location}, Responsible: ${r.personResponsible}`).join('\n');
    resourceDetails.push(`First Aid Room:\n${resources}`);
  }
  
  // Handle custom resources
  const customResourcesData = data.custom_resources_data || data.customResourcesData;
  if (customResourcesData && typeof customResourcesData === 'object') {
    Object.entries(customResourcesData).forEach(([key, resources]) => {
      if (Array.isArray(resources) && resources.length > 0) {
        const resourceName = key.replace(/Resources$/, '').replace(/([A-Z])/g, ' $1').trim();
        const resourceList = resources.map((r: ResourceItem) => `  - Location: ${r.location}, Responsible: ${r.personResponsible}`).join('\n');
        resourceDetails.push(`${toSentenceCase(resourceName)}:\n${resourceList}`);
      }
    });
  }
  
  // Handle custom resource categories
  const customResourceCategories = data.custom_resource_categories || data.customResourceCategories || [];
  const customCategoryNames = customResourceCategories.map((cat: CustomResourceCategory) => cat.label).join(', ');
  
  sections.push({
    id: 'first-aid-resources',
    title: 'First Aid Resources',
    content: [
      `First aid kit recommendations: ${toSentenceCase(data.firstAidKitsRecommendations || data.first_aid_kits_recommendations || 'Not specified')}`,
      `Additional kit content recommendations: ${toSentenceCase(data.additionalKitContent || data.additional_kit_content || 'Not specified')}`,
      `Additional recommendations: ${toSentenceCase(data.additionalRecommendations || data.additional_recommendations || 'Not specified')}`,
      `Resource categories selected: ${formatStringArray(data.resourceCategories || data.resource_categories || [])}`,
      customCategoryNames ? `Custom resource categories: ${customCategoryNames}` : '',
      resourceDetails.length > 0 ? `\nResource Details:\n${resourceDetails.join('\n\n')}` : ''
    ].filter(content => content).join('\n\n'),
    type: 'text'
  });

  // Step 14 - Additional Considerations
  sections.push({
    id: 'additional-considerations',
    title: 'Additional Considerations',
    content: [
      `Are there any additional considerations for your first aid needs assessment?: ${toSentenceCase(data.additionalConsiderations || data.additional_considerations || 'None specified')}`
    ].join('\n\n'),
    type: 'text'
  });

  return {
    basicInfo: {
      assessmentId: data.assessmentId || data.assessment_id || 'Not specified',
      assessmentDate: data.assessmentDate || data.assessment_date || new Date().toLocaleDateString(),
      assessmentTitle: data.assessmentTitle || data.assessment_title || 'First Aid Needs Assessment',
      assessorName: data.assessorName || data.assessor_name || 'Not specified',
      reviewDate: data.reviewDate || data.review_date || 'Not specified',
      assessorPosition: data.assessorPosition || data.assessor_position || 'Not specified',
      organizationName: data.organizationName || data.organization_name || 'Not specified'
    },
    businessInfo: {
       natureOfBusiness: data.natureOfBusiness || data.nature_of_business || 'Not specified',
       numberOfEmployees: data.numberOfEmployees || data.number_of_employees || 'Not specified',
       publicVisitPremises: data.publicVisitPremises || data.public_visit_premises || 'Not specified'
    },
    sections
  };
}

/**
 * Generates a unique assessment ID if one doesn't exist
 */
export function generateAssessmentId(): string {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `FA-${timestamp}-${randomStr}`.toUpperCase();
}