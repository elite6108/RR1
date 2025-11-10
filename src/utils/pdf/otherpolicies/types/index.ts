import type { CompanySettings } from '../../../../types/database';

export interface PolicySection {
  id: string;
  title: string;
  content: string;
}

export interface GeneratePDFOptions {
  title: string;
  content: string;
  policyNumber: number;
  companySettings: CompanySettings;
  createdAt?: string;
  updatedAt?: string;
}

export interface PDFTheme {
  themeColor: string;
  headerColor: string;
  cellBackgroundColor: string;
  borderColor: [number, number, number];
}

export interface PDFDimensions {
  pageWidth: number;
  leftColumnX: number;
  rightColumnX: number;
  boxWidth: number;
}
