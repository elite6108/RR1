import React from 'react';
import { HelpCircle } from 'lucide-react';
import { YesNoQuestionProps } from '../../types';

export function YesNoQuestion({ label, value, onChange, tip }: YesNoQuestionProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label} *</label>
      <div className="flex space-x-4">
        <button
          type="button"
          onClick={() => onChange(true)}
          className={`px-4 py-2 rounded-md ${
            value === true
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          Yes
        </button>
        <button
          type="button"
          onClick={() => onChange(false)}
          className={`px-4 py-2 rounded-md ${
            value === false
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          No
        </button>
      </div>
      {tip && (
        <div className="flex items-start mt-2 text-sm text-gray-500">
          <HelpCircle className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
          <span>{tip}</span>
        </div>
      )}
    </div>
  );
}
