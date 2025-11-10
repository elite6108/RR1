import React from 'react';
import { Pencil, FileText, Trash2, Loader2 } from 'lucide-react';
import { AdditionalWorkTableProps } from '../types';
import { formatCurrency } from '../../../../../utils/formatters';
import { formatDisplayDate, filterAdditionalWorks } from '../utils';

/**
 * Table component for displaying additional works
 */
const AdditionalWorkTable: React.FC<AdditionalWorkTableProps> = ({
  works,
  onEdit,
  onDelete,
  onGeneratePDF,
  generatingPdfId,
  searchQuery
}) => {
  const filteredWorks = filterAdditionalWorks(works, searchQuery);

  const renderDesktopTable = () => (
    <div className="hidden md:block overflow-x-auto">
      <div className="inline-block min-w-full align-middle">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Agreed Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Agreed With
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {filteredWorks.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                  {searchQuery ? 'No additional works match your search criteria' : 'No additional works found for this project'}
                </td>
              </tr>
            ) : (
              filteredWorks.map((work) => (
                <tr key={work.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {formatDisplayDate(work.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {work.title}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white max-w-xs truncate">
                    {work.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {formatCurrency(work.agreed_amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {work.agreed_with}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => onEdit(work)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-1"
                        title="Edit"
                      >
                        <Pencil className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => onGeneratePDF(work)}
                        disabled={generatingPdfId === work.id}
                        className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 disabled:opacity-50 p-1"
                        title="View PDF"
                      >
                        {generatingPdfId === work.id ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          <FileText className="h-5 w-5" />
                        )}
                      </button>
                      <button
                        onClick={() => onDelete(work)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1"
                        title="Delete"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderMobileCards = () => (
    <div className="md:hidden">
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {filteredWorks.length === 0 ? (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            {searchQuery ? 'No additional works match your search criteria' : 'No additional works found for this project'}
          </div>
        ) : (
          filteredWorks.map((work) => (
            <div key={work.id} className="p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    {work.title}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDisplayDate(work.created_at)}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => onEdit(work)}
                    className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-1"
                    title="Edit"
                  >
                    <Pencil className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => onGeneratePDF(work)}
                    disabled={generatingPdfId === work.id}
                    className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 disabled:opacity-50 p-1"
                    title="View PDF"
                  >
                    {generatingPdfId === work.id ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <FileText className="h-5 w-5" />
                    )}
                  </button>
                  <button
                    onClick={() => onDelete(work)}
                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1"
                    title="Delete"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Amount:</span>
                  <span className="ml-1 text-gray-900 dark:text-white">
                    {formatCurrency(work.agreed_amount)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Agreed With:</span>
                  <span className="ml-1 text-gray-900 dark:text-white">
                    {work.agreed_with}
                  </span>
                </div>
              </div>
              <div className="text-sm">
                <span className="text-gray-500 dark:text-gray-400">Description:</span>
                <p className="mt-1 text-gray-900 dark:text-white">{work.description}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
      {renderDesktopTable()}
      {renderMobileCards()}
    </div>
  );
};

export default AdditionalWorkTable;
