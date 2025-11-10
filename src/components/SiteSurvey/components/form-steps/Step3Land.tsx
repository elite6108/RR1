import React from 'react';
import type { FormStepProps } from '../../types';
import { INPUT_CLASS_NAME, BOOLEAN_BUTTON_ACTIVE, BOOLEAN_BUTTON_INACTIVE, FILE_UPLOAD_CONFIG } from '../../utils/constants';
import { FileUploadArea } from '../FileUploadArea';
import { FilePreviewGrid } from '../FilePreviewGrid';

export function Step3Land({ 
  formData, 
  uploadingFiles = false,
  handleInputChange, 
  handleBooleanChange,
  handleFileUpload,
  setFormData
}: FormStepProps) {
  if (!formData || !setFormData) return null;

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && handleFileUpload) {
      handleFileUpload(e.target.files, 'services_images');
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      services_images: prev.services_images.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          How does the ground deal with water? *
        </label>
        <textarea
          name="water_handling"
          value={formData.water_handling}
          onChange={handleInputChange}
          required
          rows={4}
          placeholder="Describe how the ground handles water..."
          className={INPUT_CLASS_NAME}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Is there any man holes or inspection service chambers in the padel court area? *
        </label>
        <textarea
          name="manholes_description"
          value={formData.manholes_description}
          onChange={handleInputChange}
          required
          rows={4}
          placeholder="Describe any manholes or inspection chambers..."
          className={INPUT_CLASS_NAME}
        />
      </div>

      <div>
        <div className="flex items-center gap-3 mb-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Is there any electrical, gas, utility services cables or pipes? *
          </label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleBooleanChange?.('services_present', true)}
              className={formData.services_present ? BOOLEAN_BUTTON_ACTIVE : BOOLEAN_BUTTON_INACTIVE}
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() => handleBooleanChange?.('services_present', false)}
              className={formData.services_present === false ? BOOLEAN_BUTTON_ACTIVE : BOOLEAN_BUTTON_INACTIVE}
            >
              No
            </button>
          </div>
        </div>
      </div>

      {formData.services_present && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Describe the services *
          </label>
          <textarea
            name="services_description"
            value={formData.services_description}
            onChange={handleInputChange}
            required
            rows={4}
            placeholder="Describe the services present..."
            className={INPUT_CLASS_NAME}
          />
        </div>
      )}

      {formData.services_present && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Services Images *
          </label>
          <div className="flex flex-col gap-2">
            <FileUploadArea
              id="services-images"
              accept={FILE_UPLOAD_CONFIG.IMAGES.accept}
              multiple={true}
              uploadingFiles={uploadingFiles}
              onFileChange={onFileChange}
              title="Click to upload images"
              description={FILE_UPLOAD_CONFIG.IMAGES.description}
            />

            <FilePreviewGrid
              files={formData.services_images}
              onRemove={removeImage}
              type="image"
            />
          </div>
        </div>
      )}
    </div>
  );
}