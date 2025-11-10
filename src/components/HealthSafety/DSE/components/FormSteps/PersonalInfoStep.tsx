import React from 'react';
import { FormStepProps } from '../../types';

export function PersonalInfoStep({ formData, setFormData }: FormStepProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">
        Step 1: Personal Information
      </h3>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Full Name *
        </label>
        <input
          type="text"
          value={formData.full_name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setFormData((prev) => ({
              ...prev,
              full_name: e.target.value,
            }))
          }
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
        />
      </div>
    </div>
  );
}
