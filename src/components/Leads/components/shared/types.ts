export type LeadStatus = 'new' | 'cold' | 'hot' | 'converted';

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  source: string;
  message: string;
  budget: string;
  status: LeadStatus;
  created_at: string;
  updated_at: string;
}

export interface Activity {
  id: string;
  activity_type: 'email_sent' | 'phone_call' | 'note_added' | 'status_changed';
  description: string;
  created_at: string;
  created_by_name: string;
  metadata?: any;
}

export interface Note {
  id: string;
  content: string;
  created_at: string;
  created_by_name: string;
}

export type SortField = 'name' | 'email' | 'phone' | 'budget' | 'priority' | 'status' | 'created_at';
export type SortDirection = 'asc' | 'desc';

export interface LeadFormProps {
  onClose: () => void;
  onSuccess: () => void;
  leadToEdit?: Lead | null;
  initialStep?: number;
}

export interface LeadCardProps {
  lead: Lead;
  onUpdate: () => void;
}

export interface LeadManagementProps {
  onBack: () => void;
}
