import React from 'react';
import type { CPPFormData } from '../../../../../types/cpp';

interface Step9SiteInductionProps {
  data: CPPFormData;
  onChange: (data: Partial<CPPFormData>) => void;
}

export function Step9SiteInduction({ data, onChange }: Step9SiteInductionProps) {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange({
      siteInduction: {
        ...data.siteInduction,
        arrangements: e.target.value
      }
    });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Site Induction</h3>
      
      <div>
        <label htmlFor="arrangements" className="block text-sm font-medium text-gray-700 mb-2">
          What are the arrangements for site induction?
        </label>
        <textarea
          id="arrangements"
          rows={6}
          value={data.siteInduction.arrangements || ''}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Describe the site induction arrangements..."
        />
      </div>
    </div>
  );
}