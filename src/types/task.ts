import { User } from '@supabase/supabase-js';

export interface TasksProps {
  onBack: () => void;
}

export interface Board {
  id: number;
  name: string;
  description?: string;
  border_color?: string;
  sort_order: number;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  status:
    | 'to_schedule'
    | 'booked_in'
    | 'in_progress'
    | 'over_due'
    | 'purchased'
    | 'completed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  project_id: number | null;
  board_id: number | null;
  notes?: string;
  tags: string[];
  staff_ids: number[];
  attachments: Attachment[];
  due_date?: string;
  cost?: number;
  category?: string;
  created_at: string;
  updated_at: string;
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

export interface Attachment {
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
  user_id: number;
  content: string;
  created_at: string;
}

export interface TaskFormData {
  title: string;
  description: string;
  status: Task['status'];
  priority: Task['priority'];
  project_id: number | null;
  board_id: number | null;
  notes: string;
  tags: string[];
  staff_ids: number[];
  attachments: File[];
  existing_attachments: Attachment[];
  due_date: string;
  cost: number;
  category: string;
}

export interface BoardFormData {
  name: string;
  description: string;
  border_color: string;
}

export interface TasksState {
  user: User | null;
  boards: Board[];
  tasks: Task[];
  projects: Project[];
  staff: StaffMember[];
  messages: Message[];
  newMessage: string;
  viewMode: 'list' | 'kanban';
  expandedBoards: Set<number>;
  activeBoardTabs: Record<number, 'open' | 'completed'>;
  showBoardModal: boolean;
  showTaskModal: boolean;
  showDeleteModal: boolean;
  showDeleteTaskModal: boolean;
  editingBoard: Board | null;
  editingTask: Task | null;
  boardToDelete: Board | null;
  activeTab?: 'info' | 'chat' | 'attachments';
  boardFormData: BoardFormData;
  taskFormData: TaskFormData;
  currentUserId: number;
}
