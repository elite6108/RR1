import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AlertTriangle } from 'lucide-react';
import { RAMSForm } from './components/form-steps/index';
import { handleExport, handleImport } from './utils/importExportUtils';

// Import hooks
import { useRAMSData, usePDFGeneration, useSearchAndSort, useModals } from './hooks';

// Import components
import {
  RAMSBreadcrumb,
  RAMSSearchBar,
  RAMSContent,
  DeleteConfirmationModal,
  RAMSImportExportModal
} from './components';

interface RAMSsubpageProps {
  onBack: () => void;
}

export function RAMSsubpage({ onBack }: RAMSsubpageProps) {
  // Custom hooks for data management
  const { loading, error, ramsEntries, fetchData, deleteRAMS, setError } = useRAMSData();
  const { generatingPdfId, pdfError, handleViewPDF } = usePDFGeneration();
  const { searchQuery, setSearchQuery, sortConfig, handleSort, sortedAndFilteredEntries } = useSearchAndSort(ramsEntries);
  const {
    showRAMSModal,
    showDeleteModal,
    selectedEntry,
    handleEdit,
    handleDelete,
    closeRAMSModal,
    closeDeleteModal,
    openNewRAMSModal
  } = useModals();

  // Import/Export state
  const [showImportExportModal, setShowImportExportModal] = useState(false);
  const [importExportMode, setImportExportMode] = useState<'export' | 'import'>('export');
  const [selectedForExport, setSelectedForExport] = useState<string | null>(null);

  // Prevent body scroll when any modal is open
  useEffect(() => {
    const isModalOpen = showRAMSModal || showDeleteModal || showImportExportModal;
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    // Cleanup function to restore scroll when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showRAMSModal, showDeleteModal, showImportExportModal]);

  const confirmDelete = async () => {
    if (!selectedEntry) return;
    
    try {
      await deleteRAMS(selectedEntry.id);
      closeDeleteModal();
    } catch (err) {
      // Error is already handled in the hook
    }
  };

  const onExport = () => {
    handleExport(selectedForExport, ramsEntries);
    setShowImportExportModal(false);
    setSelectedForExport(null);
  };

  const onImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    await handleImport(event, fetchData, setError);
    setShowImportExportModal(false);
  };

  const openImportExportModal = () => {
    setImportExportMode('export');
    setSelectedForExport(null);
    setShowImportExportModal(true);
  };

  return (
    <div className="h-full">
      {/* Breadcrumb Navigation */}
      <RAMSBreadcrumb onBack={onBack} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mt-4 mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Risk Assessment Method Statements</h2>
      </div>

      {/* Error Display */}
      {(error || pdfError) && (
        <div className="mb-4 flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-4 rounded-md">
          <AlertTriangle className="h-5 w-5 flex-shrink-0" />
          <p>{error || pdfError}</p>
        </div>
      )}

      {/* Search and Actions */}
      <RAMSSearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onAddNew={openNewRAMSModal}
        onImportExport={openImportExportModal}
      />

      {/* Main Content */}
      <RAMSContent
        loading={loading}
        entries={sortedAndFilteredEntries}
        searchQuery={searchQuery}
        sortConfig={sortConfig}
        onSort={handleSort}
        onEdit={handleEdit}
        onViewPDF={handleViewPDF}
        onDelete={handleDelete}
        generatingPdfId={generatingPdfId}
      />

      {/* RAMS Form Modal */}
      {showRAMSModal && (
        createPortal(
          <RAMSForm 
            onClose={closeRAMSModal}
            onSuccess={fetchData}
            ramsToEdit={selectedEntry}
          />,
          document.body
        )
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
      />

      {/* Import-Export Modal */}
      <RAMSImportExportModal
        show={showImportExportModal}
        onClose={() => {
          setShowImportExportModal(false);
          setSelectedForExport(null);
        }}
        mode={importExportMode}
        onModeChange={setImportExportMode}
        ramsEntries={ramsEntries}
        selectedForExport={selectedForExport}
        onExportSelectionChange={setSelectedForExport}
        onExport={onExport}
        onImport={onImport}
      />
    </div>
  );
}