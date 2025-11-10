import React from 'react';
import type { FormStepProps } from '../../types';
import { 
  INPUT_CLASS_NAME, 
  COURT_SPECIFICATIONS, 
  COURT_FEATURES,
  COURT_FEATURE_ACTIVE,
  COURT_FEATURE_INACTIVE
} from '../../utils/constants';

export function Step5CourtFeatures({ 
  formData, 
  handleInputChange,
  handleMultiSelectChange
}: FormStepProps) {
  if (!formData) return null;

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Padel court dimensions *
        </label>
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
          {COURT_SPECIFICATIONS.DIMENSIONS}
        </div>
        <input
          type="text"
          name="court_dimensions"
          value={formData.court_dimensions}
          onChange={handleInputChange}
          required
          placeholder="Specify court dimensions..."
          className={INPUT_CLASS_NAME}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Padel court height *
        </label>
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
          {COURT_SPECIFICATIONS.HEIGHT}
        </div>
        <input
          type="number"
          name="court_height"
          value={formData.court_height}
          onChange={handleInputChange}
          required
          placeholder="Specify court height in meters..."
          min={6}
          step={0.1}
          className={INPUT_CLASS_NAME}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Padel court enclosures *
        </label>
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
          {COURT_SPECIFICATIONS.ENCLOSURES}
        </div>
        <div className="mt-4 space-y-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleInputChange?.({ target: { name: 'court_enclosure_type', value: 'option1' } } as any)}
              className={formData.court_enclosure_type === 'option1' ? COURT_FEATURE_ACTIVE : COURT_FEATURE_INACTIVE}
            >
              Option 1
            </button>
            <button
              type="button"
              onClick={() => handleInputChange?.({ target: { name: 'court_enclosure_type', value: 'option2' } } as any)}
              className={formData.court_enclosure_type === 'option2' ? COURT_FEATURE_ACTIVE : COURT_FEATURE_INACTIVE}
            >
              Option 2
            </button>
          </div>
          
          {formData.court_enclosure_type === 'option1' && (
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-md text-sm text-gray-700 dark:text-gray-300">
              {COURT_SPECIFICATIONS.OPTION_1}
            </div>
          )}
          
          {formData.court_enclosure_type === 'option2' && (
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-md text-sm text-gray-700 dark:text-gray-300">
              {COURT_SPECIFICATIONS.OPTION_2}
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Padel court floor materials *
        </label>
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
          {COURT_SPECIFICATIONS.FLOOR_MATERIALS}
        </div>
        <input
          type="text"
          name="court_floor_material"
          value={formData.court_floor_material}
          onChange={handleInputChange}
          required
          placeholder="Specify court floor material..."
          className={INPUT_CLASS_NAME}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Court Features *
        </label>
        <div className="grid grid-cols-2 gap-3">
          {COURT_FEATURES.map((feature) => (
            <div 
              key={feature}
              onClick={() => handleMultiSelectChange?.('court_features', feature)}
              className={
                formData.court_features.includes(feature)
                  ? COURT_FEATURE_ACTIVE
                  : COURT_FEATURE_INACTIVE
              }
            >
              {feature}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}