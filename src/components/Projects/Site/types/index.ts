export interface Site {
  id: string;
  name: string;
  address: string;
  town: string;
  county: string;
  postcode: string;
  site_manager: string;
  phone: string;
  what3words?: string;
  created_at: string;
  project_id?: string;
}

export interface SiteCheckInFormData {
  full_name: string;
  phone: string;
  company: string;
  email: string;
  fit_to_work: boolean;
}

export interface SiteLog {
  id: string;
  full_name: string;
  phone: string;
  company: string;
  email: string;
  fit_to_work: boolean;
  logged_in_at: string;
  logged_out_at?: string;
}

export interface SiteListsProps {
  setShowCustomerProjectsDashboard: (show: boolean) => void;
  setActiveSection: (section: string | null) => void;
}

export interface Project {
  id: string;
  name: string;
  user_id: string;
  created_at: string;
}

export interface NewSiteFormData {
  name: string;
  address: string;
  town: string;
  county: string;
  postcode: string;
  site_manager: string;
  phone: string;
  what3words: string;
  project_id: string;
}

export interface W3WValidation {
  isValid: boolean;
  message: string;
  isChecking: boolean;
}

export interface Coordinates {
  lat: number;
  lng: number;
}
