import React from 'react';
import { Eye } from 'lucide-react';
import { maskAccountNumber, maskSortCode } from '../../utils/formatters';
import type { PaymentInfoData } from '../../types';

interface BankDetailsFormProps {
  formData: PaymentInfoData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  isEditingAccountNumber: boolean;
  isEditingSortCode: boolean;
  hasExistingAccountNumber: boolean;
  hasExistingSortCode: boolean;
  handleEditAccountNumber: () => void;
  handleEditSortCode: () => void;
}

export const BankDetailsForm: React.FC<BankDetailsFormProps> = ({
  formData,
  handleChange,
  isEditingAccountNumber,
  isEditingSortCode,
  hasExistingAccountNumber,
  hasExistingSortCode,
  handleEditAccountNumber,
  handleEditSortCode
}) => {
  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
        Bank Details
      </h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label
            htmlFor="bank_name"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Bank Name *
          </label>
          <input
            type="text"
            id="bank_name"
            name="bank_name"
            required
            value={formData.bank_name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label
            htmlFor="account_number"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Account Number *
          </label>
          <div className="relative">
            {hasExistingAccountNumber && !isEditingAccountNumber ? (
              <div className="flex items-center">
                <div className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-gray-50 dark:bg-gray-600 text-gray-900 dark:text-white font-mono text-lg tracking-widest">
                  {maskAccountNumber(formData.account_number)}
                </div>
                <button
                  type="button"
                  onClick={handleEditAccountNumber}
                  className="ml-2 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  title="Edit Account Number"
                >
                  <Eye className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <input
                type="text"
                id="account_number"
                name="account_number"
                required
                value={formData.account_number}
                onChange={handleChange}
                placeholder="Enter new account number"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              />
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="sort_code"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Sort Code *
          </label>
          <div className="relative">
            {hasExistingSortCode && !isEditingSortCode ? (
              <div className="flex items-center">
                <div className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-gray-50 dark:bg-gray-600 text-gray-900 dark:text-white font-mono text-lg tracking-widest">
                  {maskSortCode(formData.sort_code)}
                </div>
                <button
                  type="button"
                  onClick={handleEditSortCode}
                  className="ml-2 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  title="Edit Sort Code"
                >
                  <Eye className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <input
                type="text"
                id="sort_code"
                name="sort_code"
                required
                value={formData.sort_code}
                onChange={handleChange}
                placeholder="Enter new sort code (e.g., 12-34-56)"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
