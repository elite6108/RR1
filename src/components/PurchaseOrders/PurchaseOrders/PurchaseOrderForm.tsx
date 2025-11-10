import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { usePurchaseOrderForm } from './hooks/usePurchaseOrderForm';
import { Step1Details } from './components/form-steps/Step1Details';
import { Step2Items } from './components/form-steps/Step2Items';
import { Step3Notes } from './components/form-steps/Step3Notes';
import { FORM_STEP_LABELS } from './utils/constants';
import { FormStep } from './types';
import {
  FormContainer,
  FormHeader,
  FormContent,
  FormFooter,
  StepIndicator
} from '../../../utils/form';
import type { PurchaseOrderFormProps } from './types';

export function PurchaseOrderForm({
  onClose,
  onSuccess,
  orderToEdit,
  preselectedProject,
  disableProjectSelection = false,
  viewOnly = false,
}: PurchaseOrderFormProps) {
  const {
    currentStep,
    loading,
    error,
    projects,
    suppliers,
    createdByName,
    includeVat,
    companyPrefix,
    formData,
    setIncludeVat,
    handleInputChange,
    handleProjectChange,
    handleSupplierChange,
    handleItemChange,
    addItem,
    removeItem,
    nextStep,
    prevStep,
    handleSubmit,
  } = usePurchaseOrderForm({
    onClose,
    onSuccess,
    orderToEdit,
    preselectedProject,
    disableProjectSelection,
  });



  const handleNext = () => {
    if (currentStep < FormStep.NOTES) {
      nextStep();
    }
  };

  const handlePrevious = () => {
    if (currentStep > FormStep.DETAILS) {
      prevStep();
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep === FormStep.NOTES) {
      handleSubmit(e);
    } else {
      nextStep();
    }
  };

  const getTitle = () => {
    if (viewOnly) return 'View Purchase Order';
    return orderToEdit ? 'Edit Purchase Order' : 'New Purchase Order';
  };

  return (
    <FormContainer isOpen={true} maxWidth="4xl">
      <FormHeader
        title={getTitle()}
        onClose={onClose}
      />
      
      <FormContent>
        {!viewOnly && (
          <StepIndicator
            currentStep={currentStep + 1}
            totalSteps={FORM_STEP_LABELS.length}
            stepLabels={FORM_STEP_LABELS}
          />
        )}

        <form onSubmit={handleFormSubmit} className="space-y-6">
          {(currentStep === FormStep.DETAILS || viewOnly) && (
            <Step1Details
              formData={formData}
              projects={projects}
              suppliers={suppliers}
              loading={loading}
              error={error}
              createdByName={createdByName}
              companyPrefix={companyPrefix}
              disableProjectSelection={disableProjectSelection}
              handleProjectChange={handleProjectChange}
              handleSupplierChange={handleSupplierChange}
              handleInputChange={handleInputChange}
            />
          )}

          {(currentStep === FormStep.ITEMS || viewOnly) && (
            <Step2Items
              formData={formData}
              loading={loading}
              includeVat={includeVat}
              handleItemChange={handleItemChange}
              addItem={addItem}
              removeItem={removeItem}
              setIncludeVat={setIncludeVat}
            />
          )}

          {(currentStep === FormStep.NOTES || viewOnly) && (
            <Step3Notes
              formData={formData}
              loading={loading}
              handleInputChange={handleInputChange}
            />
          )}

          {error && (
            <div className="mt-4 flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-4 rounded-md">
              <AlertTriangle className="h-5 w-5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}
        </form>
      </FormContent>
      
      {!viewOnly && (
        <FormFooter
          onCancel={onClose}
          onPrevious={currentStep > FormStep.DETAILS ? handlePrevious : undefined}
          onNext={currentStep < FormStep.NOTES ? handleNext : undefined}
          onSubmit={currentStep === FormStep.NOTES ? () => handleSubmit({ preventDefault: () => {} } as React.FormEvent) : undefined}
          isFirstStep={currentStep === FormStep.DETAILS}
          isLastStep={currentStep === FormStep.NOTES}
          nextButtonText="Next"
          submitButtonText={loading ? 'Saving...' : (orderToEdit ? 'Save Changes' : 'Create Purchase Order')}
          loading={loading}
          disabled={loading}
          showPrevious={true}
        />
      )}
      
      {viewOnly && (
        <div className="border-t border-gray-200 dark:border-gray-700 p-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Close
          </button>
        </div>
      )}
    </FormContainer>
  );
}