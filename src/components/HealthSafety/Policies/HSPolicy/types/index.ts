export interface HSPolicyProps {
  onBack: () => void;
}

export interface PDFFile {
  id: string;
  name: string;
  type: 'uploaded' | 'created';
  policy_number?: string;
  created_at: string;
  updated_at?: string;
  size: number;
  url: string;
  signed_url?: string;
  displayName?: string;
  content?: string;
}
