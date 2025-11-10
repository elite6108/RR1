import React from 'react';
import { ChevronUp, ChevronDown, Pencil, FileText, Trash2, Loader2 } from 'lucide-react';
import type { RiskAssessment } from '../../../../types/database';
import type { SortConfig } from '../types';
import { getReviewStatus } from '../utils/sortingUtils';

interface RiskAssessmentsTableProps {
  assessments: RiskAssessment[];
  sortConfig: SortConfig | null;
  onSort: (key: string) => void;
  onEdit: (assessment: RiskAssessment) => void;
  onViewPDF: (assessment: RiskAssessment) => void;
  onDelete: (assessment: RiskAssessment) => void;
  generatingPdfId: string | null;
}

export function RiskAssessmentsTable({
  assessments,
  sortConfig,
  onSort,
  onEdit,
  onViewPDF,
  onDelete,
  generatingPdfId
}: RiskAssessmentsTableProps) {
  return (
    <>
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-600">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th 
                  scope="col" 
                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white cursor-pointer first:rounded-tl-lg last:rounded-tr-lg"
                  onClick={() => onSort('ra_id')}
                >
                  <div className="flex items-center gap-2">
                    RA Number
                    {sortConfig?.key === 'ra_id' && (
                      sortConfig.direction === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white cursor-pointer"
                  onClick={() => onSort('name')}
                >
                  <div className="flex items-center gap-2">
                    Name
                    {sortConfig?.key === 'name' && (
                      sortConfig.direction === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white cursor-pointer"
                  onClick={() => onSort('created_at')}
                >
                  <div className="flex items-center gap-2">
                    Created
                    {sortConfig?.key === 'created_at' && (
                      sortConfig.direction === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white cursor-pointer"
                  onClick={() => onSort('review_date')}
                >
                  <div className="flex items-center gap-2">
                    Review Date
                    {sortConfig?.key === 'review_date' && (
                      sortConfig.direction === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white cursor-pointer"
                  onClick={() => onSort('status')}
                >
                  <div className="flex items-center gap-2">
                    Status
                    {sortConfig?.key === 'status' && (
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
              {assessments.map((assessment, index, array) => {
                const status = getReviewStatus(assessment.review_date);
                const isLastRow = index === array.length - 1;
                return (
                  <tr 
                    key={assessment.id} 
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer"
                    onClick={() => onEdit(assessment)}
                  >
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white first:rounded-bl-lg last:rounded-br-lg">
                      {assessment.ra_id}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {assessment.name}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {new Date(assessment.created_at).toLocaleDateString()}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {new Date(assessment.review_date).toLocaleDateString()}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${status.className}`}>
                        {status.text}
                      </span>
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium">
                      <div className="flex justify-end space-x-4">
                         <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit(assessment);
                          }}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          title="Edit"
                        >
                          <Pencil className="h-5 w-5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onViewPDF(assessment);
                          }}
                          disabled={generatingPdfId === assessment.id}
                          className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 disabled:opacity-50"
                          title="View PDF"
                        >
                          {generatingPdfId === assessment.id ? (
                            <Loader2 className="h-5 w-5 animate-spin text-green-600" />
                          ) : (
                            <FileText className="h-5 w-5" />
                          )}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(assessment);
                          }}
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
      </div>

      {/* Mobile/Tablet Cards */}
      <div className="lg:hidden">
        <div className="p-4 space-y-4">
          {assessments.map((assessment) => {
            const status = getReviewStatus(assessment.review_date);
            return (
              <div 
                key={assessment.id}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md p-4 cursor-pointer"
                onClick={() => onEdit(assessment)}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">
                      {assessment.ra_id}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {assessment.name}
                    </p>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.className}`}>
                    {status.text}
                  </span>
                </div>
                
                <div className="space-y-2 text-sm mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Created:</span>
                    <span className="text-gray-900 dark:text-white">
                      {new Date(assessment.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Review Date:</span>
                    <span className="text-gray-900 dark:text-white">
                      {new Date(assessment.review_date).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(assessment);
                    }}
                    className="flex items-center px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"
                    title="Edit"
                  >
                    <Pencil className="h-4 w-4 mr-1" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewPDF(assessment);
                    }}
                    disabled={generatingPdfId === assessment.id}
                    className="flex items-center px-3 py-2 text-sm font-medium text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-md transition-colors disabled:opacity-50"
                    title="View PDF"
                  >
                    {generatingPdfId === assessment.id ? (
                      <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                    ) : (
                      <FileText className="h-4 w-4 mr-1" />
                    )}
                    
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(assessment);
                    }}
                    className="flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
