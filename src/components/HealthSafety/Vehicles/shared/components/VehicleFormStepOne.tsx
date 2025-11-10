import React from 'react';
import type { CombinedStaffUser } from '../types';
import { FormField } from '../../../../../utils/form';

interface VehicleFormStepOneProps {
  formData: {
    vin: string;
    registration: string;
    driver_id: string;
    driver: string;
  };
  combinedStaffUsers: CombinedStaffUser[];
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

export const VehicleFormStepOne = ({
  formData,
  combinedStaffUsers,
  handleChange
}: VehicleFormStepOneProps) => {
  // Transform staff users into select options
  const driverOptions = combinedStaffUsers.map(member => ({
    value: member.original_id,
    label: `${member.name} - ${
      member.type === 'staff' ? member.position || 'Staff' :
      member.type === 'worker' ? member.company || 'Worker' :
      'User'
    } (${member.type})`
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <FormField label="Registration" required>
          <input
            type="text"
            id="registration"
            name="registration"
            value={formData.registration}
            onChange={handleChange}
            maxLength={8}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
          />
        </FormField>

        <FormField label="VIN">
          <input
            type="text"
            id="vin"
            name="vin"
            value={formData.vin}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
          />
        </FormField>

        <div className="md:col-span-2">
          <FormField label="Driver">
            <select
              id="driver_id"
              name="driver_id"
              value={formData.driver_id}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">Select a driver</option>
              {driverOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </FormField>
        </div>

        <div className="md:col-span-2">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  DVLA Integration
                </h3>
                <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                  <p>Make, Model, MOT and TAX data will be automatically retrieved from DVLA when you submit the form.</p>
                  <p className="mt-1 text-gray-600 dark:text-gray-400"><strong>Note:</strong> Drivers can be selected from Staff, Users, or Workers.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
