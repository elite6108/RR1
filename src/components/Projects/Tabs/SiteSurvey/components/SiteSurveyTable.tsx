import React from 'react';
import { Eye, Pencil, FileText, Trash2 } from 'lucide-react';
import { SiteSurvey } from '../types';
import { handleGeneratePDF } from '../utils';

interface SiteSurveyTableProps {
  surveys: SiteSurvey[];
  searchQuery: string;
  onView: (survey: SiteSurvey) => void;
  onEdit: (survey: SiteSurvey) => void;
  onDelete: (survey: SiteSurvey) => void;
}

export const SiteSurveyTable: React.FC<SiteSurveyTableProps> = ({
  surveys,
  searchQuery,
  onView,
  onEdit,
  onDelete
}) => {
  return (
    <div className="hidden md:block overflow-x-auto">
      <div className="inline-block min-w-full align-middle">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Created Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Customer ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Project
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {surveys.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                  {searchQuery ? 'No site surveys match your search criteria' : 'No site surveys found for this project'}
                </td>
              </tr>
            ) : (
              surveys.map((survey) => (
                <tr key={survey.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {survey.created_at ? new Date(survey.created_at).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {survey.customer_name || survey.customer_id || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                    {survey.project_name || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => onView(survey)}
                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 p-1 mr-2"
                        title="View Site Survey Details"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => onEdit(survey)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-1 mr-2"
                        title="Edit Site Survey"
                      >
                        <Pencil className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleGeneratePDF(survey)}
                        className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 p-1 mr-2"
                        title="View PDF"
                      >
                        <FileText className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => onDelete(survey)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1"
                        title="Delete Site Survey"
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
};
