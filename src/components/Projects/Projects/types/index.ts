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

export interface ProjectsListProps {
  projects: Project[];
  onProjectChange: () => void;
  setShowCustomerProjectsDashboard: (show: boolean) => void;
  setActiveSection: (section: string | null) => void;
}

// Re-export types from database
export type { Project, PurchaseOrder, Quote } from '../../../../types/database';
