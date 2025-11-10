export interface PaymentInfoData {
  bank_name: string;
  account_number: string;
  sort_code: string;
  terms: string;
}

export interface PaymentInfoProps {
  onBack: () => void;
}

export interface QuoteTermsProps {
  onBack: () => void;
}

export interface QuoteFormProps {
  onClose: () => void;
  onSuccess: () => void;
  quoteToEdit?: Quote | null;
  preselectedProject?: Project | null;
  disableProjectSelection?: boolean;
}

export interface QuotesListProps {
  quotes: Quote[];
  onQuoteChange: () => void;
  onBack: () => void;
  hideBreadcrumbs?: boolean;
  customerName?: string;
  preselectedProject?: Project | null;
  disableProjectSelection?: boolean;
}

export type SortField = 'quote_number' | 'quote_date' | 'customer' | 'amount' | 'status';
export type SortDirection = 'asc' | 'desc';

export enum FormStep {
  DETAILS = 0,
  ITEMS = 1,
  NOTES = 2
}

// Re-export database types
export type { Quote, Project, Customer, QuoteItem } from '../../../types/database';
