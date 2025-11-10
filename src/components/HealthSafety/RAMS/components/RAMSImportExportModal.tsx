import React from 'react';
import { createPortal } from 'react-dom';
import { X, FileText, Plus } from 'lucide-react';
import type { RAMS } from '../../../../types/database';

interface RAMSImportExportModalProps {
  show: boolean;
  onClose: () => void;
  mode: 'export' | 'import';
  onModeChange: (mode: 'export' | 'import') => void;
  ramsEntries: RAMS[];
  selectedForExport: string | null;
  onExportSelectionChange: (id: string) => void;
  onExport: () => void;
  onImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function RAMSImportExportModal({
  show,
  onClose,
  mode,
  onModeChange,
  ramsEntries,
  selectedForExport,
  onExportSelectionChange,
  onExport,
  onImport
}: RAMSImportExportModalProps) {
  if (!show) return null;

  return createPortal(
    <>
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 dark:bg-gray-900 dark:bg-opacity-50 z-50"></div>
      <div className="fixed inset-0 overflow-y-auto flex items-center justify-center z-50 min-h-screen">
        <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full m-4 my-8">
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Import - Export RAMS
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="p-6">
            {/* Mode Selection */}
            <div className="flex space-x-4 mb-6">
              <button
                onClick={() => onModeChange('export')}
                className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                  mode === 'export'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <FileText className="h-4 w-4 inline mr-2" />
                Export
              </button>
              <button
                onClick={() => onModeChange('import')}
                className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                  mode === 'import'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <Plus className="h-4 w-4 inline mr-2" />
                Import
              </button>
            </div>

            {/* Export Mode */}
            {mode === 'export' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Select RAMS to Export
                  </label>
                  <select
                    value={selectedForExport || ''}
                    onChange={(e) => onExportSelectionChange(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                  >
                    <option value="">Select a RAMS...</option>
                    {ramsEntries.map((rams) => (
                      <option key={rams.id} value={rams.id}>
                        {rams.rams_number} - {rams.reference}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  * Exports all editable fields including reference and form data. RAMS number will be auto-generated on import.
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={onExport}
                    disabled={!selectedForExport}
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FileText className="h-4 w-4 inline mr-2" />
                    Export
                  </button>
                </div>
              </div>
            )}

            {/* Import Mode */}
            {mode === 'import' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Select File to Import
                  </label>
                  <input
                    type="file"
                    accept=".json"
                    onChange={onImport}
                    className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 dark:file:bg-indigo-900 dark:file:text-indigo-300 dark:hover:file:bg-indigo-800"
                  />
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  * Import will create a new RAMS with a new RAMS number. Select a JSON file exported from this system.
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}
