import type { EquipmentChecklist, Equipment, CompanySettings } from '../../../../types/database';

export interface GeneratePDFOptions {
  checklist: EquipmentChecklist;
  equipment: Equipment;
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

export interface LogoOptions {
  maxWidth: number;
  maxHeight: number;
  aspectRatio: number;
  x: number;
  y: number;
}

export interface FooterData {
  companyNumber?: string;
  vatNumber?: string;
}

export { EquipmentChecklist, Equipment, CompanySettings };
