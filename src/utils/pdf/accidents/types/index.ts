export interface GeneratePDFOptions {
  reportData: any;
  tableName: string;
}

export interface FormField {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'date' | 'datetime' | 'boolean' | 'array' | 'actions';
}

export interface FormSection {
  title: string;
  fields: FormField[];
}

export interface FormConfig {
  title: string;
  sections: FormSection[];
}

export interface FormFieldConfigs {
  [key: string]: FormConfig;
}

export interface CompanySettings {
  name: string;
  address_line1: string;
  address_line2?: string;
  town: string;
  county: string;
  post_code: string;
  phone: string;
  email: string;
  company_number?: string;
  vat_number?: string;
  logo_url?: string;
}

export interface ActionItem {
  title: string;
  description?: string;
  dueDate?: string;
}
