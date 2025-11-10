import React from 'react';
import { Pencil, FileText, Trash2, Loader2 } from 'lucide-react';
import { formatChecklistDate, formatChecklistFrequency, formatChecklistStatus } from '../utils/checklistHelpers';
import type { VehicleChecklist } from '../../shared/types';

interface ChecklistMobileCardsProps {
  checklists: VehicleChecklist[];
  generatingPdfId: string | null;
  onEditChecklist: (checklist: VehicleChecklist) => void;
  onViewPDF: (checklist: VehicleChecklist) => void;
  onDeleteChecklist: (checklist: VehicleChecklist) => void;
}

export const ChecklistMobileCards: React.FC<ChecklistMobileCardsProps> = ({
  checklists,
  generatingPdfId,
  onEditChecklist,
  onViewPDF,
  onDeleteChecklist
}) => {
  return (
    <div className="lg:hidden space-y-4">
      {checklists.map((checklist) => (
        <div 
          key={checklist.id}
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => onEditChecklist(checklist)}
        >
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">
                {formatChecklistDate(checklist.check_date)}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {formatChecklistFrequency(checklist.frequency)} Check
              </p>
            </div>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              checklist.status === 'pass' 
                ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
            }`}>
              {formatChecklistStatus(checklist.status)}
            </span>
          </div>
          
          <div className="space-y-2 text-sm mb-4">
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Created By:</span>
              <span className="text-gray-900 dark:text-white">
                {checklist.created_by_name}
              </span>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-3 border-t border-gray-200 dark:border-gray-600">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEditChecklist(checklist);
              }}
              className="flex items-center px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"
              title="Edit"
            >
              <Pencil className="h-4 w-4 mr-1" />
              Edit
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewPDF(checklist);
              }}
              disabled={generatingPdfId === checklist.id}
              className="flex items-center px-3 py-2 text-sm font-medium text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-md transition-colors disabled:opacity-50"
              title="View PDF"
            >
              {generatingPdfId === checklist.id ? (
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              ) : (
                <FileText className="h-4 w-4 mr-1" />
              )}
              PDF
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteChecklist(checklist);
              }}
              className="flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
              title="Delete"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
