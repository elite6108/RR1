import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { CPPForm } from './components/form-steps';
import { CPPHeader } from './components/CPPHeader';
import { CPPList } from './components/CPPList';
import { CPPDeleteModal } from './components/CPPDeleteModal';
import { useCPPData } from './hooks/useCPPData';
import { useCPPModals } from './hooks/useCPPModals';
import { useCPPSearch } from './hooks/useCPPSearch';
import { openCPPPDFInNewWindow } from './utils/pdfViewer';
import type { CPPsubpageProps } from './types';
import type { CPP } from '../../../types/database';

export function CPPsubpage({ onBack, setShowCPP }: CPPsubpageProps) {
  const [generatingPdfId, setGeneratingPdfId] = useState<string | null>(null);
  const [pdfError, setPdfError] = useState<string | null>(null);

  // Custom hooks
  const { loading, error, cpps, fetchData, deleteCPP } = useCPPData();
  const {
    showModal,
    showDeleteModal,
    selectedCPP,
    openEditModal,
    closeEditModal,
    openDeleteModal,
    closeDeleteModal,
  } = useCPPModals();
  const { searchQuery, setSearchQuery } = useCPPSearch(cpps);

  const handleBack = () => {
    setShowCPP(false);
    onBack();
  };

  const handleViewPDF = async (cpp: CPP) => {
    try {
      setGeneratingPdfId(cpp.id);
      setPdfError(null);
      await openCPPPDFInNewWindow(cpp);
    } catch (error) {
      console.error('Error generating PDF:', error);
      setPdfError(
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred while generating the PDF'
      );
    } finally {
      setGeneratingPdfId(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedCPP) return;

    try {
      await deleteCPP(selectedCPP.id);
      closeDeleteModal();
    } catch (error) {
      // Error is handled by the hook
    }
  };

  return (
    <div className="space-y-6">
      <CPPHeader
        onBack={handleBack}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onAddCPP={() => openEditModal()}
      />

      <CPPList
        cpps={cpps}
        loading={loading}
        error={error}
        pdfError={pdfError}
        searchQuery={searchQuery}
        generatingPdfId={generatingPdfId}
        onEdit={openEditModal}
        onViewPDF={handleViewPDF}
        onDelete={openDeleteModal}
      />

      {/* CPP Form Modal */}
      {showModal && createPortal(
        <CPPForm
          onClose={closeEditModal}
          onSuccess={() => {
            fetchData();
            closeEditModal();
          }}
          cppToEdit={selectedCPP}
        />,
        document.body
      )}

      {/* Delete Confirmation Modal */}
      <CPPDeleteModal
        isOpen={showDeleteModal}
        onClose={closeDeleteModal}
        onConfirm={handleConfirmDelete}
        loading={loading}
      />
    </div>
  );
}
