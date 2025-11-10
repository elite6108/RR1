import React from 'react';
import { Plus, File, Eye, Trash2 } from 'lucide-react';
import type { FormStepProps } from '../../types';
import { ACCEPTED_FILE_TYPES } from '../../utils/constants';

export function Step4Certificates({ 
  filePreviews = [], 
  setFilePreviews 
}: FormStepProps) {

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newPreviews = await Promise.all(
      files.map(async (file) => {
        const previewUrl = URL.createObjectURL(file);
        return {
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          url: previewUrl,
          file,
          isExisting: false
        };
      })
    );
    setFilePreviews?.(prev => [...prev, ...newPreviews]);
  };

  const removeFile = (id: string) => {
    setFilePreviews?.(prev => prev.filter(file => file.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Certificates and Documents <span className="text-gray-400 text-xs">(optional)</span>
        </h3>
        <div className="relative">
          <input
            type="file"
            multiple
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
            accept={ACCEPTED_FILE_TYPES}
          />
          <label
            htmlFor="file-upload"
            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 cursor-pointer"
          >
            <Plus className="h-4 w-4 mr-1" />
            Upload Files
          </label>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {filePreviews.map((preview) => (
          <div key={preview.id} className="relative group">
            <div className="aspect-w-1 aspect-h-1 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
              {preview.file && preview.file.type.startsWith('image/') ? (
                <img
                  src={preview.url}
                  alt={preview.name}
                  className="w-full h-full object-cover"
                />
              ) : preview.isExisting && preview.url && (preview.url.includes('.jpg') || preview.url.includes('.jpeg') || preview.url.includes('.png')) ? (
                <img
                  src={preview.url}
                  alt={preview.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <File className="h-12 w-12 text-gray-400" />
                </div>
              )}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="flex space-x-2">
                  {preview.isExisting ? (
                    // For existing files, the URL is already a signed URL
                    <a
                      href={preview.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-white rounded-full hover:bg-gray-100"
                    >
                      <Eye className="h-5 w-5 text-gray-600" />
                    </a>
                  ) : (
                    // For new files, use the blob URL directly
                    <a
                      href={preview.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-white rounded-full hover:bg-gray-100"
                    >
                      <Eye className="h-5 w-5 text-gray-600" />
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => removeFile(preview.id)}
                    className="p-2 bg-white rounded-full hover:bg-gray-100"
                  >
                    <Trash2 className="h-5 w-5 text-red-600" />
                  </button>
                </div>
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 truncate">
              {preview.name}
            </p>
            {preview.isExisting && (
              <p className="text-xs text-blue-500 dark:text-blue-400">
                Existing file
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}