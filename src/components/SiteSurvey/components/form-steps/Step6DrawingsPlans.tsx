import React from 'react';
import type { FormStepProps } from '../../types';
import { INPUT_CLASS_NAME, FILE_UPLOAD_CONFIG } from '../../utils/constants';
import { FileUploadArea } from '../FileUploadArea';
import { FilePreviewGrid } from '../FilePreviewGrid';

export function Step6DrawingsPlans({ 
  formData, 
  uploadingFiles = false,
  handleInputChange,
  handleFileUpload,
  setFormData
}: FormStepProps) {
  if (!formData || !setFormData) return null;

  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && handleFileUpload) {
      handleFileUpload(e.target.files, 'drawings_images');
    }
  };

  const onVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && handleFileUpload) {
      handleFileUpload(e.target.files, 'drawings_videos');
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      drawings_images: prev.drawings_images.filter((_, i) => i !== index)
    }));
  };

  const removeVideo = (index: number) => {
    setFormData(prev => ({
      ...prev,
      drawings_videos: prev.drawings_videos.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Drawings & Plans Images <span className="text-gray-400 text-xs">(optional)</span>
        </label>
        <div className="flex flex-col gap-2">
          <FileUploadArea
            id="drawings-images"
            accept={FILE_UPLOAD_CONFIG.IMAGES.accept}
            multiple={true}
            uploadingFiles={uploadingFiles}
            onFileChange={onImageChange}
            title="Click to upload drawings & plans"
            description={FILE_UPLOAD_CONFIG.IMAGES.description}
          />

          <FilePreviewGrid
            files={formData.drawings_images}
            onRemove={removeImage}
            type="image"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Drawings & Plans Videos <span className="text-gray-400 text-xs">(optional)</span>
        </label>
        <div className="flex flex-col gap-2">
          <FileUploadArea
            id="drawings-videos"
            accept={FILE_UPLOAD_CONFIG.VIDEOS.accept}
            multiple={true}
            uploadingFiles={uploadingFiles}
            onFileChange={onVideoChange}
            title="Click to upload videos of drawings & plans"
            description={FILE_UPLOAD_CONFIG.VIDEOS.description}
          />

          <FilePreviewGrid
            files={formData.drawings_videos}
            onRemove={removeVideo}
            type="video"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Notes/Comments <span className="text-gray-400 text-xs">(optional)</span>
        </label>
        <textarea
          name="notes_comments"
          value={formData.notes_comments}
          onChange={handleInputChange}
          rows={4}
          placeholder="Add any additional notes or comments about the site survey..."
          className={INPUT_CLASS_NAME}
        />
      </div>
    </div>
  );
}