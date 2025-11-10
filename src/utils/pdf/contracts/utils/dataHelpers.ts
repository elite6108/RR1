/*
 * Data fetching utilities for contract PDF generation
 */

import { supabase } from '../../../../lib/supabase';
import {
  Contract,
  CompanySettings,
  ContractData,
  SubcontractorData,
  SubcontractorDetails,
  CustomerData,
  PaymentTermsData,
  QuoteData,
  ProjectData,
  ContractDates,
  SiteData,
} from '../types';

/**
 * Fetch company settings from database
 */
export async function fetchCompanySettings(): Promise<CompanySettings> {
  const { data: companySettingsData, error: companyError } = await supabase
    .from('company_settings')
    .select('*')
    .limit(1)
    .maybeSingle();

  if (companyError) {
    throw new Error(`Failed to load company settings: ${companyError.message}`);
  }
  if (!companySettingsData) {
    throw new Error('Company settings not found in the database');
  }

  return companySettingsData;
}

/**
 * Fetch contract data including customer address
 */
export async function fetchContractData(contractId: string): Promise<ContractData | null> {
  const { data: contractData, error: contractError } = await supabase
    .from('contracts')
    .select('customer_address, customer_id')
    .eq('id', contractId)
    .maybeSingle();

  if (contractError) {
    throw new Error(`Failed to load contract data: ${contractError.message}`);
  }

  return contractData;
}

/**
 * Fetch subcontractor data and details
 */
export async function fetchSubcontractorData(contractId: string): Promise<SubcontractorDetails[]> {
  // Fetch subcontractor data
  const { data: contractSubData, error: subcontractorError } = await supabase
    .from('contracts')
    .select('subcontractor_data')
    .eq('id', contractId)
    .maybeSingle();

  if (subcontractorError) {
    throw new Error(`Failed to load subcontractor data: ${subcontractorError.message}`);
  }

  // Fetch actual subcontractor details if we have subcontractor data
  let subcontractorDetails: SubcontractorDetails[] = [];
  if (contractSubData?.subcontractor_data && Array.isArray(contractSubData.subcontractor_data)) {
    const subcontractorIds = contractSubData.subcontractor_data.map(
      (sub: { subcontractor_id: string }) => sub.subcontractor_id
    );

    if (subcontractorIds.length > 0) {
      const { data: subData, error: subError } = await supabase
        .from('subcontractors')
        .select('id, company_name')
        .in('id', subcontractorIds);

      if (subError) {
        throw new Error(`Failed to load subcontractor details: ${subError.message}`);
      } else if (subData) {
        subcontractorDetails = contractSubData.subcontractor_data.map((sub: {
          manager: string;
          responsibilities: string;
          subcontractor_id: string;
        }) => {
          const subInfo = subData.find((s: { id: string; company_name?: string }) => 
            s.id === sub.subcontractor_id
          );
          return {
            companyName: subInfo?.company_name || 'Unknown Company',
            manager: sub.manager,
            responsibilities: sub.responsibilities
          };
        });
      }
    }
  }

  return subcontractorDetails;
}

/**
 * Fetch customer details if customer_id is available
 */
export async function fetchCustomerData(customerId?: string): Promise<CustomerData | null> {
  if (!customerId) return null;

  const { data: customerDetails, error: customerError } = await supabase
    .from('customers')
    .select(
      'company_name, customer_name, address_line1, address_line2, town, county, post_code, phone, email'
    )
    .eq('id', customerId)
    .maybeSingle();

  if (customerError) {
    throw new Error(`Failed to load customer details: ${customerError.message}`);
  }

  return customerDetails;
}

/**
 * Fetch payment terms for bank details
 */
export async function fetchPaymentTerms(): Promise<PaymentTermsData | null> {
  const { data: paymentTermsData, error: paymentTermsError } = await supabase
    .from('payment_terms')
    .select('bank_name, account_number, sort_code')
    .limit(1)
    .maybeSingle();

  if (paymentTermsError) {
    throw new Error(`Failed to load payment terms: ${paymentTermsError.message}`);
  }

  return paymentTermsData;
}

/**
 * Fetch quote information if quote_id is available
 */
export async function fetchQuoteData(quoteId?: string): Promise<string | null> {
  if (!quoteId) return null;

  const { data: quoteData, error: quoteError } = await supabase
    .from('quotes')
    .select('quote_number')
    .eq('id', quoteId)
    .maybeSingle();

  if (quoteError) {
    console.error('Failed to load quote information:', quoteError.message);
    return null;
  }

  return quoteData?.quote_number || null;
}

/**
 * Fetch project data including project manager
 */
export async function fetchProjectData(projectId?: string): Promise<ProjectData | null> {
  if (!projectId) return null;

  const { data: projectDetails, error: projectError } = await supabase
    .from('projects')
    .select('name, project_manager')
    .eq('id', projectId)
    .maybeSingle();

  if (projectError) {
    console.error('Failed to load project details:', projectError.message);
    return null;
  }

  return projectDetails;
}

/**
 * Fetch contract dates
 */
export async function fetchContractDates(contractId: string): Promise<ContractDates | null> {
  const { data: contractDates, error: contractDatesError } = await supabase
    .from('contracts')
    .select('project_start_date, estimated_end_date')
    .eq('id', contractId)
    .maybeSingle();

  if (contractDatesError) {
    console.error('Failed to load contract dates:', contractDatesError.message);
    return null;
  }

  return contractDates;
}

/**
 * Fetch site manager information if site_id is available
 */
export async function fetchSiteManager(siteId?: string): Promise<string | null> {
  if (!siteId) return null;

  const { data: siteData, error: siteError } = await supabase
    .from('sites')
    .select('site_manager')
    .eq('id', siteId)
    .maybeSingle();

  if (siteError) {
    console.error('Failed to load site information:', siteError.message);
    return null;
  }

  return siteData?.site_manager || null;
}

/**
 * Fetch site data for project information
 */
export async function fetchSiteData(siteId?: string): Promise<SiteData | null> {
  if (!siteId) return null;

  const { data: siteDetails, error: siteError } = await supabase
    .from('sites')
    .select('name, address, site_manager, phone')
    .eq('id', siteId)
    .maybeSingle();

  if (siteError) {
    console.error('Failed to load site details:', siteError.message);
    return null;
  }

  return siteDetails;
}
