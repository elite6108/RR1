import { supabase } from '../../../../lib/supabase';
import type { SignoffData } from '../types';

/**
 * Fetches all required data for the sign-off PDF generation
 * @param projectId - The project ID
 * @param signoffId - The sign-off ID
 * @returns Promise containing all the fetched data
 */
export async function fetchSignoffData(projectId: string, signoffId: string): Promise<SignoffData> {
  try {
    // Fetch contract first
    const { data: contract, error: contractError } = await supabase
      .from('contracts')
      .select(`
        *,
        contract_id,
        quotes:quote_id (
          quote_number
        )
      `)
      .eq('project_id', projectId)
      .single();

    if (contractError) throw new Error(`Failed to load contract: ${contractError.message}`);
    if (!contract) throw new Error('Contract not found');

    // Then fetch all other data in parallel
    const [
      { data: companySettings, error: companyError },
      { data: project, error: projectError },
      { data: signoff, error: signoffError },
      { data: customer, error: customerError }
    ] = await Promise.all([
      supabase.from('company_settings').select('*').limit(1).maybeSingle(),
      supabase.from('projects').select('*').eq('id', projectId).single(),
      supabase.from('project_signoff').select('*').eq('id', signoffId).single(),
      supabase.from('customers').select('company_name, customer_name').eq('id', contract.customer_id).single()
    ]);

    // Validate all required data
    if (companyError) throw new Error(`Failed to load company settings: ${companyError.message}`);
    if (!companySettings) throw new Error('Company settings not found');
    if (projectError) throw new Error(`Failed to load project: ${projectError.message}`);
    if (signoffError) throw new Error(`Failed to load signoff: ${signoffError.message}`);
    if (customerError) throw new Error(`Failed to load customer: ${customerError.message}`);

    return {
      companySettings,
      project,
      signoff,
      customer,
      contract
    };
  } catch (error) {
    console.error('Error fetching sign-off data:', error);
    throw new Error(`Failed to fetch sign-off data: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
