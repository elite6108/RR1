export interface Policy {
  id: string;
  name: string;
  display_name?: string;
  file_name?: string;
  description?: string;
  created_at: string;
  last_signed?: string | null;
  source: 'other_policy_files' | 'hs_policy_files';
  type: 'uploaded' | 'created';
  content?: string;
  policy_number?: number;
}

export interface NotificationData {
  type: 'success' | 'error';
  title: string;
  message: string;
}

export interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

export interface UserData {
  id?: string;
  email?: string;
  full_name?: string;
  [key: string]: any;
}

export interface SignatureData {
  worker_id: string;
  signature_data: string;
  signed_at: string;
  other_policy_file_id?: string;
  hs_policy_file_id?: string;
}