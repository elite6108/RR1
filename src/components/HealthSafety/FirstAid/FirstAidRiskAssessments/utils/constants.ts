export const ASSESSMENT_TYPE_OPTIONS = [
  { value: 'workplace', label: 'Workplace Assessment' },
  { value: 'activity', label: 'Activity-Based Assessment' },
  { value: 'emergency_procedure', label: 'Emergency Procedure Assessment' },
  { value: 'training', label: 'Training Assessment' }
] as const;

export const ASSESSMENT_STATUS_OPTIONS = [
  { value: 'draft', label: 'Draft' },
  { value: 'active', label: 'Active' },
  { value: 'under_review', label: 'Under Review' },
  { value: 'expired', label: 'Expired' }
] as const;

export const RISK_LEVEL_OPTIONS = [
  { value: 'low', label: 'Low', color: 'green' },
  { value: 'medium', label: 'Medium', color: 'yellow' },
  { value: 'high', label: 'High', color: 'orange' },
  { value: 'critical', label: 'Critical', color: 'red' }
] as const;

export const HAZARD_CATEGORY_OPTIONS = [
  { value: 'physical', label: 'Physical' },
  { value: 'chemical', label: 'Chemical' },
  { value: 'biological', label: 'Biological' },
  { value: 'ergonomic', label: 'Ergonomic' },
  { value: 'psychological', label: 'Psychological' }
] as const;

export const CONTROL_MEASURE_TYPES = [
  { value: 'elimination', label: 'Elimination', priority: 1 },
  { value: 'substitution', label: 'Substitution', priority: 2 },
  { value: 'engineering', label: 'Engineering Controls', priority: 3 },
  { value: 'administrative', label: 'Administrative Controls', priority: 4 },
  { value: 'ppe', label: 'Personal Protective Equipment', priority: 5 }
] as const;

export const FIRST_AID_REQUIREMENT_TYPES = [
  { value: 'first_aider', label: 'First Aider' },
  { value: 'equipment', label: 'Equipment' },
  { value: 'training', label: 'Training' },
  { value: 'facility', label: 'Facility' }
] as const;

export const SEVERITY_LEVELS = [
  { value: 1, label: 'Negligible', description: 'No injury or health effect' },
  { value: 2, label: 'Minor', description: 'Minor injury requiring basic first aid' },
  { value: 3, label: 'Moderate', description: 'Injury requiring medical treatment' },
  { value: 4, label: 'Major', description: 'Serious injury requiring hospitalization' },
  { value: 5, label: 'Catastrophic', description: 'Fatality or permanent disability' }
] as const;

export const LIKELIHOOD_LEVELS = [
  { value: 1, label: 'Rare', description: 'May occur in exceptional circumstances' },
  { value: 2, label: 'Unlikely', description: 'Could occur but not expected' },
  { value: 3, label: 'Possible', description: 'Might occur at some time' },
  { value: 4, label: 'Likely', description: 'Will probably occur' },
  { value: 5, label: 'Almost Certain', description: 'Expected to occur frequently' }
] as const;