import React from 'react';

interface DriverFormStepTwoProps {
  formData: {
    licence_number: string;
    licence_expiry: string;
    last_check: string;
    points: number;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export const DriverFormStepTwo: React.FC<DriverFormStepTwoProps> = ({
  formData,
  handleChange
}) => {
  return (
    <>
      <div>
        <label htmlFor="licence_number" className="block text-sm font-medium text-gray-700 mb-1">
          Licence Number *
        </label>
        <input
          type="text"
          id="licence_number"
          name="licence_number"
          required
          value={formData.licence_number}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="licence_expiry" className="block text-sm font-medium text-gray-700 mb-1">
          Licence Expiry Date *
        </label>
        <input
          type="date"
          id="licence_expiry"
          name="licence_expiry"
          required
          value={formData.licence_expiry}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="last_check" className="block text-sm font-medium text-gray-700 mb-1">
          Last Check Date
        </label>
        <input
          type="date"
          id="last_check"
          name="last_check"
          value={formData.last_check}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="points" className="block text-sm font-medium text-gray-700 mb-1">
          Points
        </label>
        <input
          type="number"
          id="points"
          name="points"
          value={formData.points}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
    </>
  );
};
