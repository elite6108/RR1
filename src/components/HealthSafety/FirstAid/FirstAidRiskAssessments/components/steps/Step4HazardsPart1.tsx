import React, { useState } from 'react';
import { FormField, TextArea, ModernCheckboxGroup, TextInput } from '../../../../../../utils/form';
import { validateRequired } from '../../../../../../utils/form';
import type { FirstAidNeedsAssessmentStepProps } from '../../types';
import { Info, Users, Plus, X } from 'lucide-react';

export function Step4HazardsPart1({ 
  formData, 
  errors, 
  onDataChange,
  onValidate 
}: FirstAidNeedsAssessmentStepProps) {

  const [customHazard, setCustomHazard] = useState('');

  const handleLowLevelHazardsChange = (selectedValues: string[]) => {
    onDataChange({
      lowLevelHazards: selectedValues,
      // Clear details for unselected hazards
      ...Object.fromEntries(
        predefinedHazards.map(hazard => [
          `${hazard.value}Details`,
          selectedValues.includes(hazard.value) ? formData[`${hazard.value}Details`] || '' : ''
        ])
      )
    });
  };

  const handleHazardDetailsChange = (hazardValue: string, details: string) => {
    onDataChange({
      [`${hazardValue}Details`]: details
    });
  };

  const handleAddCustomHazard = () => {
    if (customHazard.trim() && !formData.customHazards?.includes(customHazard.trim())) {
      const currentCustom = formData.customHazards || [];
      const newCustom = [...currentCustom, customHazard.trim()];
      onDataChange({
        customHazards: newCustom,
        [`custom_${customHazard.trim().replace(/\s+/g, '_').toLowerCase()}Details`]: ''
      });
      setCustomHazard('');
    }
  };

  const handleRemoveCustomHazard = (hazardToRemove: string) => {
    const currentCustom = formData.customHazards || [];
    const newCustom = currentCustom.filter(h => h !== hazardToRemove);
    const detailsKey = `custom_${hazardToRemove.replace(/\s+/g, '_').toLowerCase()}Details`;
    
    onDataChange({
      customHazards: newCustom,
      [detailsKey]: undefined
    });
  };

  const handleCustomHazardDetailsChange = (hazardName: string, details: string) => {
    const detailsKey = `custom_${hazardName.replace(/\s+/g, '_').toLowerCase()}Details`;
    onDataChange({
      [detailsKey]: details
    });
  };

  // Validation function for this step
  const validateStep = React.useCallback(() => {
    const stepErrors: Record<string, string | undefined> = {};

    // Validate that at least one hazard type is addressed
    const hasSelectedHazards = (formData.lowLevelHazards && formData.lowLevelHazards.length > 0) || 
                              (formData.customHazards && formData.customHazards.length > 0);
    
    if (!hasSelectedHazards) {
      stepErrors.lowLevelHazards = 'Please select applicable hazards or indicate none apply';
    }

    // Validate details for selected predefined hazards
    if (formData.lowLevelHazards) {
      formData.lowLevelHazards.forEach(hazard => {
        const detailsKey = `${hazard}Details`;
        const detailsError = validateRequired(formData[detailsKey], `${hazard} details`);
        if (detailsError) {
          stepErrors[detailsKey] = detailsError;
        }
      });
    }

    // Validate details for custom hazards
    if (formData.customHazards) {
      formData.customHazards.forEach(hazard => {
        const detailsKey = `custom_${hazard.replace(/\s+/g, '_').toLowerCase()}Details`;
        const detailsError = validateRequired(formData[detailsKey], `${hazard} details`);
        if (detailsError) {
          stepErrors[detailsKey] = detailsError;
        }
      });
    }

    const isValid = Object.keys(stepErrors).length === 0;
    return { isValid, errors: stepErrors };
  }, [formData.lowLevelHazards, formData.customHazards, formData]);

  // Update validation function reference
  React.useEffect(() => {
    if (onValidate) {
      (onValidate as any).current = validateStep;
    }
  }, [validateStep, onValidate]);

  const predefinedHazards = [
    { 
      value: 'chemicals', 
      label: 'Chemicals',
      description: 'Chemical substances and materials'
    },
    { 
      value: 'confinedSpaces', 
      label: 'Confined spaces',
      description: 'Restricted access areas'
    },
    { 
      value: 'electrical', 
      label: 'Electrical',
      description: 'Electrical equipment and systems'
    },
    { 
      value: 'gas', 
      label: 'Gas',
      description: 'Gas systems and equipment'
    },
    { 
      value: 'manualHandling', 
      label: 'Manual Handling',
      description: 'Lifting, carrying, moving objects'
    },
    { 
      value: 'slipsTrips', 
      label: 'Slips and trips',
      description: 'Floor surfaces and walkways'
    },
    { 
      value: 'hydrofluoricAcid', 
      label: 'Hydrofluoric acid',
      description: 'HF acid exposure risks'
    }
  ];

  const selectedHazards = formData.lowLevelHazards || [];
  const customHazards = formData.customHazards || [];
  const hasAnyHazards = selectedHazards.length > 0 || customHazards.length > 0;

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Hazards Part 1
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Identify low-level hazards that might be found in office and shop environments.
        </p>
      </div>

      {/* Field 1: Low-Level Hazards Selection */}
      <FormField
        label="Does your workplace have low-level hazards such as those that might be found in office and shops?"
        required={true}
        error={errors.lowLevelHazards}
      >
        <ModernCheckboxGroup
          options={predefinedHazards}
          selectedValues={selectedHazards}
          onChange={handleLowLevelHazardsChange}
          layout="grid"
        />
      </FormField>

      {/* Add Custom Hazard Section */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
          Add Other Hazards
        </h4>
        <div className="flex gap-2">
          <TextInput
            value={customHazard}
            onChange={(e) => setCustomHazard(e.target.value)}
            placeholder="Enter additional hazard type..."
            className="flex-1"
          />
          <button
            type="button"
            onClick={handleAddCustomHazard}
            disabled={!customHazard.trim()}
            className="px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            Add
          </button>
        </div>

        {/* Display Custom Hazards */}
        {customHazards.length > 0 && (
          <div className="mt-3 space-y-2">
            {customHazards.map((hazard) => (
              <div key={hazard} className="flex items-center justify-between bg-white dark:bg-gray-700 rounded p-2">
                <span className="text-sm text-gray-900 dark:text-white">{hazard}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveCustomHazard(hazard)}
                  className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Details for Selected Predefined Hazards */}
      {selectedHazards.map((hazardValue) => {
        const hazard = predefinedHazards.find(h => h.value === hazardValue);
        if (!hazard) return null;

        return (
          <FormField
            key={hazardValue}
            label={`${hazard.label} - Provide details of how you will account for this in your first aid provision`}
            required={true}
            error={errors[`${hazardValue}Details`]}
          >
            <TextArea
              value={formData[`${hazardValue}Details`] || ''}
              onChange={(e) => handleHazardDetailsChange(hazardValue, e.target.value)}
              placeholder={`Describe your first aid provisions for ${hazard.label.toLowerCase()}...`}
              rows={3}
              maxLength={500}
            />
          </FormField>
        );
      })}

      {/* Details for Custom Hazards */}
      {customHazards.map((hazard) => {
        const detailsKey = `custom_${hazard.replace(/\s+/g, '_').toLowerCase()}Details`;
        return (
          <FormField
            key={hazard}
            label={`${hazard} - Provide details of how you will account for this in your first aid provision`}
            required={true}
            error={errors[detailsKey]}
          >
            <TextArea
              value={formData[detailsKey] || ''}
              onChange={(e) => handleCustomHazardDetailsChange(hazard, e.target.value)}
              placeholder={`Describe your first aid provisions for ${hazard.toLowerCase()}...`}
              rows={3}
              maxLength={500}
            />
          </FormField>
        );
      })}

      {/* First Aid Requirements Notice */}
      {hasAnyHazards && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Users className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
                First Aid Requirements Based on Employee Count
              </h4>
              <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                <div className="flex justify-between">
                  <span>&lt;25 employees:</span>
                  <span className="font-medium">At least 1 Appointed person</span>
                </div>
                <div className="flex justify-between">
                  <span>25-50 employees:</span>
                  <span className="font-medium">At least 1 EFAW trained First Aider</span>
                </div>
                <div className="flex justify-between">
                  <span>&gt;50 employees:</span>
                  <span className="font-medium">At least 1 FAW trained First Aider for every 100 (or part thereof)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Minimum Provisions Notice */}
      {hasAnyHazards && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Info className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-green-800 dark:text-green-200 mb-2">
                Minimum Provisions:
              </h4>
              <ul className="text-sm text-green-700 dark:text-green-300 space-y-1 list-disc list-inside">
                <li>An appointed person</li>
                <li>A first aid box</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
