import type { CompanySettings } from '../../../../types/database';

export interface GeneratePDFOptions {
  talk: any; // We'll type this properly once we have the full toolbox talk type
  companySettings: CompanySettings;
}

export interface PDFTheme {
  themeColor: string;
  headerColor: string;
  cellBackgroundColor: string;
  detailsHeaderColor: string;
  borderColor: [number, number, number];
}

export interface PDFDimensions {
  pageWidth: number;
  leftColumnX: number;
  rightColumnX: number;
  boxWidth: number;
}

export interface LogoDimensions {
  width: number;
  height: number;
  x: number;
  y: number;
}
