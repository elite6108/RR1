import React from 'react';
import { ChevronLeft, Plus, Search, FileText } from 'lucide-react';
import { CoshhRegisterProps } from '../types';
import { useRegisterState } from '../hooks/useRegisterState';
import { useRegisterActions } from '../hooks/useRegisterActions';
import { handleDownloadRegister } from '../utils/pdfGenerator';
import { RegisterTable } from './RegisterTable';
import { RegisterModals } from './RegisterModals';

export function CoshhRegister({ onBack }: CoshhRegisterProps) {
  const {
    substances,
    loading,
    auditorName,
    formData,
    modalState,
    searchState,
    pdfState,
    customCategory,
    showCustomCategory,
    setFormData,
    setCustomCategory,
    setPdfState,
    fetchSubstances,
    normalizeCategories,
    openAddModal,
    openEditModal,
    openReviewModal,
    openDeleteModal,
    closeAllModals,
    nextStep,
    prevStep,
    updateSearchTerm,
    handleOtherToggle,
    handleAddCustomCategory
  } = useRegisterState();

  const { deleteSubstance, submitForm } = useRegisterActions();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate categories are selected before proceeding
    if (modalState.currentStep === 1 && formData.category.length === 0) {
      alert('Please select at least one category');
      return;
    }
    
    if (modalState.currentStep < 3) {
      nextStep();
      return;
    }

    try {
      let modalType: 'add' | 'edit' | 'review' = 'add';
      if (modalState.showEditModal) modalType = 'edit';
      if (modalState.showReviewModal) modalType = 'review';

      await submitForm(formData, auditorName, modalType, modalState.selectedSubstance || undefined);
      
      closeAllModals();
      fetchSubstances();
    } catch (error) {
      console.error('Error saving substance:', error);
      alert('Error saving substance. Please try again.');
    }
  };

  const handleConfirmDelete = async () => {
    if (!modalState.selectedSubstance) return;

    try {
      await deleteSubstance(modalState.selectedSubstance);
      closeAllModals();
      fetchSubstances();
    } catch (error) {
      console.error('Error deleting substance:', error);
      alert('Error deleting substance. Please try again.');
    }
  };

  const handleDownloadPDF = async () => {
    await handleDownloadRegister(substances, (loading) => 
      setPdfState({ downloadingPDF: loading })
    );
  };

  return (
    <div>
      {/* Breadcrumb Navigation */}
      <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-white mb-6">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900 dark:text-white dark:hover:text-gray-200"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to COSHH Management
        </button>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          COSHH Register
        </h2>
      </div>

      {/* Search and Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search substances..."
            value={searchState.searchTerm}
            onChange={(e) => updateSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div className="flex space-x-3 w-full sm:w-auto">
          <button
            onClick={handleDownloadPDF}
            disabled={pdfState.downloadingPDF || substances.length === 0}
            className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FileText className="h-4 w-4 mr-2" />
            {pdfState.downloadingPDF ? 'Generating...' : 'Download'}
          </button>
          <button
            onClick={openAddModal}
            className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Substance
          </button>
        </div>
      </div>

      {/* Substances Table */}
      <RegisterTable
        substances={searchState.filteredSubstances}
        loading={loading}
        onEdit={openEditModal}
        onReview={openReviewModal}
        onDelete={openDeleteModal}
        normalizeCategories={normalizeCategories}
      />

      {/* Modals */}
      <RegisterModals
        modalState={modalState}
        formData={formData}
        setFormData={setFormData}
        auditorName={auditorName}
        customCategory={customCategory}
        setCustomCategory={setCustomCategory}
        showCustomCategory={showCustomCategory}
        onOtherToggle={handleOtherToggle}
        onAddCustomCategory={handleAddCustomCategory}
        onSubmit={handleSubmit}
        onCloseModals={closeAllModals}
        onNextStep={nextStep}
        onPrevStep={prevStep}
        onConfirmDelete={handleConfirmDelete}
      />
    </div>
  );
}
