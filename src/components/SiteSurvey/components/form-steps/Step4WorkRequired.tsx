import React from 'react';
import type { FormStepProps } from '../../types';
import { INPUT_CLASS_NAME, BOOLEAN_BUTTON_ACTIVE, BOOLEAN_BUTTON_INACTIVE } from '../../utils/constants';

export function Step4WorkRequired({ 
  formData, 
  handleInputChange, 
  handleBooleanChange
}: FormStepProps) {
  if (!formData) return null;

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          How many courts? *
        </label>
        <input
          type="number"
          name="number_of_courts"
          value={formData.number_of_courts}
          onChange={handleInputChange}
          required
          min={1}
          className={INPUT_CLASS_NAME}
        />
      </div>

      <div>
        <div className="flex items-center gap-3 mb-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Shuttering required? *
          </label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleBooleanChange?.('shuttering_required', true)}
              className={formData.shuttering_required ? BOOLEAN_BUTTON_ACTIVE : BOOLEAN_BUTTON_INACTIVE}
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() => handleBooleanChange?.('shuttering_required', false)}
              className={formData.shuttering_required === false ? BOOLEAN_BUTTON_ACTIVE : BOOLEAN_BUTTON_INACTIVE}
            >
              No
            </button>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center gap-3 mb-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Tarmac required? *
          </label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleBooleanChange?.('tarmac_required', true)}
              className={formData.tarmac_required ? BOOLEAN_BUTTON_ACTIVE : BOOLEAN_BUTTON_INACTIVE}
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() => handleBooleanChange?.('tarmac_required', false)}
              className={formData.tarmac_required === false ? BOOLEAN_BUTTON_ACTIVE : BOOLEAN_BUTTON_INACTIVE}
            >
              No
            </button>
          </div>
        </div>
      </div>

      {formData.tarmac_required && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Where is tarmac required? *
            </label>
            <input
              type="text"
              name="tarmac_location"
              value={formData.tarmac_location}
              onChange={handleInputChange}
              required
              placeholder="Describe where tarmac is required..."
              className={INPUT_CLASS_NAME}
            />
          </div>

          <div>
            <div className="flex items-center gap-3 mb-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Is there space to hold the tarmac waggon to tip, or keep feeding it out? *
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleBooleanChange?.('tarmac_wagon_space', true)}
                  className={formData.tarmac_wagon_space ? BOOLEAN_BUTTON_ACTIVE : BOOLEAN_BUTTON_INACTIVE}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => handleBooleanChange?.('tarmac_wagon_space', false)}
                  className={formData.tarmac_wagon_space === false ? BOOLEAN_BUTTON_ACTIVE : BOOLEAN_BUTTON_INACTIVE}
                >
                  No
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      <div>
        <div className="flex items-center gap-3 mb-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Muckaway required or lose muck on site? *
          </label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleBooleanChange?.('muckaway_required', true)}
              className={formData.muckaway_required ? BOOLEAN_BUTTON_ACTIVE : BOOLEAN_BUTTON_INACTIVE}
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() => handleBooleanChange?.('muckaway_required', false)}
              className={formData.muckaway_required === false ? BOOLEAN_BUTTON_ACTIVE : BOOLEAN_BUTTON_INACTIVE}
            >
              No
            </button>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Type of surface required *
        </label>
        <input
          type="text"
          name="surface_type"
          value={formData.surface_type}
          onChange={handleInputChange}
          required
          placeholder="Describe the surface type required..."
          className={INPUT_CLASS_NAME}
        />
      </div>

      <div>
        <div className="flex items-center gap-3 mb-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Lighting required? *
          </label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleBooleanChange?.('lighting_required', true)}
              className={formData.lighting_required ? BOOLEAN_BUTTON_ACTIVE : BOOLEAN_BUTTON_INACTIVE}
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() => handleBooleanChange?.('lighting_required', false)}
              className={formData.lighting_required === false ? BOOLEAN_BUTTON_ACTIVE : BOOLEAN_BUTTON_INACTIVE}
            >
              No
            </button>
          </div>
        </div>
      </div>

      {formData.lighting_required && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Describe lighting requirements *
          </label>
          <textarea
            name="lighting_description"
            value={formData.lighting_description}
            onChange={handleInputChange}
            required
            rows={3}
            placeholder="Describe the lighting requirements..."
            className={INPUT_CLASS_NAME}
          />
        </div>
      )}

      <div>
        <div className="flex items-center gap-3 mb-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Canopies required? *
          </label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleBooleanChange?.('canopies_required', true)}
              className={formData.canopies_required ? BOOLEAN_BUTTON_ACTIVE : BOOLEAN_BUTTON_INACTIVE}
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() => handleBooleanChange?.('canopies_required', false)}
              className={formData.canopies_required === false ? BOOLEAN_BUTTON_ACTIVE : BOOLEAN_BUTTON_INACTIVE}
            >
              No
            </button>
          </div>
        </div>
      </div>

      {formData.canopies_required && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            How many canopies? *
          </label>
          <input
            type="number"
            name="number_of_canopies"
            value={formData.number_of_canopies}
            onChange={handleInputChange}
            required
            min={0}
            className={INPUT_CLASS_NAME}
          />
        </div>
      )}
    </div>
  );
}