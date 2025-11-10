import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import type { SupplierCardProps } from '../types';

export function SupplierCard({ 
  supplier, 
  onEdit, 
  onDelete, 
  onViewOrders 
}: SupplierCardProps) {
  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-gray-200 dark:border-gray-700 cursor-pointer"
      onClick={() => onEdit(supplier)}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 
            className="text-lg font-semibold text-indigo-600 dark:text-indigo-400 cursor-pointer hover:text-indigo-900 dark:hover:text-indigo-300"
            onClick={(e) => {
              e.stopPropagation();
              onViewOrders(supplier);
            }}
            title="View Supplier Orders"
          >
            {supplier.name}
          </h3>
          {(supplier.email || supplier.phone) && (
            <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {supplier.email && <div>{supplier.email}</div>}
              {supplier.phone && <div>{supplier.phone}</div>}
            </div>
          )}
        </div>
      </div>
      <div className="space-y-2 text-sm mb-4">
        <div className="flex justify-between">
          <span className="text-gray-500 dark:text-gray-400">Address:</span>
          <div className="text-gray-900 dark:text-white text-right">
            <div>{supplier.address_line1}</div>
            {supplier.address_line2 && <div>{supplier.address_line2}</div>}
          </div>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500 dark:text-gray-400">Town:</span>
          <span className="text-gray-900 dark:text-white">
            {supplier.town}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500 dark:text-gray-400">Post Code:</span>
          <span className="text-gray-900 dark:text-white">
            {supplier.post_code}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-2 pt-3 border-t border-gray-200 dark:border-gray-600">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(supplier);
          }}
          className="p-2 text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md"
          title="Edit"
        >
          <Pencil className="h-4 w-4" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(supplier.id);
          }}
          className="p-2 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md"
          title="Delete"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}