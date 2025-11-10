export interface Task {
  id: string;
  name: string;
  description?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  due_date?: string;
  completed: boolean;
  completed_at?: string;
  category?: string;
  created_at: string;
  updated_at: string;
  cost?: number;
  staff_ids: number[];
  tags: string[];
  notes?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface StaffMember {
  id: number;
  name: string;
  position: string;
}

export interface Message {
  id: string;
  content: string;
  created_at: string;
  task_id: string;
  user_name: string;
}

export interface TodoProps {
  setShowToDo: (show: boolean) => void;
  setShowAdminDashboard: () => void;
}

export interface IconData {
  name: string;
  icon: React.ComponentType<any>;
}

export type ViewType = 'inbox' | 'today' | 'next7days' | 'category';

export interface TaskFormData {
  name: string;
  description: string;
  priority: Task['priority'];
  due_date: string;
  tags: string[];
  notes: string;
}

export interface CategoryFormData {
  name: string;
  icon: string;
}
