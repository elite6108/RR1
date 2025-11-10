import React, { useCallback, useEffect } from 'react';
import { FormField, TextArea } from '../../../../../../utils/form';
import { validateRequired } from '../../../../../../utils/form';
import type { FirstAidNeedsAssessmentStepProps } from '../../types';
import { Package, MapPin, Plus, Droplets } from 'lucide-react';

export function Step12FirstAidResourcesPart1({ 
  formData, 
  errors, 
  onDataChange,
  onValidate 
}: FirstAidNeedsAssessmentStepProps) {

  // Validation function for this step
  const validateStep = useCallback(() => {
    const stepErrors: Record<string, string | undefined> = {};

    // Validate first aid kits recommendations (required)
    const kitsError = validateRequired(formData.firstAidKitsRecommendations, 'First aid kits recommendations');
    if (kitsError) {
      stepErrors.firstAidKitsRecommendations = kitsError;
    }

    // Validate additional kit content (required)
    const contentError = validateRequired(formData.additionalKitContent, 'Additional kit content');
    if (contentError) {
      stepErrors.additionalKitContent = contentError;
    }

    // Validate additional recommendations (required)
    const additionalError = validateRequired(formData.additionalRecommendations, 'Additional recommendations');
    if (additionalError) {
      stepErrors.additionalRecommendations = additionalError;
    }

    const isValid = Object.keys(stepErrors).length === 0;
    return { isValid, errors: stepErrors };
  }, [
    formData.firstAidKitsRecommendations,
    formData.additionalKitContent,
    formData.additionalRecommendations
  ]);

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
          First Aid Resources - Part 1
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Specify the recommended first aid resources and equipment needed for your workplace.
        </p>
      </div>

      {/* Field 1: First Aid Kits Recommendations */}
      <FormField
        label="Recommended number and location of additional first aid kits"
        description="Specify how many first aid kits are needed and where they should be positioned throughout your workplace"
        required={true}
        error={errors.firstAidKitsRecommendations}
      >
        <div className="relative">
          <div className="absolute top-3 left-3 pointer-events-none">
            <MapPin className="h-5 w-5 text-gray-400" />
          </div>
          <TextArea
            value={formData.firstAidKitsRecommendations || ''}
            onChange={(e) => onDataChange({ firstAidKitsRecommendations: e.target.value })}
            placeholder="e.g., 3 additional first aid kits required: 1 in main office area (ground floor), 1 in warehouse section, 1 in staff break room. Each kit should be easily accessible and clearly marked with appropriate signage."
            rows={4}
            maxLength={1000}
            className="pl-11"
          />
        </div>
      </FormField>

      {/* Field 2: Additional Kit Content */}
      <FormField
        label="Recommended additional content for first aid kits"
        description="List any specialized items that should be added to standard first aid kits based on your workplace risks and needs"
        required={true}
        error={errors.additionalKitContent}
      >
        <div className="relative">
          <div className="absolute top-3 left-3 pointer-events-none">
            <Package className="h-5 w-5 text-gray-400" />
          </div>
          <TextArea
            value={formData.additionalKitContent || ''}
            onChange={(e) => onDataChange({ additionalKitContent: e.target.value })}
            placeholder="e.g., Burn gel for heat-related injuries, Eye wash solution for chemical exposure, Instant cold packs for sports injuries, EpiPens for severe allergic reactions, Glucose tablets for diabetic emergencies."
            rows={4}
            maxLength={1000}
            className="pl-11"
          />
        </div>
      </FormField>

      {/* Field 3: Additional Recommendations */}
      <FormField
        label="Additional recommendations (e.g. provision of first aid room or emergency shower)"
        description="Specify any additional first aid facilities, equipment, or arrangements needed beyond standard first aid kits"
        required={true}
        error={errors.additionalRecommendations}
      >
        <div className="relative">
          <div className="absolute top-3 left-3 pointer-events-none">
            <Plus className="h-5 w-5 text-gray-400" />
          </div>
          <TextArea
            value={formData.additionalRecommendations || ''}
            onChange={(e) => onDataChange({ additionalRecommendations: e.target.value })}
            placeholder="e.g., Dedicated first aid room with examination couch and hand washing facilities, Emergency shower station near chemical storage area, AED placement in main reception, Stretcher for patient transport, Emergency oxygen supply."
            rows={5}
            maxLength={1500}
            className="pl-11"
          />
        </div>
      </FormField>

      {/* First Aid Resources Information */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Package className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
              First Aid Resource Planning Guidelines
            </h4>
            <div className="text-sm text-blue-700 dark:text-blue-300 space-y-2">
              <p>
                <strong>Kit Placement:</strong> Position first aid kits in easily accessible locations, away from potential hazards, and ensure they are clearly signposted.
              </p>
              <p>
                <strong>Specialized Equipment:</strong> Consider workplace-specific risks when selecting additional content (e.g., burn treatments for kitchens, eye wash for laboratories).
              </p>
              <p>
                <strong>Additional Facilities:</strong> Larger workplaces may require dedicated first aid rooms, emergency showers, or specialized equipment based on identified risks.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Equipment Reminder */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Droplets className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-medium text-amber-800 dark:text-amber-200 mb-1">
              Equipment Maintenance
            </h4>
            <p className="text-sm text-amber-700 dark:text-amber-300">
              Ensure all recommended first aid resources are regularly inspected, restocked, and maintained. Assign responsibility for checking expiry dates and replacing used items.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
