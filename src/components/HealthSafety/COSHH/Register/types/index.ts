export interface CoshhSubstance {
  id: string;
  substance_name: string;
  manufacturer: string;
  category: string | string[]; // Support both old string format and new array format
  storage_location: string;
  hazard_sheet_location: string;
  added_date: string;
  review_date: string;
  reviewed_date?: string;
  auditor: string;
  created_at: string;
  updated_at: string;
}

export interface CoshhRegisterProps {
  onBack: () => void;
}

export interface RegisterFormData {
  substance_name: string;
  manufacturer: string;
  category: string[];
  storage_location: string;
  hazard_sheet_location: string;
  review_date: string;
}

export interface RegisterModalState {
  showAddModal: boolean;
  showEditModal: boolean;
  showReviewModal: boolean;
  showDeleteModal: boolean;
  selectedSubstance: CoshhSubstance | null;
  currentStep: number;
}

export interface RegisterSearchState {
  searchTerm: string;
  filteredSubstances: CoshhSubstance[];
}

export interface RegisterPDFState {
  downloadingPDF: boolean;
}

export const COSHH_CATEGORIES = [
  'Biological Agents',
  'Carcinogenic / Mutagenic / Reproductive Toxicants (CMRs)',
  'Compressed Gases / Gas Cylinders',
  'Corrosive Substances',
  'Environmental Hazards',
  'Flammable Substances',
  'Harmful / Irritants',
  'Nanomaterials',
  'Oxidising Agents',
  'Sensitisers',
  'Toxic / Highly Toxic Substances'
];
