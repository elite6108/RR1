import React from 'react';
import { Pencil, FileText, Trash2, Loader2 } from 'lucide-react';
import type { ContractCardProps } from '../types';

export function ContractCard({
  contract,
  generatingPdfId,
  onEdit,
  onGeneratePDF,
  onDelete
}: ContractCardProps) {
  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-gray-200 dark:border-gray-700 cursor-pointer"
      onClick={() => onEdit(contract)}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {contract.customer
              ? [contract.customer.company_name, contract.customer.customer_name].filter(Boolean).join(' - ')
              : 'Unknown Customer'}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{contract.project_name}</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(contract);
            }}
            className="p-2 text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md"
            title="Edit"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onGeneratePDF(contract);
            }}
            disabled={generatingPdfId === contract.id}
            className="p-2 text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-md disabled:opacity-50"
            title="PDF"
          >
            {generatingPdfId === contract.id ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <FileText className="h-4 w-4" />
            )}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(contract);
            }}
            className="p-2 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500 dark:text-gray-400">Contract Date:</span>
          <span className="text-gray-900 dark:text-white">{new Date(contract.contract_date).toLocaleDateString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500 dark:text-gray-400">Site Address:</span>
          <span className="text-gray-900 dark:text-white text-right">{contract.site_address}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500 dark:text-gray-400">Amount:</span>
          <span className="text-gray-900 dark:text-white font-semibold">£{(contract.payment_amount || 0).toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}