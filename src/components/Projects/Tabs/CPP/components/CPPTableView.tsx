import React from 'react';
import { Loader2, FileText } from 'lucide-react';
import type { CPPListProps } from '../types';

/**
 * Desktop table view for CPPs
 */
export function CPPTableView({ 
  cpps, 
  generatingPDF, 
  processingCppId, 
  onViewPDF 
}: CPPListProps) {
  const isEmpty = cpps.length === 0;

  return (
    <div className="hidden md:block overflow-x-auto">
      <div className="inline-block min-w-full align-middle">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                CPP Number
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Project Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Client
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {isEmpty ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                  No CPPs found for this project
                </td>
              </tr>
            ) : (
              cpps.map((cpp) => (
                <CPPTableRow
                  key={cpp.id}
                  cpp={cpp}
                  generatingPDF={generatingPDF}
                  processingCppId={processingCppId}
                  onViewPDF={onViewPDF}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/**
 * Individual table row component for CPP
 */
function CPPTableRow({ 
  cpp, 
  generatingPDF, 
  processingCppId, 
  onViewPDF 
}: {
  cpp: any;
  generatingPDF: boolean;
  processingCppId: string | null;
  onViewPDF: (cpp: any) => void;
}) {
  const isProcessing = generatingPDF && processingCppId === cpp.id;

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
        {cpp.cpp_number || 'N/A'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
        {cpp.front_cover?.projectName || 'N/A'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
        {cpp.front_cover?.clientName || 'N/A'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
        {new Date(cpp.created_at).toLocaleDateString()}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onViewPDF(cpp);
          }}
          disabled={isProcessing}
          className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 disabled:opacity-50"
          title="Generate PDF"
        >
          {isProcessing ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <FileText className="h-5 w-5" />
          )}
        </button>
      </td>
    </tr>
  );
}
