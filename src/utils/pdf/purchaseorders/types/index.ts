import type { PurchaseOrder, CompanySettings } from '../../../../types/database';

export interface GeneratePDFOptions {
  order: PurchaseOrder;
  companySettings: CompanySettings;
  supplierName: string;
  supplierAddress: string;
  projectName: string;
}

export interface PDFTheme {
  themeColor: string;
  headerColor: string;
  cellBackgroundColor: string;
  supplierHeaderColor: string;
  detailsHeaderColor: string;
  itemsHeaderColor: string;
  borderColor: [number, number, number];
}

export interface PDFDimensions {
  pageWidth: number;
  leftColumnX: number;
  rightColumnX: number;
  boxWidth: number;
}

export interface TableData {
  headers: string[][];
  data: any[][];
}

export interface SummaryCalculations {
  subtotal: number;
  vat: number;
  total: number;
}
