import React from 'react';
import { Eye, FileText, Trash2 } from 'lucide-react';
import { CoshhMSDS } from '../types';

interface SafetySheetsTableProps {
  sheets: CoshhMSDS[];
  loading: boolean;
  onPreview: (sheet: CoshhMSDS) => void;
  onDownload: (sheet: CoshhMSDS) => void;
  onDelete: (sheet: CoshhMSDS) => void;
  formatFileSize: (bytes: number) => string;
}

export const SafetySheetsTable: React.FC<SafetySheetsTableProps> = ({
  sheets,
  loading,
  onPreview,
  onDownload,
  onDelete,
  formatFileSize
}) => {
  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg">
        <div className="p-6 text-center">
          <div className="text-gray-600 dark:text-gray-300">Loading MSDS sheets...</div>
        </div>
      </div>
    );
  }

  if (sheets.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg">
        <div className="p-6">
          <div className="text-center py-12">
            <FileText className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-500 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No MSDS Safety Sheets Found
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Get started by adding your first Material Safety Data Sheet
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg">
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Substance
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Manufacturer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                File Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                File Size
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Upload Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {sheets.map((sheet) => (
              <tr key={sheet.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  {sheet.substance_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {sheet.manufacturer}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {sheet.file_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {formatFileSize(sheet.file_size)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {new Date(sheet.upload_date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => onPreview(sheet)}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                      title="Preview"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDownload(sheet)}
                      className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                      title="Download"
                    >
                      <FileText className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDelete(sheet)}
                      className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile/Tablet Cards */}
      <div className="lg:hidden">
        <div className="p-4 space-y-4">
          {sheets.map((sheet) => (
            <div 
              key={sheet.id}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md p-4"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">
                    {sheet.substance_name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {sheet.manufacturer}
                  </p>
                </div>
              </div>
              
              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">File Name:</span>
                  <span className="text-gray-900 dark:text-white truncate ml-2">
                    {sheet.file_name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">File Size:</span>
                  <span className="text-gray-900 dark:text-white">
                    {formatFileSize(sheet.file_size)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Upload Date:</span>
                  <span className="text-gray-900 dark:text-white">
                    {new Date(sheet.upload_date).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                <button
                  onClick={() => onPreview(sheet)}
                  className="flex items-center px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"
                  title="Preview"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Preview
                </button>
                <button
                  onClick={() => onDownload(sheet)}
                  className="flex items-center px-3 py-2 text-sm font-medium text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-md transition-colors"
                  title="Download"
                >
                  <FileText className="h-4 w-4 mr-1" />
                  Download
                </button>
                <button
                  onClick={() => onDelete(sheet)}
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
      </div>
    </div>
  );
};
