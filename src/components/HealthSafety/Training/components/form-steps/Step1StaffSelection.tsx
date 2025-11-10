import React from 'react';
import type { FormStepProps } from '../../types';
import { INPUT_CLASS_NAME } from '../../utils/constants';

export function Step1StaffSelection({ 
  selectedStaff = '', 
  setSelectedStaff, 
  combinedStaffUsers = [], 
  editData 
}: FormStepProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">Select Staff *</h3>
      {editData ? (
        // Show read-only staff info when editing
        <div className="space-y-3">
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Staff Name *</label>
                <p className="text-sm text-gray-900 dark:text-white font-medium">{editData.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Position</label>
                <p className="text-sm text-gray-900 dark:text-white">{editData.position}</p>
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Note: Staff member cannot be changed when editing. Create a new entry to assign training to a different staff member.
          </p>
        </div>
      ) : (
        // Show dropdown when adding new
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Person *</label>
          <select
            value={selectedStaff}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedStaff?.(e.target.value)}
            className={INPUT_CLASS_NAME}
          >
            <option value="">Select a person</option>
            {combinedStaffUsers.map((member) => (
              <option key={member.name} value={member.name}>
                {member.name} - {member.position || member.company || 'N/A'} ({member.type})
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}