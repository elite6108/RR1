import React from 'react';
import type { CustomerFormProps } from './types';
import { useCustomerForm } from './hooks/useCustomerForm';
import { 
  FormContainer,
  FormHeader,
  FormContent,
  FormFooter,
  StepIndicator
} from '../../utils/form';
import { ErrorMessage } from './components/ErrorMessage';
import { NamesStep, AddressStep, ContactStep } from './components/form-steps';
import { FORM_STEPS, STEP_LABELS, TOTAL_STEPS } from './utils/constants';

export function CustomerForm({
  onClose,
  onSuccess,
  customerToEdit,
}: CustomerFormProps) {
  const {
    currentStep,
    loading,
    error,
    formData,
    handleChange,
    handlePhoneChange,
    handleCountyChange,
    nextStep,
    prevStep,
    submitForm
  } = useCustomerForm(customerToEdit);

  const handleNext = () => {
    if (currentStep !== FORM_STEPS.CONTACT) {
      nextStep();
    }
  };

  const handleSubmit = async () => {
    await submitForm(onSuccess, onClose);
  };

  return (
    <FormContainer isOpen={true} maxWidth="md">
      <FormHeader
        title={customerToEdit ? 'Edit Customer' : 'New Customer'}
        onClose={onClose}
      />
      
      <FormContent>
        <StepIndicator 
          currentStep={currentStep} 
          totalSteps={TOTAL_STEPS} 
          stepLabels={STEP_LABELS} 
        />

        <div className="space-y-6">
          {currentStep === FORM_STEPS.NAMES && (
            <NamesStep 
              formData={formData}
              handleChange={handleChange}
            />
          )}

          {currentStep === FORM_STEPS.ADDRESS && (
            <AddressStep 
              formData={formData}
              handleChange={handleChange}
              handleCountyChange={handleCountyChange}
            />
          )}

          {currentStep === FORM_STEPS.CONTACT && (
            <ContactStep 
              formData={formData}
              handleChange={handleChange}
              handlePhoneChange={handlePhoneChange}
            />
          )}

          {error && <ErrorMessage error={error} />}
        </div>
      </FormContent>

      <FormFooter
        onCancel={onClose}
        onPrevious={currentStep > 1 ? prevStep : undefined}
        onNext={currentStep < TOTAL_STEPS ? handleNext : undefined}
        onSubmit={currentStep === TOTAL_STEPS ? handleSubmit : undefined}
        isFirstStep={currentStep === 1}
        isLastStep={currentStep === TOTAL_STEPS}
        submitButtonText={customerToEdit ? 'Save Changes' : 'Create Customer'}
        loading={loading}
      />
    </FormContainer>
  );
}
