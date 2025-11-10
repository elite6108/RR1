import type { Supplier } from '../../../../types/database';

// Core interfaces
export interface SuppliersListProps {
  suppliers: Supplier[];
  onSupplierChange: () => void;
  onBack: () => void;
}

export interface SupplierFormProps {
  onClose: () => void;
  onSuccess: () => void;
  supplierToEdit?: Supplier | null;
}

export interface SupplierCardProps {
  supplier: Supplier;
  onEdit: (supplier: Supplier) => void;
  onDelete: (supplierId: string) => void;
  onViewOrders: (supplier: Supplier) => void;
}

export interface SupplierTableProps {
  suppliers: Supplier[];
  loading: boolean;
  onEdit: (supplier: Supplier) => void;
  onDelete: (supplierId: string) => void;
  onViewOrders: (supplier: Supplier) => void;
}

export interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAddSupplier: () => void;
}

export interface DeleteConfirmModalProps {
  isOpen: boolean;
  supplierToDelete: string | null;
  loading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export interface OrdersModalProps {
  isOpen: boolean;
  supplierName: string;
  orders: any[];
  loading: boolean;
  onClose: () => void;
  onOrderClick: (order: any) => void;
}

export interface FormStepProps {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

// Re-export Supplier type for convenience
export type { Supplier };