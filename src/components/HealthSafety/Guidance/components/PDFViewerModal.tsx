import React from 'react';
import { X } from 'lucide-react';
import { PDFViewerModalProps } from '../types';

/**
 * Modal component for viewing PDF documents in an iframe
 * Provides full-screen PDF viewing with external link option
 */
export const PDFViewerModal: React.FC<PDFViewerModalProps> = ({ 
  onClose, 
  pdfUrl, 
  title 
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="relative w-full h-full max-w-6xl max-h-screen m-4 bg-white dark:bg-gray-900 rounded-lg overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
            {title}
          </h3>
          <div className="flex items-center space-x-2">
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Open in New Tab
            </a>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
              aria-label="Close PDF viewer"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>
        
        {/* PDF Content */}
        <div className="w-full h-full">
          <iframe
            src={pdfUrl}
            className="w-full h-full border-0"
            title={title}
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
};
