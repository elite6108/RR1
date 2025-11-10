import React from 'react';
import { FormData } from '../../types/FormData';
import { BASIC_CAUSE_OPTIONS, SOURCE_OF_HAZARD_OPTIONS } from '../../types/constants';

interface HealthSafetyStepProps {
  formData: FormData;
  setFormData: (updater: (prev: FormData) => FormData) => void;
}

export default function HealthSafetyStep({
  formData,
  setFormData
}: HealthSafetyStepProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Basic cause of incident *</label>
        <select 
          value={formData.basicCause} 
          onChange={e => setFormData(prev => ({ ...prev, basicCause: e.target.value }))} 
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
          required
        >
          <option value="">Select</option>
          {BASIC_CAUSE_OPTIONS.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Source of hazard *</label>
        <select 
          value={formData.sourceOfHazard} 
          onChange={e => setFormData(prev => ({ ...prev, sourceOfHazard: e.target.value }))} 
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
          required
        >
          <option value="">Select</option>
          {SOURCE_OF_HAZARD_OPTIONS.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
