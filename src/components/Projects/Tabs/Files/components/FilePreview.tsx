import React from 'react';
import { 
  FileText, 
  Download,
  Eye
} from 'lucide-react';
import { supabase } from '../../../../../lib/supabase';
import { ProjectFile } from '../types';
import { getFileTypeCategory, formatFileSize } from '../utils';

interface FilePreviewProps {
  file: ProjectFile;
  filePreviewUrl: string | null;
  onDownload: (file: ProjectFile) => void;
}

export function FilePreview({ file, filePreviewUrl, onDownload }: FilePreviewProps) {
  if (!file) {
    console.log('No selected file for preview');
    return null;
  }

  const fileType = getFileTypeCategory(file);
  console.log('Rendering preview for file type:', fileType, 'File:', file.name);
  console.log('Preview URL available:', !!filePreviewUrl);
  
  if (!filePreviewUrl) {
    return (
      <div className="text-center py-8">
        <FileText className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mb-4" />
        <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base mb-4">
          Unable to load preview
        </p>
        <p className="text-xs text-gray-400 mb-4">
          File type: {fileType} | MIME: {file.mime_type || 'unknown'}
        </p>
        <button
          onClick={() => onDownload(file)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Download className="h-4 w-4 mr-2" />
          Download File
        </button>
      </div>
    );
  }

  switch (fileType) {
    case 'image':
      console.log('Rendering image preview');
      return (
        <div className="text-center">
          <img
            src={filePreviewUrl}
            alt={file.name}
            className="max-w-full h-auto mx-auto rounded-lg shadow-lg"
            onError={(e) => {
              console.error('Image failed to load:', filePreviewUrl);
            }}
            onLoad={() => console.log('Image loaded successfully')}
          />
          <div className="mt-4 flex justify-center space-x-3">
            <button
              onClick={() => onDownload(file)}
              className="inline-flex items-center px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors text-sm"
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </button>
          </div>
        </div>
      );
      
    case 'pdf':
      console.log('Rendering PDF preview');
      return (
        <div className="w-full">
          <div className="w-full h-[70vh] mb-4">
            <iframe
              src={`${filePreviewUrl}#toolbar=1&navpanes=1&scrollbar=1`}
              className="w-full h-full border border-gray-200 dark:border-gray-700 rounded-lg"
              title={file.name}
              onError={() => {
                console.error('PDF iframe failed to load');
              }}
            />
          </div>
          <div className="flex justify-center">
            <button
              onClick={() => onDownload(file)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </button>
          </div>
        </div>
      );
      
    case 'document':
    case 'spreadsheet':
    case 'presentation':
      console.log('Rendering Office document preview');
      return (
        <div className="text-center py-8">
          <div className="mb-6">
            {fileType === 'document' && <FileText className="mx-auto h-16 w-16 text-blue-500 mb-4" />}
            {fileType === 'spreadsheet' && <FileText className="mx-auto h-16 w-16 text-green-500 mb-4" />}
            {fileType === 'presentation' && <FileText className="mx-auto h-16 w-16 text-orange-500 mb-4" />}
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {file.name}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
            {fileType === 'document' && 'Microsoft Word Document'}
            {fileType === 'spreadsheet' && 'Microsoft Excel Spreadsheet'}
            {fileType === 'presentation' && 'Microsoft PowerPoint Presentation'}
          </p>
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6 max-w-md mx-auto">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-800 rounded-full">
                  <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="text-left">
                <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                  Preview Options
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Office documents need to be downloaded to view. You can also try opening in Microsoft Office Online.
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Size: {formatFileSize(file.file_size)} • {new Date(file.created_at).toLocaleDateString()}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => onDownload(file)}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
              >
                <Download className="h-5 w-5 mr-2" />
                Download & Open
              </button>
              <button
                onClick={async () => {
                  try {
                    // Create a temporary signed URL for Office Online viewer
                    const { data, error } = await supabase.storage
                      .from('project-files')
                      .createSignedUrl(file.storage_path!, 3600);
                    
                    if (data?.signedUrl) {
                      // Try Microsoft Office Online viewer
                      const officeViewerUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(data.signedUrl)}`;
                      window.open(officeViewerUrl, '_blank');
                    } else {
                      console.error('Could not generate URL for Office viewer');
                      // Fallback to download
                      onDownload(file);
                    }
                  } catch (error) {
                    console.error('Error opening in Office viewer:', error);
                    // Fallback to download
                    onDownload(file);
                  }
                }}
                className="inline-flex items-center px-6 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors font-medium"
              >
                <Eye className="h-5 w-5 mr-2" />
                Try Office Online
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
              💡 Tip: Office Online viewer works best with publicly accessible files. Download is recommended for private files.
            </p>
          </div>
        </div>
      );
      
    case 'text':
      console.log('Rendering text file preview');
      return (
        <div>
          <div className="w-full h-[60vh] mb-4">
            <iframe
              src={filePreviewUrl}
              className="w-full h-full border border-gray-200 dark:border-gray-700 rounded-lg"
              title={file.name}
            />
          </div>
          <div className="flex justify-center">
            <button
              onClick={() => onDownload(file)}
              className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </button>
          </div>
        </div>
      );
      
    default:
      console.log('Rendering default file preview');
      return (
        <div className="text-center py-8">
          <FileText className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {file.name}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">
            Preview not available for this file type
          </p>
          <p className="text-xs text-gray-400 mb-6">
            Type: {fileType} | MIME: {file.mime_type || 'unknown'}
          </p>
          <div className="space-y-3">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Size: {formatFileSize(file.file_size)}
            </p>
            <button
              onClick={() => onDownload(file)}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              <Download className="h-5 w-5 mr-2" />
              Download File
            </button>
          </div>
        </div>
      );
  }
}
