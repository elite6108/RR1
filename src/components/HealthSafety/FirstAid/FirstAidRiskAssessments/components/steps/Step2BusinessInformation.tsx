import React from 'react';
import { FormField, TextInput, ModernRadioGroup } from '../../../../../../utils/form';
import { validateRequired } from '../../../../../../utils/form';
import type { FirstAidNeedsAssessmentStepProps } from '../../types';
import { Info } from 'lucide-react';

export function Step2BusinessInformation({ 
  formData, 
  errors, 
  onDataChange,
  onValidate 
}: FirstAidNeedsAssessmentStepProps) {

  const handleNatureOfBusinessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onDataChange({
      natureOfBusiness: e.target.value
    });
  };

  const handleEmployeeCountChange = (value: string) => {
    onDataChange({
      numberOfEmployees: value
    });
  };

  const handlePublicVisitChange = (value: string) => {
    onDataChange({
      publicVisitPremises: value
    });
  };

  // Validation function for this step
  const validateStep = React.useCallback(() => {
    const stepErrors: Record<string, string | undefined> = {};

    // Validate nature of business (required)
    const businessError = validateRequired(formData.natureOfBusiness, 'Nature of business');
    if (businessError) {
      stepErrors.natureOfBusiness = businessError;
    }

    // Validate number of employees (required)
    const employeeError = validateRequired(formData.numberOfEmployees, 'Number of employees');
    if (employeeError) {
      stepErrors.numberOfEmployees = employeeError;
    }

    // Validate public visit question (required)
    const publicError = validateRequired(formData.publicVisitPremises, 'Public visit question');
    if (publicError) {
      stepErrors.publicVisitPremises = publicError;
    }

    const isValid = Object.keys(stepErrors).length === 0;
    return { isValid, errors: stepErrors };
  }, [formData.natureOfBusiness, formData.numberOfEmployees, formData.publicVisitPremises]);

  // Update validation function reference
  React.useEffect(() => {
    if (onValidate) {
      (onValidate as any).current = validateStep;
    }
  }, [validateStep, onValidate]);

  const employeeOptions = [
    { 
      value: '1-45', 
      label: '1-45 employees',
      description: 'Small business or team'
    },
    { 
      value: '50-249', 
      label: '50-249 employees',
      description: 'Medium-sized business'
    },
    { 
      value: '250+', 
      label: '250+ employees',
      description: 'Large business or organization'
    }
  ];

  const publicVisitOptions = [
    { 
      value: 'yes', 
      label: 'Yes',
      description: 'Customers, visitors, or contractors regularly visit'
    },
    { 
      value: 'no', 
      label: 'No',
      description: 'Only employees access the premises'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Business Information
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Information about your business and workforce.
        </p>
      </div>

      {/* Field 1: Nature of Business */}
      <FormField
        label="Nature of business"
        required={true}
        error={errors.natureOfBusiness}
        description="Describe the type of business or activities conducted"
      >
        <TextInput
          value={formData.natureOfBusiness || ''}
          onChange={handleNatureOfBusinessChange}
          placeholder="e.g., Office work, Manufacturing, Retail, Construction, etc."
          maxLength={200}
        />
      </FormField>

      {/* Field 2: Number of Employees */}
      <FormField
        label="Number of employees"
        required={true}
        error={errors.numberOfEmployees}
        description="Select the range that best describes your workforce size"
      >
        <ModernRadioGroup
          name="numberOfEmployees"
          options={employeeOptions}
          selectedValue={formData.numberOfEmployees || ''}
          onChange={handleEmployeeCountChange}
          layout="vertical"
        />
      </FormField>

      {/* Field 3: Public Visit Premises */}
      <FormField
        label="Do members of the public visit your premises?"
        required={true}
        error={errors.publicVisitPremises}
        description="This includes customers, visitors, contractors, or any non-employees"
      >
        <ModernRadioGroup
          name="publicVisitPremises"
          options={publicVisitOptions}
          selectedValue={formData.publicVisitPremises || ''}
          onChange={handlePublicVisitChange}
          layout="horizontal"
        />
      </FormField>

      {/* Conditional Notice for Public Visitors */}
      {formData.publicVisitPremises === 'yes' && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">
                First Aid for Non-Employees
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Under the Regulations, you have no legal duty to provide first aid for non-employees, 
                but HSE strongly recommends that you include them in your first-aid provision.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
