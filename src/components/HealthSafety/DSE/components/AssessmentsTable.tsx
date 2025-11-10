import React from 'react';
import { Eye } from 'lucide-react';
import { AssessmentsTableProps } from '../types';
import { formatDate } from '../utils/constants';

export function AssessmentsTable({
  assessments,
  isAdminView,
  onViewAssessment,
  generatingPDF,
  loading
}: AssessmentsTableProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden lg:block">
        <div className="bg-white shadow-lg overflow-hidden sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Profile Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submitted Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Next Due
                </th>
                {isAdminView && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {assessments.map((assessment) => (
                <tr key={assessment.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {assessment.full_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(assessment.submitted_date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(assessment.next_due_date)}
                  </td>
                  {isAdminView && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => onViewAssessment(assessment)}
                        disabled={generatingPDF}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                      >
                        {generatingPDF ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                          <>
                            <Eye className="h-4 w-4 mr-1" />
                            View PDF
                          </>
                        )}
                      </button>
                    </td>
                  )}
                </tr>
              ))}
              {assessments.length === 0 && (
                <tr>
                  <td
                    colSpan={isAdminView ? 4 : 3}
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    No DSE assessments found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile/Tablet Cards */}
      <div className="lg:hidden">
        <div className="space-y-4">
          {assessments.map((assessment) => (
            <div 
              key={assessment.id}
              className="bg-white rounded-lg shadow-md p-4 border border-gray-200"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-indigo-600">
                    {assessment.full_name}
                  </h4>
                </div>
              </div>
              
              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-500">Submitted Date:</span>
                  <span className="text-gray-900">{formatDate(assessment.submitted_date)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Next Due:</span>
                  <span className="text-gray-900">{formatDate(assessment.next_due_date)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              {isAdminView && (
                <div className="flex justify-end pt-3 border-t border-gray-200">
                  <button
                    onClick={() => onViewAssessment(assessment)}
                    disabled={generatingPDF}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                  >
                    {generatingPDF ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <Eye className="h-4 w-4 mr-1" />
                        View PDF
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          ))}
          {assessments.length === 0 && (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <p className="text-gray-500">No DSE assessments found</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
