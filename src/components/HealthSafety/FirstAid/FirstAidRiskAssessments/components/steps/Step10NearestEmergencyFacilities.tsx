import React, { useCallback, useEffect } from 'react';
import { FormField, TextInput } from '../../../../../../utils/form';
import { validateRequired } from '../../../../../../utils/form';
import type { FirstAidNeedsAssessmentStepProps } from '../../types';
import { MapPin, Heart, Building2 } from 'lucide-react';

export function Step10NearestEmergencyFacilities({ 
  formData, 
  errors, 
  onDataChange,
  onValidate 
}: FirstAidNeedsAssessmentStepProps) {

  // Validation function for this step
  const validateStep = useCallback(() => {
    const stepErrors: Record<string, string | undefined> = {};

    // Validate nearest hospital (required)
    const hospitalError = validateRequired(formData.nearestHospital, 'Nearest hospital');
    if (hospitalError) {
      stepErrors.nearestHospital = hospitalError;
    }

    // Validate AED information (required)
    const aedError = validateRequired(formData.aedInformation, 'AED information');
    if (aedError) {
      stepErrors.aedInformation = aedError;
    }

    const isValid = Object.keys(stepErrors).length === 0;
    return { isValid, errors: stepErrors };
  }, [formData.nearestHospital, formData.aedInformation]);

  // Update validation function reference
  useEffect(() => {
    if (onValidate) {
      (onValidate as any).current = validateStep;
    }
  }, [validateStep, onValidate]);

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Nearest Emergency Facilities
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Identify the nearest emergency facilities and equipment available to your workplace.
        </p>
      </div>

      {/* Field 1: Nearest Hospital */}
      <FormField
        label="Nearest Hospital"
        description="Provide the name, address, and distance of the nearest hospital or emergency medical facility"
        required={true}
        error={errors.nearestHospital}
      >
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Building2 className="h-5 w-5 text-gray-400" />
          </div>
          <TextInput
            value={formData.nearestHospital || ''}
            onChange={(e) => onDataChange({ nearestHospital: e.target.value })}
            placeholder="e.g., City General Hospital, 123 Main Street, 2.5 miles away"
            className="pl-10"
            maxLength={500}
          />
        </div>
      </FormField>

      {/* Field 2: AED Information */}
      <FormField
        label="AED (Automated External Defibrillator)"
        description="Provide information about AED availability, location, and accessibility at your workplace or nearby"
        required={true}
        error={errors.aedInformation}
      >
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Heart className="h-5 w-5 text-red-500" />
          </div>
          <TextInput
            value={formData.aedInformation || ''}
            onChange={(e) => onDataChange({ aedInformation: e.target.value })}
            placeholder="e.g., AED located in main reception area, accessible 24/7, or nearest AED at shopping center 0.5 miles away"
            className="pl-10"
            maxLength={500}
          />
        </div>
      </FormField>

      {/* Emergency Facilities Information Notice */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
              Emergency Facility Planning
            </h4>
            <div className="text-sm text-blue-700 dark:text-blue-300 space-y-2">
              <p>
                <strong>Hospital Information:</strong> Include the facility name, full address, phone number, and estimated travel time from your workplace.
              </p>
              <p>
                <strong>AED Access:</strong> Note the exact location, access hours, and any special instructions for accessing the AED. If no AED is available on-site, identify the nearest publicly accessible AED.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Contact Reminder */}
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Heart className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-medium text-red-800 dark:text-red-200 mb-1">
              Emergency Response Reminder
            </h4>
            <p className="text-sm text-red-700 dark:text-red-300">
              Ensure all staff know the location of the nearest hospital and AED. Consider posting emergency facility information in visible areas and including it in staff training.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
