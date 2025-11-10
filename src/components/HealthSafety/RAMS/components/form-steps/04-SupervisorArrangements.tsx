import React from 'react';
import type { RAMSFormData } from '../../../../../types/rams';
import { RAMS_DEFAULTS } from '../../../../../types/rams';

interface SupervisorArrangementsProps {
  data: RAMSFormData;
  onChange: (data: Partial<RAMSFormData>) => void;
}

export function SupervisorArrangements({ data, onChange }: SupervisorArrangementsProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Supervisor Arrangements</h3>
      
      <div>
        <label htmlFor="supervision" className="block text-sm font-medium text-gray-700 mb-2">
          Supervision Arrangements *
        </label>
        <textarea
          id="supervision"
          value={data.supervision || RAMS_DEFAULTS.SUPERVISION}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onChange({ supervision: e.target.value })}
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
    </div>
  );
}