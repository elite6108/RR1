import React from 'react';
import { createPortal } from 'react-dom';
import { AlertTriangle } from 'lucide-react';
import { usePurchaseOrdersList } from './hooks/usePurchaseOrdersList';
import { SearchBar } from './components/SearchBar';
import { PurchaseOrderTable } from './components/PurchaseOrderTable';
import { PurchaseOrderCard } from './components/PurchaseOrderCard';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { PurchaseOrderForm } from './PurchaseOrderForm';
import { filterOrders } from './utils/constants';
import type { PurchaseOrdersListProps } from './types';

export function PurchaseOrdersList({
  orders,
  onOrderChange,
  onBack,
  hideBreadcrumbs = false,
  preselectedProject,
  disableProjectSelection = false,
}: PurchaseOrdersListProps) {
  const {
    showPurchaseOrderModal,
    showDeleteModal,
    orderToDelete,
    orderToEdit,
    generatingPdfId,
    pdfError,
    searchQuery,
    companyPrefix,
    purchaseOrders,
    loading,
    setSearchQuery,
    setPdfError,
    handleDeleteOrder,
    handleEditOrder,
    handleGeneratePDF,
    confirmDelete,
    handleAddOrder,
    closePurchaseOrderModal,
    handleOrderSuccess,
    cancelDelete,
    getSupplierName,
    getProjectName,
    formatDate,
    formatNumber,
  } = usePurchaseOrdersList({
    orders,
    onOrderChange,
    preselectedProject,
    disableProjectSelection,
  });

  const filteredOrders = filterOrders(purchaseOrders, searchQuery, getSupplierName, getProjectName);

  return (
    <div className="space-y-6">
      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onAddOrder={handleAddOrder}
        hideBreadcrumbs={hideBreadcrumbs}
        onBack={onBack}
      />

      {pdfError && (
        <div className="mb-4 flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-4 rounded-md">
          <AlertTriangle className="h-5 w-5 flex-shrink-0" />
          <p>{pdfError}</p>
          <button
            onClick={() => setPdfError(null)}
            className="ml-auto text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
          >
            ×
          </button>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 shadow-lg overflow-hidden sm:rounded-lg">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-8 text-center text-gray-500 dark:text-gray-400">
            {searchQuery ? 'No purchase orders found matching your search.' : 'No purchase orders found'}
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <PurchaseOrderTable
              orders={filteredOrders}
              generatingPdfId={generatingPdfId}
              onEdit={handleEditOrder}
              onDelete={handleDeleteOrder}
              onGeneratePDF={handleGeneratePDF}
              getSupplierName={getSupplierName}
              getProjectName={getProjectName}
              formatDate={formatDate}
              formatNumber={formatNumber}
              companyPrefix={companyPrefix}
            />

            {/* Mobile/Tablet Cards */}
            <div className="lg:hidden">
              <div className="space-y-4 p-4">
                {filteredOrders.map((order) => (
                  <PurchaseOrderCard
                    key={order.id}
                    order={order}
                    generatingPdfId={generatingPdfId}
                    onEdit={handleEditOrder}
                    onDelete={handleDeleteOrder}
                    onGeneratePDF={handleGeneratePDF}
                    getSupplierName={getSupplierName}
                    getProjectName={getProjectName}
                    formatDate={formatDate}
                    formatNumber={formatNumber}
                    companyPrefix={companyPrefix}
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Purchase Order Form Modal */}
      {showPurchaseOrderModal && createPortal(
        <PurchaseOrderForm
          onClose={closePurchaseOrderModal}
          onSuccess={handleOrderSuccess}
          orderToEdit={orderToEdit}
          preselectedProject={preselectedProject}
          disableProjectSelection={disableProjectSelection}
        />,
        document.body
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        orderToDelete={orderToDelete}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
}