import React from 'react';
import { UnsafeConditionsFormData } from '../types/UnsafeConditionsTypes';

interface UnsafeConditionsDocumentationStepProps {
  formData: UnsafeConditionsFormData;
  setFormData: React.Dispatch<React.SetStateAction<UnsafeConditionsFormData>>;
  uploadingFiles: boolean;
  onFileUpload: (files: FileList) => void;
}

export const UnsafeConditionsDocumentationStep: React.FC<UnsafeConditionsDocumentationStepProps> = ({ 
  formData, 
  setFormData, 
  uploadingFiles, 
  onFileUpload 
}) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Documentation</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Supporting Documents/Images <span className="text-gray-400 text-xs">(optional)</span>
        </label>
        <div className="flex flex-col gap-2">
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md p-6 text-center">
            <input
              type="file"
              multiple
              accept="image/*,.pdf,.doc,.docx"
              className="hidden"
              id="documentation-files"
              onChange={(e) => {
                if (e.target.files) {
                  onFileUpload(e.target.files);
                }
              }}
            />
            <label
              htmlFor="documentation-files"
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
                    Click to upload files
                  </span>
                  <span className="mt-1 block text-sm text-gray-500 dark:text-gray-400">
                    PNG, JPG, PDF, DOC up to 10MB
                  </span>
                </>
              )}
            </label>
          </div>

          {/* Add debug info */}
          <div className="text-xs text-gray-500 mb-2">
            Debug: {formData.file_urls.length} files uploaded
          </div>

          {formData.file_urls.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
              {formData.file_urls.map((fileUrl, index) => {
                const fileName = fileUrl.split('/').pop()?.split('?')[0] || `File ${index + 1}`;
                const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(fileName.toLowerCase());
                
                return (
                  <div key={index} className="relative group">
                    <div className="w-full h-32 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-700 border">
                      {isImage ? (
                        <div className="relative w-full h-full">
                          <img
                            src={fileUrl}
                            alt={`Document ${index + 1}`}
                            className="w-full h-full object-cover cursor-pointer"
                            onClick={() => window.open(fileUrl, '_blank')}
                            onError={() => {
                              const imgElement = document.getElementById(`file-preview-${index}`);
                              if (imgElement) {
                                imgElement.style.display = 'none';
                                const fallbackElement = document.getElementById(`file-preview-fallback-${index}`);
                                if (fallbackElement) {
                                  fallbackElement.style.display = 'flex';
                                }
                              }
                            }}
                            id={`file-preview-${index}`}
                          />
                          <div 
                            id={`file-preview-fallback-${index}`}
                            className="hidden absolute inset-0 w-full h-full items-center justify-center bg-gray-200 dark:bg-gray-600 cursor-pointer"
                            onClick={() => window.open(fileUrl, '_blank')}
                          >
                            <div className="text-center p-2">
                              <div className="text-gray-500 text-xs font-medium">
                                {fileName.split('.').pop()?.toUpperCase() || 'IMAGE'}
                              </div>
                              <div className="text-gray-400 text-xs mt-1 truncate max-w-[120px]">
                                {fileName}
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div 
                          className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-600 cursor-pointer"
                          onClick={() => window.open(fileUrl, '_blank')}
                        >
                          <div className="text-center p-2">
                            <div className="text-gray-500 text-xs font-medium">
                              {fileName.split('.').pop()?.toUpperCase() || 'FILE'}
                            </div>
                            <div className="text-gray-400 text-xs mt-1 truncate max-w-[120px]">
                              {fileName}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            file_urls: prev.file_urls.filter((_, i) => i !== index)
                          }));
                        }}
                        className="p-1 bg-red-500 rounded-full text-white hover:bg-red-600 shadow-lg"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
