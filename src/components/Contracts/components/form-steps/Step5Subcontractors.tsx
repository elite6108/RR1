import React from 'react';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import type { SubcontractorFormProps } from '../../types';

export function Step5Subcontractors({
  selectedSubcontractors,
  subcontractors,
  expandedSubcontractors,
  onAddSubcontractor,
  onRemoveSubcontractor,
  onUpdateSubcontractor,
  onToggleSubcontractor
}: SubcontractorFormProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Subcontractors <span className="text-gray-400 text-xs">(optional)</span>
        </h3>
        <button
          type="button"
          onClick={onAddSubcontractor}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Add Subcontractor
        </button>
      </div>

      <div className="max-h-[60vh] overflow-y-auto pr-2 space-y-4">
        {selectedSubcontractors.map((subcontractor, index) => (
          <div key={index} className="border border-gray-200 rounded-md p-4">
            <div
              className="flex justify-between items-center mb-4 cursor-pointer"
              onClick={() => onToggleSubcontractor(index)}
            >
              <h4 className="text-md font-medium text-gray-700 dark:text-gray-300">
                Subcontractor {subcontractor.subcontractor_id ? 
                  subcontractors.find(sub => sub.id === subcontractor.subcontractor_id)?.company_name : 
                  index + 1}
              </h4>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveSubcontractor(index);
                  }}
                  className="text-red-600 hover:text-red-700"
                >
                  <X className="h-5 w-5" />
                </button>
                {expandedSubcontractors.includes(index) ? (
                  <ChevronUp className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                )}
              </div>
            </div>

            {expandedSubcontractors.includes(index) && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Select Subcontractor <span className="text-gray-400 text-xs">(optional)</span>
                  </label>
                  <select
                    value={subcontractor.subcontractor_id}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                      onUpdateSubcontractor(
                        index,
                        'subcontractor_id',
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Select a subcontractor...</option>
                    {subcontractors.map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        {sub.company_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Manager <span className="text-gray-400 text-xs">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={subcontractor.manager}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      onUpdateSubcontractor(index, 'manager', e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter manager name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Responsibilities <span className="text-gray-400 text-xs">(optional)</span>
                  </label>
                  <textarea
                    value={subcontractor.responsibilities}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      onUpdateSubcontractor(
                        index,
                        'responsibilities',
                        e.target.value
                      )
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter responsibilities..."
                  />
                </div>
              </div>
            )}
          </div>
        ))}

        {selectedSubcontractors.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No subcontractors added yet. Click "Add Subcontractor" to add one.
          </div>
        )}
      </div>
    </div>
  );
}