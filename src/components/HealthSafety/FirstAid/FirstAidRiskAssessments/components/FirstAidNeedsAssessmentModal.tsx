import React, { useRef, useState, useEffect } from 'react';
import { 
  StepIndicator, 
  FormContainer, 
  FormHeader, 
  FormContent, 
  FormFooter 
} from '../../../../../utils/form';
import { useFirstAidNeedsAssessmentForm } from '../hooks';
import { FIRST_AID_NEEDS_ASSESSMENT_STEPS } from '../types';
import { IntroScreen, Step1BasicInformation, Step2BusinessInformation, Step3PremisesSites, Step4HazardsPart1, Step5HazardsPart2, Step6WorkersPart1, Step7WorkersPart2, Step8MentalHealth, Step9PreviousInjuries, Step10NearestEmergencyFacilities, Step11FirstAidProvisions, Step12FirstAidResourcesPart1, Step13FirstAidResourcesPart2, Step14AdditionalConsiderations } from './steps';
import type { FirstAidNeedsAssessmentFormData } from '../types';

interface FirstAidNeedsAssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: FirstAidNeedsAssessmentFormData) => Promise<void>;
  initialData?: FirstAidNeedsAssessmentFormData;
}

export function FirstAidNeedsAssessmentModal({
  isOpen,
  onClose,
  onSubmit,
  initialData
}: FirstAidNeedsAssessmentModalProps) {
  const [showIntro, setShowIntro] = useState(!initialData); // Skip intro if editing
  const [loading, setLoading] = useState(false);
  const validationRef = useRef<(() => { isValid: boolean; errors: Record<string, string | undefined> }) | null>(null);
  
  const {
    currentStep,
    formData,
    errors,
    totalSteps,
    updateFormData,
    nextStep,
    prevStep,
    isFirstStep,
    isLastStep,
    resetForm
  } = useFirstAidNeedsAssessmentForm({
    initialData,
    totalSteps: 14
  });

  // Effect to handle modal opening with initial data
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        // If editing, skip intro and initialize form
        setShowIntro(false);
        console.log('Editing mode - initialData:', initialData);
      } else {
        // If creating new, show intro
        setShowIntro(true);
      }
    }
  }, [isOpen, initialData]);

  const handleClose = () => {
    resetForm();
    setShowIntro(!initialData); // Reset to appropriate intro state
    onClose();
  };

  const handleBeginAssessment = () => {
    setShowIntro(false);
  };

  const handleNext = () => {
    // Use step-specific validation if available
    const stepValidationFn = validationRef.current;
    nextStep(stepValidationFn);
  };

  const handleSubmit = async () => {
    if (onSubmit) {
      try {
        setLoading(true);
        // Set status to completed when submitting
        const submissionData = {
          ...formData,
          status: 'completed' as const,
          currentStep: totalSteps,
          completedSteps: Array.from({ length: totalSteps }, (_, i) => i + 1)
        };
        await onSubmit(submissionData);
        handleClose();
      } catch (error) {
        console.error('Error submitting assessment:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const renderCurrentStep = () => {
    // Show intro screen first
    if (showIntro) {
      return <IntroScreen onContinue={handleBeginAssessment} />;
    }

    // Show actual form steps
    const stepProps = {
      formData,
      errors,
      onDataChange: updateFormData
    };

    switch (currentStep) {
      case 1:
        return (
          <Step1BasicInformation
            {...stepProps}
            onValidate={validationRef}
          />
        );
      
      case 2:
        return (
          <Step2BusinessInformation
            {...stepProps}
            onValidate={validationRef}
          />
        );
      
      case 3:
        return (
          <Step3PremisesSites
            {...stepProps}
            onValidate={validationRef}
          />
        );
      
      case 4:
        return (
          <Step4HazardsPart1
            {...stepProps}
            onValidate={validationRef}
          />
        );
      
      case 5:
        return (
          <Step5HazardsPart2
            {...stepProps}
            onValidate={validationRef}
          />
        );
      
      case 6:
        return (
          <Step6WorkersPart1
            {...stepProps}
            onValidate={validationRef}
          />
        );
      
      case 7:
        return (
          <Step7WorkersPart2
            {...stepProps}
            onValidate={validationRef}
          />
        );
      
      case 8:
        return (
          <Step8MentalHealth
            {...stepProps}
            onValidate={validationRef}
          />
        );
      
      case 9:
        return (
          <Step9PreviousInjuries
            {...stepProps}
            onValidate={validationRef}
          />
        );
      
      case 10:
        return (
          <Step10NearestEmergencyFacilities
            {...stepProps}
            onValidate={validationRef}
          />
        );
      
      case 11:
        return (
          <Step11FirstAidProvisions
            {...stepProps}
            onValidate={validationRef}
          />
        );
      
      case 12:
        return (
          <Step12FirstAidResourcesPart1
            {...stepProps}
            onValidate={validationRef}
          />
        );
      
      case 13:
        return (
          <Step13FirstAidResourcesPart2
            {...stepProps}
            onValidate={validationRef}
          />
        );
      
      case 14:
        return (
          <Step14AdditionalConsiderations
            {...stepProps}
            onValidate={validationRef}
          />
        );
      
      default:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Step {currentStep}: {FIRST_AID_NEEDS_ASSESSMENT_STEPS[currentStep - 1]}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              This step will be implemented in future iterations.
            </p>
          </div>
        );
    }
  };

  return (
    <FormContainer isOpen={isOpen} maxWidth="4xl">
      <FormHeader
        title="First Aid Needs Assessment"
        onClose={handleClose}
      />
      
      <FormContent>
        {!showIntro && (
          <StepIndicator
            currentStep={currentStep}
            totalSteps={totalSteps}
            stepLabels={FIRST_AID_NEEDS_ASSESSMENT_STEPS}
          />
        )}
        
        {renderCurrentStep()}
      </FormContent>

      {/* Footer for intro screen */}
      {showIntro && (
        <FormFooter
          onCancel={handleClose}
          showPrevious={false}
          cancelButtonText="Cancel"
        />
      )}

      {/* Footer for form steps */}
      {!showIntro && (
        <FormFooter
          onCancel={handleClose}
          onPrevious={prevStep}
          onNext={handleNext}
          onSubmit={handleSubmit}
          isFirstStep={isFirstStep}
          isLastStep={isLastStep}
          submitButtonText="Complete Assessment"
          loading={loading}
          disabled={loading}
        />
      )}
    </FormContainer>
  );
}
