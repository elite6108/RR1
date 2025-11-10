import { useState, useEffect } from 'react';
import { ActionPlanItem } from '../types';
import { sections, sectionTypes } from '../utils/constants';
import { calculateNextDue } from '../utils/dateHelpers';

export const useModal = () => {
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  
  const [newActionPlan, setNewActionPlan] = useState<Partial<ActionPlanItem>>({
    section: sections[0],
    item: '',
    description: '',
    type: '',
    serials: '',
    notes: '',
    last_done: '',
    interval_months: '',
    next_due: '',
    issue: false,
    files: [],
  });

  const resetForm = () => {
    setNewActionPlan({
      section: sections[0],
      item: '',
      description: '',
      type: '',
      serials: '',
      notes: '',
      last_done: '',
      interval_months: '',
      next_due: '',
      issue: false,
      files: [],
    });
    setCurrentStep(1);
  };

  const openAddModal = (section?: string) => {
    resetForm();
    if (section) {
      setNewActionPlan(prev => ({
        ...prev,
        section,
        type: sectionTypes[section]?.[0] || ''
      }));
    }
    setIsAdding(true);
  };

  const openEditModal = (plan: ActionPlanItem) => {
    setNewActionPlan(plan);
    setIsEditing(plan.id);
  };

  const closeModal = () => {
    setIsAdding(false);
    setIsEditing(null);
    resetForm();
  };

  const handleSectionChange = (section: string) => {
    setNewActionPlan({
      ...newActionPlan,
      section,
      type: sectionTypes[section]?.[0] || '' // Set first type as default
    });
  };

  const handleIntervalMonthsChange = (value: string) => {
    // Extract numbers from the input (e.g., "12 months" becomes "12")
    const numericValue = value.replace(/[^\d]/g, '');
    
    setNewActionPlan(prev => {
      const updated = { ...prev, interval_months: numericValue };
      if (prev.last_done && numericValue) {
        updated.next_due = calculateNextDue(prev.last_done, numericValue);
      }
      return updated;
    });
  };

  const handleLastDoneChange = (value: string) => {
    setNewActionPlan(prev => {
      const updated = { ...prev, last_done: value };
      if (prev.interval_months) {
        updated.next_due = calculateNextDue(value, prev.interval_months);
      }
      return updated;
    });
  };

  const getStepLabel = () => {
    switch (currentStep) {
      case 1:
        return 'Category';
      case 2:
        return 'Item Details';
      case 3:
        return 'Service & Attachments';
      default:
        return '';
    }
  };

  const handleNextStep = () => {
    // Validate current step before moving to next
    if (currentStep === 1) {
      if (!newActionPlan.section) {
        alert('Please select a section before proceeding');
        return;
      }
    } else if (currentStep === 2) {
      if (!newActionPlan.item || !newActionPlan.type) {
        alert('Please fill in Item and Type before proceeding');
        return;
      }
    }
    
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const openDeleteModal = (id: string) => {
    setItemToDelete(id);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setItemToDelete(null);
  };

  return {
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
    handleSectionChange,
    handleIntervalMonthsChange,
    handleLastDoneChange,
    getStepLabel,
    handleNextStep,
    handlePrevStep,
    openDeleteModal,
    closeDeleteModal,
    resetForm
  };
};
