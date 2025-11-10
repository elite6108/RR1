import React from 'react';
import type { RAMSFormData } from '../../../../../types/rams';
import { RAMS_DEFAULTS } from '../../../../../types/rams';

interface ToolsAndPlantProps {
  data: RAMSFormData;
  onChange: (data: Partial<RAMSFormData>) => void;
}

export function ToolsAndPlant({ data, onChange }: ToolsAndPlantProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Tools and Plant Equipment</h3>
      
      <div>
        <label htmlFor="tools_equipment" className="block text-sm font-medium text-gray-700 mb-2">
          Tools Equipment *
        </label>
        <textarea
          id="tools_equipment"
          value={data.tools_equipment || RAMS_DEFAULTS.TOOLS_EQUIPMENT}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onChange({ tools_equipment: e.target.value })}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="plant_equipment" className="block text-sm font-medium text-gray-700 mb-2">
          Plant Equipment *
        </label>
        <textarea
          id="plant_equipment"
          value={data.plant_equipment}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onChange({ plant_equipment: e.target.value })}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
    </div>
  );
}