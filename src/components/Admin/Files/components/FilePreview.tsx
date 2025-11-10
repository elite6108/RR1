import React from 'react';
import { FileIcon, Download } from 'lucide-react';
import { getFileTypeCategory } from '../utils/helpers';
import { FILE_TYPE_CATEGORIES } from '../utils/constants';
import type { CompanyFile } from '../types';

interface FilePreviewProps {
  file: CompanyFile | null;
  previewUrl: string | null;
  onDownload: (file: CompanyFile) => void;
  onPreviewError: () => void;
}

export const FilePreview: React.FC<FilePreviewProps> = ({
  file,
  previewUrl,
  onDownload,
  onPreviewError
}) => {
  if (!file || !previewUrl) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
        <FileIcon className="h-16 w-16 mx-auto mb-4" />
        <p>Preview not available</p>
        {file && (
           <button
              onClick={() => onDownload(file)}
              className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Download className="h-4 w-4 mr-2" />
              Download File
            </button>
        )}
      </div>
    );
  }

  const fileType = getFileTypeCategory(file);

  switch (fileType) {
    case FILE_TYPE_CATEGORIES.IMAGE:
      return (
        <img 
          src={previewUrl} 
          alt={file.name} 
          className="max-w-full max-h-[80vh] object-contain rounded-lg" 
          onError={onPreviewError} 
        />
      );
    case FILE_TYPE_CATEGORIES.PDF:
      return (
        <iframe 
          src={previewUrl} 
          className="w-full h-[80vh] border-0 rounded-lg" 
          title={file.name} 
        />
      );
    case FILE_TYPE_CATEGORIES.VIDEO:
      return (
        <video 
          src={previewUrl} 
          controls 
          className="max-w-full max-h-[80vh] rounded-lg" 
          onError={onPreviewError}
        >
          Your browser does not support the video tag.
        </video>
      );
    case FILE_TYPE_CATEGORIES.AUDIO:
      return (
        <audio 
          src={previewUrl} 
          controls 
          className="w-full max-w-md" 
          onError={onPreviewError}
        >
          Your browser does not support the audio tag.
        </audio>
      );
    default:
      return (
        <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
          <FileIcon className="h-16 w-16 mx-auto mb-4" />
          <p>Preview not available for this file type</p>
          <button
            onClick={() => onDownload(file)}
            className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Download className="h-4 w-4 mr-2" />
            Download File
          </button>
        </div>
      );
  }
};
