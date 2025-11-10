import { supabase } from '../../../../lib/supabase';
import { CompanySettings } from '../types';

// Fetch company settings from database
export const fetchCompanySettings = async (): Promise<CompanySettings> => {
  const { data: companySettings, error: companyError } = await supabase
    .from('company_settings')
    .select('*')
    .limit(1)
    .maybeSingle();

  if (companyError) {
    throw new Error(`Failed to load company settings: ${companyError.message}`);
  }
  if (!companySettings) {
    throw new Error('Company settings not found');
  }

  return companySettings;
};

// Build company information display text
export const buildCompanyInfoText = (companySettings: CompanySettings): string => {
  return [
    companySettings.name,
    companySettings.address_line1,
    companySettings.address_line2 || '',
    `${companySettings.town}, ${companySettings.county}`,
    companySettings.post_code,
    '',
    companySettings.phone,
    companySettings.email
  ].filter(line => line).join('\n');
};

// Build footer parts for company information
export const buildFooterParts = (companySettings: CompanySettings): string[] => {
  const footerParts = [];
  if (companySettings.company_number) {
    footerParts.push(`Company Number: ${companySettings.company_number}`);
  }
  if (companySettings.vat_number) {
    footerParts.push(`VAT Number: ${companySettings.vat_number}`);
  }
  return footerParts;
};
