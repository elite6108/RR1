import React from 'react';
import { SERVICE_INTERVAL_UNITS } from '../utils/vehicleConstants';
import { FormField } from '../../../../../utils/form';

interface VehicleFormStepTwoProps {
  formData: {
    insurance_date: string;
    breakdown_date: string;
    last_service_date: string;
    service_date: string;
    service_interval_value: string;
    service_interval_unit: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

export const VehicleFormStepTwo = ({
  formData,
  handleChange
}: VehicleFormStepTwoProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField label="Insurance Due Date">
          <input
            type="date"
            id="insurance_date"
            name="insurance_date"
            value={formData.insurance_date}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
          />
        </FormField>

        <FormField label="Breakdown Cover Due Date">
          <input
            type="date"
            id="breakdown_date"
            name="breakdown_date"
            value={formData.breakdown_date}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
          />
        </FormField>

        <FormField label="Last Service Date">
          <input
            type="date"
            id="last_service_date"
            name="last_service_date"
            value={formData.last_service_date}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
          />
        </FormField>

        <FormField label="Service Due Date">
          <input
            type="date"
            id="service_date"
            name="service_date"
            value={formData.service_date}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
          />
        </FormField>

        <div className="md:col-span-2">
          <FormField label="Service Interval">
            <div className="flex space-x-2">
              <input
                type="number"
                id="service_interval_value"
                name="service_interval_value"
                value={formData.service_interval_value}
                onChange={handleChange}
                className="w-2/3 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              />
              <select
                id="service_interval_unit"
                name="service_interval_unit"
                value={formData.service_interval_unit}
                onChange={handleChange}
                className="w-1/3 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              >
                {SERVICE_INTERVAL_UNITS.map(unit => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
            </div>
          </FormField>
        </div>
      </div>
    </div>
  );
};
