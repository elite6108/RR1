import React, { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import type { SiteSurveyFormProps } from '../types';
import { useSiteSurveyForm } from '../hooks/useSiteSurveyForm';
import { 
  FormContainer, 
  FormHeader, 
  FormContent, 
  FormFooter, 
  StepIndicator 
} from '../../../utils/form';
import {
  Step1Details,
  Step2SiteAccess,
  Step3Land,
  Step4WorkRequired,
  Step5CourtFeatures,
  Step6DrawingsPlans,
  Step7Review
} from '../components/form-steps';
import { STEP_LABELS, TOTAL_STEPS } from '../utils/constants';

export function SiteSurveyForm({
  onClose,
  onSuccess,
  surveyToEdit,
  isProjectContext = false,
}: SiteSurveyFormProps) {
  const {
    // State
    currentStep,
    loading,
    error,
    customers,
    projects,
    uploadingFiles,
    showW3WModal,
    currentUser,
    formData,

    // Actions
    setCurrentStep,
    setShowW3WModal,
    setFormData,
    handleCustomerChange,
    handleInputChange,
    handleBooleanChange,
    handleMultiSelectChange,
    handleFileUpload,
    handleSubmit
  } = useSiteSurveyForm({
    onClose,
    onSuccess,
    surveyToEdit,
    isProjectContext
  });

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';

    // Cleanup function to restore scroll when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleFormSubmit = async () => {
    const mockEvent = {
      preventDefault: () => {}
    } as React.FormEvent;
    await handleSubmit(mockEvent);
  };

  const renderCurrentStep = () => {
    const stepProps = {
      formData,
      setFormData,
      customers,
      projects,
      currentUser,
      loading,
      uploadingFiles,
      showW3WModal,
      setShowW3WModal,
      handleCustomerChange,
      handleInputChange,
      handleBooleanChange,
      handleMultiSelectChange,
      handleFileUpload,
      isProjectContext
    };

    switch (currentStep) {
      case 1:
        return <Step1Details {...stepProps} />;
      case 2:
        return <Step2SiteAccess {...stepProps} />;
      case 3:
        return <Step3Land {...stepProps} />;
      case 4:
        return <Step4WorkRequired {...stepProps} />;
      case 5:
        return <Step5CourtFeatures {...stepProps} />;
      case 6:
        return <Step6DrawingsPlans {...stepProps} />;
      case 7:
        return <Step7Review {...stepProps} />;
      default:
        return null;
    }
  };

  return (
    <FormContainer isOpen={true} maxWidth="2xl">
      <FormHeader
        title={surveyToEdit ? 'Edit Site Survey' : 'New Site Survey'}
        onClose={onClose}
      />

      <FormContent>
        <StepIndicator
          currentStep={currentStep}
          totalSteps={TOTAL_STEPS}
          stepLabels={STEP_LABELS}
        />

        <form onSubmit={(e: React.FormEvent) => {
          e.preventDefault();
          if (currentStep < TOTAL_STEPS) {
            setCurrentStep(prev => prev + 1);
          } else {
            handleSubmit(e);
          }
        }} className="space-y-6">
          {renderCurrentStep()}

          {error && (
            <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-4 rounded-md">
              <AlertTriangle className="h-5 w-5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}
        </form>
      </FormContent>

      <FormFooter
        onCancel={onClose}
        onPrevious={currentStep > 1 ? () => setCurrentStep(prev => prev - 1) : undefined}
        onNext={currentStep < TOTAL_STEPS ? () => setCurrentStep(prev => prev + 1) : undefined}
        onSubmit={currentStep === TOTAL_STEPS ? handleFormSubmit : undefined}
        isFirstStep={currentStep === 1}
        isLastStep={currentStep === TOTAL_STEPS}
        submitButtonText={surveyToEdit ? 'Save Changes' : 'Submit Survey'}
        loading={loading}
        disabled={loading}
      />
    </FormContainer>
  );
}