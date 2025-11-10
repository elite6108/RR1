import type { CompanySettings } from '../../../../types/database';
import type { FirstAidNeedsAssessment } from '../../../../components/HealthSafety/FirstAid/FirstAidRiskAssessments/types/FirstAidNeedsAssessment';

export interface FirstAidPDFOptions {
  assessmentData: FirstAidNeedsAssessment;
  companySettings: CompanySettings;
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

export interface FirstAidSection {
  id: string;
  title: string;
  content: string | string[];
  type?: 'text' | 'list' | 'table';
}

export interface FirstAidPersonnel {
  id: string;
  fullName: string;
  phone: string;
}

export interface ProcessedFirstAidData {
  basicInfo: {
    assessmentId: string;
    assessmentDate: string;
    assessmentTitle: string;
    assessorName: string;
    reviewDate: string;
    assessorPosition?: string;
    organizationName?: string;
  };
  businessInfo: {
    natureOfBusiness: string;
    numberOfEmployees: string;
    publicVisitPremises: string;
  };
  sections: FirstAidSection[];
}

export interface ResourceItem {
  id: string;
  location: string;
  personResponsible: string;
}

export interface CustomResourceCategory {
  value: string;
  label: string;
  description: string;
  icon?: any;
  iconName?: string;
}