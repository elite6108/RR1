import React from 'react';
import type { RAMSFormData } from '../../../../../types/rams';
import { RAMS_DEFAULTS } from '../../../../../types/rams';

interface StabilityAndPermitsProps {
  data: RAMSFormData;
  onChange: (data: Partial<RAMSFormData>) => void;
}

export function StabilityAndPermits({ data, onChange }: StabilityAndPermitsProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Stability and Special Permits</h3>
      
      <div>
        <label htmlFor="stability" className="block text-sm font-medium text-gray-700 mb-2">
          Stability *
        </label>
        <textarea
          id="stability"
          value={data.stability || RAMS_DEFAULTS.STABILITY}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onChange({ stability: e.target.value })}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="special_permits" className="block text-sm font-medium text-gray-700 mb-2">
          Special Permits *
        </label>
        <textarea
          id="special_permits"
          value={data.special_permits || RAMS_DEFAULTS.SPECIAL_PERMITS}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onChange({ special_permits: e.target.value })}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
    </div>
  );
}