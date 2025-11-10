import React from 'react';
import { Eye, Pencil, FileText, Trash2 } from 'lucide-react';
import { SiteSurvey } from '../types';
import { handleGeneratePDF } from '../utils';

interface SiteSurveyCardListProps {
  surveys: SiteSurvey[];
  searchQuery: string;
  onView: (survey: SiteSurvey) => void;
  onEdit: (survey: SiteSurvey) => void;
  onDelete: (survey: SiteSurvey) => void;
}

export const SiteSurveyCardList: React.FC<SiteSurveyCardListProps> = ({
  surveys,
  searchQuery,
  onView,
  onEdit,
  onDelete
}) => {
  return (
    <div className="md:hidden">
      {surveys.length === 0 ? (
        <div className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
          {searchQuery ? 'No site surveys match your search criteria' : 'No site surveys found for this project'}
        </div>
      ) : (
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {surveys.map((survey) => (
            <div key={survey.id} className="p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {survey.customer_name || survey.customer_id || 'N/A'}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {survey.created_at ? new Date(survey.created_at).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => onView(survey)}
                    className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                    title="View Site Survey Details"
                  >
                    <Eye className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => onEdit(survey)}
                    className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                    title="Edit Site Survey"
                  >
                    <Pencil className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleGeneratePDF(survey)}
                    className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                    title="View PDF"
                  >
                    <FileText className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => onDelete(survey)}
                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                    title="Delete Site Survey"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="font-medium text-gray-500 dark:text-gray-400">Project:</span>
                  <p className="text-gray-900 dark:text-white">{survey.project_name || 'N/A'}</p>
                </div>
                {survey.full_address && (
                  <div className="col-span-2">
                    <span className="font-medium text-gray-500 dark:text-gray-400">Address:</span>
                    <p className="text-gray-900 dark:text-white">{survey.full_address}</p>
                  </div>
                )}
                {survey.site_contact && (
                  <div className="col-span-2">
                    <span className="font-medium text-gray-500 dark:text-gray-400">Site Contact:</span>
                    <p className="text-gray-900 dark:text-white">{survey.site_contact}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
