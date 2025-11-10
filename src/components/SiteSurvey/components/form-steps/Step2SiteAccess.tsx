import React from 'react';
import type { FormStepProps } from '../../types';
import { INPUT_CLASS_NAME, BOOLEAN_BUTTON_ACTIVE, BOOLEAN_BUTTON_INACTIVE, FILE_UPLOAD_CONFIG } from '../../utils/constants';
import { FileUploadArea } from '../FileUploadArea';
import { FilePreviewGrid } from '../FilePreviewGrid';

export function Step2SiteAccess({ 
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
      handleFileUpload(e.target.files, 'site_access_images');
    }
  };

  const onVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && handleFileUpload) {
      handleFileUpload(e.target.files, 'site_access_videos');
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      site_access_images: prev.site_access_images.filter((_, i) => i !== index)
    }));
  };

  const removeVideo = (index: number) => {
    setFormData(prev => ({
      ...prev,
      site_access_videos: prev.site_access_videos.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Describe site access *
        </label>
        <textarea
          name="site_access_description"
          value={formData.site_access_description}
          onChange={handleInputChange}
          required
          rows={4}
          placeholder="Please describe the site access details..."
          className={INPUT_CLASS_NAME}
        />
      </div>

      <div>
        <div className="flex items-center gap-3 mb-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Is the site access suitable for a 3.5m lorry? *
          </label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleBooleanChange?.('suitable_for_lorry', true)}
              className={formData.suitable_for_lorry ? BOOLEAN_BUTTON_ACTIVE : BOOLEAN_BUTTON_INACTIVE}
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() => handleBooleanChange?.('suitable_for_lorry', false)}
              className={formData.suitable_for_lorry === false ? BOOLEAN_BUTTON_ACTIVE : BOOLEAN_BUTTON_INACTIVE}
            >
              No
            </button>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Site Access Images *
        </label>
        <div className="flex flex-col gap-2">
          <FileUploadArea
            id="site-access-images"
            accept={FILE_UPLOAD_CONFIG.IMAGES.accept}
            multiple={true}
            uploadingFiles={uploadingFiles}
            onFileChange={onFileChange}
            title="Click to upload images"
            description={FILE_UPLOAD_CONFIG.IMAGES.description}
          />

          <FilePreviewGrid
            files={formData.site_access_images}
            onRemove={removeImage}
            type="image"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Site Access Videos <span className="text-gray-400 text-xs">(optional)</span>
        </label>
        <div className="flex flex-col gap-2">
          <FileUploadArea
            id="site-access-videos"
            accept={FILE_UPLOAD_CONFIG.VIDEOS.accept}
            multiple={true}
            uploadingFiles={uploadingFiles}
            onFileChange={onVideoChange}
            title="Click to upload videos"
            description={FILE_UPLOAD_CONFIG.VIDEOS.description}
          />

          <FilePreviewGrid
            files={formData.site_access_videos}
            onRemove={removeVideo}
            type="video"
          />
        </div>
      </div>
    </div>
  );
}