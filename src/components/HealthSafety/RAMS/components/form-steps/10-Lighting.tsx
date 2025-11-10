import React from 'react';
import type { RAMSFormData } from '../../../../../types/rams';
import { RAMS_DEFAULTS } from '../../../../../types/rams';

interface LightingProps {
  data: RAMSFormData;
  onChange: (data: Partial<RAMSFormData>) => void;
}

export function Lighting({ data, onChange }: LightingProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Lighting</h3>
      
      <div>
        <label htmlFor="lighting" className="block text-sm font-medium text-gray-700 mb-2">
          Lighting Information *
        </label>
        <textarea
          id="lighting"
          value={data.lighting || RAMS_DEFAULTS.LIGHTING}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onChange({ lighting: e.target.value })}
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
    </div>
  );
}