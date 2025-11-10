import { useState } from 'react';
import type { Contract, ContractState } from '../types';

export interface UseContractStateReturn extends ContractState {
  setSearchQuery: (query: string) => void;
  setShowContractsForm: (show: boolean) => void;
  setSelectedContract: (contract: Contract | null) => void;
  setShowDeleteModal: (show: boolean) => void;
  setContractToDelete: (contract: Contract | null) => void;
  handleEdit: (contract: Contract) => void;
  handleDelete: (contract: Contract) => void;
  handleAddContract: () => void;
  handleCloseForm: () => void;
  handleCloseDeleteModal: () => void;
}

export function useContractState(initialContracts: Contract[] = []): UseContractStateReturn {
  const [contracts, setContracts] = useState<Contract[]>(initialContracts);
  const [searchQuery, setSearchQuery] = useState('');
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [showContractsForm, setShowContractsForm] = useState(false);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [contractToDelete, setContractToDelete] = useState<Contract | null>(null);

  const handleEdit = (contract: Contract) => {
    setSelectedContract(contract);
    setShowContractsForm(true);
  };

  const handleDelete = (contract: Contract) => {
    setContractToDelete(contract);
    setShowDeleteModal(true);
  };

  const handleAddContract = () => {
    setSelectedContract(null);
    setShowContractsForm(true);
  };

  const handleCloseForm = () => {
    setShowContractsForm(false);
    setSelectedContract(null);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setContractToDelete(null);
  };

  return {
    contracts,
    searchQuery,
    generatingPDF,
    pdfError,
    showContractsForm,
    selectedContract,
    showDeleteModal,
    contractToDelete,
    setSearchQuery,
    setShowContractsForm,
    setSelectedContract,
    setShowDeleteModal,
    setContractToDelete,
    handleEdit,
    handleDelete,
    handleAddContract,
    handleCloseForm,
    handleCloseDeleteModal
  };
}
