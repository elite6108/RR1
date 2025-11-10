import React from 'react';
import { Eye, Pencil, FileText, Trash2, Loader2 } from 'lucide-react';
import type { SurveyCardProps } from '../types';

export function SurveyCard({ 
  survey, 
  generatingPdfId,
  onView, 
  onEdit, 
  onGeneratePDF, 
  onDelete,
  getCustomerName,
  getProjectName,
  formatDate
}: SurveyCardProps) {
  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-gray-200 dark:border-gray-700 cursor-pointer"
      onClick={() => onEdit(survey)}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">
            {survey.survey_id || survey.id}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Created {formatDate(survey.created_at)}
          </p>
        </div>
      </div>
      <div className="space-y-2 text-sm mb-4">
        <div className="flex justify-between">
          <span className="text-gray-500 dark:text-gray-400">Customer:</span>
          <span className="text-gray-900 dark:text-white text-right">
            {getCustomerName(survey.customer_id)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500 dark:text-gray-400">Project:</span>
          <span className="text-gray-900 dark:text-white text-right">
            {getProjectName(survey.project_id)}
          </span>
        </div>
        {survey.location_what3words && (
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">Location:</span>
            <span className="text-gray-900 dark:text-white text-right">
              {survey.location_what3words}
            </span>
          </div>
        )}
        {survey.site_contact && (
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">Site Contact:</span>
            <span className="text-gray-900 dark:text-white text-right">
              {survey.site_contact}
            </span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-2 pt-3 border-t border-gray-200 dark:border-gray-600">
        <button
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            onView(survey);
          }}
          className="p-2 text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-md"
          title="View Survey Details"
        >
          <Eye className="h-4 w-4" />
        </button>
        <button
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            onEdit(survey);
          }}
          className="p-2 text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md"
          title="Edit Survey"
        >
          <Pencil className="h-4 w-4" />
        </button>
        <button
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            onGeneratePDF(survey);
          }}
          disabled={generatingPdfId === survey.id}
          className="p-2 text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-md disabled:opacity-50"
          title="View PDF"
        >
          {generatingPdfId === survey.id ? (
            <Loader2 className="h-4 w-4 animate-spin text-green-600" />
          ) : (
            <FileText className="h-4 w-4" />
          )}
        </button>
        <button
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            onDelete(survey);
          }}
          className="p-2 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md"
          title="Delete Survey"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}