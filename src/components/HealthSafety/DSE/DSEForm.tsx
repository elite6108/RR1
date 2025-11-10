import React from 'react';
// Updated to use shared form components
import { DSEFormProps } from './types';
import { useDSEForm } from './hooks/useDSEForm';
import { TOTAL_STEPS, FORM_STEPS } from './utils/constants';
import {
  FormContainer,
  FormHeader,
  FormContent,
  FormFooter,
  StepIndicator,
} from '../../../utils/form';
import {
  PersonalInfoStep,
  KeyboardStep,
  MouseStep,
  ScreenStep,
  VisionStep,
  FurnitureStep,
  EnvironmentStep,
  FeedbackStep,
} from './components/FormSteps';

export function DSEForm({ onClose }: DSEFormProps) {
  const {
    currentStep,
    formData,
    setCurrentStep,
    setFormData,
    handleSubmit,
  } = useDSEForm();

  const handleFormSubmit = async () => {
    await handleSubmit();
    onClose();
  };

  const handleNext = () => {
    setCurrentStep(currentStep + 1);
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  const renderStep = () => {
    const stepProps = { formData, setFormData };
    
    switch (currentStep) {
      case 1:
        return <PersonalInfoStep {...stepProps} />;
      case 2:
        return <KeyboardStep {...stepProps} />;
      case 3:
        return <MouseStep {...stepProps} />;
      case 4:
        return <ScreenStep {...stepProps} />;
      case 5:
        return <VisionStep {...stepProps} />;
      case 6:
        return <FurnitureStep {...stepProps} />;
      case 7:
        return <EnvironmentStep {...stepProps} />;
      case 8:
        return <FeedbackStep {...stepProps} />;
      default:
        return null;
    }
  };

  const stepLabels = FORM_STEPS.map(step => step.label);

  return (
    <FormContainer isOpen={true} maxWidth="2xl">
      <FormHeader 
        title="DSE Assessment" 
        onClose={onClose}
      />
      
      <FormContent>
        <StepIndicator
          currentStep={currentStep}
          totalSteps={TOTAL_STEPS}
          stepLabels={stepLabels}
        />
        
        <div className="space-y-6">
          {renderStep()}
        </div>
      </FormContent>

      <FormFooter
        onCancel={onClose}
        onPrevious={currentStep > 1 ? handlePrevious : undefined}
        onNext={currentStep < TOTAL_STEPS ? handleNext : undefined}
        onSubmit={currentStep === TOTAL_STEPS ? handleFormSubmit : undefined}
        isFirstStep={currentStep === 1}
        isLastStep={currentStep === TOTAL_STEPS}
        submitButtonText="Complete & Save"
      />
    </FormContainer>
  );
}
