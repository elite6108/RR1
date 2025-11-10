import React from 'react';
import { ChevronUp, ChevronDown, Pencil, FileText, Trash2, Loader2 } from 'lucide-react';
import { formatNumber, formatDate, getStatusDisplayText } from '../../utils/formatters';
import { statusColors } from '../../utils/constants';
import type { Quote, SortField, SortDirection } from '../../types';

interface QuoteTableProps {
  sortedQuotes: Quote[];
  loading: boolean;
  searchQuery: string;
  sortField: SortField;
  sortDirection: SortDirection;
  generatingPdfId: string | null;
  handleSort: (field: SortField) => void;
  handleRowClick: (quote: Quote, event: React.MouseEvent<HTMLTableRowElement>) => void;
  handleEditQuote: (quote: Quote) => void;
  handleViewPDF: (quote: Quote) => void;
  handleDeleteQuote: (quoteId: string) => void;
}

export const QuoteTable: React.FC<QuoteTableProps> = ({
  sortedQuotes,
  loading,
  searchQuery,
  sortField,
  sortDirection,
  generatingPdfId,
  handleSort,
  handleRowClick,
  handleEditQuote,
  handleViewPDF,
  handleDeleteQuote
}) => {
  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ChevronUp className="h-4 w-4 text-gray-400" />;
    }
    return sortDirection === 'asc' ? 
      <ChevronUp className="h-4 w-4 text-indigo-600 dark:text-indigo-400" /> : 
      <ChevronDown className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />;
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow-lg overflow-hidden sm:rounded-lg">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg overflow-hidden sm:rounded-lg">
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th 
                  className="sticky top-0 px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider bg-gray-50 dark:bg-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => handleSort('quote_number')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Quote Number</span>
                    {renderSortIcon('quote_number')}
                  </div>
                </th>
                <th 
                  className="sticky top-0 px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider bg-gray-50 dark:bg-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => handleSort('quote_date')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Quote Date</span>
                    {renderSortIcon('quote_date')}
                  </div>
                </th>
                <th 
                  className="sticky top-0 px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider bg-gray-50 dark:bg-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => handleSort('customer')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Customer</span>
                    {renderSortIcon('customer')}
                  </div>
                </th>
                <th 
                  className="sticky top-0 px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider bg-gray-50 dark:bg-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => handleSort('amount')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Amount</span>
                    {renderSortIcon('amount')}
                  </div>
                </th>
                <th 
                  className="sticky top-0 px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider bg-gray-50 dark:bg-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Status</span>
                    {renderSortIcon('status')}
                  </div>
                </th>
                <th className="sticky top-0 px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider bg-gray-50 dark:bg-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {sortedQuotes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    {searchQuery ? 'No quotes found matching your search.' : 'No quotes found.'}
                  </td>
                </tr>
              ) : (
                sortedQuotes.map((quote) => (
                  <tr 
                    key={quote.id}
                    onClick={(e) => handleRowClick(quote, e)}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {quote.quote_number}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {formatDate(quote.quote_date)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {quote.customer?.company_name || quote.customer?.customer_name}
                      </div>
                      {quote.customer?.company_name && (
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {quote.customer.customer_name}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        £{formatNumber(quote.amount)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[quote.status as keyof typeof statusColors]}`}>
                        {getStatusDisplayText(quote.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditQuote(quote);
                          }}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          title="Edit"
                        >
                          <Pencil className="h-5 w-5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewPDF(quote);
                          }}
                          disabled={generatingPdfId === quote.id}
                          className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 disabled:opacity-50"
                          title="View PDF"
                        >
                          {generatingPdfId === quote.id ? (
                            <Loader2 className="h-5 w-5 animate-spin text-green-600" />
                          ) : (
                            <FileText className="h-5 w-5" />
                          )}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteQuote(quote.id);
                          }}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          title="Delete"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
