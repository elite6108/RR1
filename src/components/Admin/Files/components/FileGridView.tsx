import React from 'react';
import { CheckSquare, Square, Edit2, Folder, BookMarked } from 'lucide-react';
import { FileIcon } from './FileIcon';
import { ImageThumbnail } from './ImageThumbnail';
import { formatFileSize } from '../utils/helpers';
import type { CompanyFile } from '../types';

interface FileGridViewProps {
  files: CompanyFile[];
  selectedFiles: Set<string>;
  draggedItem: CompanyFile | null;
  dragOverItem: string | null;
  onToggleFileSelection: (fileId: string) => void;
  onFileClick: (file: CompanyFile) => void;
  onFolderClick: (folderId: string) => void;
  onEditClick: (file: CompanyFile) => void;
  onDragStart: (e: React.DragEvent, file: CompanyFile) => void;
  onDragEnd: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent, file?: CompanyFile) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, file?: CompanyFile) => void;
}

export const FileGridView: React.FC<FileGridViewProps> = ({
  files,
  selectedFiles,
  draggedItem,
  dragOverItem,
  onToggleFileSelection,
  onFileClick,
  onFolderClick,
  onEditClick,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragLeave,
  onDrop
}) => {
  return (
    <div 
      className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3 p-2 sm:p-4 min-h-32 ${
        dragOverItem === 'current-folder' ? 'bg-blue-50 dark:bg-blue-900/20 border-2 border-dashed border-blue-500 rounded-lg' : ''
      }`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={(e) => onDrop(e)}
    >
      {files.map((file) => (
        <div
          key={file.id}
          className={`relative bg-white dark:bg-gray-800 p-2 sm:p-3 rounded-lg border transition-all duration-200 group touch-manipulation ${
            selectedFiles.has(file.id) 
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
              : dragOverItem === file.id && file.is_folder
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg scale-105'
              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
          }`}
          draggable
          onDragStart={(e) => onDragStart(e, file)}
          onDragEnd={onDragEnd}
          onDragOver={(e) => file.is_folder ? onDragOver(e, file) : e.preventDefault()}
          onDragLeave={onDragLeave}
          onDrop={(e) => file.is_folder ? onDrop(e, file) : e.preventDefault()}
        >
          <div className="absolute top-1 sm:top-2 right-1 sm:right-2 flex space-x-1 z-10 pointer-events-auto">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEditClick(file);
              }}
              className="opacity-70 sm:opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-opacity p-1 touch-manipulation"
              title="Edit name"
            >
              <Edit2 className="h-3 w-3 sm:h-4 sm:w-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFileSelection(file.id);
              }}
              className="opacity-70 sm:opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-opacity p-1 touch-manipulation"
            >
              {selectedFiles.has(file.id) ? (
                <CheckSquare className="h-3 w-3 sm:h-4 sm:w-4" />
              ) : (
                <Square className="h-3 w-3 sm:h-4 sm:w-4" />
              )}
            </button>
          </div>
          
          <div
            onClick={() => file.is_folder ? onFolderClick(file.id) : onFileClick(file)}
            className="w-full text-center cursor-pointer touch-manipulation"
            title={file.is_folder ? 'Click to open folder' : 'Click to view file'}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                file.is_folder ? onFolderClick(file.id) : onFileClick(file);
              }
            }}
          >
            <div className="flex justify-center mb-2 sm:mb-3">
              {file.is_folder ? (
                <div className="relative">
                  <Folder className="h-16 w-16 sm:h-20 sm:w-20 text-blue-500" />
                  {dragOverItem === file.id && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse"></div>
                    </div>
                  )}
                </div>
              ) : file.mime_type?.startsWith('image/') ? (
                <div className="h-16 w-16 sm:h-24 sm:w-24">
                  <ImageThumbnail file={file} size="lg" className="h-full w-full" />
                </div>
              ) : (
                <div className="h-16 w-16 sm:h-24 sm:w-24 flex items-center justify-center">
                  <FileIcon file={file} size="lg" />
                </div>
              )}
            </div>
            <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white truncate leading-tight">
              {file.name}
            </p>
            {file.is_employee_handbook && (
              <div className="mt-1 inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                <BookMarked className="h-2.5 w-2.5 mr-1" />
                Handbook
              </div>
            )}
            {file.is_annual_training && (
              <div className="mt-1 inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100">
                <BookMarked className="h-2.5 w-2.5 mr-1" />
                Annual Training
              </div>
            )}
            {!file.is_folder && !file.is_employee_handbook && !file.is_annual_training && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-tight">
                {formatFileSize(file.file_size)}
              </p>
            )}
            {file.is_folder && dragOverItem === file.id && (
              <p className="text-xs text-blue-500 mt-1 leading-tight animate-pulse">
                Drop here
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
