import React from 'react';
import { LeadFormProps } from '../shared/types';
import { useLeadForm } from '../../hooks/useLeadForm';
import { FormContainer, FormHeader, FormContent, StepIndicator, FormFooter } from '../../../../utils/form';
import { LeadDetailsStep } from './steps/LeadDetailsStep';
import { ActivityStep } from './steps/ActivityStep';
import { NotesStep } from './steps/NotesStep';
import { FORM_STEPS } from '../shared/constants';

export function LeadForm({ onClose, onSuccess, leadToEdit, initialStep = 1 }: LeadFormProps) {
  const {
    formData,
    loading,
    error,
    currentStep,
    setCurrentStep,
    currentUser,
    handleSubmit,
    handleChange,
    nextStep,
    prevStep,
  } = useLeadForm({ leadToEdit, initialStep, onSuccess, onClose });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(e);
  };

  const handleClose = () => {
    onClose();
    setCurrentStep(1);
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <LeadDetailsStep formData={formData} onChange={handleChange} />;
      case 2:
        return <ActivityStep leadToEdit={leadToEdit} currentUser={currentUser} />;
      case 3:
        return <NotesStep leadToEdit={leadToEdit} currentUser={currentUser} />;
      default:
        return <LeadDetailsStep formData={formData} onChange={handleChange} />;
    }
  };

  const stepLabels = FORM_STEPS.map(step => step.label);
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === FORM_STEPS.length;

  return (
    <FormContainer isOpen={true} maxWidth="2xl">
      <FormHeader 
        title={leadToEdit ? 'Edit Lead' : 'Add New Lead'}
        onClose={handleClose}
      />
      
      <FormContent>
        <StepIndicator 
          currentStep={currentStep} 
          totalSteps={FORM_STEPS.length}
          stepLabels={stepLabels}
        />

        <form onSubmit={handleFormSubmit} className="space-y-4">
          {renderCurrentStep()}

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}
        </form>
      </FormContent>

      <FormFooter
        onCancel={handleClose}
        onPrevious={prevStep}
        onNext={nextStep}
        onSubmit={() => handleSubmit(new Event('submit') as any)}
        isFirstStep={isFirstStep}
        isLastStep={isLastStep}
        loading={loading}
        submitButtonText={leadToEdit ? 'Update Lead' : 'Create Lead'}
      />
    </FormContainer>
  );
}
