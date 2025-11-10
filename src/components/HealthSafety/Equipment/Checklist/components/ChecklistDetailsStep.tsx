import React from 'react';

interface ChecklistDetailsStepProps {
  createdByName: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  onCreatedByNameChange: (name: string) => void;
  onFrequencyChange: (frequency: 'daily' | 'weekly' | 'monthly') => void;
}

export function ChecklistDetailsStep({ 
  createdByName, 
  frequency, 
  onCreatedByNameChange, 
  onFrequencyChange 
}: ChecklistDetailsStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="createdByName" className="block text-sm font-medium text-gray-700 mb-2">
          Your Name*
        </label>
        <input
          id="createdByName"
          type="text"
          value={createdByName}
          onChange={e => onCreatedByNameChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          placeholder="Enter your full name"
        />
      </div>
      <div>
        <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 mb-2">
          Frequency*
        </label>
        <select
          id="frequency"
          value={frequency}
          onChange={e => onFrequencyChange(e.target.value as 'daily' | 'weekly' | 'monthly')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>
    </div>
  );
}
