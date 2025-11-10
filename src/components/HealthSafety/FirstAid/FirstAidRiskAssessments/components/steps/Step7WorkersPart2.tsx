import React, { useCallback, useEffect } from 'react';
import { FormField, TextArea, ModernRadioGroup, ModernCheckboxGroup } from '../../../../../../utils/form';
import { validateRequired } from '../../../../../../utils/form';
import type { FirstAidNeedsAssessmentStepProps } from '../../types';
import { Info, Users, AlertTriangle, FileText } from 'lucide-react';

export function Step7WorkersPart2({ 
  formData, 
  errors, 
  onDataChange,
  onValidate 
}: FirstAidNeedsAssessmentStepProps) {

  const handleHealthConditionsChange = (selectedValues: string[]) => {
    onDataChange({
      healthConditions: selectedValues,
      // Clear details for unselected conditions
      ...Object.fromEntries(
        healthConditionOptions.map(condition => [
          `${condition.value}Details`,
          selectedValues.includes(condition.value) ? formData[`${condition.value}Details`] || '' : ''
        ])
      )
    });
  };

  const handleConditionDetailsChange = (conditionValue: string, details: string) => {
    onDataChange({
      [`${conditionValue}Details`]: details
    });
  };

  // Validation function for this step
  const validateStep = useCallback(() => {
    const stepErrors: Record<string, string | undefined> = {};

    // Validate health conditions (required)
    const hasSelectedConditions = formData.healthConditions && formData.healthConditions.length > 0;
    if (!hasSelectedConditions) {
      stepErrors.healthConditions = 'Please select applicable health conditions or indicate none apply';
    }

    // Validate details for selected health conditions
    if (formData.healthConditions) {
      formData.healthConditions.forEach(condition => {
        const detailsKey = `${condition}Details`;
        const detailsError = validateRequired(formData[detailsKey], `${condition} details`);
        if (detailsError) {
          stepErrors[detailsKey] = detailsError;
        }
      });
    }

    // Validate pregnant workers (required)
    const pregnantError = validateRequired(formData.pregnantWorkers, 'Pregnant workers');
    if (pregnantError) {
      stepErrors.pregnantWorkers = pregnantError;
    }

    // Validate pregnant workers details if "yes" selected
    if (formData.pregnantWorkers === 'yes') {
      const pregnantDetailsError = validateRequired(formData.pregnantWorkersDetails, 'Pregnant workers details');
      if (pregnantDetailsError) {
        stepErrors.pregnantWorkersDetails = pregnantDetailsError;
      }
    }

    // Validate children/under 18 workers (required)
    const childrenError = validateRequired(formData.childrenOrUnder18, 'Children or workers under 18');
    if (childrenError) {
      stepErrors.childrenOrUnder18 = childrenError;
    }

    // Validate children/under 18 details if "yes" selected
    if (formData.childrenOrUnder18 === 'yes') {
      const childrenDetailsError = validateRequired(formData.childrenOrUnder18Details, 'Children or workers under 18 details');
      if (childrenDetailsError) {
        stepErrors.childrenOrUnder18Details = childrenDetailsError;
      }
    }

    // Validate first aider absence arrangements (required)
    const absenceError = validateRequired(formData.firstAiderAbsenceArrangements, 'First aider absence arrangements');
    if (absenceError) {
      stepErrors.firstAiderAbsenceArrangements = absenceError;
    }

    // Validate shared sites (required)
    const sharedSitesError = validateRequired(formData.employeesAtSharedSitesStep7, 'Employees at shared sites');
    if (sharedSitesError) {
      stepErrors.employeesAtSharedSitesStep7 = sharedSitesError;
    }

    // Validate shared sites details if "yes" selected
    if (formData.employeesAtSharedSitesStep7 === 'yes') {
      const sharedSitesDetailsError = validateRequired(formData.employeesAtSharedSitesDetailsStep7, 'Shared sites details');
      if (sharedSitesDetailsError) {
        stepErrors.employeesAtSharedSitesDetailsStep7 = sharedSitesDetailsError;
      }
    }

    const isValid = Object.keys(stepErrors).length === 0;
    return { isValid, errors: stepErrors };
  }, [
    formData.healthConditions,
    formData.pregnantWorkers,
    formData.pregnantWorkersDetails,
    formData.childrenOrUnder18,
    formData.childrenOrUnder18Details,
    formData.firstAiderAbsenceArrangements,
    formData.employeesAtSharedSitesStep7,
    formData.employeesAtSharedSitesDetailsStep7,
    formData
  ]);

  // Update validation function reference
  useEffect(() => {
    if (onValidate) {
      (onValidate as any).current = validateStep;
    }
  }, [validateStep, onValidate]);

  const healthConditionOptions = [
    { 
      value: 'asthma', 
      label: 'Asthma',
      description: 'Respiratory condition requiring special attention'
    },
    { 
      value: 'diabetes', 
      label: 'Diabetes',
      description: 'Blood sugar management condition'
    },
    { 
      value: 'severeAllergies', 
      label: 'Severe allergies',
      description: 'Life-threatening allergic reactions'
    },
    { 
      value: 'epilepsy', 
      label: 'Epilepsy',
      description: 'Seizure disorder requiring specific care'
    },
    { 
      value: 'heartDisease', 
      label: 'Heart Disease',
      description: 'Cardiovascular conditions'
    },
    { 
      value: 'other', 
      label: 'Other',
      description: 'Other health conditions or disabilities'
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

  const selectedConditions = formData.healthConditions || [];
  const hasAnyHealthConditions = selectedConditions.length > 0;

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Workers Part 2
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Assess specific worker health conditions and workplace arrangements that affect first aid provision.
        </p>
      </div>

      {/* Field 1: Health Conditions */}
      <FormField
        label="Any employees with disabilities, or health problems?"
        required={true}
        error={errors.healthConditions}
      >
        <ModernCheckboxGroup
          options={healthConditionOptions}
          selectedValues={selectedConditions}
          onChange={handleHealthConditionsChange}
          layout="vertical"
        />
      </FormField>

      {/* Details for Selected Health Conditions */}
      {selectedConditions.map((conditionValue) => {
        const condition = healthConditionOptions.find(c => c.value === conditionValue);
        if (!condition) return null;

        return (
          <FormField
            key={conditionValue}
            label={`${condition.label} - Provide details of how you will account for this in your first aid provision`}
            required={true}
            error={errors[`${conditionValue}Details`]}
          >
            <TextArea
              value={formData[`${conditionValue}Details`] || ''}
              onChange={(e) => handleConditionDetailsChange(conditionValue, e.target.value)}
              placeholder={`Describe your first aid provisions for employees with ${condition.label.toLowerCase()}...`}
              rows={3}
              maxLength={500}
            />
          </FormField>
        );
      })}

      {/* Field 2: Pregnant Workers */}
      <FormField
        label="Is there any pregnant workers on site?"
        required={true}
        error={errors.pregnantWorkers}
      >
        <ModernRadioGroup
          options={yesNoOptions}
          selectedValue={formData.pregnantWorkers || ''}
          onChange={(value) => onDataChange({ 
            pregnantWorkers: value,
            // Clear details if "no" is selected
            pregnantWorkersDetails: value === 'no' ? '' : formData.pregnantWorkersDetails
          })}
          layout="horizontal"
        />
      </FormField>

      {/* Conditional Details for Pregnant Workers */}
      {formData.pregnantWorkers === 'yes' && (
        <FormField
          label="Provide details of how you will account for this in your first aid provision"
          required={true}
          error={errors.pregnantWorkersDetails}
        >
          <TextArea
            value={formData.pregnantWorkersDetails || ''}
            onChange={(e) => onDataChange({ pregnantWorkersDetails: e.target.value })}
            placeholder="Describe how you will address first aid needs for pregnant workers..."
            rows={3}
            maxLength={500}
          />
        </FormField>
      )}

      {/* Field 3: Children or Workers Under 18 */}
      <FormField
        label="Are there children in the workplace or any workers under 18?"
        required={true}
        error={errors.childrenOrUnder18}
      >
        <ModernRadioGroup
          options={yesNoOptions}
          selectedValue={formData.childrenOrUnder18 || ''}
          onChange={(value) => onDataChange({ 
            childrenOrUnder18: value,
            // Clear details if "no" is selected
            childrenOrUnder18Details: value === 'no' ? '' : formData.childrenOrUnder18Details
          })}
          layout="horizontal"
        />
      </FormField>

      {/* Conditional Details for Children/Under 18 */}
      {formData.childrenOrUnder18 === 'yes' && (
        <FormField
          label="Provide details of how you will account for this in your first aid provision"
          required={true}
          error={errors.childrenOrUnder18Details}
        >
          <TextArea
            value={formData.childrenOrUnder18Details || ''}
            onChange={(e) => onDataChange({ childrenOrUnder18Details: e.target.value })}
            placeholder="Describe how you will address first aid needs for children or workers under 18..."
            rows={3}
            maxLength={500}
          />
        </FormField>
      )}

      {/* Field 4: First Aider Absence Arrangements */}
      <FormField
        label="What arrangements do you have to cover first aider absence such as sickness or holidays?"
        required={true}
        error={errors.firstAiderAbsenceArrangements}
      >
        <TextArea
          value={formData.firstAiderAbsenceArrangements || ''}
          onChange={(e) => onDataChange({ firstAiderAbsenceArrangements: e.target.value })}
          placeholder="Describe your arrangements for covering first aider absences..."
          rows={4}
          maxLength={750}
        />
      </FormField>

      {/* First Aider Absence Notice */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-medium text-amber-800 dark:text-amber-200 mb-1">
              First Aider Coverage
            </h4>
            <p className="text-sm text-amber-700 dark:text-amber-300">
              Ensure sufficient first aid provisions during holiday periods/unexpected staff absences.
            </p>
          </div>
        </div>
      </div>

      {/* Field 5: Employees at Shared Sites */}
      <FormField
        label="Do any of your employees work at sites occupied by other employers?"
        required={true}
        error={errors.employeesAtSharedSitesStep7}
      >
        <ModernRadioGroup
          options={yesNoOptions}
          selectedValue={formData.employeesAtSharedSitesStep7 || ''}
          onChange={(value) => onDataChange({ 
            employeesAtSharedSitesStep7: value,
            // Clear details if "no" is selected
            employeesAtSharedSitesDetailsStep7: value === 'no' ? '' : formData.employeesAtSharedSitesDetailsStep7
          })}
          layout="horizontal"
        />
      </FormField>

      {/* Conditional Details for Shared Sites */}
      {formData.employeesAtSharedSitesStep7 === 'yes' && (
        <>
          <FormField
            label="Provide details of how you will account for this in your first aid provision"
            required={true}
            error={errors.employeesAtSharedSitesDetailsStep7}
          >
            <TextArea
              value={formData.employeesAtSharedSitesDetailsStep7 || ''}
              onChange={(e) => onDataChange({ employeesAtSharedSitesDetailsStep7: e.target.value })}
              placeholder="Describe your first aid arrangements for employees at shared sites..."
              rows={3}
              maxLength={500}
            />
          </FormField>

          {/* Shared Sites Notice */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">
                  Shared Site Arrangements
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  You should make arrangements with other site occupiers to ensure adequate provision of first aid. 
                  A written agreement between employers is strongly recommended.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
