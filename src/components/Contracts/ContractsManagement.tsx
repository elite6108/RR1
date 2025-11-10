import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft } from 'lucide-react';
import type { ContractsManagementProps } from './types';
import { useContractsManagement } from './hooks/useContractsManagement';
import { usePDFGeneration } from './hooks/usePDFGeneration';
import { ContractsForm } from './components/ContractsForm/ContractsForm';
import { ContractsSearchBar } from './components/ContractsSearchBar';
import { ContractTable } from './components/ContractTable';
import { ContractCard } from './components/ContractCard';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { ErrorMessage } from './components/ErrorMessage';
import { SuccessMessage } from './components/SuccessMessage';

export function ContractsManagement({ 
  setShowContractsManagement,
  setShowCustomerProjectsDashboard,
}: ContractsManagementProps) {
  const {
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
  } = useContractsManagement();

  const { handleGeneratePDF } = usePDFGeneration();

  useEffect(() => {
    fetchContracts();
  }, []);

  const onGeneratePDF = (contract: any) => {
    handleGeneratePDF(contract, setGeneratingPdfId, setPdfError);
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 text-sm text-gray-500 dark:text-white mb-6">
        <button
          onClick={() => {
            setShowContractsManagement(false);
            setShowCustomerProjectsDashboard(true);
          }}
          className="flex items-center text-gray-600 hover:text-gray-900 dark:text-white dark:hover:text-gray-200"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Customers & Projects
        </button>
         </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Contracts Management</h2>
      </div>

      {/* Search Box with Add Button */}
      <ContractsSearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onAddContract={handleAddContract}
      />

      {error && <ErrorMessage error={error} />}
      {successMessage && <SuccessMessage message={successMessage} />}
      {pdfError && <ErrorMessage error={pdfError} variant="pdf-error" />}

      {showContractsForm && createPortal(
        <ContractsForm
          onClose={closeContractForm}
          onSuccess={handleContractSuccess}
        />,
        document.body
      )}

      {/* Contracts Table */}
      <div className="bg-white dark:bg-gray-800 shadow-lg overflow-hidden rounded-lg">
        {/* Desktop Table */}
        <ContractTable
          contracts={contracts}
          loading={loading}
          searchQuery={searchQuery}
          generatingPdfId={generatingPdfId}
          onEdit={handleEdit}
          onGeneratePDF={onGeneratePDF}
          onDelete={handleDelete}
        />

        {/* Mobile/Tablet Cards */}
        <div className="lg:hidden">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : contracts.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No contracts found
            </div>
          ) : (
            <div className="space-y-4 p-4">
              {contracts
                .filter(contract => {
                  const query = searchQuery.toLowerCase();
                  if (!query) return true;
                  
                  return (
                    contract.customer?.company_name?.toLowerCase().includes(query) ||
                    contract.customer?.customer_name?.toLowerCase().includes(query) ||
                    contract.project_name?.toLowerCase().includes(query) ||
                    contract.description_of_works?.toLowerCase().includes(query) ||
                    contract.site_address?.toLowerCase().includes(query) ||
                    new Date(contract.contract_date).toLocaleDateString().toLowerCase().includes(query)
                  );
                })
                .map((contract) => (
                  <ContractCard
                    key={contract.id}
                    contract={contract}
                    generatingPdfId={generatingPdfId}
                    onEdit={handleEdit}
                    onGeneratePDF={onGeneratePDF}
                    onDelete={handleDelete}
                  />
                ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Form Modal */}
      {showEditForm && selectedContract && createPortal(
        <ContractsForm
          contract={selectedContract}
          onClose={closeEditForm}
          onSuccess={handleEditSuccess}
        />,
        document.body
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        contractToDelete={contractToDelete}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
} 