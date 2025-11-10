export interface WorkerDashboardProps {
  selectedProjectId?: string | null;
}

export interface NotificationData {
  type: 'success' | 'error';
  title: string;
  message: string;
}

export interface WorkerUser {
  id: string;
  email: string;
  full_name?: string;
  phone_number?: string;
  date_of_birth?: string;
  ni_number?: string;
  driving_license_number?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  photo_url?: string;
  [key: string]: any;
}

export interface SiteCheckIn {
  id: string;
  site_name: string;
  check_in_time: string;
  [key: string]: any;
}

export interface FileData {
  id: string;
  name: string;
  file_url: string;
  file_type: string;
  [key: string]: any;
}