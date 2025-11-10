'use client';

import React, { useState, useEffect } from 'react';
import BaseForm, { Step } from '../../BaseForm';
import { EnvironmentalFormData, EnvironmentalFormProps } from '../types/EnvironmentalTypes';
import { getNextEnvironmentalId } from '../utils/environmentalIdUtils';
import { refreshEnvironmentalFileUrls } from '../utils/environmentalFileUtils';
import { useEnvironmentalFileUpload } from '../hooks/useEnvironmentalFileUpload';
import { useEnvironmentalFormSubmit } from '../hooks/useEnvironmentalFormSubmit';
import { 
  EnvironmentalDetailsStep, 
  EnvironmentalDescriptionStep, 
  EnvironmentalIncidentStep, 
  EnvironmentalRootCausesStep 
} from '../components/EnvironmentalBasicSteps';
import { EnvironmentalActionsStep } from '../components/EnvironmentalActionsStep';
import { EnvironmentalDocumentationStep } from '../components/EnvironmentalDocumentationStep';

export default function EnvironmentalForm({ onClose, initialData, isEditing = false }: EnvironmentalFormProps) {
  // Generate autoId on load with format EV-XXXXX (where X is a number) or use existing one
  const [autoId, setAutoId] = useState(() => {
    if (isEditing && initialData?.autoId) {
      return initialData.autoId;
    }
    return ''; // Start empty instead of default value
  });
  const [isLoadingId, setIsLoadingId] = useState(!isEditing);

  useEffect(() => {
    if (!isEditing) {
      const loadId = async () => {
        setIsLoadingId(true);
        try {
          const newId = await getNextEnvironmentalId();
          setAutoId(newId);
          setFormData(prev => ({ ...prev, autoId: newId }));
        } catch (error) {
          console.error('Error getting next ID:', error);
          const defaultId = 'EV-00001';
          setAutoId(defaultId);
          setFormData(prev => ({ ...prev, autoId: defaultId }));
        } finally {
          setIsLoadingId(false);
        }
      };

      loadId();
    }
  }, [isEditing]);
  
  const [currentStep, setCurrentStep] = useState(0);
  
  // Initialize form state with default values or existing data
  const [formData, setFormData] = useState<EnvironmentalFormData>(() => {
    if (isEditing && initialData) {
      console.log('Editing form with initial data:', initialData); // Debug log
      
      const formDataObject = {
        // Incident Details
        date: initialData.date || '',
        time: initialData.time || '',
        location: initialData.location || '',
        department: initialData.department || '',
        description: initialData.description || '',
        potentialSeverity: initialData.potentialSeverity || '',
        
        // Contributing Factors
        unsafeCondition: initialData.unsafeCondition || false,
        unsafeAct: initialData.unsafeAct || false,
        equipmentFailure: initialData.equipmentFailure || false,
        lackOfProcedure: initialData.lackOfProcedure || false,
        inadequateTraining: initialData.inadequateTraining || false,
        otherFactors: initialData.otherFactors || '',
        
        // Potential Consequences
        potentialInjuryType: initialData.potentialInjuryType || '',
        potentialDamageType: initialData.potentialDamageType || '',
        potentialEnvironmentalImpact: initialData.potentialEnvironmentalImpact || '',
        
        // Reporting Information
        reportedBy: initialData.reportedBy || '',
        reportedDate: initialData.reportedDate || '',
        supervisorNotified: initialData.supervisorNotified || false,
        supervisorName: initialData.supervisorName || '',
        
        // Immediate Actions
        immediateActionsTaken: initialData.immediateActionsTaken || '',
        
        // Preventive Measures
        recommendedActions: initialData.recommendedActions || '',
        responsiblePerson: initialData.responsiblePerson || '',
        targetCompletionDate: initialData.targetCompletionDate || '',
        lessonLearned: initialData.lessonLearned || '',

        // Form specific fields
        autoId: initialData.autoId || initialData.auto_id || autoId,
        reportType: initialData.reportType || initialData.report_type || 'Environmental Incident',
        category: initialData.category || 'Report An Incident',
        incidentLocation: initialData.incidentLocation || initialData.incident_location || '',
        incidentDate: initialData.incidentDate || initialData.incident_date || '',
        incidentDescription: initialData.incidentDescription || initialData.incident_description || '',
        basicCause: initialData.basicCause || initialData.basic_cause_of_incident || '',
        sourceOfHazard: initialData.sourceOfHazard || initialData.source_of_hazard || '',
        rootCauseWorkEnvironment: initialData.rootCauseWorkEnvironment || initialData.root_cause_work_environment || [],
        rootCauseHumanFactors: initialData.rootCauseHumanFactors || initialData.root_cause_human_factors || [],
        rootCausePpe: initialData.rootCausePpe || initialData.rootCausePpe || initialData.root_cause_ppe || [],
        rootCauseManagement: initialData.rootCauseManagement || initialData.root_cause_management || [],
        rootCausePlantEquipment: initialData.rootCausePlantEquipment || initialData.root_cause_plant_equipment || [],
        actionsTaken: initialData.actionsTaken || initialData.actions_taken || '',
        actions: initialData.actions || [],
        file_urls: [], // Initialize empty, will be handled by useEffect
        
        // Environmental specific fields
        environmentalIncidentType: initialData.environmentalIncidentType || initialData.environmental_incident_type || '',
        severityOfIncident: initialData.severityOfIncident || initialData.severity_of_incident || '',
      };

      return formDataObject;
    }
    
    return {
      // Incident Details
      date: '',
      time: '',
      location: '',
      department: '',
      description: '',
      potentialSeverity: '',
      
      // Contributing Factors
      unsafeCondition: false,
      unsafeAct: false,
      equipmentFailure: false,
      lackOfProcedure: false,
      inadequateTraining: false,
      otherFactors: '',
      
      // Potential Consequences
      potentialInjuryType: '',
      potentialDamageType: '',
      potentialEnvironmentalImpact: '',
      
      // Reporting Information
      reportedBy: '',
      reportedDate: '',
      supervisorNotified: false,
      supervisorName: '',
      
      // Immediate Actions
      immediateActionsTaken: '',
      
      // Preventive Measures
      recommendedActions: '',
      responsiblePerson: '',
      targetCompletionDate: '',
      lessonLearned: '',

      // Form specific fields
      autoId,
      reportType: 'Environmental Incident',
      category: 'Report An Incident',
      incidentLocation: '',
      incidentDate: '',
      incidentDescription: '',
      basicCause: '',
      sourceOfHazard: '',
      rootCauseWorkEnvironment: [],
      rootCauseHumanFactors: [],
      rootCausePpe: [],
      rootCauseManagement: [],
      rootCausePlantEquipment: [],
      actionsTaken: '',
      actions: [],
      file_urls: [],
      
      // Environmental specific fields
      environmentalIncidentType: '',
      severityOfIncident: '',
    };
  });

  // Handle file URL refreshing for editing mode
  useEffect(() => {
    if (isEditing && initialData) {
      console.log('UseEffect: Processing file URLs for editing form');
      
      // Check for both snake_case and camelCase versions
      const fileUrlsFromDb = initialData.file_urls || initialData.fileUrls;
      
      if (fileUrlsFromDb) {
        console.log('UseEffect: Found file URLs in database:', fileUrlsFromDb);
        let fileUrls: string[] = [];
        
        if (typeof fileUrlsFromDb === 'string') {
          try {
            fileUrls = JSON.parse(fileUrlsFromDb);
            console.log('UseEffect: Parsed file URLs from string:', fileUrls);
          } catch (e) {
            console.error('UseEffect: Error parsing file_urls:', e);
            fileUrls = [];
          }
        } else if (Array.isArray(fileUrlsFromDb)) {
          fileUrls = fileUrlsFromDb;
          console.log('UseEffect: Using file URLs as array:', fileUrls);
        }
        
        // Filter valid URLs
        fileUrls = fileUrls.filter((url: any) => url && typeof url === 'string');
        console.log('UseEffect: Filtered file URLs:', fileUrls);
        
        if (fileUrls.length > 0) {
          console.log('UseEffect: Setting file URLs in form data');
          // Set the URLs immediately first
          setFormData(prev => {
            console.log('UseEffect: Updating form data with file URLs:', fileUrls);
            return { ...prev, file_urls: fileUrls };
          });
          
          // Then refresh the signed URLs
          const refreshUrls = async () => {
            try {
              const refreshedUrls = await refreshEnvironmentalFileUrls(fileUrls);
              setFormData(prev => ({ ...prev, file_urls: refreshedUrls }));
            } catch (error) {
              console.error('Error refreshing file URLs:', error);
            }
          };
          
          // Small delay to ensure component is mounted
          setTimeout(refreshUrls, 100);
        } else {
          console.log('UseEffect: No valid file URLs found after filtering');
        }
      } else {
        console.log('UseEffect: No file URLs field found in initialData');
      }
    }
  }, [isEditing, initialData]);

  // Use custom hooks
  const { handleFileUpload, uploadingFiles } = useEnvironmentalFileUpload();
  const { handleSubmit, isSubmitting, submitted, error } = useEnvironmentalFormSubmit();

  const onFileUpload = (files: FileList) => {
    handleFileUpload(
      files,
      formData.autoId,
      (uploadedUrls) => {
        setFormData(prev => ({
          ...prev,
          file_urls: [...prev.file_urls, ...uploadedUrls]
        }));
      },
      (errorMessage) => {
        console.error('File upload error:', errorMessage);
      }
    );
  };

  const handleNext = () => setCurrentStep((prev) => Math.min(prev + 1, formSteps.length - 1));
  const handlePrevious = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const onSubmit = () => {
    handleSubmit(formData, isEditing, initialData, onClose);
  };

  // Define the form steps with IDs
  const formSteps: Step[] = [
    { id: 'id-and-type', title: 'Report Details' },
    { id: 'incident-description', title: 'Description of Incident' },
    { id: 'environmental-incident', title: 'Environmental Incident' },
    { id: 'root-causes', title: 'Root Causes' },
    { id: 'actions', title: 'Actions' },
    { id: 'documentation', title: 'Documentation' },
  ];

  const stepContent = [
    <EnvironmentalDetailsStep 
      key="id-and-type" 
      formData={formData} 
      setFormData={setFormData} 
      isLoadingId={isLoadingId} 
    />,
    <EnvironmentalDescriptionStep 
      key="incident-description" 
      formData={formData} 
      setFormData={setFormData} 
      isLoadingId={isLoadingId} 
    />,
    <EnvironmentalIncidentStep 
      key="environmental-incident" 
      formData={formData} 
      setFormData={setFormData} 
      isLoadingId={isLoadingId} 
    />,
    <EnvironmentalRootCausesStep 
      key="root-causes" 
      formData={formData} 
      setFormData={setFormData} 
      isLoadingId={isLoadingId} 
    />,
    <EnvironmentalActionsStep 
      key="actions" 
      formData={formData} 
      setFormData={setFormData} 
    />,
    <EnvironmentalDocumentationStep 
      key="documentation" 
      formData={formData} 
      setFormData={setFormData} 
      uploadingFiles={uploadingFiles}
      onFileUpload={onFileUpload}
    />,
  ];

  return (
    <div className="environmental-form">
      <h1 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Environmental Incident Report</h1>
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
                <p>Your environmental incident report has been successfully submitted and saved.</p>
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
          children: submitted ? 'Submitted' : isSubmitting ? 'Submitting...' : undefined,
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
