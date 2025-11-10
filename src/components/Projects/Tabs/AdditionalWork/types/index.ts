// AdditionalWork Types and Interfaces

export interface AdditionalWork {
  id: string;
  created_at: string;
  project_id: string;
  title: string;
  description: string;
  agreed_amount: number;
  agreed_with: string;
  vat_type?: string;
}

export interface AdditionalWorkTabProps {
  projectId: string;
  projectName: string;
}

export interface NewWorkForm {
  title: string;
  description: string;
  agreed_amount: string;
  agreed_with: string;
  vat_type: string;
}

export interface AdditionalWorkFormProps {
  newWork: NewWorkForm;
  setNewWork: React.Dispatch<React.SetStateAction<NewWorkForm>>;
  currentStep: number;
  projectName: string;
  onSubmit: (e: React.FormEvent) => void;
  onNext: () => void;
  onPrev: () => void;
  onCancel: () => void;
  isEditing: boolean;
}

export interface AdditionalWorkTableProps {
  works: AdditionalWork[];
  onEdit: (work: AdditionalWork) => void;
  onDelete: (work: AdditionalWork) => void;
  onGeneratePDF: (work: AdditionalWork) => void;
  generatingPdfId: string | null;
  searchQuery: string;
}

export interface DeleteModalProps {
  isOpen: boolean;
  workToDelete: AdditionalWork | null;
  onConfirm: (work: AdditionalWork) => void;
  onCancel: () => void;
}

export interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAddClick: () => void;
}

export interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
}

export interface PDFGenerationOptions {
  additionalWork: AdditionalWork;
  projectName: string;
}

export type VATType = 'Inc VAT' | 'Plus VAT';

export interface FormErrors {
  title?: string;
  description?: string;
  agreed_amount?: string;
  agreed_with?: string;
}
