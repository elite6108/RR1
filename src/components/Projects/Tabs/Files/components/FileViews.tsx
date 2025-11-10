import React from 'react';
import { 
  CheckSquare,
  Square,
  Edit2,
  Eye,
  Trash2,
  Folder
} from 'lucide-react';
import { ProjectFile, ViewMode } from '../types';
import { FileIcon, ImageThumbnail } from './index';
import { formatFileSize } from '../utils';

interface FileViewsProps {
  projectFiles: ProjectFile[];
  viewMode: ViewMode;
  selectedFiles: Set<string>;
  dragOverItem: string | null;
  onSelectAll: () => void;
  onToggleFileSelection: (fileId: string) => void;
  onFolderClick: (folderId: string) => void;
  onFileClick: (file: ProjectFile) => void;
  onEditClick: (file: ProjectFile) => void;
  onDeleteClick: (fileId: string) => void;
  onDragStart: (e: React.DragEvent, file: ProjectFile) => void;
  onDragEnd: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent, file?: ProjectFile) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, file?: ProjectFile) => void;
}

export function ListView({ 
  projectFiles, 
  selectedFiles, 
  dragOverItem,
  onSelectAll,
  onToggleFileSelection,
  onFolderClick,
  onFileClick,
  onEditClick,
  onDeleteClick,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragLeave,
  onDrop
}: FileViewsProps) {
  return (
    <div 
      className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden ${
        dragOverItem === 'current-folder' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : ''
      }`}
      onDragOver={(e) => onDragOver(e)}
      onDragLeave={onDragLeave}
      onDrop={(e) => onDrop(e)}
    >
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-750">
            <tr>
              <th className="px-3 sm:px-4 py-3 text-left w-8">
                <button
                  onClick={onSelectAll}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 touch-manipulation"
                >
                  {selectedFiles.size === projectFiles.length && projectFiles.length > 0 ? (
                    <CheckSquare className="h-4 w-4" />
                  ) : (
                    <Square className="h-4 w-4" />
                  )}
                </button>
              </th>
              <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Name
              </th>
              <th className="hidden sm:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Size
              </th>
              <th className="hidden md:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Modified
              </th>
              <th className="px-3 sm:px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-16 sm:w-20">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {projectFiles.map((file) => (
              <tr 
                key={file.id} 
                className={`hover:bg-gray-50 dark:hover:bg-gray-700 ${
                  dragOverItem === file.id && file.is_folder ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500' : ''
                }`}
                draggable
                onDragStart={(e) => onDragStart(e, file)}
                onDragEnd={onDragEnd}
                onDragOver={(e) => file.is_folder ? onDragOver(e, file) : e.preventDefault()}
                onDragLeave={onDragLeave}
                onDrop={(e) => file.is_folder ? onDrop(e, file) : e.preventDefault()}
              >
                <td className="px-3 sm:px-4 py-3">
                  <button
                    onClick={() => onToggleFileSelection(file.id)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 touch-manipulation"
                  >
                    {selectedFiles.has(file.id) ? (
                      <CheckSquare className="h-4 w-4" />
                    ) : (
                      <Square className="h-4 w-4" />
                    )}
                  </button>
                </td>
                <td className="px-3 sm:px-4 py-3">
                  <div className="flex items-center min-w-0">
                    <FileIcon file={file} />
                    <button
                      onClick={() => file.is_folder ? onFolderClick(file.id) : onFileClick(file)}
                      className="ml-2 sm:ml-3 text-sm font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate touch-manipulation"
                      title={file.is_folder ? 'Click to open folder' : 'Click to view file'}
                    >
                      {file.name}
                    </button>
                    {file.is_folder && (
                      <span className="ml-2 text-xs text-gray-400">📂 Drop zone</span>
                    )}
                  </div>
                  {/* Mobile-only size display */}
                  <div className="sm:hidden text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {file.is_folder ? '—' : formatFileSize(file.file_size)}
                  </div>
                </td>
                <td className="hidden sm:table-cell px-4 py-3 text-sm text-gray-500 dark:text-gray-300">
                  {file.is_folder ? '—' : formatFileSize(file.file_size)}
                </td>
                <td className="hidden md:table-cell px-4 py-3 text-sm text-gray-500 dark:text-gray-300">
                  {new Date(file.created_at).toLocaleDateString()}
                </td>
                <td className="px-3 sm:px-4 py-3 text-right">
                  <div className="flex justify-end space-x-1 sm:space-x-2">
                    <button
                      onClick={() => onEditClick(file)}
                      className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300 p-1 touch-manipulation"
                      title="Edit name"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    {!file.is_folder && (
                      <button
                        onClick={() => onFileClick(file)}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 p-1 touch-manipulation"
                        title="View file"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      onClick={() => onDeleteClick(file.id)}
                      className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 p-1 touch-manipulation"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function GridView({ 
  projectFiles, 
  selectedFiles, 
  dragOverItem,
  onToggleFileSelection,
  onFolderClick,
  onFileClick,
  onEditClick,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragLeave,
  onDrop
}: Omit<FileViewsProps, 'viewMode' | 'onSelectAll' | 'onDeleteClick'>) {
  return (
    <div 
      className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3 p-2 sm:p-4 min-h-32 ${
        dragOverItem === 'current-folder' ? 'bg-blue-50 dark:bg-blue-900/20 border-2 border-dashed border-blue-500 rounded-lg' : ''
      }`}
      onDragOver={(e) => onDragOver(e)}
      onDragLeave={onDragLeave}
      onDrop={(e) => onDrop(e)}
    >
      {projectFiles.map((file) => (
        <div
          key={file.id}
          className={`relative bg-white dark:bg-gray-800 p-2 sm:p-3 rounded-lg border transition-all duration-200 cursor-pointer group touch-manipulation ${
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
          <div className="absolute top-1 sm:top-2 right-1 sm:right-2 flex space-x-1">
            <button
              onClick={() => onEditClick(file)}
              className="opacity-70 sm:opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-opacity p-1 touch-manipulation"
              title="Edit name"
            >
              <Edit2 className="h-3 w-3 sm:h-4 sm:w-4" />
            </button>
            <button
              onClick={() => onToggleFileSelection(file.id)}
              className="opacity-70 sm:opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-opacity p-1 touch-manipulation"
            >
              {selectedFiles.has(file.id) ? (
                <CheckSquare className="h-3 w-3 sm:h-4 sm:w-4" />
              ) : (
                <Square className="h-3 w-3 sm:h-4 sm:w-4" />
              )}
            </button>
          </div>
          
          <button
            onClick={() => file.is_folder ? onFolderClick(file.id) : onFileClick(file)}
            className="w-full text-center touch-manipulation"
            title={file.is_folder ? 'Click to open folder' : 'Click to view file'}
          >
            <div className="flex justify-center mb-1 sm:mb-2">
              {file.is_folder ? (
                <div className="relative">
                  <Folder className="h-8 w-8 sm:h-10 sm:w-10 text-blue-500" />
                  {dragOverItem === file.id && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse"></div>
                    </div>
                  )}
                </div>
              ) : file.mime_type?.startsWith('image/') ? (
                <div className="h-8 w-8 sm:h-10 sm:w-10">
                  <ImageThumbnail file={file} size="lg" className="h-full w-full" />
                </div>
              ) : (
                <div className="h-8 w-8 sm:h-10 sm:w-10 flex items-center justify-center">
                  <FileIcon file={file} size="lg" />
                </div>
              )}
            </div>
            <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white truncate leading-tight">
              {file.name}
            </p>
            {!file.is_folder && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-tight">
                {formatFileSize(file.file_size)}
              </p>
            )}
            {file.is_folder && dragOverItem === file.id && (
              <p className="text-xs text-blue-500 mt-1 leading-tight animate-pulse">
                Drop here
              </p>
            )}
          </button>
        </div>
      ))}
    </div>
  );
}
