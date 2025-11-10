// Add this interface to the existing types
export interface CompanySettings {
  id: string;
  name: string;
  address_line1: string;
  address_line2?: string;
  town: string;
  county: string;
  post_code: string;
  phone: string;
  email: string;
  vat_number?: string;
  company_number?: string;
  logo_url?: string;
}

export interface CPP {
  id: string;
  user_id: string;
  cpp_number: string;
  created_at: string;
  updated_at: string;
  review_date: string;
  front_cover: any;
  project_description: any;
  site_information: any;
  hours_team: any;
  management_work: any;
  management_structure: any;
  site_rules: any;
  arrangements: any;
  site_induction: any;
  welfare_arrangements: any;
  first_aid_arrangements: any;
  rescue_plan: any;
  specific_measures: any;
  hazards: any;
  high_risk_work: any;
  notifiable_work: any;
  contractors: any;
  monitoring: any;
  hs_file: any;
  hazard_identification: any;
}

export interface Driver {
  id: string;
  user_id: string;
  full_name: string;
  points: number;
  licence_number: string;
  licence_expiry: string;
  created_at: string;
  updated_at: string;
}

export interface Vehicle {
  id: string;
  user_id: string;
  registration: string;
  make: string;
  model: string;
  driver: string;
  mot_date: string | null;
  tax_date: string | null;
  service_date: string | null;
  insurance_date: string | null;
  breakdown_date: string | null;
  congestion_date: string | null;
  dartford_date: string | null;
  clean_air_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface VehicleChecklist {
  id: string;
  user_id: string;
  vehicle_id: string;
  check_date: string;
  items: ChecklistItem[];
  notes: string | null;
  created_by_name: string;
  driver_name: string;
  mileage: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  status: 'pass' | 'fail';
  created_at: string;
  updated_at: string;
}

export interface ChecklistItem {
  id: string;
  name: string;
  status: 'pass' | 'fail';
  notes?: string;
}

export interface Equipment {
  id: string;
  user_id: string;
  name: string;
  serial_number: string;
  calibration_date: string | null;
  service_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface EquipmentChecklist {
  id: string;
  user_id: string;
  equipment_id: string;
  check_date: string;
  items: ChecklistItem[];
  notes: string | null;
  created_by_name: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  status: 'pass' | 'fail';
  created_at: string;
  updated_at: string;
}

export interface InsuranceDetails {
  insurer: string;
  policy_no: string;
  renewal_date: string;
  limit_of_indemnity: string;
}

export interface SatisfactionRating {
  rating: 'totally_dissatisfied' | 'mostly_dissatisfied' | 'neither' | 'mostly_satisfied' | 'totally_satisfied';
  comments: string;
}

export interface Review {
  date: string;
  requirements_scope: string;
  agreed_timeframe: string;
  total_time_taken: string;
  quality_rating: SatisfactionRating;
  timeliness_rating: SatisfactionRating;
  communication_rating: SatisfactionRating;
  understanding_rating: SatisfactionRating;
  cooperativeness_rating: SatisfactionRating;
  overall_satisfaction_rating: SatisfactionRating;
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
  review?: Review;
}

export interface RAMS {
  id: string;
  user_id: string;
  rams_number: string;
  date: string;
  created_at: string;
  updated_at: string;
  reference: string;
  client_id?: string;
  client_name: string;
  project_id?: string;
  site_manager: string;
  assessor: string;
  approved_by: string;
  address_line1: string;
  address_line2?: string;
  address_line3?: string;
  site_town: string;
  site_county: string;
  post_code: string;
  site_hours: string;
  supervision: string;
  description?: string;
  sequence?: string;
  stability?: string;
  special_permits?: string;
  workers?: string;
  tools_equipment?: string;
  plant_equipment?: string;
  lighting?: string;
  deliveries?: string;
  services?: string;
  access_equipment?: string;
  hazardous_equipment?: string;
  welfare_first_aid?: string;
  nearest_hospital?: string;
  fire_action_plan?: string;
  protection_of_public?: string;
  clean_up?: string;
  order_of_works_safety?: string;
  order_of_works_task?: 'groundworks' | 'custom';
  order_of_works_custom?: string;
  delivery_info?: string;
  groundworks_info?: string;
  additional_info?: string;
  ppe?: string[];
  hazards?: any[];
}

export interface SiteSurvey {
  id: string;
  user_id: string;
  site_name: string;
  survey_date: string;
  surveyor_name: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  site_address: string;
  site_access: string;
  parking_facilities: string;
  site_restrictions: string | null;
  working_hours: string;
  equipment_requirements: string | null;
  additional_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface FirstAidKit {
  id: string;
  user_id: string;
  name: string;
  location: string;
  description?: string;
  serial_number?: string;
  purchase_date?: string;
  expiry_date?: string;
  last_inspection_date?: string;
  next_inspection_date?: string;
  status: 'active' | 'needs_inspection' | 'expired' | 'out_of_service';
  created_at: string;
  updated_at: string;
}

export interface FirstAidKitItem {
  id: string;
  name: string;
  required_quantity: number;
  current_quantity: number;
  expiry_date?: string;
  status: 'sufficient' | 'low' | 'expired' | 'missing';
}

export interface FirstAidKitInspection {
  id: string;
  user_id: string;
  first_aid_kit_id: string;
  inspector_name: string;
  inspection_date: string;
  items: FirstAidKitItem[];
  notes?: string;
  overall_status: 'good' | 'needs_attention' | 'critical';
  next_inspection_date?: string;
  created_at: string;
  updated_at: string;
}

// New inspection tables (RR)
export type InspectionFrequency = 'daily' | 'weekly' | 'monthly';

export interface CraneOperatorInspection {
  id: string;
  user_id: string;
  created_by_name?: string;
  equipment_id?: string;
  site_id?: string;
  project_id?: string;
  crane_type?: string;
  serial_number?: string;
  location?: string;
  check_date: string; // ISO date
  frequency?: InspectionFrequency;
  status: 'pass' | 'fail';
  items: any[]; // [{name,status,notes,image_url}]
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface PPEInspection {
  id: string;
  user_id: string;
  created_by_name?: string;
  staff_id?: number;
  worker_id?: string;
  site_id?: string;
  check_date: string;
  frequency?: InspectionFrequency;
  status: 'pass' | 'fail';
  items: any[]; // [{name,condition,compliant,notes,image_url}]
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ForkliftDailyInspection {
  id: string;
  user_id: string;
  created_by_name?: string;
  equipment_id?: string;
  site_id?: string;
  check_date: string;
  frequency?: InspectionFrequency;
  status: 'pass' | 'fail';
  items: any[]; // [{name,status,notes,image_url}]
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface SiteInspection {
  id: string;
  user_id: string;
  created_by_name?: string;
  site_id?: string;
  project_id?: string;
  check_date: string;
  frequency?: InspectionFrequency;
  status: 'pass' | 'fail';
  items: any[];
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface MotorVehicleInspection {
  id: string;
  user_id: string;
  created_by_name?: string;
  vehicle_id?: string;
  check_date: string;
  frequency?: InspectionFrequency;
  status: 'pass' | 'fail';
  odometer?: number;
  items: any[];
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface GuardingInspection {
  id: string;
  user_id: string;
  created_by_name?: string;
  equipment_id?: string;
  site_id?: string;
  check_date: string;
  frequency?: InspectionFrequency;
  status: 'pass' | 'fail';
  items: any[]; // emergency stop checks
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface WorkshopInspection {
  id: string;
  user_id: string;
  created_by_name?: string;
  site_id?: string;
  workshop_name?: string;
  check_date: string;
  frequency?: InspectionFrequency;
  status: 'pass' | 'fail';
  items: any[];
  notes?: string;
  created_at: string;
  updated_at: string;
}