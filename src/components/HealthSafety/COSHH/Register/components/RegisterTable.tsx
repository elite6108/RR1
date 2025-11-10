import React from 'react';
import { Pencil, Trash2, FileCheck } from 'lucide-react';
import { CoshhSubstance } from '../types';

interface RegisterTableProps {
  substances: CoshhSubstance[];
  loading: boolean;
  onEdit: (substance: CoshhSubstance) => void;
  onReview: (substance: CoshhSubstance) => void;
  onDelete: (substance: CoshhSubstance) => void;
  normalizeCategories: (category: string | string[]) => string[];
}

export const RegisterTable: React.FC<RegisterTableProps> = ({
  substances,
  loading,
  onEdit,
  onReview,
  onDelete,
  normalizeCategories
}) => {
  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="p-6 text-center text-gray-500 dark:text-gray-400">
          Loading...
        </div>
      </div>
    );
  }

  if (substances.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="p-6 text-center text-gray-500 dark:text-gray-400">
          No substances found. Click "Add Substance" to get started.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      {/* Desktop Table View */}
      <div className="hidden lg:block">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Substance Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Manufacturer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Storage Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Date Added
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Reviewed On
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Next Review Due
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {substances.map((substance) => (
              <tr 
                key={substance.id} 
                className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                onClick={() => onEdit(substance)}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  {substance.substance_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {substance.manufacturer}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                  <div className="flex flex-wrap gap-1">
                    {normalizeCategories(substance.category).map((cat, index) => (
                      <span 
                        key={index} 
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {substance.storage_location}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {substance.added_date ? new Date(substance.added_date).toLocaleDateString() : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {substance.reviewed_date ? new Date(substance.reviewed_date).toLocaleDateString() : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {substance.review_date ? new Date(substance.review_date).toLocaleDateString() : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(substance);
                      }}
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-1"
                      title="Edit"
                    >
                      <Pencil className="h-5 w-5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onReview(substance);
                      }}
                      className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 p-1"
                      title="Review"
                    >
                      <FileCheck className="h-5 w-5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(substance);
                      }}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1"
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

      {/* Mobile Card View */}
      <div className="lg:hidden">
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {substances.map((substance) => (
            <div 
              key={substance.id} 
              className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm mx-4 my-4 cursor-pointer"
              onClick={() => onEdit(substance)}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">
                    {substance.substance_name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {substance.manufacturer}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(substance);
                    }}
                    className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-1 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                    title="Edit"
                  >
                    <Pencil className="h-5 w-5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onReview(substance);
                    }}
                    className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 p-1 hover:bg-green-50 dark:hover:bg-green-900/20 rounded"
                    title="Review"
                  >
                    <FileCheck className="h-5 w-5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(substance);
                    }}
                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                    title="Delete"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mb-4">
                <div>
                  <span className="text-gray-500 dark:text-gray-400 font-medium">Categories:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {normalizeCategories(substance.category).map((cat, index) => (
                      <span 
                        key={index} 
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400 font-medium">Storage:</span>
                  <p className="text-gray-900 dark:text-white mt-1">{substance.storage_location}</p>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400 font-medium">Added:</span>
                  <p className="text-gray-900 dark:text-white mt-1">
                    {substance.added_date ? new Date(substance.added_date).toLocaleDateString() : '-'}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400 font-medium">Next Review:</span>
                  <p className="text-gray-900 dark:text-white mt-1">
                    {substance.review_date ? new Date(substance.review_date).toLocaleDateString() : '-'}
                  </p>
                </div>
              </div>
              
              {substance.reviewed_date && (
                <div className="text-sm border-t border-gray-200 dark:border-gray-600 pt-3">
                  <span className="text-gray-500 dark:text-gray-400 font-medium">Last Reviewed:</span>
                  <p className="text-gray-900 dark:text-white mt-1">
                    {new Date(substance.reviewed_date).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
