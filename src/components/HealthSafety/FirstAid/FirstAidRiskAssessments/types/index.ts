export interface FirstAidRiskAssessment {
  id: string;
  title: string;
  description?: string;
  assessmentType: 'workplace' | 'activity' | 'emergency_procedure' | 'training';
  location: string;
  assessor: string;
  assessmentDate: string;
  reviewDate: string;
  status: 'draft' | 'active' | 'under_review' | 'expired';
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  hazards: FirstAidHazard[];
  controlMeasures: ControlMeasure[];
  emergencyProcedures: EmergencyProcedure[];
  firstAidRequirements: FirstAidRequirement[];
  createdAt: string;
  updatedAt: string;
}

export interface FirstAidHazard {
  id: string;
  description: string;
  category: 'physical' | 'chemical' | 'biological' | 'ergonomic' | 'psychological';
  severity: 1 | 2 | 3 | 4 | 5;
  likelihood: 1 | 2 | 3 | 4 | 5;
  riskScore: number;
  affectedPersons: string[];
}

export interface ControlMeasure {
  id: string;
  hazardId: string;
  description: string;
  type: 'elimination' | 'substitution' | 'engineering' | 'administrative' | 'ppe';
  priority: 'high' | 'medium' | 'low';
  responsible: string;
  implementationDate?: string;
  status: 'planned' | 'in_progress' | 'implemented' | 'overdue';
}

export interface EmergencyProcedure {
  id: string;
  title: string;
  description: string;
  steps: string[];
  emergencyContacts: EmergencyContact[];
  equipmentRequired: string[];
}

export interface EmergencyContact {
  id: string;
  name: string;
  role: string;
  phone: string;
  email?: string;
  availability: string;
}

export interface FirstAidRequirement {
  id: string;
  requirement: string;
  justification: string;
  location: string;
  quantity: number;
  type: 'first_aider' | 'equipment' | 'training' | 'facility';
  status: 'met' | 'partially_met' | 'not_met';
}

export interface FirstAidRiskAssessmentsProps {
  onBack: () => void;
  onOverdueAssessmentsChange?: (count: number) => void;
}

// Export First Aid Needs Assessment types
export * from './FirstAidNeedsAssessment';