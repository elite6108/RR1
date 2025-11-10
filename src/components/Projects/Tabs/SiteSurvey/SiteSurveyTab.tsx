import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Search, Plus } from 'lucide-react';
import { SiteSurveyForm } from '../../../SiteSurvey/form/SiteSurveyForm';
import { SiteSurveyView } from '../../../SiteSurvey/view/SiteSurveyView';
import { SiteSurveyTabProps } from './types';
import { useSiteSurveyActions } from './hooks/useSiteSurveyActions';
import { filterSiteSurveys } from './utils';
import { DeleteModal, SiteSurveyTable, SiteSurveyCardList } from './components';

export function SiteSurveyTab({ project, isLoading, onSiteSurveysChange }: SiteSurveyTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  
  const {
    siteSurveysList,
    error,
    showSiteSurveyForm,
    showViewModal,
    selectedSiteSurvey,
    showDeleteModal,
    handleEdit,
    handleView,
    handleDelete,
    handleAddNew,
    confirmDelete,
    handleFormClose,
    handleFormSuccess,
    handleViewClose,
    handleDeleteCancel
  } = useSiteSurveyActions({ project, onSiteSurveysChange });

  const filteredSiteSurveys = filterSiteSurveys(siteSurveysList, searchQuery);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Site Surveys</h2>

      {/* Search and Add button row */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            placeholder="Search by customer, project, or date..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <button
          onClick={handleAddNew}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shrink-0"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Site Survey
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 rounded-md bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
          <p>{error}</p>
        </div>
      )}

      {/* Site Surveys Table/Cards */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <SiteSurveyTable 
          surveys={filteredSiteSurveys}
          searchQuery={searchQuery}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
        <SiteSurveyCardList 
          surveys={filteredSiteSurveys}
          searchQuery={searchQuery}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {/* Site Survey Form Modal */}
      {showSiteSurveyForm && createPortal(
        <SiteSurveyForm
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
          surveyToEdit={selectedSiteSurvey}
          isProjectContext={true}
        />,
        document.body
      )}
      
      {/* Site Survey View Modal */}
      {showViewModal && selectedSiteSurvey && createPortal(
        <SiteSurveyView
          survey={selectedSiteSurvey}
          customerName={selectedSiteSurvey.customer_name || 'Unknown Customer'}
          projectName={selectedSiteSurvey.project_name || 'Unknown Project'}
          onClose={handleViewClose}
        />,
        document.body
      )}

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={showDeleteModal}
        onCancel={handleDeleteCancel}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
