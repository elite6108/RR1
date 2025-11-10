import React from 'react';
import type { Customer, Quote } from '../../Contracts/types';

export interface CustomerFormProps {
  onClose: () => void;
  onSuccess: () => void;
  customerToEdit?: Customer | null;
}

export interface CustomersListProps {
  customers: Customer[];
  onCustomerChange: () => void;
  setShowCustomerProjectsDashboard: (show: boolean) => void;
  setActiveSection: (section: string | null) => void;
}

export interface CustomerFormData {
  company_name: string;
  customer_name: string;
  address_line1: string;
  address_line2: string;
  town: string;
  county: string;
  post_code: string;
  phone: string;
  email: string;
}



export interface FormStepProps {
  formData: CustomerFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePhoneChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCountyChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export interface CustomerTableProps {
  customers: Customer[];
  loading: boolean;
  onCustomerClick: (customer: Customer) => void;
  onEditCustomer: (customer: Customer) => void;
  onDeleteCustomer: (customerId: string) => void;
}

export interface CustomerCardProps {
  customer: Customer;
  onCustomerClick: (customer: Customer) => void;
  onEditCustomer: (customer: Customer) => void;
  onDeleteCustomer: (customerId: string) => void;
}

export interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAddCustomer: () => void;
}

export interface DeleteConfirmModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export interface CustomerQuotesViewProps {
  customer: Customer;
  quotes: Quote[];
  loading: boolean;
  error: string | null;
  onBack: () => void;
  setShowCustomerProjectsDashboard: (show: boolean) => void;
  setActiveSection: (section: string | null) => void;
}