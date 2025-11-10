'use client';

import React, { useState } from 'react';
import BaseForm, { Step } from '../../BaseForm';
import { FormProps, ActionItem } from '../types/FormData';
import { useAutoId } from '../hooks/useAutoId';
import { useFormData } from '../hooks/useFormData';
import { useFileUpload } from '../hooks/useFileUpload';
import { submitForm } from '../utils/formSubmission';
import ReportDetailsStep from '../components/steps/ReportDetailsStep';
import IncidentDescriptionStep from '../components/steps/IncidentDescriptionStep';
import HealthSafetyStep from '../components/steps/HealthSafetyStep';
import RootCausesStep from '../components/steps/RootCausesStep';
import ActionsStep from '../components/steps/ActionsStep';
import DocumentationStep from '../components/steps/DocumentationStep';

export default function NearMissForm({ 
  onClose, 
  initialData, 
  isEditing = false 
}: FormProps) {
  // State variables
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionDraft, setActionDraft] = useState<ActionItem>({ title: '', dueDate: '', description: '' });

  // Use custom hooks for form management
  const { autoId, isLoadingId } = useAutoId(
    'accidents_nearmiss',
    'NM',
    isEditing,
    initialData
  );
  
  const { formData, setFormData } = useFormData(
    isEditing,
    initialData,
      autoId,
    'Near Miss',
    'accidents-nearmiss'
  );
  
  const { handleFileUpload, uploadingFiles } = useFileUpload(
    'accidents-nearmiss',
    setError,
    setFormData
  );

  // Define the form steps with IDs
  const formSteps: Step[] = [
    { id: 'id-and-type', title: 'Report Details' },
    { id: 'incident-description', title: 'Description of Incident' },
    { id: 'health-safety', title: 'Health & Safety' },
    { id: 'root-causes', title: 'Root Causes' },
    { id: 'actions', title: 'Actions' },
    { id: 'documentation', title: 'Documentation' },
  ];

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, formSteps.length - 1));
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      console.log('About to submit form with autoId:', autoId);
      console.log('Form data autoId:', formData.autoId);
      
      await submitForm(
        formData,
        'accidents_nearmiss',
        isEditing,
        initialData?.id
      );
      
      setIsSubmitting(false);
      setSubmitted(true);
      
      if (onClose) {
        setTimeout(() => {
          onClose();
        }, 1000);
      }
    } catch (err: any) {
      console.error('Submission error:', err);
      setIsSubmitting(false);
      setError(err?.message || 'An unknown error occurred.');
      setSubmitted(false);
    }
  };

  // Content for each step using shared components
  const stepContent = [
    <ReportDetailsStep 
      autoId={autoId}
      isLoadingId={isLoadingId}
      reportType={formData.reportType}
      category={formData.category}
    />,
    <IncidentDescriptionStep 
      formData={formData}
      setFormData={setFormData}
    />,
    <HealthSafetyStep 
      formData={formData}
      setFormData={setFormData}
    />,
    <RootCausesStep 
      formData={formData}
      setFormData={setFormData}
    />,
    <ActionsStep 
      formData={formData}
      setFormData={setFormData}
      showActionModal={showActionModal}
      setShowActionModal={setShowActionModal}
      actionDraft={actionDraft}
      setActionDraft={setActionDraft}
    />,
    <DocumentationStep 
      formData={formData}
      setFormData={setFormData}
      uploadingFiles={uploadingFiles}
      onFileUpload={(files, fieldName) => handleFileUpload(files, fieldName, formData.autoId)}
    />
  ];

  return (
    <div className="near-miss-form">
      <h1 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Near Miss Report</h1>
      {submitted ? (
        <div className="bg-green-50 dark:bg-green-900 p-4 rounded-md mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800 dark:text-green-200">Success!</h3>
              <div className="mt-2 text-sm text-green-700 dark:text-green-300">
                <p>Your near miss report has been successfully submitted and saved.</p>
              </div>
            </div>
          </div>
        </div>
      ) : null}
      <BaseForm
        steps={formSteps}
        currentStep={currentStep}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onSubmit={handleSubmit}
        onCancel={onClose}
        submitButtonProps={{
          className: submitted ? 'bg-green-600 hover:bg-green-700 text-white' : undefined,
          disabled: submitted,
          children: submitted ? 'Submitted' : undefined,
        }}
      >
        {stepContent[currentStep]}
        {error && (
          <div className="mt-4 text-sm text-red-600 dark:text-red-400 text-center">{error}</div>
        )}
      </BaseForm>
    </div>
  );
} 