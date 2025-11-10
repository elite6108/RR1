import React from 'react';
import { ChevronUp, ChevronDown, Pencil, FileText, Trash2, Loader2 } from 'lucide-react';
import type { RAMS } from '../../../../types/database';

interface RAMSDesktopTableProps {
  entries: RAMS[];
  sortConfig: { key: string; direction: 'asc' | 'desc' } | null;
  onSort: (key: string) => void;
  onEdit: (entry: RAMS) => void;
  onViewPDF: (entry: RAMS) => void;
  onDelete: (entry: RAMS) => void;
  generatingPdfId: string | null;
}

export function RAMSDesktopTable({
  entries,
  sortConfig,
  onSort,
  onEdit,
  onViewPDF,
  onDelete,
  generatingPdfId
}: RAMSDesktopTableProps) {
  return (
    <div className="hidden lg:block overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-700/50">
          <tr>
            <th 
              scope="col" 
              className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white cursor-pointer first:rounded-tl-lg last:rounded-tr-lg"
              onClick={() => onSort('rams_number')}
            >
              <div className="flex items-center gap-2">
                RAMS Number
                {sortConfig?.key === 'rams_number' && (
                  sortConfig.direction === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                )}
              </div>
            </th>
            <th 
              scope="col" 
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white cursor-pointer"
              onClick={() => onSort('date')}
            >
              <div className="flex items-center gap-2">
                Date
                {sortConfig?.key === 'date' && (
                  sortConfig.direction === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                )}
              </div>
            </th>
            <th 
              scope="col" 
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white cursor-pointer"
              onClick={() => onSort('client_name')}
            >
              <div className="flex items-center gap-2">
                Client Name
                {sortConfig?.key === 'client_name' && (
                  sortConfig.direction === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                )}
              </div>
            </th>
            <th 
              scope="col" 
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white cursor-pointer"
              onClick={() => onSort('site')}
            >
              <div className="flex items-center gap-2">
                Site Reference
                {sortConfig?.key === 'site' && (
                  sortConfig.direction === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                )}
              </div>
            </th>
            <th scope="col" className="relative py-3.5 pl-3 pr-4">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-600 bg-white dark:bg-gray-800">
          {entries.map((entry) => (
            <tr 
              key={entry.id} 
              className="hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer"
              onClick={() => onEdit(entry)}
            >
              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white first:rounded-bl-lg last:rounded-br-lg">
                {entry.rams_number}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                {new Date(entry.date).toLocaleDateString()}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                {entry.client_name}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                {entry.site_town}, {entry.site_county}
              </td>
              <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium">
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(entry);
                    }}
                    className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                    title="Edit"
                  >
                    <Pencil className="h-5 w-5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewPDF(entry);
                    }}
                    disabled={generatingPdfId === entry.id}
                    className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 disabled:opacity-50"
                    title="View PDF"
                  >
                    {generatingPdfId === entry.id ? (
                      <Loader2 className="h-5 w-5 animate-spin text-green-600" />
                    ) : (
                      <FileText className="h-5 w-5" />
                    )}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(entry);
                    }}
                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300" 
                    title="Delete"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
