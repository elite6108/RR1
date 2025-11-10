import React from 'react';
import type { ContractsTabProps } from './types';
import { useContracts, useContractPDF, useContractState } from './hooks';
import { filterContracts } from './utils';
import {
  ContractSearch,
  ContractTable,
  ContractCards,
  DeleteConfirmationModal,
  ContractFormModal,
  ErrorMessage,
  LoadingSpinner
} from './components';

export function ContractsTab({ project, isLoading, onContractsChange }: ContractsTabProps) {
  // Custom hooks for state management
  const {
    contracts: contractsList,
    isLoading: contractsLoading,
    error: contractsError,
    fetchContracts,
    deleteContract
  } = useContracts(project, onContractsChange);

  const {
    generatingPDF,
    pdfError,
    generatePDF,
    clearError
  } = useContractPDF();

  const {
    searchQuery,
    showContractsForm,
    selectedContract,
    showDeleteModal,
    contractToDelete,
    setSearchQuery,
    handleEdit,
    handleDelete,
    handleAddContract,
    handleCloseForm,
    handleCloseDeleteModal
  } = useContractState();
  // Filter contracts based on search query
  const filteredContracts = filterContracts(contractsList, searchQuery);

  // Handle contract deletion confirmation
  const handleConfirmDelete = async () => {
    if (!contractToDelete) return;

    try {
      await deleteContract(contractToDelete.id);
      handleCloseDeleteModal();
    } catch (error) {
      console.error('Failed to delete contract:', error);
    }
  };

  // Handle form success
  const handleFormSuccess = () => {
    handleCloseForm();
    fetchContracts();
  };

  // Show loading spinner if contracts are loading
  if (isLoading || contractsLoading) {
    return <LoadingSpinner message="Loading contracts..." />;
  }

  return (
    <div>
      {/* Header */}
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Contracts</h2>

      {/* Search and Add button */}
      <ContractSearch
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onAddContract={handleAddContract}
      />

      {/* Error Messages */}
      <ErrorMessage error={pdfError} onDismiss={clearError} />
      <ErrorMessage error={contractsError} />

      {/* Contracts Display */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        {filteredContracts.length === 0 && searchQuery ? (
            <div className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
            No contracts match your search criteria
            </div>
          ) : (
          <>
            {/* Desktop Table View */}
            <ContractTable
              contracts={filteredContracts}
              project={project}
              generatingPDF={generatingPDF}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onGeneratePDF={generatePDF}
            />

            {/* Mobile Card View */}
            <ContractCards
              contracts={filteredContracts}
              project={project}
              generatingPDF={generatingPDF}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onGeneratePDF={generatePDF}
            />
          </>
        )}
      </div>

      {/* Contract Form Modal */}
      <ContractFormModal
        isOpen={showContractsForm}
          contract={selectedContract}
        project={project}
        onClose={handleCloseForm}
        onSuccess={handleFormSuccess}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        contract={contractToDelete}
        onConfirm={handleConfirmDelete}
        onCancel={handleCloseDeleteModal}
      />
    </div>
  );
} 