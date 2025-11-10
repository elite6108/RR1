import React from 'react';
import type { FormStepProps } from '../../types';

export function NamesStep({ formData, handleChange }: FormStepProps) {
  return (
    <>
      <div>
        <label
          htmlFor="company_name"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Company Name <span className="text-gray-400 text-xs">(optional)</span>
        </label>
        <input
          type="text"
          id="company_name"
          name="company_name"
          value={formData.company_name}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400"
          placeholder="Enter company name"
        />
      </div>

      <div>
        <label
          htmlFor="customer_name"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Customer Name *
        </label>
        <input
          type="text"
          id="customer_name"
          name="customer_name"
          required
          value={formData.customer_name}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400"
          placeholder="Enter customer name"
        />
      </div>
    </>
  );
}