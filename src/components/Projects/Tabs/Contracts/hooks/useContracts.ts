import { useState, useEffect } from 'react';
import { supabase } from '../../../../../lib/supabase';
import type { Contract } from '../types';
import type { Project } from '../../../../../types/task';

export interface UseContractsReturn {
  contracts: Contract[];
  isLoading: boolean;
  error: string | null;
  fetchContracts: () => Promise<void>;
  deleteContract: (contractId: string) => Promise<void>;
}

export function useContracts(project: Project, onContractsChange?: () => void): UseContractsReturn {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContracts = async () => {
    if (!project?.id) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('contracts')
        .select(`
          *,
          projects:project_id(name),
          customer:customer_id(company_name, customer_name)
        `)
        .eq('project_id', project.id)
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      // Transform the data to match expected format
      const contractsWithProjectNames = data?.map(contract => ({
        ...contract,
        project_name: contract.projects?.name || 'Unknown Project'
      })) || [];

      console.log('Fetched contracts:', contractsWithProjectNames);
      setContracts(contractsWithProjectNames);
      
      if (onContractsChange) {
        onContractsChange();
      }
    } catch (error) {
      console.error('Error fetching contracts:', error);
      setError('Failed to fetch contracts');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteContract = async (contractId: string) => {
    try {
      setError(null);
      
      const { error: deleteError } = await supabase
        .from('contracts')
        .delete()
        .eq('id', contractId);

      if (deleteError) throw deleteError;

      await fetchContracts();
    } catch (error) {
      console.error('Error deleting contract:', error);
      setError('Failed to delete contract');
      throw error;
    }
  };

  useEffect(() => {
    if (project && project.id) {
      fetchContracts();
    }
  }, [project]);

  return {
    contracts,
    isLoading,
    error,
    fetchContracts,
    deleteContract
  };
}
