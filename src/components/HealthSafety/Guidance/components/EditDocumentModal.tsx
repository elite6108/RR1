import React, { useState, useRef, useEffect } from 'react';
import { X, Upload, FileText, Trash2, Edit3 } from 'lucide-react';
import { EditDocumentModalProps } from '../types';
import { validateFile } from '../utils';

/**
 * Modal component for editing documents
 * Allows users to update title, replace PDF, update thumbnail, or delete document
 */
export const EditDocumentModal: React.FC<EditDocumentModalProps> = ({
  onClose,
  onEdit,
  onDelete,
  document,
  thumbnailUrl,
  editing,
  deleting,
  error,
  documentType = 'Document'
}) => {
  const [title, setTitle] = useState(document.title);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  // Clear local error when external error changes
  useEffect(() => {
    if (error) {
      setLocalError(null);
    }
  }, [error]);

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateFile(file, 'pdf', 20 * 1024 * 1024);
    if (!validation.isValid) {
      setLocalError(validation.error || 'Invalid PDF file');
      return;
    }

    setLocalError(null);
    setPdfFile(file);
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateFile(file, 'image', 5 * 1024 * 1024);
    if (!validation.isValid) {
      setLocalError(validation.error || 'Invalid image file');
      return;
    }

    setLocalError(null);
    setThumbnailFile(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setLocalError('Title is required');
      return;
    }

    setLocalError(null);
    onEdit(document.id, title.trim(), pdfFile, thumbnailFile);
  };

  const handleDelete = () => {
    setLocalError(null);
    onDelete(document.id);
  };

  const displayError = error || localError;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Edit {documentType}
          </h3>
          <button
            onClick={onClose}
            disabled={editing || deleting}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 disabled:opacity-50"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {!showDeleteConfirm ? (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Current Document Info */}
            <div className="text-center">
              <div className="mb-4">
                {document.thumbnail_path && thumbnailUrl ? (
                  <img
                    src={thumbnailUrl}
                    alt={document.title}
                    className="h-24 w-24 rounded object-cover mx-auto"
                  />
                ) : (
                  <FileText className="h-24 w-24 text-gray-400 mx-auto" />
                )}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Current: {document.title}
              </p>
            </div>

            {/* Title Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={editing}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white disabled:opacity-50"
                placeholder="Enter document title"
                required
              />
            </div>

            {/* PDF File Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Replace PDF (optional)
              </label>
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => pdfInputRef.current?.click()}
                  disabled={editing}
                  className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Choose PDF
                </button>
                {pdfFile && (
                  <span className="text-sm text-gray-600 dark:text-gray-400 truncate">
                    {pdfFile.name}
                  </span>
                )}
              </div>
              <input
                ref={pdfInputRef}
                type="file"
                accept=".pdf"
                onChange={handlePdfChange}
                className="hidden"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Maximum file size: 20MB
              </p>
            </div>

            {/* Thumbnail File Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Update Thumbnail (optional)
              </label>
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => thumbnailInputRef.current?.click()}
                  disabled={editing}
                  className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Choose Image
                </button>
                {thumbnailFile && (
                  <span className="text-sm text-gray-600 dark:text-gray-400 truncate">
                    {thumbnailFile.name}
                  </span>
                )}
              </div>
              <input
                ref={thumbnailInputRef}
                type="file"
                accept="image/*"
                onChange={handleThumbnailChange}
                className="hidden"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Recommended: PNG or JPG, maximum 5MB
              </p>
            </div>

            {/* Error Display */}
            {displayError && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                <p className="text-sm text-red-600 dark:text-red-400">
                  {displayError}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={editing || deleting}
                className="flex-1 flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {editing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <Edit3 className="h-4 w-4 mr-2" />
                    Update {documentType}
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                disabled={editing || deleting}
                className="px-4 py-2 border border-red-300 dark:border-red-600 rounded-md shadow-sm text-sm font-medium text-red-700 dark:text-red-400 bg-white dark:bg-gray-700 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </form>
        ) : (
          /* Delete Confirmation */
          <div className="p-6">
            <div className="text-center mb-6">
              <Trash2 className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Delete {documentType}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Are you sure you want to delete "{document.title}"? This action cannot be undone.
              </p>
            </div>

            {displayError && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                <p className="text-sm text-red-600 dark:text-red-400">
                  {displayError}
                </p>
              </div>
            )}

            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
              >
                {deleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
