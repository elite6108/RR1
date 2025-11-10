import React from 'react';
import type { PaymentInfoData } from '../../types';

interface PaymentTermsFormProps {
  formData: PaymentInfoData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const PaymentTermsForm: React.FC<PaymentTermsFormProps> = ({
  formData,
  handleChange
}) => {
  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
        Payment Terms
      </h3>
      <div>
        <label
          htmlFor="terms"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Enter your payment terms below *
        </label>
        <textarea
          id="terms"
          name="terms"
          rows={10}
          required
          value={formData.terms}
          onChange={handleChange}
          placeholder="Enter your payment terms here..."
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
        />
      </div>
    </div>
  );
};
