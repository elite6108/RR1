export interface TasksProps {
  setShowTasks: (show: boolean) => void;
  setShowAdminDashboard: (show: boolean) => void;
}

export interface Board {
  id: number;
  name: string;
  description: string | null;
  border_color: string | null;
  sort_order: number;
}

export interface Task {
  id: number;
  title: string;
  description: string | null;
  status:
    | 'to_schedule'
    | 'booked_in'
    | 'over_due'
    | 'in_progress'
    | 'purchased'
    | 'completed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  project_id: string | null;
  board_id: number;
  notes: string | null;
  tags: string[];
  staff_ids: number[];
  due_date: string | null;
  cost: number | null;
  created_at: string;
  updated_at: string;
  category:
    | 'Quote'
    | 'Repair'
    | 'Aftersales'
    | 'Complaints'
    | 'Remedials'
    | 'Finance'
    | 'Insurance'
    | 'Tax'
    | 'Banking'
    | null;
  attachments?: TaskAttachment[];
}

export interface Project {
  id: string;
  name: string;
}

export interface StaffMember {
  id: number;
  name: string;
  position: string;
}

export interface User {
  id: string;
  full_name: string;
  email: string;
}

export interface CombinedStaffUser {
  id: string;
  name: string;
  type: 'staff' | 'user';
  original_id: string | number;
  email: string;
  position?: string;
  phone?: string;
  ni_number?: string;
  start_date?: string;
  token?: string;
}

export interface TaskAttachment {
  id: number;
  task_id: number;
  file_name: string;
  file_url: string;
  file_type: string;
  display_name: string;
}

export interface Message {
  id: number;
  task_id: number;
  user_id: string;
  user_name: string;
  message: string;
  created_at: string;
}

export interface TaskFormData {
  title: string;
  description: string;
  status: Task['status'];
  priority: Task['priority'];
  project_id: string | null;
  board_id: number | null;
  notes: string;
  tags: string[];
  staff_ids: number[];
  attachments: File[];
  existing_attachments: TaskAttachment[];
  due_date: string;
  cost: number | null;
  category: Task['category'];
}
