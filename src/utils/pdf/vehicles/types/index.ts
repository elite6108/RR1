import type { VehicleChecklist, Vehicle, CompanySettings } from '../../../../types/database';

export interface GeneratePDFOptions {
  checklist: VehicleChecklist;
  vehicle: Vehicle;
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
  maxWidth: number;
  maxHeight: number;
  aspectRatio: number;
}

export interface TableStyles {
  fontSize: number;
  cellPadding: number;
  lineWidth: number;
  lineColor: [number, number, number];
}

export { VehicleChecklist, Vehicle, CompanySettings };
