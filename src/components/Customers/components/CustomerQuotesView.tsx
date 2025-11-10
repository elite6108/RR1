import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { QuotesList } from '../../Quotes';
import type { CustomerQuotesViewProps } from '../types';

export function CustomerQuotesView({
  customer,
  quotes,
  loading,
  error,
  onBack,
  setShowCustomerProjectsDashboard,
  setActiveSection
}: CustomerQuotesViewProps) {
  const customerName = customer.company_name
    ? `${customer.company_name} (${customer.customer_name})`
    : customer.customer_name;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => {
              setShowCustomerProjectsDashboard(true);
              setActiveSection('customers');
            }}
            className="flex items-center space-x-2 text-sm text-gray-500 dark:text-white mb-6"
          >
            <ChevronLeft className="h-5 w-5 mr-2" />
            Back to Customers
          </button>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{customerName} - Quotes</h1>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-600 dark:text-red-400">{error}</div>
        ) : (
          <QuotesList
            quotes={quotes}
            onQuoteChange={() => {}} // This would need to be passed down if needed
            onBack={onBack}
            hideBreadcrumbs={true}
            customerName={customerName}
          />
        )}
      </div>
    </div>
  );
}