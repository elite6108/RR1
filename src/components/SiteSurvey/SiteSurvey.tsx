import React from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft } from 'lucide-react';
import type { SiteSurveyProps } from './types';
import { useSiteSurvey } from './hooks/useSiteSurvey';
import { usePDFGeneration } from './hooks/usePDFGeneration';
import { SiteSurveyForm } from './form/SiteSurveyForm';
import { SiteSurveyView } from './view/SiteSurveyView';
import { SurveySearchBar } from './components/SurveySearchBar';
import { SurveyTable } from './components/SurveyTable';
import { SurveyCard } from './components/SurveyCard';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';

export function SiteSurvey({ onBack }: SiteSurveyProps) {
  const {
    // State
    searchQuery,
    showForm,
    showViewModal,
    showDeleteModal,
    surveyToDelete,
    siteSurveys,
    loading,
    error,
    selectedSurvey,
    generatingPdfId,
    filteredSurveys,

    // Actions
    setSearchQuery,
    setGeneratingPdfId,
    setError,
    getCustomerName,
    getProjectName,
    formatDate,
    handleFormSuccess,
    openViewModal,
    openEditModal,
    openDeleteModal,
    handleDeleteSurvey,
    handleAddSurvey,
    closeViewModal,
    closeForm,
    cancelDelete
  } = useSiteSurvey();

  const { handleGeneratePDF } = usePDFGeneration();

  const onGeneratePDF = (survey: any) => {
    handleGeneratePDF(survey, setGeneratingPdfId, setError);
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-white mb-6">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900 dark:text-white dark:hover:text-gray-200"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Dashboard
        </button>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Site Survey Management</h2>
      </div>

      {/* Search Box with New Survey Button */}
      <SurveySearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onAddSurvey={handleAddSurvey}
      />

      {/* Surveys Table */}
      <div className="bg-white dark:bg-gray-800 shadow-lg overflow-hidden sm:rounded-lg">
        <SurveyTable
          surveys={siteSurveys}
          filteredSurveys={filteredSurveys}
          loading={loading}
          error={error}
          generatingPdfId={generatingPdfId}
          onView={openViewModal}
          onEdit={openEditModal}
          onGeneratePDF={onGeneratePDF}
          onDelete={openDeleteModal}
          getCustomerName={getCustomerName}
          getProjectName={getProjectName}
          formatDate={formatDate}
        />

            {/* Mobile/Tablet Cards */}
            <div className="lg:hidden">
              <div className="space-y-4 p-4">
                {filteredSurveys.map((survey) => (
              <SurveyCard
                    key={survey.id} 
                survey={survey}
                generatingPdfId={generatingPdfId}
                onView={openViewModal}
                onEdit={openEditModal}
                onGeneratePDF={onGeneratePDF}
                onDelete={openDeleteModal}
                getCustomerName={getCustomerName}
                getProjectName={getProjectName}
                formatDate={formatDate}
              />
            ))}
            {filteredSurveys.length === 0 && !loading && !error && (
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-8 text-center">
                <p className="text-gray-500 dark:text-gray-400">No surveys found. Please create a new survey.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Site Survey Form Modal (Create or Edit) */}
      {showForm && createPortal(
        <SiteSurveyForm
          onClose={closeForm}
          onSuccess={handleFormSuccess}
          surveyToEdit={selectedSurvey}
        />,
        document.body
      )}
      
      {/* Site Survey View Modal */}
      {showViewModal && selectedSurvey && createPortal(
        <SiteSurveyView
          survey={selectedSurvey}
          customerName={getCustomerName(selectedSurvey.customer_id)}
          projectName={getProjectName(selectedSurvey.project_id)}
          onClose={closeViewModal}
        />,
        document.body
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        surveyToDelete={surveyToDelete}
        onConfirm={handleDeleteSurvey}
        onCancel={cancelDelete}
      />
    </div>
  );
}