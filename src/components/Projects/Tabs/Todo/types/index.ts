export interface Task {
  id: string;
  name: string;
  description?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  due_date?: string;
  completed: boolean;
  completed_at?: string;
  category?: string;
  project_id: string;
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
  project_id: string;
}

export interface StaffMember {
  id: number;
  name: string;
  position: string;
}

export interface TodoTabProps {
  projectId: string;
}

export type ViewType = 'inbox' | 'today' | 'next7days' | 'category';

export interface TaskFormData {
  name: string;
  description: string;
  priority: Task['priority'];
  due_date: string;
  notes: string;
}

export interface CategoryFormData {
  name: string;
  icon: string;
}

export interface IconData {
  name: string;
  icon: React.ComponentType<any>;
}
