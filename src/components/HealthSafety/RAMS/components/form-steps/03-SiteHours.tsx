import React from 'react';
import type { RAMSFormData } from '../../../../../types/rams';
import { RAMS_DEFAULTS } from '../../../../../types/rams';

interface SiteHoursProps {
  data: RAMSFormData;
  onChange: (data: Partial<RAMSFormData>) => void;
}

export function SiteHours({ data, onChange }: SiteHoursProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Site Hours</h3>
      
      <div>
        <label htmlFor="site_hours" className="block text-sm font-medium text-gray-700 mb-2">
          Site Hours *
        </label>
        <textarea
          id="site_hours"
          value={data.site_hours || RAMS_DEFAULTS.SITE_HOURS}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onChange({ site_hours: e.target.value })}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
    </div>
  );
}
