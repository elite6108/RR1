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
  services_present?: boolean;
  services_description?: string;
  services_images?: string[];
  number_of_courts?: number;
  court_dimensions?: string;
  court_height?: number;
  suitable_for_lorry?: boolean;
  site_access_images?: string[];
  site_access_videos?: string[];
  shuttering_required?: boolean;
  court_enclosure_type?: string;
  court_floor_material?: string;
  court_features?: string;
  tarmac_required?: boolean;
  tarmac_location?: string;
  tarmac_wagon_space?: string;
  muckaway_required?: string;
  surface_type?: string;
  lighting_required?: boolean;
  lighting_description?: string;
  canopies_required?: boolean;
  number_of_canopies?: number;
  drawings_images?: string[];
  drawings_videos?: string[];
  notes_comments?: string;
}

export interface GeneratePDFOptions {
  siteSurvey: SiteSurvey;
}

export interface PDFStyles {
  themeColor: string;
  headerColor: string;
  cellBackgroundColor: string;
  borderColor: number[];
}

export interface ImageDimensions {
  width: number;
  height: number;
  aspectRatio: number;
}

export interface ImageProcessingOptions {
  maxWidth: number;
  maxHeight: number;
  pageWidth: number;
}
