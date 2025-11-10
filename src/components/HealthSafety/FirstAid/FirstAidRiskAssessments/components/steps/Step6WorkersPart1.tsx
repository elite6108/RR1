import React, { useCallback, useEffect } from 'react';
import { FormField, TextArea, ModernRadioGroup, ModernCheckboxGroup } from '../../../../../../utils/form';
import { validateRequired } from '../../../../../../utils/form';
import type { FirstAidNeedsAssessmentStepProps } from '../../types';
import { Info, Users, AlertTriangle, Phone } from 'lucide-react';

export function Step6WorkersPart1({ 
  formData, 
  errors, 
  onDataChange,
  onValidate 
}: FirstAidNeedsAssessmentStepProps) {

  const handleWorkerConditionsChange = (selectedValues: string[]) => {
    onDataChange({
      workerConditions: selectedValues,
      // Clear details for unselected conditions
      ...Object.fromEntries(
        workerConditionOptions.map(condition => [
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

    // Validate site workers count (required)
    const workersError = validateRequired(formData.siteWorkersCount, 'Number of workers');
    if (workersError) {
      stepErrors.siteWorkersCount = workersError;
    }

    // Validate worker conditions (required)
    const hasSelectedConditions = formData.workerConditions && formData.workerConditions.length > 0;
    if (!hasSelectedConditions) {
      stepErrors.workerConditions = 'Please select applicable worker conditions or indicate none apply';
    }

    // Validate details for selected conditions
    if (formData.workerConditions) {
      formData.workerConditions.forEach(condition => {
        const detailsKey = `${condition}Details`;
        const detailsError = validateRequired(formData[detailsKey], `${condition} details`);
        if (detailsError) {
          stepErrors[detailsKey] = detailsError;
        }
      });
    }

    // Validate inexperienced workers (required)
    const inexperiencedError = validateRequired(formData.inexperiencedWorkers, 'Inexperienced workers');
    if (inexperiencedError) {
      stepErrors.inexperiencedWorkers = inexperiencedError;
    }

    // Validate inexperienced workers details if "yes" selected
    if (formData.inexperiencedWorkers === 'yes') {
      const inexperiencedDetailsError = validateRequired(formData.inexperiencedWorkersDetails, 'Inexperienced workers details');
      if (inexperiencedDetailsError) {
        stepErrors.inexperiencedWorkersDetails = inexperiencedDetailsError;
      }
    }

    // Validate age-related risks (required)
    const ageRiskError = validateRequired(formData.ageRelatedRisks, 'Age-related risks');
    if (ageRiskError) {
      stepErrors.ageRelatedRisks = ageRiskError;
    }

    // Validate age-related risks details if "yes" selected
    if (formData.ageRelatedRisks === 'yes') {
      const ageRiskDetailsError = validateRequired(formData.ageRelatedRisksDetails, 'Age-related risks details');
      if (ageRiskDetailsError) {
        stepErrors.ageRelatedRisksDetails = ageRiskDetailsError;
      }
    }

    const isValid = Object.keys(stepErrors).length === 0;
    return { isValid, errors: stepErrors };
  }, [
    formData.siteWorkersCount,
    formData.workerConditions,
    formData.inexperiencedWorkers,
    formData.inexperiencedWorkersDetails,
    formData.ageRelatedRisks,
    formData.ageRelatedRisksDetails,
    formData
  ]);

  // Update validation function reference
  useEffect(() => {
    if (onValidate) {
      (onValidate as any).current = validateStep;
    }
  }, [validateStep, onValidate]);

  const siteWorkersOptions = [
    { 
      value: '1-10', 
      label: '1-10',
      description: 'Small team size'
    },
    { 
      value: '11-20', 
      label: '11-20',
      description: 'Medium team size'
    },
    { 
      value: '21-50', 
      label: '21-50',
      description: 'Large team size'
    },
    { 
      value: '50+', 
      label: '50+',
      description: 'Very large team size'
    }
  ];

  const workerConditionOptions = [
    { 
      value: 'travelALot', 
      label: 'Travel a lot',
      description: 'Employees who frequently travel for work'
    },
    { 
      value: 'workRemotely', 
      label: 'Work remotely',
      description: 'Employees working from remote locations'
    },
    { 
      value: 'workAlone', 
      label: 'Work alone',
      description: 'Employees working in isolation'
    },
    { 
      value: 'workShifts', 
      label: 'Work shifts',
      description: 'Employees on shift patterns'
    },
    { 
      value: 'outOfHours', 
      label: 'Out of hours',
      description: 'Employees working outside normal hours'
    },
    { 
      value: 'others', 
      label: 'Others',
      description: 'Other special working conditions'
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

  const selectedConditions = formData.workerConditions || [];
  const hasRemoteOrTravelOrAlone = selectedConditions.some(condition => 
    ['workRemotely', 'travelALot', 'workAlone'].includes(condition)
  );
  const hasWorkShifts = selectedConditions.includes('workShifts');
  const hasOutOfHours = selectedConditions.includes('outOfHours');

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Workers Part 1
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Assess worker demographics and working conditions that may affect first aid requirements.
        </p>
      </div>

      {/* Field 1: Site Workers Count */}
      <FormField
        label="How many people work at the site?"
        required={true}
        error={errors.siteWorkersCount}
      >
        <ModernRadioGroup
          options={siteWorkersOptions}
          selectedValue={formData.siteWorkersCount || ''}
          onChange={(value) => onDataChange({ siteWorkersCount: value })}
          layout="grid"
        />
      </FormField>

      {/* Field 2: Worker Conditions */}
      <FormField
        label="Do you have employees who..."
        required={true}
        error={errors.workerConditions}
      >
        <ModernCheckboxGroup
          options={workerConditionOptions}
          selectedValues={selectedConditions}
          onChange={handleWorkerConditionsChange}
          layout="vertical"
        />
      </FormField>

      {/* Details for Selected Worker Conditions */}
      {selectedConditions.map((conditionValue) => {
        const condition = workerConditionOptions.find(c => c.value === conditionValue);
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
              placeholder={`Describe your first aid provisions for employees who ${condition.label.toLowerCase()}...`}
              rows={3}
              maxLength={500}
            />
          </FormField>
        );
      })}

      {/* Remote/Travel/Alone Workers Notice */}
      {hasRemoteOrTravelOrAlone && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Phone className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">
                Remote/Travel/Lone Worker Provision
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Ensure you issue personal first aid kits, or mobile phones to employees.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Work Shifts Notice */}
      {hasWorkShifts && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Users className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-amber-800 dark:text-amber-200 mb-1">
                Shift Work Consideration
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300">
                You should ensure there is adequate first-aid provision at all times for people at work.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Out of Hours Notice */}
      {hasOutOfHours && (
        <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-orange-800 dark:text-orange-200 mb-1">
                Out of Hours Coverage
              </h4>
              <p className="text-sm text-orange-700 dark:text-orange-300">
                Ensure there is sufficient First Aid cover during all shifts.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Field 3: Inexperienced Workers */}
      <FormField
        label="Is there any inexperienced workers on site?"
        required={true}
        error={errors.inexperiencedWorkers}
      >
        <ModernRadioGroup
          options={yesNoOptions}
          selectedValue={formData.inexperiencedWorkers || ''}
          onChange={(value) => onDataChange({ 
            inexperiencedWorkers: value,
            // Clear details if "no" is selected
            inexperiencedWorkersDetails: value === 'no' ? '' : formData.inexperiencedWorkersDetails
          })}
          layout="horizontal"
        />
      </FormField>

      {/* Conditional Details for Inexperienced Workers */}
      {formData.inexperiencedWorkers === 'yes' && (
        <>
          <FormField
            label="Provide details of how you will account for this in your first aid provision"
            required={true}
            error={errors.inexperiencedWorkersDetails}
          >
            <TextArea
              value={formData.inexperiencedWorkersDetails || ''}
              onChange={(e) => onDataChange({ inexperiencedWorkersDetails: e.target.value })}
              placeholder="Describe how you will address first aid needs for inexperienced workers..."
              rows={3}
              maxLength={500}
            />
          </FormField>

          {/* Inexperienced Workers Considerations Notice */}
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Info className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-green-800 dark:text-green-200 mb-2">
                  You Should Consider:
                </h4>
                <ul className="text-sm text-green-700 dark:text-green-300 space-y-1 list-disc list-inside">
                  <li>Additional training for first-aiders</li>
                  <li>Additional first-aid equipment</li>
                  <li>Location of first-aid equipment</li>
                </ul>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Field 4: Age-Related Risks */}
      <FormField
        label="Does the age of any of your workers increase your risk of a first aid incident?"
        required={true}
        error={errors.ageRelatedRisks}
      >
        <ModernRadioGroup
          options={yesNoOptions}
          selectedValue={formData.ageRelatedRisks || ''}
          onChange={(value) => onDataChange({ 
            ageRelatedRisks: value,
            // Clear details if "no" is selected
            ageRelatedRisksDetails: value === 'no' ? '' : formData.ageRelatedRisksDetails
          })}
          layout="horizontal"
        />
      </FormField>

      {/* Conditional Details for Age-Related Risks */}
      {formData.ageRelatedRisks === 'yes' && (
        <FormField
          label="Provide details of how you will account for this in your first aid provision"
          required={true}
          error={errors.ageRelatedRisksDetails}
        >
          <TextArea
            value={formData.ageRelatedRisksDetails || ''}
            onChange={(e) => onDataChange({ ageRelatedRisksDetails: e.target.value })}
            placeholder="Describe how you will address first aid needs related to worker age demographics..."
            rows={3}
            maxLength={500}
          />
        </FormField>
      )}
    </div>
  );
}
