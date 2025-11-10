export interface CoshhSubstance {
  id: string;
  substance_name: string;
  manufacturer: string;
  category: string;
  storage_location: string;
  hazard_sheet_location: string;
  added_date: string;
  review_date: string;
  reviewed_date?: string;
  auditor: string;
  created_at: string;
  updated_at: string;
}

export interface CoshhAssessment {
  id: string;
  substance_name: string;
  coshh_reference: string;
  supplied_by: string;
  description_of_substance: string;
  form: string;
  odour: string;
  method_of_use: string;
  site_and_location: string;
  assessment_date: string;
  review_date: string;
  persons_at_risk: string[];
  routes_of_entry: string[];
  selected_ppe: string[];
  selected_hazards: string[];
  ppe_location: string;
  hazards_precautions: string;
  carcinogen: boolean;
  sk: boolean;
  sen: boolean;
  ingredient_items: Array<{
    ingredient_name: string;
    wel_twa_8_hrs: string;
    stel_15_mins: string;
  }>;
  occupational_exposure: string;
  maximum_exposure: string;
  workplace_exposure: string;
  stel: string;
  stability_reactivity: string;
  ecological_information: string;
  amount_used: string;
  times_per_day: string;
  duration: string;
  how_often_process: string;
  how_long_process: string;
  general_precautions: string;
  first_aid_measures: string;
  accidental_release_measures: string;
  ventilation: string;
  handling: string;
  storage: string;
  further_controls: string;
  respiratory_protection: string;
  ppe_details: string;
  monitoring: string;
  health_surveillance: string;
  additional_control_items: string[];
  responsibility: string;
  by_when: string;
  spillage_procedure: string;
  fire_explosion: string;
  handling_storage: string;
  disposal_considerations: string;
  assessment_comments: string;
  q1_answer: boolean;
  q1_action: string;
  q2_answer: boolean;
  q2_action: string;
  q3_answer: boolean;
  q3_action: string;
  q4_answer: boolean;
  q4_action: string;
  q5_answer: boolean;
  q5_action: string;
  assessment_conclusion: string;
  hazard_level: string;
  assessor_name: string;
  created_at: string;
  updated_at: string;
}

export interface CompanySettings {
  name: string;
  address_line1: string;
  address_line2?: string;
  town: string;
  county: string;
  post_code: string;
  phone: string;
  email: string;
  logo_url?: string;
  company_number?: string;
  vat_number?: string;
}

export interface PDFStyles {
  themeColor: string;
  headerColor: string;
  cellBackgroundColor: string;
  borderColor: [number, number, number];
}

export interface ImageOptions {
  imageData: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface TableCellWithImage {
  content: string;
  styles: any;
  image?: string;
  imageOptions?: ImageOptions;
}
