import React from 'react';
import type { RAMSFormData } from '../../../../../types/rams';
import { RAMS_DEFAULTS } from '../../../../../types/rams';

interface DeliveriesProps {
  data: RAMSFormData;
  onChange: (data: Partial<RAMSFormData>) => void;
}

export function Deliveries({ data, onChange }: DeliveriesProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Deliveries</h3>
      
      <div>
        <label htmlFor="deliveries" className="block text-sm font-medium text-gray-700 mb-2">
          Delivery Information *
        </label>
        <textarea
          id="deliveries"
          value={data.deliveries || RAMS_DEFAULTS.DELIVERIES}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onChange({ deliveries: e.target.value })}
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
    </div>
  );
}