import type { CPP, CompanySettings } from '../../types/database';

export interface GeneratePDFOptions {
  cpp: CPP;
  companySettings: CompanySettings;
}

export interface SectionConfig {
  title: string;
  data: any;
  fields: string[];
}

export interface HazardIdentificationSection {
  title: string;
  options: Record<string, string>;
}

export interface HazardIdentificationSections {
  [key: string]: HazardIdentificationSection;
}

export interface AddressData {
  line1?: string;
  line2?: string;
  town?: string;
  county?: string;
  postCode?: string;
}

export interface ContactMember {
  name: string;
  role: string;
  contact?: string;
}

export interface ContractorData {
  companyName?: string;
  trade?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
}

export interface HazardData {
  id?: string;
  title: string;
  beforeTotal?: string;
  afterTotal?: string;
  beforeSeverity?: string;
  afterSeverity?: string;
  beforeLikelihood?: string;
  afterLikelihood?: string;
  controlMeasures?: Array<{ description: string }>;
  howMightBeHarmed?: string;
  whoMightBeHarmed?: string;
}

export interface SpecificMeasureItem {
  code: string;
  category: string;
  title: string;
  description: string;
  controlMeasure: string;
}

export interface ArrangementItem {
  type: string;
  cover: string;
}

export interface ContactNumber {
  name: string;
  number: string;
  purpose: string;
}

export interface RoleData {
  role: string;
  name: string;
  contact: string;
}
