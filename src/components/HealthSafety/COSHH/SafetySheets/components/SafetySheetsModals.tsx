import React, { useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, FileCheck, FileText, Trash2 } from 'lucide-react';
import { 
  SafetySheetsFormData, 
  SafetySheetsModalState, 
  CoshhRegisterItem, 
  CoshhMSDS 
} from '../types';

interface SafetySheetsModalsProps {
  modalState: SafetySheetsModalState;
  formData: SafetySheetsFormData;
  setFormData: (data: SafetySheetsFormData) => void;
  coshhRegister: CoshhRegisterItem[];
  onRegisterSelection: (registerId: string) => void;
  onFileInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onUpload: () => void;
  onCloseModals: () => void;
  onConfirmDelete: () => void;
  formatFileSize: (bytes: number) => string;
  removeSelectedFile: () => void;
}

export const SafetySheetsModals: React.FC<SafetySheetsModalsProps> = ({
  modalState,
  formData,
  setFormData,
  coshhRegister,
  onRegisterSelection,
  onFileInputChange,
  onDragOver,
  onDragLeave,
  onDrop,
  onUpload,
  onCloseModals,
  onConfirmDelete,
  formatFileSize,
  removeSelectedFile
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const renderUploadModal = () => {
    if (!modalState.showUploadModal) return null;

    return createPortal(
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Upload MSDS Sheet
            </h3>
            <button
              onClick={onCloseModals}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-6 space-y-4">
            {/* Link to COSHH Register */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Link to COSHH Register (Optional)
              </label>
              <select
                value={formData.coshh_register_id}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onRegisterSelection(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select from COSHH Register...</option>
                {coshhRegister.map(item => (
                  <option key={item.id} value={item.id}>
                    {item.substance_name} - {item.manufacturer}
                  </option>
                ))}
              </select>
            </div>

            {/* Substance Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Substance Name *
              </label>
              <input
                type="text"
                value={formData.substance_name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, substance_name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter substance name"
                required
              />
            </div>

            {/* Manufacturer */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Manufacturer *
              </label>
              <input
                type="text"
                value={formData.manufacturer}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, manufacturer: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter manufacturer name"
                required
              />
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                MSDS File (PDF only) *
              </label>
              <div
                className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
                  modalState.dragOver 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                    : 'border-gray-300 dark:border-gray-600'
                }`}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
              >
                {modalState.selectedFile ? (
                  <div className="space-y-2">
                    <FileCheck className="h-8 w-8 text-green-500 mx-auto" />
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {modalState.selectedFile.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(modalState.selectedFile.size)}
                    </p>
                    <button
                      onClick={removeSelectedFile}
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      Remove file
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <FileText className="h-8 w-8 text-gray-400 mx-auto" />
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Drag and drop a PDF file here, or{' '}
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="text-blue-600 hover:text-blue-800 underline"
                      >
                        browse
                      </button>
                    </p>
                    <p className="text-xs text-gray-500">
                      PDF files only, max 10MB
                    </p>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={onFileInputChange}
                className="hidden"
              />
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onCloseModals}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={onUpload}
              disabled={modalState.uploading || !modalState.selectedFile || !formData.substance_name || !formData.manufacturer}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {modalState.uploading ? 'Uploading...' : 'Upload MSDS'}
            </button>
          </div>
        </div>
      </div>,
      document.body
    );
  };

  const renderDeleteModal = () => {
    if (!modalState.showDeleteModal || !modalState.selectedSheetForDelete) return null;

    return createPortal(
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
          <div className="flex items-center justify-center p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 dark:bg-red-900/30 rounded-full mb-4">
              <Trash2 className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
          </div>

          <div className="p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Delete MSDS Sheet
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              Are you sure you want to delete the MSDS sheet for:
            </p>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 mb-4">
              <p className="font-medium text-gray-900 dark:text-white">
                {modalState.selectedSheetForDelete.substance_name}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {modalState.selectedSheetForDelete.manufacturer}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {modalState.selectedSheetForDelete.file_name}
              </p>
            </div>
            <p className="text-sm text-red-600 dark:text-red-400">
              This action cannot be undone.
            </p>
          </div>

          <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onCloseModals}
              disabled={modalState.deleting}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirmDelete}
              disabled={modalState.deleting}
              className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {modalState.deleting ? 'Deleting...' : 'Delete MSDS'}
            </button>
          </div>
        </div>
      </div>,
      document.body
    );
  };

  return (
    <>
      {renderUploadModal()}
      {renderDeleteModal()}
    </>
  );
};
