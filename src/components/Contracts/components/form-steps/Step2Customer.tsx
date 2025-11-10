import React from 'react';
import type { FormStepProps } from '../../types';

export function Step2Customer({ 
  formData, 
  customers = [], 
  customerAddress = '',
  onCustomerChange,
  disableCustomerAndProject = false
}: FormStepProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Customer *
        </label>
        <select
          name="customer_id"
          value={formData.customer_id}
          onChange={onCustomerChange}
          className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
            disableCustomerAndProject ? 'bg-gray-100 cursor-not-allowed' : ''
          }`}
          disabled={disableCustomerAndProject}
        >
          <option value="">Select a customer...</option>
          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.company_name || customer.customer_name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Address *
        </label>
        <input
          type="text"
          name="customer_address"
          value={customerAddress}
          readOnly
          className="w-full px-3 py-2 border border-gray-300 bg-gray-100 rounded-md shadow-sm focus:outline-none"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Phone *
        </label>
        <input
          name="customer_phone"
          type="text"
          value={formData.customer_phone}
          readOnly
          className="w-full px-3 py-2 border border-gray-300 bg-gray-100 rounded-md shadow-sm focus:outline-none"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Email *
        </label>
        <input
          type="text"
          name="customer_email"
          value={formData.customer_email}
          readOnly
          className="w-full px-3 py-2 border border-gray-300 bg-gray-100 rounded-md shadow-sm focus:outline-none"
        />
      </div>
    </div>
  );
}