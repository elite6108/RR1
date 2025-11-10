import React from 'react';
import type { RAMSFormData } from '../../../../../types/rams';

interface DescriptionOfWorksProps {
  data: RAMSFormData;
  onChange: (data: Partial<RAMSFormData>) => void;
}

export function DescriptionOfWorks({ data, onChange }: DescriptionOfWorksProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Description of Works</h3>
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          Description *
        </label>
        <textarea
          id="description"
          value={data.description || ''}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
            console.log('Description onChange:', { 
              value: e.target.value, 
              length: e.target.value.length,
              trimmed: e.target.value.trim(),
              trimmedLength: e.target.value.trim().length
            });
            onChange({ description: e.target.value });
          }}
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
    </div>
  );
}