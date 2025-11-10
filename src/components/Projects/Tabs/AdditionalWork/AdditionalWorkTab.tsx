import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { AdditionalWorkTabProps } from './types';
import { useAdditionalWorks, useModalManagement, usePDFGeneration } from './hooks';
import { cleanNumericInput } from './utils';
import {
  SearchBar,
  AdditionalWorkTable,
  AdditionalWorkForm,
  DeleteModal,
  ErrorMessage,
  LoadingSpinner
} from './components';

/**
 * Main AdditionalWork tab component - refactored into smaller, manageable pieces
 */
const AdditionalWorkTab = ({ 
  projectId, 
  projectName 
}: AdditionalWorkTabProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Custom hooks for data management
  const {
    additionalWorks,
    loading,
    error,
    setError,
    createAdditionalWork,
    updateAdditionalWork,
    deleteAdditionalWork,
  } = useAdditionalWorks(projectId);

  // Custom hooks for modal and form management
  const {
    showAddModal,
    showDeleteModal,
    workToDelete,
    isEditing,
    editingWorkId,
    newWork,
    setNewWork,
    currentStep,
    openAddModal,
    closeAddModal,
    openEditModal,
    openDeleteModal,
    closeDeleteModal,
    nextStep,
    prevStep,
  } = useModalManagement();

  // Custom hook for PDF generation
  const {
    generatingPdfId,
    pdfError,
    generatePDF,
  } = usePDFGeneration();

  /**
   * Handle form submission for creating/updating additional work
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentStep === 1) {
      nextStep();
      return;
    }

    try {
      const workData = {
        title: newWork.title,
        description: newWork.description,
        agreed_amount: parseFloat(cleanNumericInput(newWork.agreed_amount)),
        agreed_with: newWork.agreed_with,
        vat_type: newWork.vat_type
      };

      let result;
      if (isEditing && editingWorkId) {
        result = await updateAdditionalWork(editingWorkId, workData);
      } else {
        result = await createAdditionalWork(workData);
      }

      if (result.success) {
        closeAddModal();
      } else {
        setError(result.error || 'An error occurred');
      }
    } catch (err) {
      console.error('Error saving additional work:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  /**
   * Handle delete confirmation
   */
  const handleDeleteConfirm = async (work: typeof workToDelete) => {
    if (!work) return;

    const result = await deleteAdditionalWork(work.id);
    if (result.success) {
      closeDeleteModal();
    }
  };

  /**
   * Handle PDF generation
   */
  const handleGeneratePDF = async (work: typeof additionalWorks[0]) => {
    await generatePDF(work, projectName);
  };

  /**
   * Handle search query changes
   */
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  // Show loading spinner while data is loading
  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      {/* Header */}
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
        Additional Work
      </h2>

      {/* Search and Add button */}
      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onAddClick={openAddModal}
      />

      {/* Error messages */}
      <ErrorMessage error={error} />
      <ErrorMessage error={pdfError} />

      {/* Table/Cards View */}
      <AdditionalWorkTable
        works={additionalWorks}
        onEdit={openEditModal}
        onDelete={openDeleteModal}
        onGeneratePDF={handleGeneratePDF}
        generatingPdfId={generatingPdfId}
        searchQuery={searchQuery}
      />

      {/* Add/Edit Modal */}
      {showAddModal && createPortal(
        <AdditionalWorkForm
          newWork={newWork}
          setNewWork={setNewWork}
          currentStep={currentStep}
          projectName={projectName}
          onSubmit={handleSubmit}
          onNext={nextStep}
          onPrev={prevStep}
          onCancel={closeAddModal}
          isEditing={isEditing}
        />,
        document.body
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && createPortal(
        <DeleteModal
          isOpen={showDeleteModal}
          workToDelete={workToDelete}
          onConfirm={handleDeleteConfirm}
          onCancel={closeDeleteModal}
        />,
        document.body
      )}
    </div>
  );
};

export default AdditionalWorkTab;
