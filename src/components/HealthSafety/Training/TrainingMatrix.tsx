import React from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft } from 'lucide-react';
import type { TrainingMatrixProps } from './types';
import { useTrainingMatrix } from './hooks/useTrainingMatrix';
import { TrainingForm } from './form/TrainingForm';
import { TrainingSearchBar } from './components/TrainingSearchBar';
import { TrainingTable } from './components/TrainingTable';
import { TrainingCard } from './components/TrainingCard';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { ViewTrainingModal } from './components/ViewTrainingModal';

export function TrainingMatrix({ onBack }: TrainingMatrixProps) {
  const {
    // State
    trainingData,
    filteredData,
    loading,
    searchQuery,
    showTrainingModal,
    showEditModal,
    selectedTraining,
    showViewModal,
    showDeleteModal,
    trainingToDelete,
    certificateUrls,

    // Actions
    setSearchQuery,
    handleViewTraining,
    handleEditTraining,
    handleDeleteTraining,
    confirmDelete,
    handleAddTraining,
    handleTrainingSuccess,
    handleEditSuccess,
    closeViewModal,
    cancelDelete
  } = useTrainingMatrix();

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-white mb-6">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900 dark:text-white dark:hover:text-gray-200"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Training
        </button>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-semibold text-gray-900">
          Training Records
        </h2>
      </div>

      {/* Search Bar with Add Button */}
      <TrainingSearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onAddTraining={handleAddTraining}
      />

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <TrainingTable
            trainingData={trainingData}
            filteredData={filteredData}
            loading={loading}
            onEdit={handleEditTraining}
            onView={handleViewTraining}
            onDelete={handleDeleteTraining}
          />

          {/* Mobile/Tablet Cards */}
          <div className="lg:hidden">
            <div className="space-y-4">
              {filteredData.map((training) => (
                <TrainingCard
                  key={training.id}
                  training={training}
                  onEdit={handleEditTraining}
                  onView={handleViewTraining}
                  onDelete={handleDeleteTraining}
                />
              ))}
              {filteredData.length === 0 && (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-8 text-center">
                  <p className="text-gray-500 dark:text-gray-400">No training entries found</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Training Form Modal for Adding */}
      {showTrainingModal && (
        createPortal(
          <TrainingForm onClose={handleTrainingSuccess} />,
          document.body
        )
      )}

      {/* Training Form Modal for Editing */}
      {showEditModal && selectedTraining && (
        createPortal(
          <TrainingForm 
            onClose={handleEditSuccess}
            editData={selectedTraining}
          />,
          document.body
        )
      )}

      {/* View Training Modal */}
      <ViewTrainingModal
        isOpen={showViewModal}
        selectedTraining={selectedTraining}
        certificateUrls={certificateUrls}
        onClose={closeViewModal}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        trainingToDelete={trainingToDelete}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
}