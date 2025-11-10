import React from 'react';
import { FileUp } from 'lucide-react';
import {
  FormContainer,
  FormHeader,
  FormContent,
  FormFooter
} from '../../../../utils/form';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDragOver: boolean;
  onDragEnter: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onFileSelect: () => void;
}

export const UploadModal = ({
  isOpen,
  onClose,
  isDragOver,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop,
  onFileSelect
}) => {
  if (!isOpen) return null;

  return (
    <FormContainer isOpen={isOpen} maxWidth="md">
      <FormHeader
        title="Upload Files"
        onClose={onClose}
      />
      
      <FormContent>
        <div 
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 ${
            isDragOver 
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 scale-105' 
              : 'border-gray-300 dark:border-gray-600'
          }`}
          onDragEnter={onDragEnter}
          onDragLeave={onDragLeave}
          onDragOver={onDragOver}
          onDrop={onDrop}
        >
          <FileUp className={`mx-auto h-12 w-12 mb-4 transition-colors ${
            isDragOver ? 'text-blue-500' : 'text-gray-400'
          }`} />
          <p className={`text-sm mb-4 transition-colors ${
            isDragOver 
              ? 'text-blue-700 dark:text-blue-300 font-semibold' 
              : 'text-gray-600 dark:text-gray-400'
          }`}>
            {isDragOver 
              ? 'Drop files here to upload' 
              : `Drag and drop files here or click to browse`
            }
          </p>
          
          {!isDragOver && (
            <button
              onClick={onFileSelect}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <FileUp className="h-4 w-4 mr-2" />
              Select Files
            </button>
          )}
          
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
            Supported: Images, PDFs, Documents, Spreadsheets
          </p>
        </div>
      </FormContent>
      
      <FormFooter
        onCancel={onClose}
        showPrevious={false}
      />
    </FormContainer>
  );
};
