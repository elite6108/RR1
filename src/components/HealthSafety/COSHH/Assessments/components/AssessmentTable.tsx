import React from 'react';
import { Pencil, Trash2, FileText } from 'lucide-react';
import { CoshhAssessment } from '../types';

interface AssessmentTableProps {
  assessments: CoshhAssessment[];
  loading: boolean;
  onEdit: (assessment: CoshhAssessment) => void;
  onDelete: (assessment: CoshhAssessment) => void;
  onDownloadPDF: (assessment: CoshhAssessment) => void;
  onExport: (assessment: CoshhAssessment) => void;
  downloadingPDF: boolean;
}

export const AssessmentTable: React.FC<AssessmentTableProps> = ({
  assessments,
  loading,
  onEdit,
  onDelete,
  onDownloadPDF,
  onExport,
  downloadingPDF
}) => {
  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="p-6 text-center text-gray-500 dark:text-gray-400">
          Loading assessments...
        </div>
      </div>
    );
  }

  if (assessments.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="p-6 text-center text-gray-500 dark:text-gray-400">
          No assessments found. Click "Add Assessment" to get started.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      {/* Desktop Table View */}
      <div className="hidden lg:block">
        <table className="w-full min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Substance Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                COSHH Reference
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Assessment Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Review Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Assessor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                  Loading...
                </td>
              </tr>
            ) : assessments.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                  No assessments found. Click "Add Assessment" to get started.
                </td>
              </tr>
            ) : (
              assessments.map((assessment) => (
                <tr 
                  key={assessment.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                  onClick={() => onEdit(assessment)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {assessment.substance_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {assessment.coshh_reference}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {assessment.assessment_date ? new Date(assessment.assessment_date).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {assessment.review_date ? new Date(assessment.review_date).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {assessment.assessor_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <div className="flex justify-end space-x-4">
                      <button
                        onClick={(e: React.MouseEvent) => {
                          e.stopPropagation();
                          onEdit(assessment);
                        }}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        title="Edit"
                      >
                        <Pencil className="h-5 w-5" />
                      </button>
                      <button
                        onClick={(e: React.MouseEvent) => {
                          e.stopPropagation();
                          onDownloadPDF(assessment);
                        }}
                        disabled={downloadingPDF}
                        className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 disabled:opacity-50"
                        title={downloadingPDF ? "Generating PDF..." : "View PDF"}
                      >
                        <FileText className="h-5 w-5" />
                      </button>
                      <button
                        onClick={(e: React.MouseEvent) => {
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
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden">
        {loading ? (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
            Loading...
          </div>
        ) : assessments.length === 0 ? (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
            No assessments found. Click "Add Assessment" to get started.
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {assessments.map((assessment) => (
              <div key={assessment.id} className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm mx-4 my-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">
                      {assessment.substance_name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {assessment.coshh_reference}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onEdit(assessment)}
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-1 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                      title="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDownloadPDF(assessment)}
                      disabled={downloadingPDF}
                      className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 p-1 hover:bg-green-50 dark:hover:bg-green-900/20 rounded disabled:opacity-50"
                      title={downloadingPDF ? "Generating PDF..." : "View PDF"}
                    >
                      <FileText className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDelete(assessment)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mb-4">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400 font-medium">Assessment Date:</span>
                    <p className="text-gray-900 dark:text-white mt-1">
                      {assessment.assessment_date ? new Date(assessment.assessment_date).toLocaleDateString() : '-'}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400 font-medium">Review Date:</span>
                    <p className="text-gray-900 dark:text-white mt-1">
                      {assessment.review_date ? new Date(assessment.review_date).toLocaleDateString() : '-'}
                    </p>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-gray-500 dark:text-gray-400 font-medium">Assessor:</span>
                    <p className="text-gray-900 dark:text-white mt-1">{assessment.assessor_name}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
