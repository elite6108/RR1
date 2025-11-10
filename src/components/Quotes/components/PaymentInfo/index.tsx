import React from 'react';
import { ChevronLeft, AlertCircle, Save } from 'lucide-react';
import { usePaymentInfo } from '../../hooks/usePaymentInfo';
import { BankDetailsForm } from './BankDetailsForm';
import { PaymentTermsForm } from './PaymentTermsForm';
import type { PaymentInfoProps } from '../../types';

export const PaymentInfo: React.FC<PaymentInfoProps> = ({ onBack }) => {
  const {
    formData,
    loading,
    saving,
    error,
    success,
    isEditingAccountNumber,
    isEditingSortCode,
    hasExistingAccountNumber,
    hasExistingSortCode,
    handleChange,
    handleEditAccountNumber,
    handleEditSortCode,
    handleSubmit,
  } = usePaymentInfo();

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-white mb-6">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900 dark:text-white dark:hover:text-gray-200"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Quote Management
        </button>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Payment Information</h2>
        <button
          onClick={handleSubmit}
          disabled={saving || loading}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-indigo-500 dark:hover:bg-indigo-600"
        >
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>

      {error && (
        <div className="mb-4 flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-4 rounded-md">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-4 flex items-center gap-2 text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-4 rounded-md">
          <p>Payment info saved successfully!</p>
        </div>
      )}

      {/* Main Content */}
      <div className="bg-white dark:bg-gray-800 shadow-lg overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Bank Details Section */}
              <BankDetailsForm
                formData={formData}
                handleChange={handleChange}
                isEditingAccountNumber={isEditingAccountNumber}
                isEditingSortCode={isEditingSortCode}
                hasExistingAccountNumber={hasExistingAccountNumber}
                hasExistingSortCode={hasExistingSortCode}
                handleEditAccountNumber={handleEditAccountNumber}
                handleEditSortCode={handleEditSortCode}
              />

              {/* Payment Terms Section */}
              <PaymentTermsForm
                formData={formData}
                handleChange={handleChange}
              />
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
