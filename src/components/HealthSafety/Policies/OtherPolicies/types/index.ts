export interface PolicySection {
  id: string;
  title: string;
  content: string;
}

export interface CreatePolicyModalProps {
  onClose: () => void;
  onSuccess: () => void;
  policyToEdit?: {
    id: string;
    name: string;
    content: string;
  } | null;
}
