import React from 'react';
import { FileText, Edit3, MoreVertical } from 'lucide-react';
import { BaseDocument } from '../types';

interface DocumentGridProps<T extends BaseDocument> {
  documents: T[];
  loading: boolean;
  thumbnailUrls: Record<string, string>;
  onViewPDF: (document: T) => void;
  onEditDocument?: (document: T) => void;
  emptyMessage?: string;
}

/**
 * Reusable grid component for displaying documents
 * Handles loading states, empty states, and document cards
 */
export const DocumentGrid = <T extends BaseDocument>({
  documents,
  loading,
  thumbnailUrls,
  onViewPDF,
  onEditDocument,
  emptyMessage = "No documents found"
}: DocumentGridProps<T>) => {
  if (loading) {
    return (
      <div className="col-span-full flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="col-span-full text-center py-8 text-gray-500 dark:text-gray-400">
        {emptyMessage}
      </div>
    );
  }

  return (
    <>
      {documents.map((doc) => (
        <DocumentCard
          key={doc.id}
          document={doc}
          thumbnailUrl={thumbnailUrls[doc.id]}
          onViewPDF={() => onViewPDF(doc)}
          onEditDocument={onEditDocument ? () => onEditDocument(doc) : undefined}
        />
      ))}
    </>
  );
};

interface DocumentCardProps<T extends BaseDocument> {
  document: T;
  thumbnailUrl?: string;
  onViewPDF: () => void;
  onEditDocument?: () => void;
}

/**
 * Individual document card component
 * Displays document thumbnail or fallback icon with title and view button
 */
const DocumentCard = <T extends BaseDocument>({
  document,
  thumbnailUrl,
  onViewPDF,
  onEditDocument
}: DocumentCardProps<T>) => {
  const [showDropdown, setShowDropdown] = React.useState(false);

  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm p-4 text-center flex flex-col justify-between border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow relative">
      {/* Edit Dropdown */}
      {onEditDocument && (
        <div className="absolute top-2 right-2">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <MoreVertical className="h-4 w-4" />
          </button>
          
          {showDropdown && (
            <>
              {/* Backdrop to close dropdown */}
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setShowDropdown(false)}
              />
              
              {/* Dropdown menu */}
              <div className="absolute right-0 top-8 z-20 w-32 bg-white dark:bg-gray-700 rounded-md shadow-lg border border-gray-200 dark:border-gray-600">
                <button
                  onClick={() => {
                    onEditDocument();
                    setShowDropdown(false);
                  }}
                  className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md flex items-center"
                >
                  <Edit3 className="h-3 w-3 mr-2" />
                  Edit
                </button>
              </div>
            </>
          )}
        </div>
      )}

      <div className="flex-grow flex flex-col items-center justify-center pt-4">
        {document.thumbnail_path && thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={document.title}
            className="h-30 w-30 rounded object-cover mb-4"
            loading="lazy"
          />
        ) : (
          <FileText className="h-20 w-20 text-gray-400 mb-4" />
        )}
        <h3 className="text-md font-medium text-gray-900 dark:text-white truncate w-full px-2">
          {document.title}
        </h3>
      </div>
      <div className="mt-4">
        <button
          onClick={onViewPDF}
          className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          View PDF
        </button>
      </div>
    </div>
  );
};
