import type { PurchaseOrder, Project, Supplier, PurchaseOrderItem } from '../../../../types/database';

// Core interfaces
export interface PurchaseOrdersListProps {
  orders: PurchaseOrder[];
  onOrderChange: () => void;
  onBack: () => void;
  hideBreadcrumbs?: boolean;
  preselectedProject?: Project | null;
  disableProjectSelection?: boolean;
}

export interface PurchaseOrderFormProps {
  onClose: () => void;
  onSuccess: () => void;
  orderToEdit?: PurchaseOrder | null;
  preselectedProject?: Project | null;
  disableProjectSelection?: boolean;
  viewOnly?: boolean;
}

export interface PurchaseOrderCardProps {
  order: PurchaseOrder;
  generatingPdfId: string | null;
  onEdit: (order: PurchaseOrder) => void;
  onDelete: (orderId: string) => void;
  onGeneratePDF: (order: PurchaseOrder) => void;
  getSupplierName: (supplierId: string) => string;
  getProjectName: (projectId: string) => string;
  formatDate: (dateString: string) => string;
  formatNumber: (num: number) => string;
  companyPrefix: string;
}

export interface PurchaseOrderTableProps {
  orders: PurchaseOrder[];
  generatingPdfId: string | null;
  onEdit: (order: PurchaseOrder) => void;
  onDelete: (orderId: string) => void;
  onGeneratePDF: (order: PurchaseOrder) => void;
  getSupplierName: (supplierId: string) => string;
  getProjectName: (projectId: string) => string;
  formatDate: (dateString: string) => string;
  formatNumber: (num: number) => string;
  companyPrefix: string;
}

export interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAddOrder: () => void;
  hideBreadcrumbs?: boolean;
  onBack?: () => void;
}

export interface DeleteConfirmModalProps {
  isOpen: boolean;
  orderToDelete: string | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export interface FormStepProps {
  formData: any;
  projects?: Project[];
  suppliers?: Supplier[];
  loading?: boolean;
  error?: string | null;
  createdByName?: string;
  includeVat?: boolean;
  companyPrefix?: string;
  disableProjectSelection?: boolean;
  handleInputChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleProjectChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleSupplierChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleItemChange?: (index: number, field: keyof PurchaseOrderItem, value: any) => void;
  addItem?: () => void;
  removeItem?: (index: number) => void;
  setIncludeVat?: (value: boolean) => void;
}

export interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
}

// Form step enum
export enum FormStep {
  DETAILS = 0,
  ITEMS = 1,
  NOTES = 2
}

// Per options type
export type PerOption = 'Days' | 'Weeks' | 'Litres' | 'Each';

// Re-export types for convenience
export type { PurchaseOrder, Project, Supplier, PurchaseOrderItem };