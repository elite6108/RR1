import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export interface LeaveRequest {
  id: string;
  start_date: string;
  end_date: string;
  total_days: number;
  leave_type: string;
  reason?: string;
  status: 'pending' | 'approved' | 'denied';
  admin_notes?: string;
  created_at: string;
}

export interface LeaveEntitlement {
  total_entitlement: number;
  used_days: number;
  remaining_days: number;
  year: number;
}

export type LeaveType = 'full_day' | 'half_day_morning' | 'half_day_afternoon';

export const calculateTotalDays = (start: Date, end: Date, type: string): number => {
  if (type.startsWith('half_day')) return 0.5;
  
  // Count only weekdays (Monday to Friday)
  let workingDays = 0;
  const current = new Date(start);
  
  while (current <= end) {
    const dayOfWeek = current.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Not Sunday (0) or Saturday (6)
      workingDays++;
    }
    current.setDate(current.getDate() + 1);
  }
  
  return workingDays;
};

export const getStatusIcon = (status: string) => {
  switch (status) {
    case 'approved': return CheckCircle;
    case 'denied': return XCircle;
    default: return AlertCircle;
  }
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'approved': return 'text-green-600 bg-green-50';
    case 'denied': return 'text-red-600 bg-red-50';
    default: return 'text-yellow-600 bg-yellow-50';
  }
};

export const getStatusIconColor = (status: string) => {
  switch (status) {
    case 'approved': return 'text-green-500';
    case 'denied': return 'text-red-500';
    default: return 'text-yellow-500';
  }
};

export const formatLeaveType = (leaveType: string): string => {
  if (leaveType.startsWith('half_day')) {
    return 'Half Day';
  }
  return leaveType.replace('_', ' ');
};

export const getDefaultEntitlement = (year: number): LeaveEntitlement => ({
  total_entitlement: 25,
  used_days: 0,
  remaining_days: 25,
  year
});