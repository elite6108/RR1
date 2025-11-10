import React from 'react';
import { Eye, Pencil, FileText, Trash2, Loader2 } from 'lucide-react';
import type { SurveyTableProps } from '../types';

export function SurveyTable({ 
  surveys, 
  filteredSurveys, 
  loading, 
  error,
  generatingPdfId,
  onView, 
  onEdit, 
  onGeneratePDF, 
  onDelete,
  getCustomerName,
  getProjectName,
  formatDate
}: SurveyTableProps) {
  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow-lg overflow-hidden sm:rounded-lg">
        <div className="py-8 text-center text-gray-500 dark:text-gray-400">
          Loading site surveys...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow-lg overflow-hidden sm:rounded-lg">
        <div className="py-8 text-center text-red-500">
          Error: {error}
        </div>
      </div>
    );
  }

  if (filteredSurveys.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow-lg overflow-hidden sm:rounded-lg">
        <div className="py-8 text-center text-gray-500 dark:text-gray-400">
          No surveys found. Please create a new survey.
        </div>
      </div>
    );
  }

  return (
    <div className="hidden lg:block">
      <div className="bg-white dark:bg-gray-800 shadow-lg overflow-hidden sm:rounded-lg">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="sticky top-0 px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider bg-gray-50 dark:bg-gray-700">
                    Survey ID
                  </th>
                  <th className="sticky top-0 px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider bg-gray-50 dark:bg-gray-700">
                    Created At
                  </th>
                  <th className="sticky top-0 px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider bg-gray-50 dark:bg-gray-700">
                    Customer
                  </th>
                  <th className="sticky top-0 px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider bg-gray-50 dark:bg-gray-700">
                    Project
                  </th>
                  <th className="sticky top-0 px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider bg-gray-50 dark:bg-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredSurveys.map((survey) => (
                  <tr 
                    key={survey.id} 
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                    onClick={() => onEdit(survey)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {survey.survey_id || survey.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {formatDate(survey.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {getCustomerName(survey.customer_id)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {getProjectName(survey.project_id)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={(e: React.MouseEvent) => {
                          e.stopPropagation();
                          onView(survey);
                        }}
                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 p-1 mr-2"
                        aria-label="View"
                        title="View Survey Details"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      <button
                        onClick={(e: React.MouseEvent) => {
                          e.stopPropagation();
                          onEdit(survey);
                        }}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-1 mr-2"
                        aria-label="Edit"
                        title="Edit Survey"
                      >
                        <Pencil className="h-5 w-5" />
                      </button>
                      <button
                        onClick={(e: React.MouseEvent) => {
                          e.stopPropagation();
                          onGeneratePDF(survey);
                        }}
                        disabled={generatingPdfId === survey.id}
                        className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 p-1 mr-2 disabled:opacity-50"
                        title="View PDF"
                      >
                        {generatingPdfId === survey.id ? (
                          <Loader2 className="h-5 w-5 animate-spin text-green-600" />
                        ) : (
                          <FileText className="h-5 w-5" />
                        )}
                      </button>
                      <button
                        onClick={(e: React.MouseEvent) => {
                          e.stopPropagation();
                          onDelete(survey);
                        }}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1"
                        aria-label="Delete"
                        title="Delete Survey"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}