'use client';

import React, { useState, useEffect } from 'react';
import BaseForm, { Step } from '../../BaseForm';
import { generateSevenDayIncapacitationId } from '../utils/sevenDayIdUtils';
import { useSevenDayFormSubmit } from '../hooks/useSevenDayFormSubmit';
import { useSevenDayFileUpload } from '../hooks/useSevenDayFileUpload';
import { SevenDayIncapacitationFormData, SevenDayIncapacitationFormProps } from '../types/SevenDayIncapacitationTypes';
import { 
  SevenDayDetailsStep, 
  SevenDayDescriptionStep, 
  SevenDayInjuredPersonStep 
} from '../components/SevenDayBasicSteps';
import { 
  SevenDayInjuryLocationStep, 
  SevenDayInjuryTypeStep, 
  SevenDayFirstAidStep, 
  SevenDayHealthSafetyStep 
} from '../components/SevenDayInjurySteps';
import { SevenDayRootCausesStep } from '../components/SevenDayRootCausesStep';
import { SevenDayActionsStep } from '../components/SevenDayActionsStep';
import { SevenDayDocumentationStep } from '../components/SevenDayDocumentationStep';

export default function SevenDayIncapacitationForm({ onClose, initialData, isEditing = false }: SevenDayIncapacitationFormProps) {
  // Generate autoId on load with format SD-XXXXX (where X is a number) or use existing one
  const [autoId, setAutoId] = useState(() => {
    if (isEditing && initialData?.autoId) {
      return initialData.autoId;
    }
    return ''; // Start empty instead of default value
  });
  const [isLoadingId, setIsLoadingId] = useState(!isEditing);

  useEffect(() => {
    if (!isEditing) {
      const getNextId = async () => {
        setIsLoadingId(true);
        try {
          const newId = await generateSevenDayIncapacitationId();
          setAutoId(newId);
          setFormData(prev => ({ ...prev, autoId: newId }));
        } catch (err) {
          console.error('Error in getNextId:', err);
          const defaultId = 'SD-00001';
          setAutoId(defaultId);
          setFormData(prev => ({ ...prev, autoId: defaultId }));
        } finally {
          setIsLoadingId(false);
        }
      };

      getNextId();
    }
  }, [isEditing]);

  const [currentStep, setCurrentStep] = useState(0);

  // Initialize form state with default values or existing data
  const [formData, setFormData] = useState<SevenDayIncapacitationFormData>(() => {
    if (isEditing && initialData) {
      return {
        autoId: initialData.autoId || autoId,
        reportType: initialData.reportType || '7 Day Incapacitation',
        category: initialData.category || 'Report An Accident',
        incidentLocation: initialData.incidentLocation || '',
        incidentDate: initialData.incidentDate || '',
        incidentDescription: initialData.incidentDescription || '',
        injuredPersonName: initialData.injuredPersonName || '',
        injuredPersonAddress: initialData.injuredPersonAddress || '',
        injuredPersonPhone: initialData.injuredPersonPhone || '',
        injuredPersonPosition: initialData.injuredPersonPosition || '',
        timeLost: initialData.timeLost || false,
        timeLostStartDate: initialData.timeLostStartDate || '',
        timeLostEndDate: initialData.timeLostEndDate || '',
        aeHospitalName: initialData.aeHospitalName || '',
        requiredPpe: initialData.requiredPpe || '',
        wornPpe: initialData.wornPpe || '',
        injuryLocations: initialData.injuryLocations || [],
        injuryTypes: initialData.injuryTypes || [],
        advisedMedical: initialData.advisedMedical || false,
        drugAlcoholTest: initialData.drugAlcoholTest || false,
        firstAidDetails: initialData.firstAidDetails || '',
        basicCause: initialData.basicCause || '',
        rootCauseWorkEnvironment: initialData.rootCauseWorkEnvironment || [],
        rootCauseHumanFactors: initialData.rootCauseHumanFactors || [],
        rootCausePpe: initialData.rootCausePpe || [],
        rootCauseManagement: initialData.rootCauseManagement || [],
        rootCausePlantEquipment: initialData.rootCausePlantEquipment || [],
        actionsTaken: initialData.actionsTaken || '',
        actions: initialData.actions || [],
        file_urls: initialData.file_urls || initialData.fileUrls || [],
      };
    }
    
    return {
      autoId,
      reportType: '7 Day Incapacitation',
      category: 'Report An Accident',
      incidentLocation: '',
      incidentDate: '',
      incidentDescription: '',
      injuredPersonName: '',
      injuredPersonAddress: '',
      injuredPersonPhone: '',
      injuredPersonPosition: '',
      timeLost: false,
      timeLostStartDate: '',
      timeLostEndDate: '',
      aeHospitalName: '',
      requiredPpe: '',
      wornPpe: '',
      injuryLocations: [],
      injuryTypes: [],
      advisedMedical: false,
      drugAlcoholTest: false,
      firstAidDetails: '',
      basicCause: '',
      rootCauseWorkEnvironment: [],
      rootCauseHumanFactors: [],
      rootCausePpe: [],
      rootCauseManagement: [],
      rootCausePlantEquipment: [],
      actionsTaken: '',
      actions: [],
      file_urls: [],
    };
  });

  // Use custom hooks
  const { isSubmitting, submitted, error, handleSubmit, setError } = useSevenDayFormSubmit();
  const { uploadingFiles, handleFileUpload } = useSevenDayFileUpload(formData, setFormData, isEditing, initialData);

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, formSteps.length - 1));
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const onSubmit = () => {
    handleSubmit(formData, isEditing, initialData, onClose);
  };

  // Define the form steps with IDs
  const formSteps: Step[] = [
    { id: 'details', title: 'Report Details' },
    { id: 'description', title: 'Description of Incident' },
    { id: 'injured-person', title: 'Details of Injured Person' },
    { id: 'injury-location', title: 'Location of Injury' },
    { id: 'injury-type', title: 'Type of Injury' },
    { id: 'first-aid', title: 'First Aid' },
    { id: 'health-safety', title: 'Health & Safety' },
    { id: 'root-causes', title: 'Root Causes' },
    { id: 'actions', title: 'Actions' },
    { id: 'documentation', title: 'Documentation' },
  ];

  // Content for each step
  const stepContent = [
    <SevenDayDetailsStep 
      key="details"
      formData={formData} 
      setFormData={setFormData} 
      isLoadingId={isLoadingId} 
    />,
    <SevenDayDescriptionStep 
      key="description"
      formData={formData} 
      setFormData={setFormData} 
      isLoadingId={isLoadingId} 
    />,
    <SevenDayInjuredPersonStep 
      key="injured-person"
      formData={formData} 
      setFormData={setFormData} 
      isLoadingId={isLoadingId} 
    />,
    <SevenDayInjuryLocationStep 
      key="injury-location"
      formData={formData} 
      setFormData={setFormData} 
    />,
    <SevenDayInjuryTypeStep 
      key="injury-type"
      formData={formData} 
      setFormData={setFormData} 
    />,
    <SevenDayFirstAidStep 
      key="first-aid"
      formData={formData} 
      setFormData={setFormData} 
    />,
    <SevenDayHealthSafetyStep 
      key="health-safety"
      formData={formData} 
      setFormData={setFormData} 
    />,
    <SevenDayRootCausesStep 
      key="root-causes"
      formData={formData} 
      setFormData={setFormData} 
    />,
    <SevenDayActionsStep 
      key="actions"
      formData={formData} 
      setFormData={setFormData} 
    />,
    <SevenDayDocumentationStep 
      key="documentation"
      formData={formData} 
      setFormData={setFormData} 
      uploadingFiles={uploadingFiles}
      handleFileUpload={handleFileUpload}
    />,
  ];

  return (
    <div className="seven-day-incapacitation-form">
      <h1 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">7 Day Incapacitation Report</h1>
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
                <p>Your 7 day incapacitation report has been successfully {isEditing ? 'updated' : 'submitted'} and saved.</p>
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
        onSubmit={onSubmit}
        onCancel={onClose}
        submitButtonProps={{
          className: submitted ? 'bg-green-600 hover:bg-green-700 text-white' : undefined,
          disabled: submitted || isSubmitting,
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
