import { useState, useEffect, useCallback } from 'react';
import { FormData, FormStep } from '../types';
import { getInitialFormData, validateCurrentStep } from '../utils/formValidation';
import { fetchWorkerName, fetchExistingQuestionnaire } from '../utils/supabaseHelpers';

export const useQuestionnaireForm = (userEmail?: string, isEditMode: boolean = false) => {
  const [formData, setFormData] = useState<FormData>(getInitialFormData());
  const [currentStep, setCurrentStep] = useState<FormStep>('medicalDeclaration');
  const [workerName, setWorkerName] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingExistingData, setIsLoadingExistingData] = useState(false);

  useEffect(() => {
    if (userEmail) {
      loadWorkerName();
      if (isEditMode) {
        loadExistingQuestionnaire();
      }
    }
  }, [userEmail, isEditMode]);

  const loadWorkerName = async () => {
    const name = await fetchWorkerName(userEmail!);
    if (name) {
      setWorkerName(name);
      setFormData(prev => ({ ...prev, fullName: name }));
    }
  };

  const loadExistingQuestionnaire = async () => {
    if (!userEmail) return;
    
    setIsLoadingExistingData(true);
    try {
      const existingData = await fetchExistingQuestionnaire(userEmail);
      if (existingData) {
        console.log('DEBUG: Loading existing questionnaire data for editing');
        setFormData(existingData);
        setWorkerName(existingData.fullName);
      }
    } catch (err) {
      console.error('Error loading existing questionnaire:', err);
      setError('Failed to load existing questionnaire data');
    } finally {
      setIsLoadingExistingData(false);
    }
  };

  const handleChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }, []);

  const handleSignatureChange = useCallback((signature: string) => {
    setFormData(prev => ({ ...prev, digitalSignature: signature }));
  }, []);

  const validateStep = useCallback((): string | null => {
    return validateCurrentStep(currentStep, formData);
  }, [currentStep, formData]);

  const nextStep = useCallback(() => {
    if (currentStep === 'medicalDeclaration') {
      setCurrentStep('occupationalHistory');
    } else if (currentStep === 'occupationalHistory') {
      setCurrentStep('declaration');
    }
  }, [currentStep]);

  const previousStep = useCallback(() => {
    if (currentStep === 'occupationalHistory') {
      setCurrentStep('medicalDeclaration');
    } else if (currentStep === 'declaration') {
      setCurrentStep('occupationalHistory');
    }
  }, [currentStep]);

  return {
    formData,
    currentStep,
    workerName,
    loading,
    success,
    error,
    isLoadingExistingData,
    setFormData,
    setCurrentStep,
    setLoading,
    setSuccess,
    setError,
    handleChange,
    handleSignatureChange,
    validateStep,
    nextStep,
    previousStep
  };
};
