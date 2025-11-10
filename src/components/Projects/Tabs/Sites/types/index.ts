import type { Project } from '../../../../../types/task';

// Define Site interface
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
  project_id: string;
}

export interface SitesTabProps {
  project: Project;
  sites: Site[];
  isLoading: boolean;
  onSitesChange?: () => void;
}

export interface NewSiteData {
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
