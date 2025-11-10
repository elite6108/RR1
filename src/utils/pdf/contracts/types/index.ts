/*
 * TypeScript types and interfaces for contract PDF generation
 */

import { Contract, CompanySettings } from '../../../../types/database';

export interface GeneratePDFOptions {
  contract: Contract;
  companySettings: CompanySettings;
}

export interface ContractData {
  customer_address?: string;
  customer_id?: string;
}

export interface SubcontractorData {
  subcontractor_data?: Array<{
    subcontractor_id: string;
    manager: string;
    responsibilities: string;
  }>;
}

export interface SubcontractorDetails {
  companyName: string;
  manager: string;
  responsibilities: string;
}

export interface CustomerData {
  company_name?: string;
  customer_name?: string;
  address_line1?: string;
  address_line2?: string;
  town?: string;
  county?: string;
  post_code?: string;
  phone?: string;
  email?: string;
}

export interface PaymentTermsData {
  bank_name?: string;
  account_number?: string;
  sort_code?: string;
}

export interface QuoteData {
  quote_number?: string;
}

export interface ProjectData {
  name?: string;
  project_manager?: string;
}

export interface ContractDates {
  project_start_date?: string;
  estimated_end_date?: string;
}

export interface SiteData {
  name?: string;
  address?: string;
  site_manager?: string;
  phone?: string;
}

export interface ContractSection {
  title: string;
  content: string;
}

export interface PDFTableOptions {
  startY: number;
  head: any[][];
  body: any[][];
  theme?: string;
  headStyles?: any;
  styles?: any;
  margin?: any;
  tableWidth?: number;
}
