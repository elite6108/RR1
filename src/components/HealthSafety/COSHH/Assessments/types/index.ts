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

export interface CoshhAssessmentsProps {
  onBack: () => void;
}

export interface AssessmentFormData extends Omit<CoshhAssessment, 'id' | 'created_at' | 'updated_at'> {
  id: string;
}

export interface AssessmentModalState {
  showAddModal: boolean;
  showEditModal: boolean;
  showDeleteModal: boolean;
  showImportExportModal: boolean;
  selectedAssessment: CoshhAssessment | null;
  currentStep: number;
  importExportMode: 'import' | 'export';
  selectedForExport: string | null;
}

export interface AssessmentSearchState {
  searchTerm: string;
  filteredAssessments: CoshhAssessment[];
  ppeSearchQuery: string;
  hazardSearchQuery: string;
}

export interface AssessmentPDFState {
  downloadingPDF: boolean;
}

export interface AssessmentIconState {
  loadingIcons: boolean;
  iconUrls: Record<string, string>;
  loadingHazardIcons: boolean;
  hazardIconUrls: Record<string, string>;
}

export interface DynamicControlItem {
  id: string;
  item: string;
}

export interface DynamicIngredientItem {
  id: string;
  ingredient_name: string;
  wel_twa_8_hrs: string;
  stel_15_mins: string;
}

// PPE Constants
export const PRIORITY_PPE = [
  'Safety Gloves',
  'Safety Footwear',
  'Hi Vis Clothing',
  'Hard Hat',
  'Safety Goggles',
  'Hearing Protection',
  'Protective Clothing',
  'P3 Masks',
  'Face Shield',
  'Respirator Hoods'
];

export const OTHER_PPE = [
  'Connect an earth terminal to the ground',
  'Disconnect before carrying out maintenance or repair',
  'Disconnect mains plug from electrical outlet',
  'Disinfect surface',
  'Disinfect your hands',
  'Ensure continuous ventilation',
  'Entry only with supervisor outside',
  'General mandatory action sign',
  'Install locks and keep locked',
  'Install or check guard',
  'Opaque eye protection must be worn',
  'Place trash in the bin',
  'Refer to instruction manual',
  'Secure gas cylinders',
  'Sound your horn',
  'Use barrier cream',
  'Use breathing equipment',
  'Use footbridge',
  'Use footwear with antistatic or antispark features',
  'Use gas detector',
  'Use guard to protect from injury from the table saw',
  'Use handrail',
  'Use protective apron',
  'Use this walkway',
  'Ventilate before and during entering',
  'Wash your hands',
  'Wear a safety harness',
  'Wear a welding mask',
  'Wear safety belts'
];

// Map of PPE names to their filenames
export const PPE_FILENAMES = {
  'Safety Gloves': 'wear-protective-gloves.png',
  'Safety Footwear': 'wear-foot-protection.png',
  'Hi Vis Clothing': 'wear-high-visibility-clothing.png',
  'Hard Hat': 'wear-head-protection.png',
  'Safety Goggles': 'wear-eye-protection.png',
  'Hearing Protection': 'wear-ear-protection.png',
  'Protective Clothing': 'wear-protective-clothing.png',
  'P3 Masks': 'wear-a-mask.png',
  'Face Shield': 'wear-a-face-shield.png',
  'Respirator Hoods': 'wear-respiratory-protection.png',
  'Connect an earth terminal to the ground': 'connect-an-earth-terminal-to-the-ground.png',
  'Disconnect before carrying out maintenance or repair': 'disconnect-before-carrying-out-maintenance-or-repair.png',
  'Disconnect mains plug from electrical outlet': 'disconnect-mains-plug-from-electrical-outlet.png',
  'Disinfect surface': 'disinfect-surface.png',
  'Disinfect your hands': 'disinfect-your-hands.png',
  'Ensure continuous ventilation': 'ensure-continuous-ventilation.png',
  'Entry only with supervisor outside': 'entry-only-with-supervisor-outside.png',
  'General mandatory action sign': 'general-mandatory-action-sign.png',
  'Install locks and keep locked': 'install-locks-and-keep-locked.png',
  'Install or check guard': 'install-or-check-guard.png',
  'Opaque eye protection must be worn': 'opaque-eye-protection-must-be-worn.png',
  'Place trash in the bin': 'place-trash-in-the-bin.png',
  'Refer to instruction manual': 'refer-to-instruction-manual.png',
  'Secure gas cylinders': 'secure-gas-cylinders.png',
  'Sound your horn': 'sound-your-horn.png',
  'Use barrier cream': 'use-barrier-cream.png',
  'Use breathing equipment': 'use-breathing-equipment.png',
  'Use footbridge': 'use-footbridge.png',
  'Use footwear with antistatic or antispark features': 'use-footwear-with-anti-static-or-anti-spark-features.png',
  'Use gas detector': 'use-gas-detector.png',
  'Use guard to protect from injury from the table saw': 'use-guard-to-protect-from-injury-from-the-table-saw.png',
  'Use handrail': 'use-handrail.png',
  'Use protective apron': 'use-protective-apron.png',
  'Use this walkway': 'use-this-walkway.png',
  'Ventilate before and during entering': 'ventilate-before-and-during-entering.png',
  'Wash your hands': 'wash-your-hands.png',
  'Wear a safety harness': 'wear-a-safety-harness.png',
  'Wear a welding mask': 'wear-a-welding-mask.png',
  'Wear safety belts': 'wear-safety-belts.png'
};

// Hazard Constants for COSHH assessments
export const HAZARDS = [
  'Acute Toxicity',
  'Corrosive', 
  'Flammable',
  'Gas Under Pressure',
  'Hazardous to Environment',
  'Health Hazard',
  'Oxidising',
  'Serious Health Hazard'
];

// Map of hazard names to their filenames in signage-artwork bucket
export const HAZARD_FILENAMES = {
  'Acute Toxicity': 'acute-toxicity.png',
  'Corrosive': 'corrosive.png',
  'Flammable': 'flammable.png',
  'Gas Under Pressure': 'gas-under-pressure.png',
  'Hazardous to Environment': 'hazardous-to-environment.png',
  'Health Hazard': 'health-hazard.png',
  'Oxidising': 'oxidising.png',
  'Serious Health Hazard': 'serious-health-hazard.png'
};
