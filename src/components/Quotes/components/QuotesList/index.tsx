import React from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, AlertCircle, AlertTriangle } from 'lucide-react';
import { useQuotesList } from '../../hooks/useQuotesList';
import { SearchBar } from './SearchBar';
import { QuoteTable } from './QuoteTable';
import { DeleteModal } from './DeleteModal';
import { QuoteForm } from '../QuoteForm';
import type { QuotesListProps } from '../../types';

export const QuotesList: React.FC<QuotesListProps> = ({
  quotes,
  onQuoteChange,
  onBack,
  hideBreadcrumbs = false,
  customerName,
  preselectedProject = null,
  disableProjectSelection = false,
}) => {
  const {
    showQuoteModal,
    setShowQuoteModal,
    showDeleteModal,
    setShowDeleteModal,
    quoteToDelete,
    setQuoteToDelete,
    quoteToEdit,
    setQuoteToEdit,
    loading,
    error,
    generatingPdfId,
    searchQuery,
    setSearchQuery,
    pdfError,
    sortField,
    sortDirection,
    sortedQuotes,
    handleSort,
    handleDeleteQuote,
    handleEditQuote,
    handleRowClick,
    handleViewPDF,
    confirmDelete,
  } = useQuotesList({ quotes, onQuoteChange });

  const handleAddQuote = () => {
    setQuoteToEdit(null);
    setShowQuoteModal(true);
    
    // Scroll to top on mobile when modal opens
    if (window.innerWidth < 640) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setQuoteToDelete(null);
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      {!hideBreadcrumbs && (
        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-white mb-6">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-900 dark:text-white dark:hover:text-gray-200"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Quote Management
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Quotes</h2>
          {customerName && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              for {customerName}
            </p>
          )}
        </div>
      </div>

      {/* Search Box with Add Button */}
      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onAddQuote={handleAddQuote}
      />

      {error && (
        <div className="mb-4 flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-4 rounded-md">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {pdfError && (
        <div className="mb-4 flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-4 rounded-md">
          <AlertTriangle className="h-5 w-5 flex-shrink-0" />
          <div>
            <p className="font-medium">Error generating PDF</p>
            <p>{pdfError}</p>
          </div>
        </div>
      )}

      {/* Main Content - Table */}
      <QuoteTable
        sortedQuotes={sortedQuotes}
        loading={loading}
        searchQuery={searchQuery}
        sortField={sortField}
        sortDirection={sortDirection}
        generatingPdfId={generatingPdfId}
        handleSort={handleSort}
        handleRowClick={handleRowClick}
        handleEditQuote={handleEditQuote}
        handleViewPDF={handleViewPDF}
        handleDeleteQuote={handleDeleteQuote}
      />

      {/* Quote Form Modal */}
      {showQuoteModal && createPortal(
        <QuoteForm
          onClose={() => {
            setShowQuoteModal(false);
            setQuoteToEdit(null);
          }}
          onSuccess={() => {
            onQuoteChange();
            setShowQuoteModal(false);
            setQuoteToEdit(null);
          }}
          quoteToEdit={quoteToEdit}
          preselectedProject={preselectedProject}
          disableProjectSelection={disableProjectSelection}
        />,
        document.body
      )}

      {/* Delete Confirmation Modal */}
      <DeleteModal
        showDeleteModal={showDeleteModal}
        onCancel={handleCancelDelete}
        onConfirm={confirmDelete}
      />
    </div>
  );
};
