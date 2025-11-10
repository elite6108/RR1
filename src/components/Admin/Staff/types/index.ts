export interface StaffProps {
  setShowStaff: (show: boolean) => void;
  setShowAdminDashboard: (show: boolean) => void;
}

export interface CompanySettings {
  id: string;  // UUID is stored as string
  token?: string;
}

export interface StaffMember {
  id: number;
  name: string;
  position: string;
  email: string;
  phone: string;
  ni_number: string;
  start_date: string;
  token?: string;
}

export interface User {
  id: string;
  full_name: string;
  email: string;
  user_metadata?: {
    role?: string;
  };
}

export interface CombinedStaffUser {
  id: string;
  name: string;
  type: 'staff' | 'user' | 'worker';
  original_id: string | number;
  email: string;
  position?: string;
  phone?: string;
  ni_number?: string;
  start_date?: string;
  token?: string;
}

export interface WorkerPhone {
  email: string;
  phone: string;
}

export interface FormData {
  name: string;
  position: string;
  email: string;
  phone: string;
  ni_number: string;
  start_date: string;
}

export interface FormErrors {
  phone?: string;
  ni_number?: string;
}

export interface UserDetails {
  [userId: string]: Partial<CombinedStaffUser>;
}
