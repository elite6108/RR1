import React from 'react';
import type { CPPFormData } from '../../../../../types/cpp';

interface Step12RescuePlanProps {
  data: CPPFormData;
  onChange: (data: Partial<CPPFormData>) => void;
}

export function Step12RescuePlan({ data, onChange }: Step12RescuePlanProps) {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange({
      rescuePlan: {
        ...data.rescuePlan,
        arrangements: e.target.value
      }
    });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Rescue Plan</h3>
      
      <div>
        <label htmlFor="arrangements" className="block text-sm font-medium text-gray-700 mb-2">
          What are the rescue plan arrangements for this site?
        </label>
        <textarea
          id="arrangements"
          rows={6}
          value={data.rescuePlan.arrangements || ''}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Describe the rescue plan arrangements..."
        />
      </div>
    </div>
  );
}