import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { useSupplierForm } from './hooks/useSupplierForm';
import { Step1SupplierName } from './components/form-steps/Step1SupplierName';
import { Step2Address } from './components/form-steps/Step2Address';
import {
  FormContainer,
  FormHeader,
  FormContent,
  FormFooter,
  StepIndicator
} from '../../../utils/form';
import type { SupplierFormProps } from './types';

export function SupplierForm({
  onClose,
  onSuccess,
  supplierToEdit,
}: SupplierFormProps) {
  const {
    loading,
    error,
    currentStep,
    formData,
    handleChange,
    handleSubmit,
    nextStep,
    prevStep,
  } = useSupplierForm({ onClose, onSuccess, supplierToEdit });

  const stepLabels = ['Supplier Name', 'Address'];

  const handleNext = () => {
    if (currentStep < 2) {
      nextStep();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      prevStep();
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep === 2) {
      handleSubmit(e);
    } else {
      nextStep();
    }
  };

  return (
    <FormContainer isOpen={true} maxWidth="md">
      <FormHeader
        title={supplierToEdit ? 'Edit Supplier' : 'New Supplier'}
        onClose={onClose}
      />
      
      <FormContent>
        <StepIndicator
          currentStep={currentStep}
          totalSteps={2}
          stepLabels={stepLabels}
        />

        <form onSubmit={handleFormSubmit} className="space-y-6">
          {currentStep === 1 && (
            <Step1SupplierName formData={formData} handleChange={handleChange} />
          )}

          {currentStep === 2 && (
            <Step2Address formData={formData} handleChange={handleChange} />
          )}

          {error && (
            <div className="mt-4 flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-4 rounded-md">
              <AlertTriangle className="h-5 w-5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}
        </form>
      </FormContent>
      
      <FormFooter
        onCancel={onClose}
        onPrevious={currentStep > 1 ? handlePrevious : undefined}
        onNext={currentStep < 2 ? handleNext : undefined}
        onSubmit={currentStep === 2 ? () => handleSubmit({ preventDefault: () => {} } as React.FormEvent) : undefined}
        isFirstStep={currentStep === 1}
        isLastStep={currentStep === 2}
        nextButtonText="Next"
        submitButtonText={loading ? 'Saving...' : (supplierToEdit ? 'Save Changes' : 'Create Supplier')}
        loading={loading}
        disabled={loading}
        showPrevious={true}
      />
    </FormContainer>
  );
}