import React from 'react';
import type { CPPFormData } from '../../../../../types/cpp';

interface Step5ManagementWorkProps {
  data: CPPFormData;
  onChange: (data: Partial<CPPFormData>) => void;
}

export function Step5ManagementWork({ data, onChange }: Step5ManagementWorkProps) {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange({
      managementWork: {
        ...data.managementWork,
        healthAndSafetyAims: e.target.value
      }
    });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Management of Work</h3>
      
      <div>
        <label htmlFor="healthAndSafetyAims" className="block text-sm font-medium text-gray-700 mb-2">
          What are the Health and Safety aims of this project?
        </label>
        <textarea
          id="healthAndSafetyAims"
          rows={6}
          value={data.managementWork.healthAndSafetyAims || ''}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Enter the health and safety aims for this project..."
        />
      </div>
    </div>
  );
}