import React from 'react';
import type { FileUploadAreaProps } from '../types';

export function FileUploadArea({
  id,
  accept,
  multiple,
  uploadingFiles,
  onFileChange,
  title,
  description
}: FileUploadAreaProps) {
  return (
    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md p-6 text-center">
      <input
        type="file"
        multiple={multiple}
        accept={accept}
        className="hidden"
        id={id}
        onChange={onFileChange}
      />
      <label
        htmlFor={id}
        className="cursor-pointer flex flex-col items-center justify-center"
      >
        {uploadingFiles ? (
          <div className="flex flex-col items-center">
            <svg className="animate-spin h-6 w-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="mt-2 text-sm text-gray-500">Uploading...</span>
          </div>
        ) : (
          <>
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="mt-2 block text-sm font-medium text-gray-900 dark:text-gray-300">
              {title}
            </span>
            <span className="mt-1 block text-sm text-gray-500 dark:text-gray-400">
              {description}
            </span>
          </>
        )}
      </label>
    </div>
  );
}