import React from 'react';
import { User, Calendar } from 'lucide-react';
import { WorkerFormData, ValidationErrors } from '../utils/profileUtils';
import { PhotoUpload } from './PhotoUpload';

interface ProfileTabProps {
  formData: WorkerFormData;
  validationErrors: ValidationErrors;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  // Photo upload props
  imagePreview: string | null;
  photoLoading: boolean;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemovePhoto: () => void;
  onUploadClick: () => void;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({
  formData,
  validationErrors,
  onChange,
  imagePreview,
  photoLoading,
  fileInputRef,
  onFileChange,
  onRemovePhoto,
  onUploadClick
}) => {
  return (
    <div className="space-y-4">
      <PhotoUpload
        imagePreview={imagePreview}
        loading={photoLoading}
        fileInputRef={fileInputRef}
        onFileChange={onFileChange}
        onRemovePhoto={onRemovePhoto}
        onUploadClick={onUploadClick}
      />
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Full Name <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <User className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            name="full_name"
            value={formData.full_name}
            onChange={onChange}
            className={`pl-10 w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500 dark:bg-gray-700 dark:text-white ${
              validationErrors.full_name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
            required
          />
        </div>
        {validationErrors.full_name && (
          <p className="mt-1 text-xs text-red-500">{validationErrors.full_name}</p>
        )}
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Date of Birth <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Calendar className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={onChange}
            className={`pl-10 w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500 dark:bg-gray-700 dark:text-white ${
              validationErrors.dob ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
            required
          />
        </div>
        {validationErrors.dob && (
          <p className="mt-1 text-xs text-red-500">{validationErrors.dob}</p>
        )}
      </div>
    </div>
  );
};