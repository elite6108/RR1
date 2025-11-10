export interface SignOffPDFOptions {
  projectName: string;
  date: string;
  projectId: string;
  signoffId: string;
}

export interface CompanyInfo {
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

export interface ProjectDetails {
  customer: {
    company_name?: string;
    customer_name?: string;
  };
  projectName: string;
  project_manager: string;
  quote_number?: string;
  contract_id?: string;
  payment_amount: number;
  project_start_date: string;
}

export interface SignoffData {
  companySettings: CompanyInfo;
  project: any;
  signoff: any;
  customer: {
    company_name?: string;
    customer_name?: string;
  };
  contract: any;
}
