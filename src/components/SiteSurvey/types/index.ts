import React from 'react';

// Core interfaces
export interface Customer {
  id: string;
  company_name: string | null;
  customer_name: string;
}

export interface Project {
  id: string;
  name: string;
  customer_id: string;
}

export interface SiteSurvey {
  id: string;
  survey_id?: string;
  created_at: string;
  customer_id: string;
  project_id: string;
  customer?: Customer;
  project?: Project;
  location_what3words?: string;
  site_contact?: string;
  full_address?: string;
  site_access_description?: string;
  water_handling?: string;
  manholes_description?: string;
  number_of_courts?: number;
  court_dimensions?: string;
  court_height?: number;
  
  // Additional fields from form
  location_coordinates?: { lat: number; lng: number } | null;
  suitable_for_lorry?: boolean;
  site_access_images?: string[];
  site_access_videos?: string[];
  services_present?: boolean;
  services_description?: string;
  services_images?: string[];
  shuttering_required?: boolean;
  tarmac_required?: boolean;
  tarmac_location?: string;
  tarmac_wagon_space?: boolean;
  muckaway_required?: boolean;
  surface_type?: string;
  lighting_required?: boolean;
  lighting_description?: string;
  canopies_required?: boolean;
  number_of_canopies?: number;
  court_enclosure_type?: 'option1' | 'option2';
  court_floor_material?: string;
  court_features?: string[];
  drawings_images?: string[];
  drawings_videos?: string[];
  notes_comments?: string;
}

export interface FormData {
  // Step 1: Details
  customer_id: string;
  project_id: string;
  location_what3words: string;
  full_address: string;
  site_contact: string;

  // Step 2: Site Access
  site_access_description: string;
  suitable_for_lorry: boolean;
  site_access_images: string[];
  site_access_videos: string[];

  // Step 3: Land
  water_handling: string;
  manholes_description: string;
  services_present: boolean;
  services_description: string;
  services_images: string[];

  // Step 4: Work Required
  number_of_courts: number;
  shuttering_required: boolean;
  tarmac_required: boolean;
  tarmac_location: string;
  tarmac_wagon_space: boolean;
  muckaway_required: boolean;
  surface_type: string;
  lighting_required: boolean;
  lighting_description: string;
  canopies_required: boolean;
  number_of_canopies: number;

  // Step 5: Court Features
  court_dimensions: string;
  court_height: number;
  court_enclosure_type: 'option1' | 'option2';
  court_floor_material: string;
  court_features: string[];

  // Step 6: Drawings & Plans
  drawings_images: string[];
  drawings_videos: string[];
  notes_comments: string;
}

// Component Props
export interface SiteSurveyProps {
  onBack: () => void;
}

export interface SiteSurveyViewProps {
  survey: SiteSurvey;
  customerName: string;
  projectName: string;
  onClose: () => void;
}

export interface SiteSurveyFormProps {
  onClose: () => void;
  onSuccess: () => void;
  surveyToEdit?: SiteSurvey | null;
  isProjectContext?: boolean;
}

export interface SurveySearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAddSurvey: () => void;
}

export interface SurveyTableProps {
  surveys: SiteSurvey[];
  filteredSurveys: SiteSurvey[];
  loading: boolean;
  error: string | null;
  generatingPdfId: string | null;
  onView: (survey: SiteSurvey) => void;
  onEdit: (survey: SiteSurvey) => void;
  onGeneratePDF: (survey: SiteSurvey) => void;
  onDelete: (survey: SiteSurvey) => void;
  getCustomerName: (customerId: string) => string;
  getProjectName: (projectId: string) => string;
  formatDate: (dateString: string) => string;
}

export interface SurveyCardProps {
  survey: SiteSurvey;
  generatingPdfId: string | null;
  onView: (survey: SiteSurvey) => void;
  onEdit: (survey: SiteSurvey) => void;
  onGeneratePDF: (survey: SiteSurvey) => void;
  onDelete: (survey: SiteSurvey) => void;
  getCustomerName: (customerId: string) => string;
  getProjectName: (projectId: string) => string;
  formatDate: (dateString: string) => string;
}

export interface DeleteConfirmModalProps {
  isOpen: boolean;
  surveyToDelete: SiteSurvey | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
}

export interface FormStepProps {
  formData?: FormData;
  setFormData?: React.Dispatch<React.SetStateAction<FormData>>;
  customers?: Customer[];
  projects?: Project[];
  currentUser?: any;
  loading?: boolean;
  uploadingFiles?: boolean;
  showW3WModal?: boolean;
  setShowW3WModal?: React.Dispatch<React.SetStateAction<boolean>>;
  handleCustomerChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleInputChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleBooleanChange?: (name: string, value: boolean) => void;
  handleMultiSelectChange?: (name: string, value: string) => void;
  handleFileUpload?: (files: FileList, fieldName: 'site_access_images' | 'site_access_videos' | 'services_images' | 'drawings_images' | 'drawings_videos') => void;
  isProjectContext?: boolean;
}

export interface What3WordsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface FileUploadAreaProps {
  id: string;
  accept: string;
  multiple: boolean;
  uploadingFiles: boolean;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  title: string;
  description: string;
}

export interface FilePreviewGridProps {
  files: string[];
  onRemove: (index: number) => void;
  type: 'image' | 'video';
}

// Error and Success message props
export interface ErrorMessageProps {
  error: string;
  variant?: 'default' | 'modal';
}

export interface SuccessMessageProps {
  message: string;
}

// File upload types
export type FileUploadField = 'site_access_images' | 'site_access_videos' | 'services_images' | 'drawings_images' | 'drawings_videos';

// Review section data
export interface ReviewSectionData {
  customer?: Customer;
  project?: Project;
  formData: FormData;
}