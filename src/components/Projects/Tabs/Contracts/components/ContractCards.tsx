import React from 'react';
import { Loader2, FileText, Pencil, Trash2 } from 'lucide-react';
import type { ContractTableProps } from '../types';
import { formatContractDate, formatContractAmount, formatCustomerName } from '../utils';

export function ContractCards({ 
  contracts, 
  project, 
  generatingPDF, 
  onEdit, 
  onDelete, 
  onGeneratePDF 
}: ContractTableProps) {
  if (contracts.length === 0) {
    return (
      <div className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
        No contracts found for this project
      </div>
    );
  }

  return (
    <div className="md:hidden">
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {contracts.map((contract) => (
          <div key={contract.id} className="p-4 space-y-3">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {formatCustomerName(contract.customer)}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {formatContractDate(contract.contract_date)}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(contract);
                  }}
                  className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                  title="Edit Contract"
                >
                  <Pencil className="h-5 w-5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onGeneratePDF(contract);
                  }}
                  disabled={generatingPDF}
                  className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                  title="Generate PDF"
                >
                  {generatingPDF ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
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
                  title="Delete Contract"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="font-medium text-gray-500 dark:text-gray-400">Project:</span>
                <p className="text-gray-900 dark:text-white">{contract.project_name || project.name}</p>
              </div>
              <div>
                <span className="font-medium text-gray-500 dark:text-gray-400">Amount:</span>
                <p className="text-gray-900 dark:text-white">{formatContractAmount(contract.payment_amount)}</p>
              </div>
              <div className="col-span-2">
                <span className="font-medium text-gray-500 dark:text-gray-400">Site:</span>
                <p className="text-gray-900 dark:text-white">{contract.site_address || 'N/A'}</p>
              </div>
              {contract.description_of_works && (
                <div className="col-span-2">
                  <span className="font-medium text-gray-500 dark:text-gray-400">Description:</span>
                  <p className="text-gray-900 dark:text-white">{contract.description_of_works}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
