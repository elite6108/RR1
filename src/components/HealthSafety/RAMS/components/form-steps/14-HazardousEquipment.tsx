import React from 'react';
import type { RAMSFormData } from '../../../../../types/rams';
import { RAMS_DEFAULTS } from '../../../../../types/rams';

interface HazardousEquipmentProps {
  data: RAMSFormData;
  onChange: (data: Partial<RAMSFormData>) => void;
}

export function HazardousEquipment({ data, onChange }: HazardousEquipmentProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Hazardous Equipment</h3>
      
      <div>
        <label htmlFor="hazardous_equipment" className="block text-sm font-medium text-gray-700 mb-2">
          Hazardous Equipment Information *
        </label>
        <textarea
          id="hazardous_equipment"
          value={data.hazardous_equipment || RAMS_DEFAULTS.HAZARDOUS_EQUIPMENT}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onChange({ hazardous_equipment: e.target.value })}
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
    </div>
  );
}