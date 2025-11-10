import React from 'react';
import { Pencil, FileText, Trash2, Loader2 } from 'lucide-react';
import type { ContractTableProps } from '../types';

export function ContractTable({
  contracts,
  loading,
  searchQuery,
  generatingPdfId,
  onEdit,
  onGeneratePDF,
  onDelete
}: ContractTableProps) {
  const filteredContracts = contracts.filter(contract => {
    const query = searchQuery.toLowerCase();
    if (!query) return true;
    
    return (
      contract.customer?.company_name?.toLowerCase().includes(query) ||
      contract.customer?.customer_name?.toLowerCase().includes(query) ||
      contract.project_name?.toLowerCase().includes(query) ||
      contract.description_of_works?.toLowerCase().includes(query) ||
      contract.site_address?.toLowerCase().includes(query) ||
      new Date(contract.contract_date).toLocaleDateString().toLowerCase().includes(query)
    );
  });

  return (
    <div className="hidden lg:block">
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="sticky top-0 px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider bg-gray-50 dark:bg-gray-700">
                  Contract Date
                </th>
                <th className="sticky top-0 px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider bg-gray-50 dark:bg-gray-700">
                  Client / Customer
                </th>
                <th className="sticky top-0 px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider bg-gray-50 dark:bg-gray-700">
                  Project
                </th>
                <th className="sticky top-0 px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider bg-gray-50 dark:bg-gray-700">
                  Site
                </th>
                <th className="sticky top-0 px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider bg-gray-50 dark:bg-gray-700">
                  Amount
                </th>
                <th className="sticky top-0 px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider bg-gray-50 dark:bg-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    Loading contracts...
                  </td>
                </tr>
              ) : filteredContracts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    No contracts found
                  </td>
                </tr>
              ) : (
                filteredContracts.map((contract) => (
                  <tr 
                    key={contract.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                    onClick={() => onEdit(contract)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {new Date(contract.contract_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {contract.customer
                        ? [contract.customer.company_name, contract.customer.customer_name].filter(Boolean).join(' - ')
                        : 'Unknown Customer'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {contract.project_name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      {contract.site_address}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      £{(contract.payment_amount || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit(contract);
                          }}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"   
                          title="Edit"
                        >
                          <Pencil className="h-5 w-5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onGeneratePDF(contract);
                          }}
                          disabled={generatingPdfId === contract.id}
                          className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 disabled:opacity-50"
                          title="View PDF"
                        >
                          {generatingPdfId === contract.id ? (
                            <Loader2 className="h-5 w-5 animate-spin text-green-600" />
                          ) : (
                            <FileText className="h-5 w-5" />
                          )}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(contract);
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
}