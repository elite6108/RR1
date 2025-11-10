import React from 'react';
import type { CombinedStaffUser } from '../../shared/types';

interface DriverFormStepOneProps {
  isNewDriver: boolean;
  setIsNewDriver: (value: boolean) => void;
  formData: {
    staff_id: string | number;
    full_name: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  staffOptions: CombinedStaffUser[];
  driverToEdit?: any;
}

export const DriverFormStepOne: React.FC<DriverFormStepOneProps> = ({
  isNewDriver,
  setIsNewDriver,
  formData,
  handleChange,
  staffOptions,
  driverToEdit
}) => {
  return (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Driver Information
        </label>
        <div className="flex gap-4 mb-4">
          <button
            type="button"
            onClick={() => setIsNewDriver(false)}
            className={`w-full text-center px-4 py-2 border rounded-md text-sm ${!isNewDriver ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
          >
            Select existing staff member
          </button>
          <button
            type="button"
            onClick={() => setIsNewDriver(true)}
            className={`w-full text-center px-4 py-2 border rounded-md text-sm ${isNewDriver ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
          >
            {driverToEdit ? 'Driver by name' : 'Add new driver'}
          </button>
        </div>
      </div>

      {!isNewDriver ? (
        <div>
          <label htmlFor="staff_id" className="block text-sm font-medium text-gray-700 mb-1">
            Staff Member *
          </label>
          <select
            id="staff_id"
            name="staff_id"
            required={!isNewDriver}
            value={formData.staff_id}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Select a staff member</option>
            {staffOptions.map(staff => (
              <option key={staff.id} value={staff.original_id}>
                {staff.name} - {
                  staff.type === 'staff' ? staff.position || 'Staff' :
                  staff.type === 'worker' ? staff.company || 'Worker' :
                  'User'
                } ({staff.type})
              </option>
            ))}
          </select>
        </div>
      ) : (
        <div>
          <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-1">
            Driver Full Name *
          </label>
          <input
            type="text"
            id="full_name"
            name="full_name"
            required={isNewDriver}
            value={formData.full_name}
            onChange={handleChange}
            placeholder="Enter driver's full name"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      )}
    </>
  );
};
