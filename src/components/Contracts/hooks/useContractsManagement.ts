import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import type { Contract } from '../types';

export function useContractsManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showContractsForm, setShowContractsForm] = useState(false);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [contractToDelete, setContractToDelete] = useState<Contract | null>(null);
  const [generatingPdfId, setGeneratingPdfId] = useState<string | null>(null);
  const [pdfError, setPdfError] = useState<string | null>(null);

  // Prevent body scroll when modal is open
  useEffect(() => {
    const isModalOpen = showContractsForm || showEditForm || showDeleteModal;
    
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to restore scroll when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showContractsForm, showEditForm, showDeleteModal]);

  const fetchContracts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('contracts')
        .select(`
          *,
          projects:project_id(name),
          customer:customer_id(company_name, customer_name)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      // Transform the data to match expected format
      const contractsWithProjectNames = data?.map(contract => ({
        ...contract,
        project_name: contract.projects?.name || 'Unknown Project'
      })) || [];

      console.log('Fetched contracts:', contractsWithProjectNames);
      setContracts(contractsWithProjectNames);
    } catch (error) {
      setError('Failed to fetch contracts');
      console.error('Error fetching contracts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (contract: Contract) => {
    setSelectedContract(contract);
    setShowEditForm(true);
    
    // Scroll to top on mobile when modal opens
    if (window.innerWidth < 640) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleDelete = async (contract: Contract) => {
    setContractToDelete(contract);
    setShowDeleteModal(true);
    
    // Scroll to top on mobile when modal opens
    if (window.innerWidth < 640) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const confirmDelete = async () => {
    if (!contractToDelete) return;

    try {
      const { error } = await supabase
        .from('contracts')
        .delete()
        .eq('id', contractToDelete.id);

      if (error) throw error;

      setSuccessMessage('Contract deleted successfully');
      setShowDeleteModal(false);
      setContractToDelete(null);
      fetchContracts();
    } catch (error) {
      setError('Failed to delete contract');
      console.error('Error:', error);
    }
  };

  const handleAddContract = () => {
    setShowContractsForm(true);
    
    // Scroll to top on mobile when modal opens
    if (window.innerWidth < 640) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleContractSuccess = () => {
    setShowContractsForm(false);
    setSuccessMessage('Contract created successfully');
    fetchContracts();
  };

  const handleEditSuccess = () => {
    setShowEditForm(false);
    setSelectedContract(null);
    setSuccessMessage('Contract updated successfully');
    fetchContracts();
  };

  const closeContractForm = () => {
    setShowContractsForm(false);
  };

  const closeEditForm = () => {
    setShowEditForm(false);
    setSelectedContract(null);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setContractToDelete(null);
  };

  // Clear messages after some time
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 10000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (pdfError) {
      const timer = setTimeout(() => setPdfError(null), 10000);
      return () => clearTimeout(timer);
    }
  }, [pdfError]);

  return {
    // State
    searchQuery,
    error,
    successMessage,
    showContractsForm,
    contracts,
    loading,
    selectedContract,
    showEditForm,
    showDeleteModal,
    contractToDelete,
    generatingPdfId,
    pdfError,
    
    // Actions
    setSearchQuery,
    setError,
    setSuccessMessage,
    setGeneratingPdfId,
    setPdfError,
    fetchContracts,
    handleEdit,
    handleDelete,
    confirmDelete,
    handleAddContract,
    handleContractSuccess,
    handleEditSuccess,
    closeContractForm,
    closeEditForm,
    cancelDelete
  };
}