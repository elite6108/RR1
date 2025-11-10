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

export interface GeneratePDFOptions {
  additionalWork: AdditionalWork;
  projectName: string;
}

export interface PDFTheme {
  themeColor: string;
  headerColor: string;
  cellBackgroundColor: string;
  detailsHeaderColor: string;
  borderColor: [number, number, number];
}

export interface LogoDimensions {
  width: number;
  height: number;
  x: number;
  y: number;
}

export interface PageLayout {
  pageWidth: number;
  leftColumnX: number;
  rightColumnX: number;
  boxWidth: number;
}
