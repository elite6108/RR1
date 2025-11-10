import React from 'react';
import { createPortal } from 'react-dom';
import { 
  X,
  Upload,
  AlertTriangle,
  Download
} from 'lucide-react';
import { ProjectFile } from '../types';
import { FilePreview } from './FilePreview';
import { FileIcon } from './index';
import { formatFileSize, getCurrentFolderName } from '../utils';

interface UploadModalProps {
  show: boolean;
  onClose: () => void;
  onFileSelect: () => void;
  currentFolderName: string;
}

export function UploadModal({ show, onClose, onFileSelect, currentFolderName }: UploadModalProps) {
  if (!show) return null;

  return createPortal(
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50 p-4">
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Upload Files
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Choose files to upload to {currentFolderName}
          </p>
          
          <button
            onClick={onFileSelect}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Upload className="h-4 w-4 mr-2" />
            Select Files
          </button>
          
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
            Supported: Images, PDFs, Documents, Spreadsheets
          </p>
        </div>
        
        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 touch-manipulation"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

interface FolderModalProps {
  show: boolean;
  onClose: () => void;
  onSubmit: () => void;
  value: string;
  onChange: (value: string) => void;
  title: string;
  loading?: boolean;
}

export function FolderModal({ show, onClose, onSubmit, value, onChange, title, loading = false }: FolderModalProps) {
  if (!show) return null;

  return createPortal(
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50 p-4">
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-sm w-full">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          {title}
        </h3>
        <input
          type="text"
          value={value}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
          placeholder="Folder name"
          className="block w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white touch-manipulation text-base"
          onKeyPress={(e: React.KeyboardEvent) => e.key === 'Enter' && onSubmit()}
          autoFocus
        />
        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 touch-manipulation"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={!value.trim() || loading}
            className="px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 touch-manipulation flex items-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              title.includes('Create') ? 'Create' : 'Save'
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

interface FileModalProps {
  show: boolean;
  onClose: () => void;
  file: ProjectFile | null;
  filePreviewUrl: string | null;
  onDownload: (file: ProjectFile) => void;
}

export function FileModal({ show, onClose, file, filePreviewUrl, onDownload }: FileModalProps) {
  if (!show || !file) return null;

  return createPortal(
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-5xl w-full max-h-[95vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3 min-w-0 flex-1">
            <FileIcon file={file} />
            <div className="min-w-0">
              <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white truncate">
                {file.name}
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                {formatFileSize(file.file_size)} • {new Date(file.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onDownload(file)}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="Download file"
            >
              <Download className="h-5 w-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>
        <div className="p-4 overflow-auto max-h-[calc(95vh-5rem)]">
          <FilePreview file={file} filePreviewUrl={filePreviewUrl} onDownload={onDownload} />
        </div>
      </div>
    </div>,
    document.body
  );
}

interface DeleteModalProps {
  show: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemCount: number;
  loading?: boolean;
}

export function DeleteModal({ show, onClose, onConfirm, itemCount, loading = false }: DeleteModalProps) {
  if (!show) return null;

  return createPortal(
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50 p-4">
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-sm w-full">
        <div className="flex items-center justify-center mb-4">
          <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full dark:bg-red-900/20">
            <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white text-center mb-2">
          Confirm Deletion
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
          {itemCount === 1 
            ? 'Are you sure you want to delete this item? This action cannot be undone.'
            : `Are you sure you want to delete these ${itemCount} items? This action cannot be undone.`
          }
        </p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 touch-manipulation"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2.5 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 flex items-center touch-manipulation"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Deleting...
              </>
            ) : (
              'Delete'
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
