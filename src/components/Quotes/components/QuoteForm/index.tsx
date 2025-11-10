import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { useQuoteForm } from '../../hooks/useQuoteForm';
import { DetailsStep } from './DetailsStep';
import { ItemsStep } from './ItemsStep';
import { NotesStep } from './NotesStep';
import {
  FormContainer,
  FormHeader,
  FormContent,
  FormFooter,
  StepIndicator,
} from '../../../../utils/form';
import type { QuoteFormProps } from '../../types';
import { FormStep } from '../../types';

export const QuoteForm = ({
  onClose,
  onSuccess,
  quoteToEdit,
  preselectedProject = null,
  disableProjectSelection = false,
}) => {
  const {
    currentStep,
    loading,
    error,
    projects,
    customers,
    createdByName,
    includeVat,
    setIncludeVat,
    overrideSubtotal,
    setOverrideSubtotal,
    manualSubtotal,
    setManualSubtotal,
    paymentTerms,
    customPaymentTerms,
    setCustomPaymentTerms,
    formData,
    setFormData,
    calculateSubtotal,
    calculateTotal,
    addSection,
    updateSection,
    updateSectionPrice,
    removeSection,
    addItem,
    updateItem,
    removeItem,
    moveItem,
    nextStep,
    prevStep,
    handleSubmit,
  } = useQuoteForm({ quoteToEdit, preselectedProject, onSuccess, onClose });

  // Render appropriate step content
  const renderStepContent = () => {
    switch (currentStep) {
      case FormStep.DETAILS:
        return (
          <DetailsStep
            createdByName={createdByName}
            formData={formData}
            setFormData={setFormData}
            projects={projects}
            customers={customers}
            disableProjectSelection={disableProjectSelection}
          />
        );
      case FormStep.ITEMS:
        return (
          <ItemsStep
            formData={formData}
            addSection={addSection}
            updateSection={updateSection}
            updateSectionPrice={updateSectionPrice}
            removeSection={removeSection}
            addItem={addItem}
            updateItem={updateItem}
            removeItem={removeItem}
            moveItem={moveItem}
            overrideSubtotal={overrideSubtotal}
            setOverrideSubtotal={setOverrideSubtotal}
            includeVat={includeVat}
            setIncludeVat={setIncludeVat}
            manualSubtotal={manualSubtotal}
            setManualSubtotal={setManualSubtotal}
            calculateSubtotal={calculateSubtotal}
            calculateTotal={calculateTotal}
          />
        );
      case FormStep.NOTES:
        return (
          <NotesStep
            formData={formData}
            setFormData={setFormData}
            paymentTerms={paymentTerms}
            customPaymentTerms={customPaymentTerms}
            setCustomPaymentTerms={setCustomPaymentTerms}
            overrideSubtotal={overrideSubtotal}
            includeVat={includeVat}
            calculateSubtotal={calculateSubtotal}
            calculateTotal={calculateTotal}
          />
        );
      default:
        return (
          <DetailsStep
            createdByName={createdByName}
            formData={formData}
            setFormData={setFormData}
            projects={projects}
            customers={customers}
            disableProjectSelection={disableProjectSelection}
          />
        );
    }
  };

  const stepLabels = ['Details', 'Items', 'Notes'];

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

  const handleFormSubmit = () => {
    // Create a mock event object for the handleSubmit function
    const mockEvent = {
      preventDefault: () => {},
    } as React.FormEvent;
    handleSubmit(mockEvent);
  };

  const totalItems = formData.sections.reduce(
    (sum, section) => sum + section.items.length,
    0
  );
  const canProceedFromItems = currentStep !== FormStep.ITEMS || totalItems > 0;

  return (
    <FormContainer isOpen={true} maxWidth="4xl">
      <FormHeader
        title={quoteToEdit ? 'Edit Quote' : 'New Quote'}
        onClose={onClose}
      />

      <FormContent>
        <StepIndicator
          currentStep={currentStep + 1}
          totalSteps={3}
          stepLabels={stepLabels}
        />

        <div className="space-y-6">
          {renderStepContent()}

          {error && (
            <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-4 rounded-md mt-4">
              <AlertTriangle className="h-5 w-5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}
        </div>
      </FormContent>

      <FormFooter
        onCancel={onClose}
        onPrevious={currentStep > FormStep.DETAILS ? handlePrevious : undefined}
        onNext={
          currentStep < FormStep.NOTES && canProceedFromItems
            ? handleNext
            : undefined
        }
        onSubmit={
          currentStep === FormStep.NOTES && canProceedFromItems
            ? handleFormSubmit
            : undefined
        }
        isFirstStep={currentStep === FormStep.DETAILS}
        isLastStep={currentStep === FormStep.NOTES}
        nextButtonText="Next"
        submitButtonText={
          loading ? 'Saving...' : quoteToEdit ? 'Update Quote' : 'Create Quote'
        }
        loading={loading}
        disabled={
          loading ||
          (currentStep === FormStep.ITEMS && totalItems === 0) ||
          (currentStep === FormStep.NOTES && totalItems === 0)
        }
        showPrevious={true}
      />
    </FormContainer>
  );
};
