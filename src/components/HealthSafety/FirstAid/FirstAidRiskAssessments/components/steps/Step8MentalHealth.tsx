import React, { useCallback, useEffect } from 'react';
import { FormField, ModernRadioGroup } from '../../../../../../utils/form';
import { validateRequired } from '../../../../../../utils/form';
import type { FirstAidNeedsAssessmentStepProps } from '../../types';
import { Info, Heart } from 'lucide-react';

export function Step8MentalHealth({ 
  formData, 
  errors, 
  onDataChange,
  onValidate 
}: FirstAidNeedsAssessmentStepProps) {

  // Validation function for this step
  const validateStep = useCallback(() => {
    const stepErrors: Record<string, string | undefined> = {};

    // Validate mental health incidents (required)
    const incidentsError = validateRequired(formData.mentalHealthIncidents, 'Mental health incidents');
    if (incidentsError) {
      stepErrors.mentalHealthIncidents = incidentsError;
    }

    // Validate mental health sick leave (required)
    const sickLeaveError = validateRequired(formData.mentalHealthSickLeave, 'Mental health sick leave');
    if (sickLeaveError) {
      stepErrors.mentalHealthSickLeave = sickLeaveError;
    }

    const isValid = Object.keys(stepErrors).length === 0;
    return { isValid, errors: stepErrors };
  }, [formData.mentalHealthIncidents, formData.mentalHealthSickLeave]);

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

  const hasMentalHealthIncidents = formData.mentalHealthIncidents === 'yes';

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Mental Health
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Assess mental health considerations that may affect first aid requirements in your workplace.
        </p>
      </div>

      {/* Field 1: Mental Health Incidents */}
      <FormField
        label="Have incidents associated with mental health previously occurred?"
        required={true}
        error={errors.mentalHealthIncidents}
      >
        <ModernRadioGroup
          options={yesNoOptions}
          selectedValue={formData.mentalHealthIncidents || ''}
          onChange={(value) => onDataChange({ mentalHealthIncidents: value })}
          layout="horizontal"
        />
      </FormField>

      {/* Mental Health First Aider Notice */}
      {hasMentalHealthIncidents && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Heart className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-green-800 dark:text-green-200 mb-1">
                Mental Health First Aid Consideration
              </h4>
              <p className="text-sm text-green-700 dark:text-green-300">
                Appointing a mental health first aider
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Field 2: Mental Health Sick Leave */}
      <FormField
        label="Is there a degree of sick leave/absent that is associated with mental health issues?"
        required={true}
        error={errors.mentalHealthSickLeave}
      >
        <ModernRadioGroup
          options={yesNoOptions}
          selectedValue={formData.mentalHealthSickLeave || ''}
          onChange={(value) => onDataChange({ mentalHealthSickLeave: value })}
          layout="horizontal"
        />
      </FormField>
    </div>
  );
}
