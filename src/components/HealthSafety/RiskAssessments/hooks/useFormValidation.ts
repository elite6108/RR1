import type { RiskAssessment } from '../../../../types/database';

interface HazardItem {
  id: string;
  title: string;
  whoMightBeHarmed: string;
  howMightBeHarmed: string;
  beforeLikelihood: number;
  beforeSeverity: number;
  beforeTotal: number;
  controlMeasures: { id: string; description: string }[];
  afterLikelihood: number;
  afterSeverity: number;
  afterTotal: number;
}

interface WorkingMethodItem {
  id: string;
  number: number;
  description: string;
}

interface FormData {
  name: string;
  location: string;
  assessor: string;
  selectedPPE: string[];
  guidelines: string;
  workingMethods: WorkingMethodItem[];
  hazards: HazardItem[];
}

type Screen = 'details' | 'ppe' | 'guidelines' | 'workingMethod' | 'hazards';

export const validateCurrentScreen = (currentScreen: Screen, formData: FormData): string | null => {
  switch (currentScreen) {
    case 'details':
      if (!formData.name.trim()) return 'Name is required';
      if (!formData.location.trim()) return 'Location is required';
      if (!formData.assessor.trim()) return 'Assessor name is required';
      break;
    case 'ppe':
      break;
    case 'workingMethod':
      if (formData.workingMethods.length === 0) return 'Please add at least one working method';
      break;
    case 'hazards':
      if (formData.hazards.length === 0) return 'Please add at least one hazard';
      // Validate each hazard
      for (const hazard of formData.hazards) {
        if (!hazard.title) return `Hazard title is required`;
        if (!hazard.whoMightBeHarmed) return `"Who might be harmed" is required`;
        if (!hazard.howMightBeHarmed) return `"How might they be harmed" is required`;
        if (hazard.beforeLikelihood < 1 || hazard.beforeSeverity < 1) return `Please set likelihood and severity ratings`;
        if (hazard.controlMeasures.length === 0) return `Please add at least one control measure`;
        if (hazard.afterLikelihood < 1 || hazard.afterSeverity < 1) return `Please set final likelihood and severity ratings`;
      }
      break;
  }
  return null;
};

export const validateAllFields = (formData: FormData): string[] => {
  const errors: string[] = [];

  if (!formData.name.trim()) {
    errors.push('Name is required');
  }
  if (!formData.location.trim()) {
    errors.push('Location is required');
  }
  if (!formData.assessor.trim()) {
    errors.push('Assessor name is required');
  }
  if (formData.workingMethods.length === 0) {
    errors.push('Please add at least one working method');
  }
  if (formData.hazards.length === 0) {
    errors.push('Please add at least one hazard');
  }
  
  // Validate each hazard
  for (const hazard of formData.hazards) {
    if (!hazard.title) {
      errors.push(`Hazard title is required for hazard #${formData.hazards.indexOf(hazard) + 1}`);
    }
    if (!hazard.whoMightBeHarmed) {
      errors.push(`"Who might be harmed" is required for hazard #${formData.hazards.indexOf(hazard) + 1}`);
    }
    if (!hazard.howMightBeHarmed) {
      errors.push(`"How might they be harmed" is required for hazard #${formData.hazards.indexOf(hazard) + 1}`);
    }
    if (hazard.beforeLikelihood < 1 || hazard.beforeSeverity < 1) {
      errors.push(`Please set likelihood and severity ratings for hazard #${formData.hazards.indexOf(hazard) + 1} (before control measures)`);
    }
    if (hazard.controlMeasures.length === 0) {
      errors.push(`Please add at least one control measure for hazard #${formData.hazards.indexOf(hazard) + 1}`);
    }
    if (hazard.afterLikelihood < 1 || hazard.afterSeverity < 1) {
      errors.push(`Please set likelihood and severity ratings for hazard #${formData.hazards.indexOf(hazard) + 1} (after control measures)`);
    }
  }

  return errors;
};
