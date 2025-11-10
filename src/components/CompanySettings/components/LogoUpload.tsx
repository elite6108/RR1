import React from 'react';
import { UploadCloud, Loader2 } from 'lucide-react';
import type { LogoUploadProps } from '../types';

export function LogoUpload({ formData, handleLogoUpload, uploadingLogo }: LogoUploadProps) {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
        Company Logo
      </label>
      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-4 sm:space-y-0">
        {formData.logo_url && (
          <div className="flex-shrink-0 h-24 w-24 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
            <img
              src={formData.logo_url}
              alt="Company logo"
              className="h-full w-full object-contain"
              onError={(e) => {
                e.currentTarget.src = 'https://via.placeholder.com/150?text=Logo';
              }}
            />
          </div>
        )}
        <div className="flex-1">
          <label
            htmlFor="logo-upload"
            className={`
              relative cursor-pointer bg-white rounded-md font-medium 
              text-indigo-600 hover:text-indigo-500 focus-within:outline-none 
              focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500
              ${uploadingLogo ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <div className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm rounded-md hover:bg-gray-50">
              {uploadingLogo ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <UploadCloud className="h-5 w-5 mr-2" />
                  {formData.logo_url ? 'Change Logo' : 'Upload Logo'}
                </>
              )}
            </div>
            <input
              id="logo-upload"
              name="logo"
              type="file"
              accept="image/jpeg,image/png,image/gif"
              disabled={uploadingLogo}
              onChange={handleLogoUpload}
              className="sr-only"
            />
          </label>
          <p className="mt-1 text-xs text-gray-500">
            Accepted formats: JPG, PNG, GIF (max 5MB)
          </p>
        </div>
      </div>
    </div>
  );
}