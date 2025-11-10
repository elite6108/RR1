export interface SubcontractorsProps {
  setShowSubcontractors: (show: boolean) => void;
  setShowAdminDashboard: (show: boolean) => void;
}

export interface Reminder {
  type: 'insurance';
  title: string;
  date: Date;
  description: string;
  severity: 'warning' | 'danger';
}

export interface InsuranceDetails {
  insurer: string;
  policy_no: string;
  renewal_date: string;
  limit_of_indemnity: string;
}

export interface SatisfactionRating {
  rating:
    | 'totally_dissatisfied'
    | 'mostly_dissatisfied'
    | 'neither'
    | 'mostly_satisfied'
    | 'totally_satisfied';
  comments: string;
}

export interface ReviewFormData {
  id?: string; // Optional ID for existing reviews
  date: string;
  requirements_scope: string;
  requirements: string;
  review_date: string;
  agreed_timeframe: string;
  total_time_taken: string;
  actual_timeframe: string;

  // Satisfaction ratings
  quality_rating: SatisfactionRating;
  timeliness_rating: SatisfactionRating;
  communication_rating: SatisfactionRating;
  understanding_rating: SatisfactionRating;
  cooperativeness_rating: SatisfactionRating;
  overall_satisfaction_rating: SatisfactionRating;

  // Yes/No questions
  authority_to_work: boolean;
  relevant_permits: boolean;
  risk_assessments: boolean;
  documents_legible: boolean;
  time_limit_clear: boolean;
  control_measures: boolean;
  work_in_line: boolean;
  right_people: boolean;
  emergency_knowledge: boolean;
  ppe_condition: boolean;
  tools_condition: boolean;
  housekeeping_standards: boolean;
}

export interface Subcontractor {
  id: string;
  company_name: string;
  services_provided: string;
  address: string;
  phone: string;
  email: string;
  swms: boolean;
  insurance_exp_date: string;
  review_date: string;
  created_at?: string;
  updated_at?: string;
  employers_liability: InsuranceDetails;
  public_liability: InsuranceDetails;
  professional_negligence: InsuranceDetails;
  contractors_all_risk: InsuranceDetails;
  custom_insurance_types?: Record<string, InsuranceDetails>;
  nature_of_business: string;
  swms_url?: string;
  health_safety_policy_url?: string;
  additional_files_urls?: string[];
  review?: ReviewFormData;
  token?: string;
}

export interface SubcontractorFormData
  extends Omit<Subcontractor, 'id' | 'created_at' | 'updated_at'> {
  nature_of_business: string;
  employers_liability: InsuranceDetails;
  public_liability: InsuranceDetails;
  professional_negligence: InsuranceDetails;
  contractors_all_risk: InsuranceDetails;
  has_swms: boolean;
  swms_file?: File | null;
  swms_url?: string;
  swms_file_path?: string;
  has_health_safety_policy: boolean;
  health_safety_policy_file?: File | null;
  health_safety_policy_url?: string;
  health_safety_file_path?: string;
  additional_files: File[];
  additional_files_urls: string[];
  additional_files_paths?: string[];
}
