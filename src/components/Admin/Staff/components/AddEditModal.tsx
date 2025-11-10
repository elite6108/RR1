import React, { useState, useEffect } from 'react';
import type { StaffMember, FormData, FormErrors } from '../types';
import { validatePhoneNumber, validateNINumber } from '../utils';
import { FormContainer, FormHeader, FormContent, FormFooter, StepIndicator } from '../../../../utils/form';
import { FormField, TextInput, DateInput } from '../../../../utils/form';

interface AddEditModalProps {
  isOpen: boolean;
  isEditMode: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => Promise<void>;
  staffMember: StaffMember | null;
}

export function AddEditModal({ isOpen, isEditMode, onClose, onSubmit, staffMember }: AddEditModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    name: staffMember?.name || '',
    position: staffMember?.position || '',
    email: staffMember?.email || '',
    phone: staffMember?.phone || '',
    ni_number: staffMember?.ni_number || '',
    start_date: staffMember?.start_date || '',
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: staffMember?.name || '',
        position: staffMember?.position || '',
        email: staffMember?.email || '',
        phone: staffMember?.phone || '',
        ni_number: staffMember?.ni_number || '',
        start_date: staffMember?.start_date || '',
      });
      setCurrentStep(1);
      setFormErrors({});
    }
  }, [isOpen, staffMember]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    setFormData(prev => ({ ...prev, phone: value }));
    if (value.length > 0) {
      const error = validatePhoneNumber(value);
      setFormErrors(prev => ({ ...prev, phone: error }));
    } else {
      setFormErrors(prev => ({ ...prev, phone: undefined }));
    }
  };

  const handleNIChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().replace(/\s/g, '');
    setFormData(prev => ({ ...prev, ni_number: value }));
    if (value.length > 0) {
      const error = validateNINumber(value);
      setFormErrors(prev => ({ ...prev, ni_number: error }));
    } else {
      setFormErrors(prev => ({ ...prev, ni_number: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep !== 3) {
      nextStep();
      return;
    }

    await submitForm();
  };

  const submitForm = async () => {
    setFormErrors({});

    // Validate phone number
    const phoneError = validatePhoneNumber(formData.phone);
    if (phoneError) {
      setFormErrors(prev => ({ ...prev, phone: phoneError }));
      return;
    }

    // Validate NI number
    const niError = validateNINumber(formData.ni_number);
    if (niError) {
      setFormErrors(prev => ({ ...prev, ni_number: niError }));
      return;
    }

    await onSubmit(formData);
  };

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const stepLabels = ['Details', 'Contact', 'Employment'];

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <FormField label="Name" required>
            <TextInput
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </FormField>
        );

      case 2:
        return (
          <FormField label="Position" required>
            <TextInput
              id="position"
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
            />
          </FormField>
        );

      case 3:
        return (
          <div className="space-y-4">
            <FormField label="Email" required>
              <TextInput
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </FormField>

            <FormField label="Phone" required error={formErrors.phone}>
              <div className="flex">
                <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
                  +44
                </span>
                <TextInput
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  maxLength={10}
                  className="rounded-l-none"
                />
              </div>
            </FormField>

            <FormField label="NI Number" required error={formErrors.ni_number}>
              <TextInput
                id="ni_number"
                value={formData.ni_number}
                onChange={handleNIChange}
              />
            </FormField>

            <FormField label="Start Date" required>
              <DateInput
                id="start_date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
              />
            </FormField>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <FormContainer isOpen={isOpen} maxWidth="lg">
      <FormHeader
        title={isEditMode ? 'Edit Staff Member' : 'Add Staff Member'}
        onClose={onClose}
      />
      
      <FormContent>
        <StepIndicator
          currentStep={currentStep}
          totalSteps={3}
          stepLabels={stepLabels}
        />
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {renderStepContent()}
        </form>
      </FormContent>
      
      <FormFooter
        onCancel={onClose}
        onPrevious={currentStep > 1 ? prevStep : undefined}
        onNext={currentStep < 3 ? nextStep : undefined}
        onSubmit={currentStep === 3 ? submitForm : undefined}
        isFirstStep={currentStep === 1}
        isLastStep={currentStep === 3}
        nextButtonText="Next"
        submitButtonText={isEditMode ? 'Save' : 'Add'}
        showPrevious={true}
      />
    </FormContainer>
  );
}
