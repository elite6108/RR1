import React from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, AlertTriangle } from 'lucide-react';
import { useSuppliersList } from './hooks/useSuppliersList';
import { SearchBar } from './components/SearchBar';
import { SupplierTable } from './components/SupplierTable';
import { SupplierCard } from './components/SupplierCard';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { OrdersModal } from './components/OrdersModal';
import { SupplierForm } from './SupplierForm';
import { PurchaseOrderForm } from '../PurchaseOrders/PurchaseOrderForm';
import { filterSuppliers } from './utils/constants';
import type { SuppliersListProps } from './types';

export function SuppliersList({
  suppliers,
  onSupplierChange,
  onBack,
}: SuppliersListProps) {
  const {
    // State
    showSupplierModal,
    showDeleteModal,
    supplierToDelete,
    supplierToEdit,
    loading,
    error,
    showOrdersModal,
    selectedSupplierOrders,
    selectedSupplierName,
    loadingOrders,
    selectedOrder,
    showOrderDetails,
    searchQuery,

    // Actions
    setError,
    setSearchQuery,
    handleDeleteSupplier,
    handleEditSupplier,
    handleSupplierClick,
    handleOrderClick,
    confirmDelete,
    handleAddSupplier,
    closeSupplierModal,
    handleSupplierSuccess,
    cancelDelete,
    closeOrdersModal,
    closeOrderDetails,
    handleOrderSuccess,
  } = useSuppliersList({ suppliers, onSupplierChange });

  const filteredSuppliers = filterSuppliers(suppliers, searchQuery);

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-white mb-6">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900 dark:text-white dark:hover:text-gray-200"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Purchase Orders
        </button>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Suppliers Management</h2>
      </div>

      {/* Search Box with Add Button */}
      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onAddSupplier={handleAddSupplier}
      />

      {error && (
        <div className="mb-4 flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-4 rounded-md">
          <AlertTriangle className="h-5 w-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Suppliers Table/Cards */}
      <div className="bg-white dark:bg-gray-800 shadow-lg overflow-hidden sm:rounded-lg">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : filteredSuppliers.length === 0 ? (
          <div className="py-8 text-center text-gray-500 dark:text-gray-400">
            No suppliers found
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <SupplierTable
              suppliers={filteredSuppliers}
              loading={loading}
              onEdit={handleEditSupplier}
              onDelete={handleDeleteSupplier}
              onViewOrders={handleSupplierClick}
            />

            {/* Mobile/Tablet Cards */}
            <div className="lg:hidden">
              <div className="space-y-4 p-4">
                {filteredSuppliers.map((supplier) => (
                  <SupplierCard
                    key={supplier.id}
                    supplier={supplier}
                    onEdit={handleEditSupplier}
                    onDelete={handleDeleteSupplier}
                    onViewOrders={handleSupplierClick}
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Supplier Form Modal */}
      {showSupplierModal && createPortal(
        <SupplierForm
          onClose={closeSupplierModal}
          onSuccess={handleSupplierSuccess}
          supplierToEdit={supplierToEdit}
        />,
        document.body
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        supplierToDelete={supplierToDelete}
        loading={loading}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />

      {/* Purchase Orders Modal */}
      <OrdersModal
        isOpen={showOrdersModal}
        supplierName={selectedSupplierName}
        orders={selectedSupplierOrders}
        loading={loadingOrders}
        onClose={closeOrdersModal}
        onOrderClick={handleOrderClick}
      />

      {/* Purchase Order Details Modal */}
      {showOrderDetails && selectedOrder && createPortal(
        <PurchaseOrderForm
          onClose={closeOrderDetails}
          onSuccess={handleOrderSuccess}
          orderToEdit={selectedOrder}
          viewOnly={true}
        />,
        document.body
      )}
    </div>
  );
}