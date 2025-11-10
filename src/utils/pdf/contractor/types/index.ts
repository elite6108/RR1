import type {
  Subcontractor,
  CompanySettings,
  Review,
} from '../../../../types/database';

export interface GeneratePDFOptions {
  contractor: Subcontractor;
  companySettings: CompanySettings;
}

export interface PDFTheme {
  themeColor: string;
  headerColor: string;
  cellBackgroundColor: string;
  borderColor: number[];
}

export interface InsuranceType {
  key: string;
  title: string;
  data: any;
}

export interface SatisfactionRating {
  label: string;
  rating: any;
}

// Re-export the database types for convenience
export type { Subcontractor, CompanySettings, Review };
