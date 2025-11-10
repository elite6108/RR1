import type { Quote, CompanySettings } from '../../../../types/database';

export interface GeneratePDFOptions {
  quote: Quote;
  companySettings: CompanySettings;
  customerName: string;
  customerAddress: string;
  projectName: string;
}

export interface PDFTheme {
  themeColor: string;
  headerColor: string;
  cellBackgroundColor: string;
  itemsHeaderColor: string;
  detailsHeaderColor: string;
  borderColor: [number, number, number];
}

export interface BankDetails {
  bank_name: string;
  account_number: string;
  sort_code: string;
  terms?: string;
}

export interface QuoteTerms {
  terms: string;
}

export interface PDFDimensions {
  pageWidth: number;
  leftColumnX: number;
  rightColumnX: number;
  boxWidth: number;
}
