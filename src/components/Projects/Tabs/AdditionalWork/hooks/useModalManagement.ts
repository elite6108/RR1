import { useState, useEffect } from 'react';
import { AdditionalWork, NewWorkForm } from '../types';
import { CONSTANTS, toggleBodyScroll } from '../utils';

/**
 * Hook for managing modal states and form data
 */
export const useModalManagement = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [workToDelete, setWorkToDelete] = useState<AdditionalWork | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingWorkId, setEditingWorkId] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  
  const [newWork, setNewWork] = useState<NewWorkForm>({
    title: '',
    description: '',
    agreed_amount: '',
    agreed_with: '',
    vat_type: CONSTANTS.DEFAULT_VAT_TYPE
  });

  // Handle body scroll prevention when modals are open
  useEffect(() => {
    const isModalOpen = showAddModal || showDeleteModal;
    const cleanup = toggleBodyScroll(isModalOpen);
    return cleanup;
  }, [showAddModal, showDeleteModal]);

  // Reset form to initial state
  const resetForm = () => {
    setNewWork({
      title: '',
      description: '',
      agreed_amount: '',
      agreed_with: '',
      vat_type: CONSTANTS.DEFAULT_VAT_TYPE
    });
    setCurrentStep(1);
    setIsEditing(false);
    setEditingWorkId(null);
  };

  // Open add modal
  const openAddModal = () => {
    resetForm();
    setShowAddModal(true);
  };

  // Close add modal
  const closeAddModal = () => {
    setShowAddModal(false);
    resetForm();
  };

  // Open edit modal with existing work data
  const openEditModal = (work: AdditionalWork) => {
    setNewWork({
      title: work.title,
      description: work.description,
      agreed_amount: work.agreed_amount.toString(),
      agreed_with: work.agreed_with,
      vat_type: work.vat_type || CONSTANTS.DEFAULT_VAT_TYPE
    });
    setIsEditing(true);
    setEditingWorkId(work.id);
    setCurrentStep(1);
    setShowAddModal(true);
  };

  // Open delete modal
  const openDeleteModal = (work: AdditionalWork) => {
    setWorkToDelete(work);
    setShowDeleteModal(true);
  };

  // Close delete modal
  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setWorkToDelete(null);
  };

  // Step navigation
  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, CONSTANTS.TOTAL_STEPS));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  return {
    // Modal states
    showAddModal,
    showDeleteModal,
    workToDelete,
    isEditing,
    editingWorkId,
    
    // Form states
    newWork,
    setNewWork,
    currentStep,
    
    // Modal actions
    openAddModal,
    closeAddModal,
    openEditModal,
    openDeleteModal,
    closeDeleteModal,
    resetForm,
    
    // Step navigation
    nextStep,
    prevStep,
  };
};
