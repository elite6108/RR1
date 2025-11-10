import type { SectionConfig } from '../types';

// CPP Sections configuration
export const getSections = (cpp: any): SectionConfig[] => [
  { title: 'Site Information', data: cpp.site_information, fields: [
    'address',
    'siteManager',
    'siteManagerEmail',
    'siteManagerPhone',
    'principalDesigner',
    'principalDesignerEmail',
    'principalDesignerPhone',
    'principalDesignerCompany',
    'principalContractor',
    'principalContractorEmail',
    'principalContractorPhone',
    'principalContractorCompany',
    'accessRestrictions',
    'parkingArrangements',
    'existingEnvironment',
    'surroundingLandUse',
    'existingServices'
  ]},
  { title: 'Project Description', data: cpp.project_description, fields: [
    'workType',
    'description',
    'startDate',
    'endDate',
    'duration',
    'orderReference'
  ]},
  { title: 'Hours & Team', data: cpp.hours_team, fields: [
    'hours',
    'workingDays',
    'keyMembers'
  ]},
  { title: 'Management of Work', data: cpp.management_work, fields: [
    'healthAndSafetyAims',
    'supervisionArrangements',
    'trainingArrangements',
    'consultationArrangements'
  ]},
  { title: 'Management Structure', data: cpp.management_structure, fields: [
    'roles'
  ]},
  { title: 'Site Rules', data: cpp.site_rules, fields: [
    'generalRules',
    'ppeRequirements',
    'otherPPE',
    'permitToWork',
    'trafficManagement'
  ]},
  { title: 'Arrangements', data: cpp.arrangements, fields: [
    'items',
    'storage',
    'lighting',
    'security',
    'deliveries',
    'electricity'
  ]},
  { title: 'Site Induction', data: cpp.site_induction, fields: [
    'arrangements',
    'inductionTopics',
    'inductionProcess',
    'recordKeeping'
  ]},
  { title: 'Welfare Arrangements', data: cpp.welfare_arrangements, fields: [
    'other',
    'toilets',
    'restAreas',
    'dryingRooms',
    'drinking',
    'handwashing',
    'selectedOptions'
  ]},
  { title: 'First Aid Arrangements', data: cpp.first_aid_arrangements, fields: [
    'arrangements',
    'assemblyArea',
    'firstAiderName',
    'nearestMedical',
    'emergencySignal',
    'firstAiderPhone',
    'safetyManagerName',
    'safetyManagerPhone',
    'firstAidKitLocation',
    'fireEquipmentLocation'
  ]},
  { title: 'Rescue Plan', data: cpp.rescue_plan, fields: [
    'arrangements',
    'emergencyProcedures',
    'assemblyPoints',
    'contactNumbers'
  ]},
  { title: 'Specific Measures', data: cpp.specific_measures, fields: [
    'items'
  ]},
  { title: 'Hazard Identification', data: cpp.hazard_identification, fields: [
    'workingAtHeight',
    'scaffolding',
    'mewp',
    'demolitionAsbestos',
    'demolitionNoAsbestos',
    'excavations',
    'heavyMachinery',
    'concrete',
    'hotWorks',
    'temporarySupports',
    'handlingGlass',
    'hazardousSubstances',
    'crampedConditions',
    'confinedSpace'
  ]},
  { title: 'Hazards', data: cpp.hazards, fields: [
    'id',
    'title',
    'beforeTotal',
    'afterTotal',
    'beforeSeverity',
    'afterSeverity',
    'beforeLikelihood',
    'afterLikelihood',
    'controlMeasures',
    'howMightBeHarmed',
    'whoMightBeHarmed'
  ]},
  { title: 'High Risk Construction Work', data: cpp.high_risk_work, fields: [
    'activities',
    'selectedOptions'
  ]},
  { title: 'Notifiable Work', data: cpp.notifiable_work, fields: [
    'isNotifiable',
    'selectedOptions'
  ]},
  { title: 'Contractors', data: cpp.contractors, fields: [
    'companyName',
    'trade',
    'firstName',
    'lastName',
    'phone',
    'email'
  ]},
  { title: 'Monitoring & Review', data: cpp.monitoring, fields: [
    'cooperation',
    'recordKeeping',
    'reviewProcess',
    'riskArrangements',
    'responsiblePerson',
    'inspectionSchedule',
    'siteReviewFrequency',
    'toolboxTalkFrequency'
  ]}
];

// List of sections that should use the two-column layout
export const twoColumnSections = [
  'Site Information',
  'Project Description',
  'Hours & Team',
  'Management of Work',
  'Site Rules',
  'Arrangements',
  'Site Induction',
  'Welfare Arrangements',
  'First Aid Arrangements',
  'Rescue Plan',
  'Monitoring & Review',
  'Hazard Identification',
  'Notifiable Work',
  'High Risk Construction Work'
];
