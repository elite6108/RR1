import React from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft } from 'lucide-react';
import type { CustomersListProps } from './types';
import { useCustomersList } from './hooks/useCustomersList';
import { CustomerForm } from './CustomerForm';
import { SearchBar } from './components/SearchBar';
import { CustomerTable } from './components/CustomerTable';
import { CustomerCard } from './components/CustomerCard';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { ErrorMessage } from './components/ErrorMessage';
import { CustomerQuotesView } from './components/CustomerQuotesView';

export function CustomersList({
  customers,
  onCustomerChange,
  setShowCustomerProjectsDashboard,
  setActiveSection,
}: CustomersListProps) {
  const {
    // State
    showCustomerModal,
    showDeleteModal,
    customerToEdit,
    loading,
    error,
    selectedCustomer,
    customerQuotes,
    loadingQuotes,
    searchQuery,
    filteredCustomers,
    
    // Actions
    setSearchQuery,
    handleDeleteCustomer,
    handleEditCustomer,
    handleAddCustomer,
    handleCustomerClick,
    confirmDelete,
    cancelDelete,
    closeCustomerModal,
    handleCustomerSuccess,
    setSelectedCustomer
  } = useCustomersList(customers, onCustomerChange);

  if (selectedCustomer) {
    return (
      <CustomerQuotesView
        customer={selectedCustomer}
        quotes={customerQuotes}
        loading={loadingQuotes}
        error={error}
        onBack={() => setSelectedCustomer(null)}
        setShowCustomerProjectsDashboard={setShowCustomerProjectsDashboard}
        setActiveSection={setActiveSection}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-white mb-6">
        <button
          onClick={() => {
            setShowCustomerProjectsDashboard(true);
            setActiveSection('customers');
          }}
          className="flex items-center text-gray-600 hover:text-gray-900 dark:text-white dark:hover:text-gray-200"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Customers & Projects
        </button>

      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Customers Management</h2>
      </div>

      {/* Search Box with Add Button */}
      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onAddCustomer={handleAddCustomer}
      />

      {error && <ErrorMessage error={error} />}

      {/* Customers Table */}
      <div className="bg-white dark:bg-gray-800 shadow-lg overflow-hidden sm:rounded-lg">
        {/* Desktop Table */}
        <CustomerTable
          customers={filteredCustomers}
          loading={loading}
          onCustomerClick={handleCustomerClick}
          onEditCustomer={handleEditCustomer}
          onDeleteCustomer={handleDeleteCustomer}
        />

        {/* Mobile/Tablet Cards */}
        <div className="lg:hidden">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : filteredCustomers.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No customers found
            </div>
          ) : (
            <div className="space-y-4 p-4">
              {filteredCustomers.map((customer) => (
                <CustomerCard
                  key={customer.id}
                  customer={customer}
                  onCustomerClick={handleCustomerClick}
                  onEditCustomer={handleEditCustomer}
                  onDeleteCustomer={handleDeleteCustomer}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Customer Form Modal */}
      {showCustomerModal && createPortal(
        <CustomerForm
          onClose={closeCustomerModal}
          onSuccess={handleCustomerSuccess}
          customerToEdit={customerToEdit}
        />,
        document.body
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        loading={loading}
      />
    </div>
  );
}
