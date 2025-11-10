import React from 'react';
import type { FormStepProps } from '../../types';

export function Step6Financial({ formData, handleInputChange, setFormData }: FormStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Payment Amount *
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm">£</span>
          </div>
          <input
            type="number"
            name="payment_amount"
            value={formData.payment_amount}
            onChange={handleInputChange}
            step="0.01"
            min="0"
            className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Deposit Required *
        </label>
        <div className="flex space-x-2">
          <button
            type="button"
            name="deposit_required_yes"
            onClick={() =>
              setFormData!((prev) => ({ ...prev, deposit_required: true }))
            }
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              formData.deposit_required
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
            }`}
          >
            Yes
          </button>
          <button
            type="button"
            name="deposit_required_no"
            onClick={() =>
              setFormData!((prev) => ({
                ...prev,
                deposit_required: false,
                deposit_amount: '',
              }))
            }
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              !formData.deposit_required
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
            }`}
          >
            No
          </button>
        </div>
      </div>

      {formData.deposit_required && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Deposit Amount *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">£</span>
            </div>
            <input
              type="number"
              name="deposit_amount"
              value={formData.deposit_amount}
              onChange={handleInputChange}
              step="0.01"
              min="0"
              className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
      )}

      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Installment Type <span className="text-gray-400 text-xs">(optional)</span>
        </label>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            name="installment_type_none"
            onClick={() =>
              setFormData!((prev) => ({
                ...prev,
                installment_type: 'none',
                custom_installments: '',
              }))
            }
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              formData.installment_type === 'none'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
            }`}
          >
            No Installments
          </button>
          <button
            type="button"
            name="installment_type_regular"
            onClick={() =>
              setFormData!((prev) => ({
                ...prev,
                installment_type: 'regular',
              }))
            }
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              formData.installment_type === 'regular'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
            }`}
          >
            Regular Installments
          </button>
          <button
            type="button"
            name="installment_type_custom"
            onClick={() =>
              setFormData!((prev) => ({
                ...prev,
                installment_type: 'custom',
              }))
            }
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              formData.installment_type === 'custom'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
            }`}
          >
            Custom Installments
          </button>
        </div>
      </div>

      {formData.installment_type === 'regular' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Regular Installments <span className="text-gray-400 text-xs">(optional)</span>
          </label>
          <select
            name="installment_frequency"
            value={formData.installment_frequency}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="week">Week</option>
            <option value="month">Month</option>
            <option value="milestone">Milestone</option>
          </select>
        </div>
      )}

      {formData.installment_type === 'custom' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Custom Installment Details <span className="text-gray-400 text-xs">(optional)</span>
          </label>
          <textarea
            name="custom_installments"
            value={formData.custom_installments}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter custom installment details..."
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Statutory Interest Rate *
        </label>
        <input
          type="text"
          name="statutory_interest_rate"
          value={formData.statutory_interest_rate}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
    </div>
  );
}