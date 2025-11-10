import React from 'react';
import { FormField, TextArea, ModernRadioGroup } from '../../../../../../utils/form';
import { validateRequired } from '../../../../../../utils/form';
import type { FirstAidNeedsAssessmentStepProps } from '../../types';
import { Info, AlertTriangle } from 'lucide-react';

export function Step3PremisesSites({ 
  formData, 
  errors, 
  onDataChange,
  onValidate 
}: FirstAidNeedsAssessmentStepProps) {

  const handlePremisesSpreadChange = (value: string) => {
    onDataChange({
      premisesSpreadOut: value,
      // Clear the details if "none" is selected
      premisesSpreadDetails: value === 'none' ? '' : formData.premisesSpreadDetails
    });
  };



  const handleRemoteFromServicesChange = (value: string) => {
    onDataChange({
      remoteFromEmergencyServices: value,
      // Clear the details if "no" is selected
      remoteServicesDetails: value === 'no' ? '' : formData.remoteServicesDetails
    });
  };

  const handleSharedSitesChange = (value: string) => {
    onDataChange({
      employeesAtSharedSites: value,
      // Clear the details if "no" is selected
      sharedSitesDetails: value === 'no' ? '' : formData.sharedSitesDetails
    });
  };

  const handlePremisesDetailsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onDataChange({
      premisesSpreadDetails: e.target.value
    });
  };

  const handleRiskLevelsDetailsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onDataChange({
      riskLevelsDetails: e.target.value
    });
  };

  const handleRemoteServicesDetailsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onDataChange({
      remoteServicesDetails: e.target.value
    });
  };

  const handleSharedSitesDetailsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onDataChange({
      sharedSitesDetails: e.target.value
    });
  };

  // Validation function for this step
  const validateStep = React.useCallback(() => {
    const stepErrors: Record<string, string | undefined> = {};

    // Validate premises spread out (required)
    const premisesError = validateRequired(formData.premisesSpreadOut, 'Premises layout');
    if (premisesError) {
      stepErrors.premisesSpreadOut = premisesError;
    }

    // Validate premises details if applicable
    if (formData.premisesSpreadOut && formData.premisesSpreadOut !== 'none') {
      const detailsError = validateRequired(formData.premisesSpreadDetails, 'Premises details');
      if (detailsError) {
        stepErrors.premisesSpreadDetails = detailsError;
      }
    }

    // Validate different risk levels (required)
    const riskLevelsError = validateRequired(formData.differentRiskLevels, 'Different risk levels');
    if (riskLevelsError) {
      stepErrors.differentRiskLevels = riskLevelsError;
    }

    // Validate risk levels details if applicable
    if (formData.differentRiskLevels === 'yes') {
      const riskDetailsError = validateRequired(formData.riskLevelsDetails, 'Risk levels details');
      if (riskDetailsError) {
        stepErrors.riskLevelsDetails = riskDetailsError;
      }
    }

    // Validate remote from emergency services (required)
    const remoteError = validateRequired(formData.remoteFromEmergencyServices, 'Remote from emergency services');
    if (remoteError) {
      stepErrors.remoteFromEmergencyServices = remoteError;
    }

    // Validate remote services details if applicable
    if (formData.remoteFromEmergencyServices === 'yes') {
      const remoteDetailsError = validateRequired(formData.remoteServicesDetails, 'Remote services details');
      if (remoteDetailsError) {
        stepErrors.remoteServicesDetails = remoteDetailsError;
      }
    }

    // Validate shared sites (required)
    const sharedError = validateRequired(formData.employeesAtSharedSites, 'Employees at shared sites');
    if (sharedError) {
      stepErrors.employeesAtSharedSites = sharedError;
    }

    // Validate shared sites details if applicable
    if (formData.employeesAtSharedSites === 'yes') {
      const sharedDetailsError = validateRequired(formData.sharedSitesDetails, 'Shared sites details');
      if (sharedDetailsError) {
        stepErrors.sharedSitesDetails = sharedDetailsError;
      }
    }

    const isValid = Object.keys(stepErrors).length === 0;
    return { isValid, errors: stepErrors };
  }, [
    formData.premisesSpreadOut, 
    formData.premisesSpreadDetails,
    formData.differentRiskLevels,
    formData.riskLevelsDetails,
    formData.remoteFromEmergencyServices,
    formData.remoteServicesDetails,
    formData.employeesAtSharedSites,
    formData.sharedSitesDetails
  ]);

  // Update validation function reference
  React.useEffect(() => {
    if (onValidate) {
      (onValidate as any).current = validateStep;
    }
  }, [validateStep, onValidate]);

  const premisesOptions = [
    { 
      value: 'several-buildings', 
      label: 'There are several buildings',
      description: 'Multiple separate buildings on site'
    },
    { 
      value: 'multiple-floors', 
      label: 'The building has multiple floors',
      description: 'Multi-story single building'
    },
    { 
      value: 'other', 
      label: 'Other',
      description: 'Different layout or configuration'
    },
    { 
      value: 'none', 
      label: 'None of the above',
      description: 'Single floor, single building'
    }
  ];

  const riskLevelsOptions = [
    { 
      value: 'yes', 
      label: 'Yes',
      description: 'We have different risk areas (e.g., office and factory)'
    },
    { 
      value: 'no', 
      label: 'No',
      description: 'All areas have similar risk levels'
    }
  ];

  const yesNoOptions = [
    { 
      value: 'yes', 
      label: 'Yes'
    },
    { 
      value: 'no', 
      label: 'No'
    }
  ];

  const showPremisesDetails = formData.premisesSpreadOut && formData.premisesSpreadOut !== 'none';
  const showRiskLevelsDetails = formData.differentRiskLevels === 'yes';
  const showRemoteDetails = formData.remoteFromEmergencyServices === 'yes';
  const showSharedSitesDetails = formData.employeesAtSharedSites === 'yes';

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Premises/Site(s)
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Information about your workplace layout and emergency service access.
        </p>
      </div>

      {/* Field 1: Premises Spread Out */}
      <FormField
        label="Are the premises of your workplace spread out, e.g are there several buildings on the site or multi-floor buildings?"
        required={true}
        error={errors.premisesSpreadOut}
      >
        <ModernRadioGroup
          name="premisesSpreadOut"
          options={premisesOptions}
          selectedValue={formData.premisesSpreadOut || ''}
          onChange={handlePremisesSpreadChange}
          layout="vertical"
        />
      </FormField>

      {/* Conditional Details for Premises */}
      {showPremisesDetails && (
        <>
          <FormField
            label="Please provide details of how you will account for this in your first aid provision"
            required={true}
            error={errors.premisesSpreadDetails}
          >
            <TextArea
              value={formData.premisesSpreadDetails || ''}
              onChange={handlePremisesDetailsChange}
              placeholder="Describe your first aid provision plans for multiple buildings/floors..."
              rows={4}
              maxLength={500}
            />
          </FormField>

          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Info className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-amber-700 dark:text-amber-300">
                <strong>Recommendation:</strong> You should consider provision of first aid measures in each building or on each floor.
              </p>
            </div>
          </div>
        </>
      )}

      {/* Field 2: Different Risk Levels */}
      <FormField
        label="Does your workplace contain areas with different risk levels, an office and a factory?"
        required={true}
        error={errors.differentRiskLevels}
      >
        <ModernRadioGroup
          options={riskLevelsOptions}
          selectedValue={formData.differentRiskLevels || ''}
          onChange={(value) => onDataChange({ 
            differentRiskLevels: value,
            // Clear the details if "no" is selected
            riskLevelsDetails: value === 'no' ? '' : formData.riskLevelsDetails
          })}
          layout="vertical"
        />
      </FormField>

      {/* Conditional Details for Risk Levels */}
      {showRiskLevelsDetails && (
        <FormField
          label="Please write which area of the business you are completing this first aids needs assessment"
          required={true}
          error={errors.riskLevelsDetails}
        >
          <TextArea
            value={formData.riskLevelsDetails || ''}
            onChange={handleRiskLevelsDetailsChange}
            placeholder="Specify which business area this assessment covers..."
            rows={3}
            maxLength={300}
          />
        </FormField>
      )}

      {/* Field 3: Remote from Emergency Services */}
      <FormField
        label="Is your workplace remote from emergency medical services?"
        required={true}
        error={errors.remoteFromEmergencyServices}
      >
        <ModernRadioGroup
          name="remoteFromEmergencyServices"
          options={yesNoOptions}
          selectedValue={formData.remoteFromEmergencyServices || ''}
          onChange={handleRemoteFromServicesChange}
          layout="horizontal"
        />
      </FormField>

      {/* Conditional Details for Remote Services */}
      {showRemoteDetails && (
        <>
          <FormField
            label="Provide details of how you will account for this in your first aid provision"
            required={true}
            error={errors.remoteServicesDetails}
          >
            <TextArea
              value={formData.remoteServicesDetails || ''}
              onChange={handleRemoteServicesDetailsChange}
              placeholder="Describe your plans for remote location first aid provision..."
              rows={4}
              maxLength={500}
            />
          </FormField>

          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-red-800 dark:text-red-200 mb-2">
                  You Should:
                </h4>
                <ul className="text-sm text-red-700 dark:text-red-300 space-y-1 list-disc list-inside">
                  <li>Inform the emergency services of your location; consider special arrangements with the emergency services.</li>
                  <li>Consider emergency transport requirements.</li>
                </ul>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Field 4: Shared Sites */}
      <FormField
        label="Do any of your employees work at sites occupied by other employers?"
        required={true}
        error={errors.employeesAtSharedSites}
      >
        <ModernRadioGroup
          name="employeesAtSharedSites"
          options={yesNoOptions}
          selectedValue={formData.employeesAtSharedSites || ''}
          onChange={handleSharedSitesChange}
          layout="horizontal"
        />
      </FormField>

      {/* Conditional Details for Shared Sites */}
      {showSharedSitesDetails && (
        <FormField
          label="Provide details of how you will account for this in your first aid provision"
          required={true}
          error={errors.sharedSitesDetails}
        >
          <TextArea
            value={formData.sharedSitesDetails || ''}
            onChange={handleSharedSitesDetailsChange}
            placeholder="Describe your first aid arrangements for shared sites..."
            rows={4}
            maxLength={500}
          />
        </FormField>
      )}
    </div>
  );
}
