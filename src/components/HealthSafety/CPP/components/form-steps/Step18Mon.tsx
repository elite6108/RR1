import React from 'react';
import type { CPPFormData } from '../../../../../types/cpp';

interface Step18MonProps {
  data: CPPFormData;
  onChange: (data: Partial<CPPFormData>) => void;
}

const REVIEW_FREQUENCIES = ['Weekly', 'Fortnightly', 'Monthly'] as const;

export function Step18Mon({ data, onChange }: Step18MonProps) {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onChange({
      monitoring: {
        ...data.monitoring,
        [name]: value
      }
    });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Monitoring & Review</h3>
      
      <div>
        <label htmlFor="riskArrangements" className="block text-sm font-medium text-gray-700 mb-2">
          What are the arrangements for monitoring and reviewing the effectiveness of the plan for addressing risk?
        </label>
        <textarea
          id="riskArrangements"
          name="riskArrangements"
          rows={4}
          value={data.monitoring.riskArrangements || ''}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="cooperation" className="block text-sm font-medium text-gray-700 mb-2">
          How does the PC co-operate with the contractors to ensure the plan remains fit for purpose through the construction phase?
        </label>
        <textarea
          id="cooperation"
          name="cooperation"
          rows={4}
          value={data.monitoring.cooperation || ''}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="siteReviewFrequency" className="block text-sm font-medium text-gray-700 mb-2">
            How often will you conduct site reviews on this job?
          </label>
          <select
            id="siteReviewFrequency"
            name="siteReviewFrequency"
            value={data.monitoring.siteReviewFrequency || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Select frequency</option>
            {REVIEW_FREQUENCIES.map(frequency => (
              <option key={frequency} value={frequency}>{frequency}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="toolboxTalkFrequency" className="block text-sm font-medium text-gray-700 mb-2">
            How often will you conduct workplace toolbox talks on this job?
          </label>
          <select
            id="toolboxTalkFrequency"
            name="toolboxTalkFrequency"
            value={data.monitoring.toolboxTalkFrequency || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Select frequency</option>
            {REVIEW_FREQUENCIES.map(frequency => (
              <option key={frequency} value={frequency}>{frequency}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}