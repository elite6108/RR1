import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import type { CustomerCardProps } from '../types';

export function CustomerCard({ 
  customer, 
  onCustomerClick, 
  onEditCustomer, 
  onDeleteCustomer 
}: CustomerCardProps) {
  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-gray-200 dark:border-gray-700 cursor-pointer hover:shadow-lg transition-shadow duration-200"
      onClick={() => onCustomerClick(customer)}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">
            {customer.company_name || customer.customer_name}
          </h3>
          {customer.company_name && (
            <p className="text-sm text-gray-600 dark:text-gray-400">{customer.customer_name}</p>
          )}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEditCustomer(customer);
            }}
            className="p-2 text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md"
            title="Edit"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDeleteCustomer(customer.id);
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
          <span className="text-gray-500 dark:text-gray-400">Email:</span>
          <span className="text-gray-900 dark:text-white text-right">{customer.email}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500 dark:text-gray-400">Phone:</span>
          <span className="text-gray-900 dark:text-white">{customer.phone}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500 dark:text-gray-400">Address:</span>
          <div className="text-gray-900 dark:text-white text-right">
            <div>{customer.address_line1}</div>
            {customer.address_line2 && <div>{customer.address_line2}</div>}
            <div>{customer.town}, {customer.county}</div>
            <div>{customer.post_code}</div>
          </div>
        </div>
      </div>
    </div>
  );
}