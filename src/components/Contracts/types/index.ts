import React from 'react';

export interface Contract {
  id: string;
  created_at: string;
  updated_at: string;
  contract_date: string;
  customer_id: string;
  customer?: {
    company_name: string | null;
    customer_name: string | null;
  };
  project_id: string;
  project_name: string;
  site_address: string;
  quote_id: string;
  description_of_works: string;
  payment_amount: number;
  deposit_required: boolean;
  deposit_amount: number;
  installments_required: boolean;
  installment_frequency: string;
  custom_installments: string;
  statutory_interest_rate: string;
  is_signed: boolean;
  signed_at: string | null;
  signed_by: string | null;
}

export interface ContractsManagementProps {
  setShowContractsManagement: (show: boolean) => void;
  setShowCustomerProjectsDashboard: (show: boolean) => void;
}

export interface ContractsFormProps {
  onClose: () => void;
  onSuccess: () => void;
  contract?: any;
  preSelectedProjectId?: string;
  disableCustomerAndProject?: boolean;
}

export interface Project {
  id: string;
  name: string;
  project_manager: string;
}

export interface Quote {
  id: string;
  quote_number: string;
  customer_id: string;
}

export interface Site {
  id: string;
  name: string;
  address: string;
  town: string;
  county: string;
  postcode: string;
  site_manager: string;
  phone: string;
  what3words?: string;
  created_at: string;
  project_id: string;
}

export interface Customer {
  id: string;
  company_name: string;
  customer_name: string;
  address_line1: string;
  address_line2: string | null;
  town: string;
  county: string;
  post_code: string;
  phone: string;
  email: string;
}

export interface Subcontractor {
  id: string;
  company_name: string;
  subcontractor_manager: string;
  subcontractor_phone: string;
  subcontractor_responsibilities: string;
}

export interface SubcontractorData {
  subcontractor_id: string;
  manager: string;
  responsibilities: string;
}

export interface FormData {
  // Step 1
  contract_date: string;
  contract_id: string;

  // Step 2
  customer_id: string;
  customer_address: string;
  customer_phone: string;
  customer_email: string;

  // Step 3
  project_id: string;
  project_manager: string;
  site_id: string;
  site_address: string;
  site_manager: string;
  project_start_date: string;
  estimated_end_date: string;

  // Step 4
  quote_id: string;
  description_of_works: string;
  builder_responsibilities: string;
  manufacturing: boolean;
  delivery: boolean;
  installing: boolean;

  // Step 5
  subcontractor_data: SubcontractorData[];

  // Step 6
  payment_amount: string | null | number;
  deposit_required: boolean;
  deposit_amount: string | null | number;
  installments_required: boolean;
  installment_type: string;
  installment_frequency: string;
  custom_installments: string;
  statutory_interest_rate: string;
}

// Component Props
export interface ContractTableProps {
  contracts: Contract[];
  loading: boolean;
  searchQuery: string;
  generatingPdfId: string | null;
  onEdit: (contract: Contract) => void;
  onGeneratePDF: (contract: Contract) => void;
  onDelete: (contract: Contract) => void;
}

export interface ContractCardProps {
  contract: Contract;
  generatingPdfId: string | null;
  onEdit: (contract: Contract) => void;
  onGeneratePDF: (contract: Contract) => void;
  onDelete: (contract: Contract) => void;
}

export interface ContractsSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAddContract: () => void;
}

export interface DeleteConfirmModalProps {
  isOpen: boolean;
  contractToDelete: Contract | null;
  onConfirm: () => void;
  onCancel: () => void;
}



export interface FormStepProps {
  formData: FormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  customers?: Customer[];
  projects?: Project[];
  sites?: Site[];
  quotes?: Quote[];
  subcontractors?: Subcontractor[];
  customerAddress?: string;
  siteAddress?: string;
  siteManager?: string;
  onCustomerChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onProjectChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onSiteChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  disableCustomerAndProject?: boolean;
  preSelectedProjectId?: string;
  setFormData?: React.Dispatch<React.SetStateAction<FormData>>;
}

export interface SubcontractorFormProps {
  selectedSubcontractors: SubcontractorData[];
  subcontractors: Subcontractor[];
  expandedSubcontractors: number[];
  onAddSubcontractor: () => void;
  onRemoveSubcontractor: (index: number) => void;
  onUpdateSubcontractor: (index: number, field: keyof SubcontractorData, value: string) => void;
  onToggleSubcontractor: (index: number) => void;
}

export interface DescriptionTabsProps {
  formData: FormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  activeDescriptionTab: 'builder' | 'description';
  setActiveDescriptionTab: (tab: 'builder' | 'description') => void;
  quotes: Quote[];
}