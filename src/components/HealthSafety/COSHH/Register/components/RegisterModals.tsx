import React, { useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, AlertTriangle } from 'lucide-react';
import { RegisterFormData, RegisterModalState, COSHH_CATEGORIES } from '../types';

interface RegisterModalsProps {
  modalState: RegisterModalState;
  formData: RegisterFormData;
  setFormData: (data: RegisterFormData) => void;
  auditorName: string;
  customCategory: string;
  setCustomCategory: (category: string) => void;
  showCustomCategory: boolean;
  onOtherToggle: (checked: boolean) => void;
  onAddCustomCategory: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onCloseModals: () => void;
  onNextStep: () => void;
  onPrevStep: () => void;
  onConfirmDelete: () => void;
}

export const RegisterModals: React.FC<RegisterModalsProps> = ({
  modalState,
  formData,
  setFormData,
  auditorName,
  customCategory,
  setCustomCategory,
  showCustomCategory,
  onOtherToggle,
  onAddCustomCategory,
  onSubmit,
  onCloseModals,
  onNextStep,
  onPrevStep,
  onConfirmDelete
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Prevent body scroll when modal is open
  useEffect(() => {
    const isModalOpen = modalState.showAddModal || modalState.showEditModal || 
                       modalState.showDeleteModal || modalState.showReviewModal;
    
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [modalState]);

  const renderStepIndicator = () => {
    const stepLabels = modalState.showReviewModal ? 
      ['Basic Info', 'Details', 'Review Sign Off'] : 
      ['Basic Info', 'Details', 'Sign Off'];
    
    return (
      <div className="mb-8 w-full">
        <div className="flex items-center justify-between mb-4">
          <div className="text-base font-medium text-indigo-600">
            {stepLabels[modalState.currentStep - 1]}
          </div>
          <div className="text-sm text-gray-500">
            Step {modalState.currentStep} of 3
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-indigo-600 h-2 rounded-full transition-all duration-300 ease-in-out"
            style={{ width: `${(modalState.currentStep / 3) * 100}%` }}
          />
        </div>
      </div>
    );
  };

  const renderDeleteModal = () => {
    if (!modalState.showDeleteModal) return null;

    return createPortal(
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 dark:bg-gray-900 dark:bg-opacity-50 overflow-y-auto flex items-center justify-center z-50">
        <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-sm w-full m-4">
          <div className="flex items-center justify-center mb-4">
            <AlertTriangle className="h-12 w-12 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white text-center mb-2">
            Confirm Deletion
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
            Are you sure you want to delete {modalState.selectedSubstance?.substance_name}? This action cannot be undone.
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={onCloseModals}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={onConfirmDelete}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </div>,
      document.body
    );
  };

  const renderFormModal = () => {
    const isVisible = modalState.showAddModal || modalState.showEditModal || modalState.showReviewModal;
    if (!isVisible) return null;

    return createPortal(
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 dark:bg-gray-900 dark:bg-opacity-50 overflow-y-auto flex items-center justify-center z-50 p-4">
        <div ref={modalRef} className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-lg w-full m-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {modalState.showReviewModal ? 'Review Substance' : 
               modalState.showAddModal ? 'Add Substance' : 'Edit Substance'}
            </h2>
            <button
              onClick={onCloseModals}
              className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-300"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          {renderStepIndicator()}
          
          <form onSubmit={onSubmit} className="space-y-4">
            {/* Step 1: Basic Info */}
            {modalState.currentStep === 1 && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Substance Name *
                  </label>
                  <input
                    type="text"
                    value={formData.substance_name}
                    onChange={(e) => setFormData({...formData, substance_name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Manufacturer *
                  </label>
                  <input
                    type="text"
                    value={formData.manufacturer}
                    onChange={(e) => setFormData({...formData, manufacturer: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Categories * <span className="text-xs text-gray-500">(Select one or more)</span>
                  </label>
                  <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-md p-3 bg-white dark:bg-gray-700">
                    {COSHH_CATEGORIES.map((category) => (
                      <label key={category} className="flex items-start space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.category.includes(category)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({
                                ...formData,
                                category: [...formData.category, category]
                              });
                            } else {
                              setFormData({
                                ...formData,
                                category: formData.category.filter(c => c !== category)
                              });
                            }
                          }}
                          className="mt-0.5 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-900 dark:text-white leading-tight">
                          {category}
                        </span>
                      </label>
                    ))}
                    
                    {/* Other option */}
                    <label className="flex items-start space-x-2 cursor-pointer border-t border-gray-200 dark:border-gray-600 pt-2 mt-2">
                      <input
                        type="checkbox"
                        checked={showCustomCategory}
                        onChange={(e) => onOtherToggle(e.target.checked)}
                        className="mt-0.5 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-900 dark:text-white leading-tight font-medium">
                        Other (specify custom category)
                      </span>
                    </label>
                  </div>

                  {/* Custom category input */}
                  {showCustomCategory && (
                    <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-600 rounded-md">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Custom Category
                      </label>
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={customCategory}
                          onChange={(e) => setCustomCategory(e.target.value)}
                          placeholder="Enter custom category name"
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white text-sm"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              onAddCustomCategory();
                            }
                          }}
                        />
                        <button
                          type="button"
                          onClick={onAddCustomCategory}
                          disabled={!customCategory.trim()}
                          className="px-3 py-2 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Display selected categories */}
                  {formData.category.length > 0 && (
                    <div className="mt-3">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Selected Categories:
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {formData.category.map((cat, index) => (
                          <span 
                            key={index} 
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                          >
                            {cat}
                            <button
                              type="button"
                              onClick={() => {
                                setFormData(prev => ({
                                  ...prev,
                                  category: prev.category.filter(c => c !== cat)
                                }));
                              }}
                              className="ml-1 text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {formData.category.length === 0 && (
                    <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                      Please select at least one category
                    </p>
                  )}
                </div>
              </>
            )}

            {/* Step 2: Details */}
            {modalState.currentStep === 2 && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Storage Location *
                  </label>
                  <input
                    type="text"
                    value={formData.storage_location}
                    onChange={(e) => setFormData({...formData, storage_location: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Hazard Sheet Location *
                  </label>
                  <input
                    type="text"
                    value={formData.hazard_sheet_location}
                    onChange={(e) => setFormData({...formData, hazard_sheet_location: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                {!modalState.showReviewModal && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Review Date <span className="text-gray-400 text-xs">(optional)</span>
                    </label>
                    <input
                      type="date"
                      value={formData.review_date}
                      onChange={(e) => setFormData({...formData, review_date: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                )}
              </>
            )}

            {/* Step 3: Sign Off */}
            {modalState.currentStep === 3 && (
              <div>
                {modalState.showReviewModal ? (
                  <div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Reviewed Date
                      </label>
                      <div className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                        {new Date().toLocaleDateString()}
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Today's date will be recorded as the review date
                      </p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Auditor
                      </label>
                      <div className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                        {auditorName}
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Logged in user will be recorded as the auditor
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center pt-4">
              {modalState.currentStep > 1 && (
                <button 
                  type="button" 
                  onClick={onPrevStep} 
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  Previous
                </button>
              )}
              <div className="ml-auto flex space-x-2">
                <button 
                  type="button" 
                  onClick={onCloseModals} 
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {modalState.currentStep === 3 ? 
                    (modalState.showReviewModal ? 'Complete Review' : 
                     modalState.showAddModal ? 'Add Substance' : 'Update') : 'Next'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>,
      document.body
    );
  };

  return (
    <>
      {renderDeleteModal()}
      {renderFormModal()}
    </>
  );
};
