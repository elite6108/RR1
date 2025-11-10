import React from 'react';
import { Pencil, Trash2, FileText, Loader2 } from 'lucide-react';
import type { PurchaseOrderCardProps } from '../types';

export function PurchaseOrderCard({
  order,
  generatingPdfId,
  onEdit,
  onDelete,
  onGeneratePDF,
  getSupplierName,
  getProjectName,
  formatDate,
  formatNumber,
  companyPrefix,
}: PurchaseOrderCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {order.order_number}
          </h3>
          <div className="mt-1">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                order.status === 'pending'
                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
                  : order.status === 'approved'
                  ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'
              }`}
            >
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-gray-900 dark:text-white">
            £{formatNumber(order.amount)}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {formatDate(order.created_at)}
          </div>
        </div>
      </div>

      <div className="space-y-2 text-sm mb-4">
        <div className="flex justify-between">
          <span className="text-gray-500 dark:text-gray-400">Supplier:</span>
          <span className="text-gray-900 dark:text-white font-medium">
            {getSupplierName(order.supplier_id)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500 dark:text-gray-400">Project:</span>
          <span className="text-gray-900 dark:text-white font-medium">
            {getProjectName(order.project_id)}
          </span>
        </div>
        {order.delivery_to && (
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">Delivery To:</span>
            <span className="text-gray-900 dark:text-white text-right">
              {order.delivery_to}
            </span>
          </div>
        )}
        {order.notes && (
          <div>
            <span className="text-gray-500 dark:text-gray-400">Notes:</span>
            <p className="text-gray-900 dark:text-white text-sm mt-1">
              {order.notes}
            </p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200 dark:border-gray-600">
        <button
          onClick={() => onEdit(order)}
          className="p-2 text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md"
          title="Edit"
        >
          <Pencil className="h-4 w-4" />
        </button>
        <button
          onClick={() => onGeneratePDF(order)}
          disabled={generatingPdfId === order.id}
          className="p-2 text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-md disabled:opacity-50"
          title="Generate PDF"
        >
          {generatingPdfId === order.id ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <FileText className="h-4 w-4" />
          )}
        </button>
        <button
          onClick={() => onDelete(order.id)}
          className="p-2 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md"
          title="Delete"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}