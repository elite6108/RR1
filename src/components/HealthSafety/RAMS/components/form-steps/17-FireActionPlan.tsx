import React from 'react';
import type { RAMSFormData } from '../../../../../types/rams';
import { RAMS_DEFAULTS } from '../../../../../types/rams';

interface FireActionPlanProps {
  data: RAMSFormData;
  onChange: (data: Partial<RAMSFormData>) => void;
}

export function FireActionPlan({ data, onChange }: FireActionPlanProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Fire Action Plan</h3>
      
      <div>
        <label htmlFor="fire_action_plan" className="block text-sm font-medium text-gray-700 mb-2">
          Fire Action Plan Information *
        </label>
        <textarea
          id="fire_action_plan"
          value={data.fire_action_plan || RAMS_DEFAULTS.FIRE_ACTION_PLAN}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onChange({ fire_action_plan: e.target.value })}
          rows={8}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
    </div>
  );
}