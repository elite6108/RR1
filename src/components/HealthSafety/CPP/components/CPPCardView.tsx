import React from 'react';
import { Pencil, FileText, Trash2, Loader2 } from 'lucide-react';
import { getCPPStatus } from '../utils/cppStatus';
import type { CPPCardProps } from '../types';

export function CPPCardView({
  filteredCPPs,
  generatingPdfId,
  onEdit,
  onViewPDF,
  onDelete,
}: CPPCardProps) {
  return (
    <div className="lg:hidden">
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {filteredCPPs.map((cpp) => {
          const { statusText, statusBadgeClass } = getCPPStatus(cpp);

          return (
            <div key={cpp.id} className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm mx-4 my-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">
                    {cpp.cpp_number}
                  </h4>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${statusBadgeClass}`}>
                    {statusText}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => onEdit(cpp)}
                    className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-1 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                    title="Edit"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onViewPDF(cpp)}
                    disabled={generatingPdfId === cpp.id}
                    className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 p-1 hover:bg-green-50 dark:hover:bg-green-900/20 rounded disabled:opacity-50"
                    title="View PDF"
                  >
                    {generatingPdfId === cpp.id ? (
                      <Loader2 className="h-4 w-4 animate-spin text-green-600" />
                    ) : (
                      <FileText className="h-4 w-4" />
                    )}
                  </button>
                  <button
                    onClick={() => onDelete(cpp)}
                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-500 dark:text-gray-400 font-medium">Created:</span>
                  <p className="text-gray-900 dark:text-white mt-1">
                    {new Date(cpp.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400 font-medium">Review Date:</span>
                  <p className="text-gray-900 dark:text-white mt-1">
                    {new Date(cpp.review_date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
