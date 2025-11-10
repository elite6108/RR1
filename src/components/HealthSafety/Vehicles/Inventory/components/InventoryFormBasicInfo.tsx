import React from 'react';
import type { InventoryFormBasicInfoProps } from '../types/formTypes';

export const InventoryFormBasicInfo: React.FC<InventoryFormBasicInfoProps> = ({
  checkedBy,
  notes,
  onCheckedByChange,
  onNotesChange
}) => {
  return (
    <>
      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Checked By*
          </label>
          <input
            type="text"
            value={checkedBy}
            onChange={(e) => onCheckedByChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Check Date
          </label>
          <input
            type="text"
            value={new Date().toLocaleDateString()}
            disabled
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-400"
          />
        </div>
      </div>

      {/* General Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          General Notes <span className="text-gray-400 text-xs">(optional)</span>
        </label>
        <textarea
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
          rows={2}
          placeholder="Add any general notes about the inventory check..."
        />
      </div>
    </>
  );
};
