import React from 'react';
import { Pencil, FileText, Trash2, Loader2 } from 'lucide-react';
import { formatChecklistDate, formatChecklistFrequency, formatChecklistStatus } from '../utils/checklistHelpers';
import type { VehicleChecklist } from '../../shared/types';

interface ChecklistDesktopTableProps {
  checklists: VehicleChecklist[];
  generatingPdfId: string | null;
  onEditChecklist: (checklist: VehicleChecklist) => void;
  onViewPDF: (checklist: VehicleChecklist) => void;
  onDeleteChecklist: (checklist: VehicleChecklist) => void;
}

export const ChecklistDesktopTable = ({
  checklists,
  generatingPdfId,
  onEditChecklist,
  onViewPDF,
  onDeleteChecklist
}: ChecklistDesktopTableProps) => {
  return (
    <div className="hidden lg:block overflow-hidden rounded-lg">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead>
          <tr className="bg-gray-50 dark:bg-gray-700">
            <th scope="col" className="py-3 px-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider first:rounded-tl-lg">
              Date
            </th>
            <th scope="col" className="py-3 px-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Frequency
            </th>
            <th scope="col" className="py-3 px-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Created By
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
          {checklists.map((checklist, index) => (
            <tr key={checklist.id} className={index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700'}>
              <td className="py-2 px-3 text-sm text-gray-500 dark:text-gray-400 first:rounded-bl-lg">
                {formatChecklistDate(checklist.check_date)}
              </td>
              <td className="py-2 px-3 text-sm text-gray-500 dark:text-gray-400">
                {formatChecklistFrequency(checklist.frequency)}
              </td>
              <td className="py-2 px-3 text-sm text-gray-500 dark:text-gray-400">
                {checklist.created_by_name}
              </td>
              <td className="py-2 px-3 text-sm">
                <span className={checklist.status === 'pass' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                  {formatChecklistStatus(checklist.status)}
                </span>
              </td>
              <td className="py-2 px-3 text-right text-sm font-medium last:rounded-br-lg">
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => onEditChecklist(checklist)}
                    className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                    title="Edit"
                  >
                    <Pencil className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => onViewPDF(checklist)}
                    disabled={generatingPdfId === checklist.id}
                    className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 disabled:opacity-50"
                    title="View PDF"
                  >
                    {generatingPdfId === checklist.id ? (
                      <Loader2 className="h-5 w-5 animate-spin text-green-600" />
                    ) : (
                      <FileText className="h-5 w-5" />
                    )}
                  </button>
                  <button
                    onClick={() => onDeleteChecklist(checklist)}
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
};
