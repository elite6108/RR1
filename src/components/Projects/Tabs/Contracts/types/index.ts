import type { Project } from '../../../../../types/task';

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
  project_name?: string;
  projects?: {
    name: string | null;
  };
  site_id?: string;
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

export interface ContractsTabProps {
  project: Project;
  contracts: Contract[];
  isLoading: boolean;
  onContractsChange?: () => void;
}

export interface ContractTableProps {
  contracts: Contract[];
  project: Project;
  generatingPDF: boolean;
  onEdit: (contract: Contract) => void;
  onDelete: (contract: Contract) => void;
  onGeneratePDF: (contract: Contract) => void;
}

export interface ContractCardProps {
  contract: Contract;
  project: Project;
  generatingPDF: boolean;
  onEdit: (contract: Contract) => void;
  onDelete: (contract: Contract) => void;
  onGeneratePDF: (contract: Contract) => void;
}

export interface ContractSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAddContract: () => void;
}

export interface DeleteConfirmationModalProps {
  isOpen: boolean;
  contract: Contract | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export interface ContractFormModalProps {
  isOpen: boolean;
  contract: Contract | null;
  project: Project;
  onClose: () => void;
  onSuccess: () => void;
}

export interface ContractPDFData extends Contract {
  site_address_line1: string;
  site_address_line2: string;
  site_town: string;
  site_county: string;
  site_postcode: string;
  other_party_name: string;
  other_party_address_line1: string;
  other_party_address_line2: string;
  other_party_town: string;
  other_party_county: string;
  other_party_postcode: string;
  site_manager: string;
}

export interface PDFGenerationOptions {
  contract: ContractPDFData;
  companySettings: any;
}

export interface ContractFilters {
  searchQuery: string;
}

export interface ContractActions {
  onEdit: (contract: Contract) => void;
  onDelete: (contract: Contract) => void;
  onGeneratePDF: (contract: Contract) => void;
}

export interface ContractState {
  contracts: Contract[];
  searchQuery: string;
  generatingPDF: boolean;
  pdfError: string | null;
  showContractsForm: boolean;
  selectedContract: Contract | null;
  showDeleteModal: boolean;
  contractToDelete: Contract | null;
}
