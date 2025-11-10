import React, { useState, useEffect } from 'react';
import { ChevronLeft, Plus } from 'lucide-react';

// Import types
import { ActionPlanProps, ActionPlanItem } from './types';

// Import hooks
import { useActionPlans } from './hooks/useActionPlans';
import { useModal } from './hooks/useModal';
import { useFileUpload } from './hooks/useFileUpload';

// Import components
import { AddEditModal, DeleteModal, StatisticsWidgets, SectionList } from './components';

// Import constants and utilities
import { sections } from './utils/constants';

export function ActionPlan({ setShowActionPlan, setActiveSection, onShowReportingDashboard }: ActionPlanProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  
  // Use custom hooks
  const { actionPlans, addActionPlan, updateActionPlan, deleteActionPlan } = useActionPlans();
  const {
    isAdding,
    isEditing,
    currentStep,
    deleteModalOpen,
    itemToDelete,
    newActionPlan,
    setNewActionPlan,
    openAddModal,
    openEditModal,
    closeModal,
    handleNextStep,
    handlePrevStep,
    openDeleteModal,
    closeDeleteModal
  } = useModal();
  
  const {
    filePreviews,
    uploadingFiles,
    handleFileUpload,
    handleRemoveFile,
    loadExistingFiles,
    uploadFilesToStorage,
    clearFiles
  } = useFileUpload();

  // Load existing files when editing
  useEffect(() => {
    if (isEditing && newActionPlan.files) {
      loadExistingFiles(newActionPlan.files);
    } else if (isAdding) {
      clearFiles();
    }
  }, [isEditing, isAdding]);

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const handleAddItem = (section: string) => {
    openAddModal(section);
  };

  const handleEditItem = (plan: ActionPlanItem) => {
    openEditModal(plan);
  };

  const handleDeleteItem = (id: string) => {
    openDeleteModal(id);
  };

  const handleSave = async (editingId?: string) => {
    const uploadedFiles = await uploadFilesToStorage();
    const actionPlanData = {
      ...newActionPlan,
      files: uploadedFiles
    };

    let success = false;
    if (editingId) {
      success = await updateActionPlan(editingId, actionPlanData);
    } else {
      success = await addActionPlan(actionPlanData);
    }

    if (success) {
      closeModal();
      clearFiles();
    }
  };

  const handleConfirmDelete = async () => {
    if (itemToDelete) {
      const success = await deleteActionPlan(itemToDelete);
      if (success) {
        closeDeleteModal();
      }
    }
  };

  return (
    <>
      {/* Breadcrumb Navigation */}
      <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-white mb-6">
        <button
          onClick={() => {
            if (onShowReportingDashboard) {
              onShowReportingDashboard();
            } else {
              setShowActionPlan(false);
              setActiveSection('health');
            }
          }}
          className="flex items-center text-gray-600 hover:text-gray-900 dark:text-white dark:hover:text-gray-200"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Reporting
        </button>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Action Plan</h2>
   
      </div>

      {/* Add/Edit Modal */}
      <AddEditModal
        isOpen={isAdding || !!isEditing}
        isEditing={!!isEditing}
        editingId={isEditing}
        actionPlan={newActionPlan}
        onClose={closeModal}
        onSave={handleSave}
        onActionPlanChange={setNewActionPlan}
        currentStep={currentStep}
        onNextStep={handleNextStep}
        onPrevStep={handlePrevStep}
        filePreviews={filePreviews}
        onFileUpload={handleFileUpload}
        onRemoveFile={handleRemoveFile}
        uploadingFiles={uploadingFiles}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleConfirmDelete}
      />

      {/* Statistics Widgets */}
      <StatisticsWidgets actionPlans={actionPlans} />

      {/* Section List */}
      <SectionList
        sections={sections}
        actionPlans={actionPlans}
        expandedSections={expandedSections}
        onToggleSection={toggleSection}
        onAddItem={handleAddItem}
        onEditItem={handleEditItem}
        onDeleteItem={handleDeleteItem}
      />
    </>
  );
} 