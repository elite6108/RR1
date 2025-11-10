import React, { useCallback, useEffect } from 'react';
import { FormField, TextArea, ModernRadioGroup, ModernCheckboxGroup } from '../../../../../../utils/form';
import { validateRequired } from '../../../../../../utils/form';
import type { FirstAidNeedsAssessmentStepProps } from '../../types';
import { AlertTriangle, Activity } from 'lucide-react';

export function Step9PreviousInjuries({ 
  formData, 
  errors, 
  onDataChange,
  onValidate 
}: FirstAidNeedsAssessmentStepProps) {

  const handleInjuryTypesChange = (selectedValues: string[]) => {
    onDataChange({
      injuryTypes: selectedValues,
      // Clear details for unselected injury types
      ...Object.fromEntries(
        injuryTypeOptions.map(injury => [
          `${injury.value}Details`,
          selectedValues.includes(injury.value) ? formData[`${injury.value}Details`] || '' : ''
        ])
      )
    });
  };

  const handleInjuryDetailsChange = (injuryValue: string, details: string) => {
    onDataChange({
      [`${injuryValue}Details`]: details
    });
  };

  // Validation function for this step
  const validateStep = useCallback(() => {
    const stepErrors: Record<string, string | undefined> = {};

    // Validate previous injuries awareness (required)
    const injuriesError = validateRequired(formData.previousInjuriesAwareness, 'Previous injuries awareness');
    if (injuriesError) {
      stepErrors.previousInjuriesAwareness = injuriesError;
    }

    // If "yes" is selected, validate injury types selection
    if (formData.previousInjuriesAwareness === 'yes') {
      const hasSelectedInjuries = formData.injuryTypes && formData.injuryTypes.length > 0;
      if (!hasSelectedInjuries) {
        stepErrors.injuryTypes = 'Please select applicable injury types that have occurred';
      }

      // Validate details for selected injury types
      if (formData.injuryTypes) {
        formData.injuryTypes.forEach(injury => {
          const detailsKey = `${injury}Details`;
          const detailsError = validateRequired(formData[detailsKey], `${injury} details`);
          if (detailsError) {
            stepErrors[detailsKey] = detailsError;
          }
        });
      }
    }

    const isValid = Object.keys(stepErrors).length === 0;
    return { isValid, errors: stepErrors };
  }, [
    formData.previousInjuriesAwareness,
    formData.injuryTypes,
    formData
  ]);

  // Update validation function reference
  useEffect(() => {
    if (onValidate) {
      (onValidate as any).current = validateStep;
    }
  }, [validateStep, onValidate]);

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

  const injuryTypeOptions = [
    { 
      value: 'brokenBone', 
      label: 'Broken bone',
      description: 'Fractures and bone injuries'
    },
    { 
      value: 'bleeding', 
      label: 'Bleeding',
      description: 'Cuts, lacerations, and hemorrhaging'
    },
    { 
      value: 'fainting', 
      label: 'Fainting',
      description: 'Loss of consciousness episodes'
    },
    { 
      value: 'burn', 
      label: 'Burn',
      description: 'Heat, chemical, or electrical burns'
    },
    { 
      value: 'choking', 
      label: 'Choking',
      description: 'Airway obstruction incidents'
    },
    { 
      value: 'eyeInjury', 
      label: 'Eye injury',
      description: 'Damage to eyes or vision'
    },
    { 
      value: 'poisoning', 
      label: 'Poisoning',
      description: 'Chemical or substance poisoning'
    },
    { 
      value: 'severeAllergicReaction', 
      label: 'Severe allergic reaction',
      description: 'Anaphylaxis or serious allergic responses'
    },
    { 
      value: 'heartAttack', 
      label: 'Heart attack',
      description: 'Cardiac arrest or myocardial infarction'
    },
    { 
      value: 'stroke', 
      label: 'Stroke',
      description: 'Cerebrovascular accidents'
    },
    { 
      value: 'seizure', 
      label: 'Seizure',
      description: 'Epileptic episodes or convulsions'
    },
    { 
      value: 'asthmaAttack', 
      label: 'Asthma attack',
      description: 'Severe respiratory distress'
    },
    { 
      value: 'diabeticEmergency', 
      label: 'Diabetic emergency',
      description: 'Hypoglycemia or hyperglycemia'
    },
    { 
      value: 'other', 
      label: 'Other',
      description: 'Other types of injuries or illnesses'
    }
  ];

  const selectedInjuries = formData.injuryTypes || [];
  const hasPreviousInjuries = formData.previousInjuriesAwareness === 'yes';
  const hasSelectedInjuries = selectedInjuries.length > 0;

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Previous Injuries
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Assess injuries or illnesses that have occurred in your workplace within the last 12 months.
        </p>
      </div>

      {/* Field 1: Previous Injuries Awareness */}
      <FormField
        label="Are you aware of any injuries or illnesses that have occurred in the last 12 months?"
        required={true}
        error={errors.previousInjuriesAwareness}
      >
        <ModernRadioGroup
          options={yesNoOptions}
          selectedValue={formData.previousInjuriesAwareness || ''}
          onChange={(value) => onDataChange({ 
            previousInjuriesAwareness: value,
            // Clear injury types and details if "no" is selected
            injuryTypes: value === 'no' ? [] : formData.injuryTypes,
            // Clear all injury details if "no" is selected
            ...Object.fromEntries(
              injuryTypeOptions.map(injury => [
                `${injury.value}Details`,
                value === 'no' ? '' : formData[`${injury.value}Details`]
              ])
            )
          })}
          layout="horizontal"
        />
      </FormField>

      {/* Conditional Injury Types Selection */}
      {hasPreviousInjuries && (
        <FormField
          label="Select the types of injuries or illnesses that have occurred:"
          required={true}
          error={errors.injuryTypes}
        >
          <ModernCheckboxGroup
            options={injuryTypeOptions}
            selectedValues={selectedInjuries}
            onChange={handleInjuryTypesChange}
            layout="grid"
          />
        </FormField>
      )}

      {/* Details for Selected Injury Types */}
      {hasPreviousInjuries && selectedInjuries.map((injuryValue) => {
        const injury = injuryTypeOptions.find(i => i.value === injuryValue);
        if (!injury) return null;

        return (
          <FormField
            key={injuryValue}
            label={`${injury.label} - Please provide details of how you will account for this in your first aid provision`}
            required={true}
            error={errors[`${injuryValue}Details`]}
          >
            <TextArea
              value={formData[`${injuryValue}Details`] || ''}
              onChange={(e) => handleInjuryDetailsChange(injuryValue, e.target.value)}
              placeholder={`Describe your first aid provisions for ${injury.label.toLowerCase()} incidents...`}
              rows={3}
              maxLength={500}
            />
          </FormField>
        );
      })}

      {/* Previous Injuries Information Notice */}
      {hasPreviousInjuries && hasSelectedInjuries && (
        <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-orange-800 dark:text-orange-200 mb-1">
                Historical Injury Pattern Identified
              </h4>
              <p className="text-sm text-orange-700 dark:text-orange-300">
                Based on your previous injury history, ensure your first aid provisions are specifically prepared to handle these types of incidents effectively.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
