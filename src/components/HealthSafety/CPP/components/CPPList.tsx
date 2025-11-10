import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { CPPTableView } from './CPPTableView';
import { CPPCardView } from './CPPCardView';
import type { CPPListProps } from '../types';

export function CPPList({
  cpps,
  loading,
  error,
  pdfError,
  searchQuery,
  generatingPdfId,
  onEdit,
  onViewPDF,
  onDelete,
}: CPPListProps) {
  // Filter CPPs based on search query
  const filteredCPPs = cpps.filter((cpp) =>
    cpp.cpp_number.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Error Messages */}
      {error && (
        <div className="mb-4 flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-4 rounded-md">
          <AlertTriangle className="h-5 w-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {pdfError && (
        <div className="mb-4 flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-4 rounded-md">
          <AlertTriangle className="h-5 w-5 flex-shrink-0" />
          <div>
            <p className="font-medium">Error generating PDF</p>
            <p>{pdfError}</p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
          </div>
        ) : cpps.length === 0 ? (
          <div className="flex items-center justify-center h-48">
            <p className="text-gray-500 dark:text-gray-400">No CPPs available</p>
          </div>
        ) : (
          <>
            <CPPTableView
              cpps={cpps}
              filteredCPPs={filteredCPPs}
              loading={loading}
              generatingPdfId={generatingPdfId}
              onEdit={onEdit}
              onViewPDF={onViewPDF}
              onDelete={onDelete}
            />

            <CPPCardView
              cpps={cpps}
              filteredCPPs={filteredCPPs}
              generatingPdfId={generatingPdfId}
              onEdit={onEdit}
              onViewPDF={onViewPDF}
              onDelete={onDelete}
            />
          </>
        )}
      </div>
    </>
  );
}
