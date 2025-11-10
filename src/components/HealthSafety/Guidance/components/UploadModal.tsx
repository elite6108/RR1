import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { UploadModalProps } from '../types';
import { validatePdfFile, validateImageFile } from '../utils';

/**
 * Modal component for uploading PDF documents with optional thumbnails
 * Handles file validation and form submission
 */
export const UploadModal = ({ 
  onClose, 
  onUpload, 
  uploading, 
  error,
  documentType = "Document"
}: UploadModalProps) => {
  const [title, setTitle] = useState('');
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  /**
   * Handle PDF file selection with validation
   */
  const handlePdfFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validation = validatePdfFile(file);
      
      if (!validation.isValid) {
        setLocalError(validation.error || 'Invalid PDF file');
        return;
      }

      setPdfFile(file);
      setLocalError(null);
    }
  };

  /**
   * Handle thumbnail file selection with validation
   */
  const handleThumbnailFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validation = validateImageFile(file);
      
      if (!validation.isValid) {
        setLocalError(validation.error || 'Invalid image file');
        return;
      }

      setThumbnailFile(file);
      setLocalError(null);
    }
  };

  /**
   * Handle form submission
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pdfFile || !title.trim()) {
      setLocalError('Please provide a title and PDF file');
      return;
    }

    onUpload(title.trim(), pdfFile, thumbnailFile);
  };

  /**
   * Remove selected PDF file
   */
  const removePdfFile = () => {
    setPdfFile(null);
    setLocalError(null);
  };

  /**
   * Remove selected thumbnail file
   */
  const removeThumbnailFile = () => {
    setThumbnailFile(null);
    setLocalError(null);
  };

  const displayError = error || localError;

  return (
    <div 
      className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 max-w-md w-full m-4"
        onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Upload {documentType}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
            aria-label="Close upload modal"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder={`Enter ${documentType.toLowerCase()} title`}
              required
            />
          </div>

          {/* PDF Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              PDF File
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md dark:border-gray-600">
              <div className="space-y-1 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <div className="flex text-sm text-gray-600 dark:text-gray-400">
                  <label
                    htmlFor="pdf-upload"
                    className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                  >
                    <span>Upload PDF</span>
                    <input
                      id="pdf-upload"
                      name="pdf-upload"
                      type="file"
                      className="sr-only"
                      accept="application/pdf"
                      onChange={handlePdfFileChange}
                      required
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  PDF files up to 20MB
                </p>
              </div>
            </div>
            {pdfFile && (
              <div className="mt-2 flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-2 rounded-lg">
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {pdfFile.name}
                </span>
                <button
                  type="button"
                  onClick={removePdfFile}
                  className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                  aria-label="Remove PDF file"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {/* Thumbnail Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Thumbnail Image (Optional)
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md dark:border-gray-600">
              <div className="space-y-1 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <div className="flex text-sm text-gray-600 dark:text-gray-400">
                  <label
                    htmlFor="thumbnail-upload"
                    className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                  >
                    <span>Upload image</span>
                    <input
                      id="thumbnail-upload"
                      name="thumbnail-upload"
                      type="file"
                      className="sr-only"
                      accept="image/*"
                      onChange={handleThumbnailFileChange}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  PNG, JPG, GIF up to 5MB
                </p>
              </div>
            </div>
            {thumbnailFile && (
              <div className="mt-2 flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-2 rounded-lg">
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {thumbnailFile.name}
                </span>
                <button
                  type="button"
                  onClick={removeThumbnailFile}
                  className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                  aria-label="Remove thumbnail file"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {/* Error Display */}
          {displayError && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 p-4 rounded-md">
              <svg className="h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <p>{displayError}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:text-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
              disabled={uploading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading || !pdfFile || !title.trim()}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                `Upload ${documentType}`
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
