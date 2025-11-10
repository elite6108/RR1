import React, { useState, useCallback, useEffect } from 'react';
import type { StepValidationResult } from '../../../../../utils/form';
import type { 
  FirstAidNeedsAssessmentFormData
} from '../types';

interface UseFirstAidNeedsAssessmentFormOptions {
  initialData?: FirstAidNeedsAssessmentFormData;
  totalSteps?: number;
}

export function useFirstAidNeedsAssessmentForm({
  initialData = {},
  totalSteps = 13
}: UseFirstAidNeedsAssessmentFormOptions = {}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FirstAidNeedsAssessmentFormData>(initialData);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  // Update form data when initialData changes
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData(initialData);
      console.log('Form hook - setting initial data:', initialData);
    }
  }, [initialData]);

  const updateFormData = useCallback((data: Partial<FirstAidNeedsAssessmentFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  }, []);

  const updateErrors = useCallback((newErrors: Record<string, string | undefined>) => {
    setErrors(newErrors);
  }, []);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const validateStep = useCallback((stepNumber: number, validationFn?: () => StepValidationResult) => {
    if (!validationFn) {
      return { isValid: true, errors: {} };
    }
    
    const result = validationFn();
    updateErrors(result.errors);
    return result;
  }, [updateErrors]);

  const nextStep = useCallback((validationFn?: () => StepValidationResult) => {
    const validation = validateStep(currentStep, validationFn);
    
    if (validation.isValid) {
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps(prev => [...prev, currentStep]);
      }
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
      clearErrors();
      return true;
    }
    
    return false;
  }, [currentStep, totalSteps, completedSteps, validateStep, clearErrors]);

  const prevStep = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    clearErrors();
  }, [clearErrors]);

  const goToStep = useCallback((step: number) => {
    if (step >= 1 && step <= totalSteps) {
      setCurrentStep(step);
      clearErrors();
    }
  }, [totalSteps, clearErrors]);

  const resetForm = useCallback(() => {
    setCurrentStep(1);
    setFormData(initialData);
    setErrors({});
    setCompletedSteps([]);
  }, [initialData]);

  const isStepCompleted = useCallback((step: number) => {
    return completedSteps.includes(step);
  }, [completedSteps]);

  const canNavigateToStep = useCallback((step: number) => {
    // Can always go back to previous steps or current step
    if (step <= currentStep) return true;
    
    // Can go to next step only if current step is completed
    if (step === currentStep + 1 && isStepCompleted(currentStep)) return true;
    
    return false;
  }, [currentStep, isStepCompleted]);

  return {
    // State
    currentStep,
    formData,
    errors,
    completedSteps,
    totalSteps,
    
    // Actions
    updateFormData,
    updateErrors,
    clearErrors,
    nextStep,
    prevStep,
    goToStep,
    resetForm,
    validateStep,
    
    // Helpers
    isStepCompleted,
    canNavigateToStep,
    isFirstStep: currentStep === 1,
    isLastStep: currentStep === totalSteps,
    progress: (currentStep / totalSteps) * 100
  };
}
