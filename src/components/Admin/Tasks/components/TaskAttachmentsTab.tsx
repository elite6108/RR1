import React, { useState } from 'react';
import { X, FileText, Upload } from 'lucide-react';
import { TaskFormData } from '../types';

interface TaskAttachmentsTabProps {
  taskFormData: TaskFormData;
  setTaskFormData: React.Dispatch<React.SetStateAction<TaskFormData>>;
  onRemoveFile: (index: number) => void;
  onRemoveExistingAttachment: (index: number) => void;
}

export const TaskAttachmentsTab: React.FC<TaskAttachmentsTabProps> = ({
  taskFormData,
  setTaskFormData,
  onRemoveFile,
  onRemoveExistingAttachment,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    setTaskFormData({
      ...taskFormData,
      attachments: [...taskFormData.attachments, ...files],
    });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setTaskFormData({
        ...taskFormData,
        attachments: [...taskFormData.attachments, ...newFiles],
      });
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Attachments <span className="text-gray-400 text-xs">(optional)</span>
        </label>
        <div
          className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
            isDragOver
              ? 'border-indigo-500 bg-indigo-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-4">
              <label htmlFor="file-upload" className="cursor-pointer">
                <span className="mt-2 block text-sm font-medium text-gray-900">
                  Drop files here, or{' '}
                  <span className="text-indigo-600 hover:text-indigo-500">browse</span>
                </span>
              </label>
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                multiple
                className="sr-only"
                onChange={handleFileSelect}
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              PNG, JPG, PDF up to 10MB each
            </p>
          </div>
        </div>
      </div>

      {/* Display new files to be uploaded */}
      {taskFormData.attachments.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">New Files:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {taskFormData.attachments.map((file, index) => {
              const isImage = file.type?.startsWith('image/');
              const fileUrl = URL.createObjectURL(file);
              
              return (
                <div
                  key={index}
                  className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 border border-gray-200 dark:border-gray-600"
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-16 h-16 flex-shrink-0">
                      {isImage ? (
                        <img
                          src={fileUrl}
                          alt={file.name}
                          className="w-full h-full object-cover rounded-md cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => window.open(fileUrl, '_blank')}
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 dark:bg-gray-500 rounded-md flex items-center justify-center">
                          <FileText className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {file.type} • {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                      <button
                        type="button"
                        onClick={() => onRemoveFile(index)}
                        className="mt-2 inline-flex items-center text-xs text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <X className="w-3 h-3 mr-1" />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Display existing attachments */}
      {taskFormData.existing_attachments.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Existing Attachments:
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {taskFormData.existing_attachments.map((attachment, index) => {
              const isImage = attachment.file_type?.startsWith('image/') || 
                attachment.file_name?.match(/\.(jpg|jpeg|png|gif|webp)$/i);
              
              return (
                <div
                  key={attachment.id}
                  className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800"
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-16 h-16 flex-shrink-0">
                      {isImage && attachment.file_url ? (
                        <img
                          src={attachment.file_url}
                          alt={attachment.display_name || attachment.file_name}
                          className="w-full h-full object-cover rounded-md cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => window.open(attachment.file_url, '_blank')}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            target.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      ) : null}
                      <div className={`w-full h-full bg-blue-100 dark:bg-blue-800 rounded-md flex items-center justify-center ${isImage ? 'hidden' : ''}`}>
                        <FileText className="w-8 h-8 text-blue-500" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {attachment.display_name || attachment.file_name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {attachment.file_type || 'Unknown type'}
                      </p>
                      <div className="flex items-center space-x-2 mt-2">
                        {attachment.file_url && (
                          <button
                            type="button"
                            onClick={() => window.open(attachment.file_url, '_blank')}
                            className="inline-flex items-center text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            Open
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => onRemoveExistingAttachment(index)}
                          className="inline-flex items-center text-xs text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <X className="w-3 h-3 mr-1" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
              File Upload Guidelines
            </h3>
            <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
              <ul className="list-disc list-inside space-y-1">
                <li>Maximum file size: 10MB per file</li>
                <li>Supported formats: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG, GIF</li>
                <li>Files are securely stored and accessible only to assigned users</li>
                <li>You can remove existing attachments by clicking the X button</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
