import React from 'react';
import { Pencil, FileText, Trash2, Loader2 } from 'lucide-react';
import { getCPPStatus } from '../utils/cppStatus';
import type { CPPTableProps } from '../types';

export function CPPTableView({
  filteredCPPs,
  generatingPdfId,
  onEdit,
  onViewPDF,
  onDelete,
}: CPPTableProps) {
  return (
    <div className="hidden lg:block overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead>
          <tr className="bg-gray-50 dark:bg-gray-700">
            <th scope="col" className="py-3 px-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider first:rounded-tl-lg">
              CPP Number
            </th>
            <th scope="col" className="py-3 px-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Created
            </th>
            <th scope="col" className="py-3 px-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Review Date
            </th>
            <th scope="col" className="py-3 px-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="py-3 px-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider last:rounded-tr-lg">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {filteredCPPs.map((cpp, index) => {
            const { statusClass, statusText } = getCPPStatus(cpp);

            return (
              <tr key={cpp.id} className={index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700'}>
                <td className="py-2 px-3 text-sm text-gray-900 dark:text-white first:rounded-bl-lg">
                  {cpp.cpp_number}
                </td>
                <td className="py-2 px-3 text-sm text-gray-500 dark:text-gray-400">
                  {new Date(cpp.created_at).toLocaleDateString()}
                </td>
                <td className="py-2 px-3 text-sm text-gray-500 dark:text-gray-400">
                  {new Date(cpp.review_date).toLocaleDateString()}
                </td>
                <td className="py-2 px-3 text-sm">
                  <span className={statusClass}>{statusText}</span>
                </td>
                <td className="py-2 px-3 text-right text-sm font-medium last:rounded-br-lg">
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => onEdit(cpp)}
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                      title="Edit"
                    >
                      <Pencil className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => onViewPDF(cpp)}
                      disabled={generatingPdfId === cpp.id}
                      className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 disabled:opacity-50"
                      title="View PDF"
                    >
                      {generatingPdfId === cpp.id ? (
                        <Loader2 className="h-5 w-5 animate-spin text-green-600" />
                      ) : (
                        <FileText className="h-5 w-5" />
                      )}
                    </button>
                    <button
                      onClick={() => onDelete(cpp)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      title="Delete"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
