export interface HolidaysProps {
  setShowHolidays: (show: boolean) => void;
  setShowAdminDashboard: (show: boolean) => void;
}

export interface LeaveRequest {
  id: string;
  user_id: string;
  user_email: string;
  user_name: string;
  user_type: 'worker' | 'staff';
  start_date: string;
  end_date: string;
  total_days: number;
  leave_type: string;
  reason?: string;
  status: 'pending' | 'approved' | 'denied';
  approved_by?: string;
  approved_at?: string;
  admin_notes?: string;
  created_at: string;
}

export interface LeaveEntitlement {
  user_id: string;
  user_email: string;
  user_name: string;
  user_type: string;
  year: number;
  total_entitlement: number;
  used_days: number;
  remaining_days: number;
}

export type ViewMode = 'my_requests' | 'all_requests' | 'entitlements' | 'holiday_table';

export interface RequestsViewProps {
  requests: LeaveRequest[];
  loading: boolean;
  isAdmin: boolean;
  viewMode: ViewMode;
  onApprove: (request: LeaveRequest) => void;
  getStatusIcon: (status: string) => React.ReactNode;
  getStatusColor: (status: string) => string;
}

export interface EntitlementsViewProps {
  entitlements: LeaveEntitlement[];
  loading: boolean;
  onEditEntitlement: (entitlement: LeaveEntitlement) => void;
}

export interface HolidayTableViewProps {
  entitlements: LeaveEntitlement[];
  requests: LeaveRequest[];
  loading: boolean;
}
