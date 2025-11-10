export type Worker = {
  id: string;
  full_name: string;
  phone: string;
  dob: string | null;
  national_insurance: string | null;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  last_health_questionnaire: string | null;
  photo_filename: string | null;
  photo_url?: string | null;
  first_name: string | null;
  last_name: string | null;
  last_main_questionnaire_date: string | null;
  email: string;
  company: string;
  is_active: boolean;
  created_at: string;
  workers_safety_handbook: { signed_at: string | null;[key: string]: any }[] | null;
  workers_annual_training: { signed_at: string | null;[key: string]: any }[] | null;
  workers_risk_assessment_signatures: { 
    signed_at: string | null;
    risk_assessments: { ra_id: string; name: string } | null;
    [key: string]: any 
  }[] | null;
  workers_policy_signatures: {
    signed_at: string | null;
    policy_id: string | null;
    other_policy_file_id: string | null;
    hs_policy_file_id: string | null;
    [key: string]: any
  }[] | null;
};

export type SortField = 'full_name' | 'last_health_questionnaire';
export type SortDirection = 'asc' | 'desc';

export type WorkersProps = {
  onBack: () => void;
};

export interface PortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText: string;
  confirmButtonClass?: string;
  loading?: boolean;
}
