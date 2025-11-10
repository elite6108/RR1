import React from 'react';
import { User, Upload, XCircle } from 'lucide-react';

interface PhotoUploadProps {
  imagePreview: string | null;
  loading: boolean;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemovePhoto: () => void;
  onUploadClick: () => void;
}

export const PhotoUpload: React.FC<PhotoUploadProps> = ({
  imagePreview,
  loading,
  fileInputRef,
  onFileChange,
  onRemovePhoto,
  onUploadClick
}) => {
  return (
    <div className="flex flex-col items-center mb-4">
      <div className="relative">
        {imagePreview ? (
          <div className="relative">
            <img
              src={imagePreview}
              alt="Worker"
              className="w-24 h-24 rounded-full object-cover border-2 border-amber-500"
            />
            <button
              type="button"
              onClick={onRemovePhoto}
              disabled={loading}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 disabled:opacity-50"
            >
              <XCircle className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
            <User className="h-12 w-12 text-gray-500 dark:text-gray-400" />
          </div>
        )}
      </div>

      <div className="mt-3 flex space-x-2">
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          className="hidden"
          onChange={onFileChange}
        />
        <button
          type="button"
          onClick={onUploadClick}
          disabled={loading}
          className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50"
        >
          <Upload className="h-4 w-4 mr-1" />
          {loading ? 'Uploading...' : 'Upload'}
        </button>
      </div>
    </div>
  );
};