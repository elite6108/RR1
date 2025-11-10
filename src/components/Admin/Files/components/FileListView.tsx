import React from 'react';
import { CheckSquare, Square, Edit2, Eye, Trash2, BookMarked } from 'lucide-react';
import { FileIcon } from './FileIcon';
import { formatFileSize, truncateFileName } from '../utils/helpers';
import type { CompanyFile } from '../types';

interface FileListViewProps {
  files: CompanyFile[];
  selectedFiles: Set<string>;
  draggedItem: CompanyFile | null;
  dragOverItem: string | null;
  onSelectAll: () => void;
  onToggleFileSelection: (fileId: string) => void;
  onFileClick: (file: CompanyFile) => void;
  onEditClick: (file: CompanyFile) => void;
  onDeleteClick: (fileId: string) => void;
  onDragStart: (e: React.DragEvent, file: CompanyFile) => void;
  onDragEnd: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent, file?: CompanyFile) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, file?: CompanyFile) => void;
}

export const FileListView: React.FC<FileListViewProps> = ({
  files,
  selectedFiles,
  draggedItem,
  dragOverItem,
  onSelectAll,
  onToggleFileSelection,
  onFileClick,
  onEditClick,
  onDeleteClick,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragLeave,
  onDrop
}) => {
  return (
    <div 
      className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={(e) => onDrop(e)}
    >
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-700/50">
          <tr>
            <th scope="col" className="p-4">
              <button onClick={onSelectAll} className="flex items-center">
                {selectedFiles.size === files.length && files.length > 0 ? (
                  <CheckSquare className="h-4 w-4 text-blue-600" />
                ) : (
                  <Square className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-1/2">Name</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-24">Size</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-32">Modified</th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {files.map((file) => (
            <tr
              key={file.id}
              draggable
              onDragStart={(e) => onDragStart(e, file)}
              onDragEnd={onDragEnd}
              onDragOver={(e) => onDragOver(e, file)}
              onDragLeave={onDragLeave}
              onDrop={(e) => onDrop(e, file)}
              onClick={() => onFileClick(file)}
              onDoubleClick={() => onFileClick(file)}
              className={`transition-colors cursor-pointer group ${
                selectedFiles.has(file.id) ? 'bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
              } ${
                draggedItem?.id === file.id ? 'opacity-50' : ''
              } ${
                dragOverItem === file.id && file.is_folder ? 'outline outline-2 outline-blue-500 outline-offset-[-1px]' : ''
              }`}
            >
              <td className="p-4">
                <button onClick={(e) => { e.stopPropagation(); onToggleFileSelection(file.id); }} className="flex items-center">
                  {selectedFiles.has(file.id) ? (
                    <CheckSquare className="h-4 w-4 text-blue-600" />
                  ) : (
                    <Square className="h-4 w-4 text-gray-400 group-hover:text-gray-500" />
                  )}
                </button>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center min-w-0">
                  <FileIcon file={file} size="sm" />
                  <span 
                    className="ml-4 text-sm font-medium text-gray-900 dark:text-white truncate"
                    title={file.name}
                  >
                    {truncateFileName(file.name, 35)}
                  </span>
                  {file.is_employee_handbook && (
                    <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100 flex-shrink-0">
                      <BookMarked className="h-3 w-3 mr-1" />
                      Employee Handbook
                    </span>
                  )}
                   {dragOverItem === file.id && file.is_folder && (
                     <span className="ml-2 text-xs text-blue-500 font-semibold flex-shrink-0">Drop zone</span>
                   )}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {formatFileSize(file.file_size)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {new Date(file.created_at).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex items-center justify-end space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={(e) => { e.stopPropagation(); onEditClick(file); }} className="text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-white" title="Edit">
                    <Edit2 className="h-4 w-4" />
                  </button>
                  {!file.is_folder && (
                    <button onClick={(e) => { e.stopPropagation(); onFileClick(file); }} className="text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-white" title="Preview">
                      <Eye className="h-4 w-4" />
                    </button>
                  )}
                  <button onClick={(e) => { e.stopPropagation(); onDeleteClick(file.id); }} className="text-red-500 hover:text-red-700" title="Delete">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
