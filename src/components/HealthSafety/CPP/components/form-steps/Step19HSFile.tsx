import React from 'react';
import type { CPPFormData } from '../../../../../types/cpp';

interface Step19HSFileProps {
  data: CPPFormData;
  onChange: (data: Partial<CPPFormData>) => void;
}

export function Step19HSFile({ data, onChange }: Step19HSFileProps) {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onChange({
      hsFile: {
        ...data.hsFile,
        [name]: value
      }
    });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Health & Safety File</h3>
      
      <div>
        <label htmlFor="arrangements" className="block text-sm font-medium text-gray-700 mb-2">
          Arrangements for collecting and collating information
        </label>
        <textarea
          id="arrangements"
          name="arrangements"
          rows={4}
          value={data.hsFile.arrangements || ''}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="storage" className="block text-sm font-medium text-gray-700 mb-2">
          Storage of information
        </label>
        <textarea
          id="storage"
          name="storage"
          rows={4}
          value={data.hsFile.storage || ''}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
    </div>
  );
}