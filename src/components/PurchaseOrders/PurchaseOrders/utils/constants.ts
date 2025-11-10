import type { PerOption } from '../types';

// Per options for purchase order items
export const PER_OPTIONS: readonly PerOption[] = ['Days', 'Weeks', 'Litres', 'Each'] as const;

// Form step labels
export const FORM_STEP_LABELS = ['Order Details', 'Items', 'Notes'];

// CSS classes for consistent styling
export const INPUT_CLASS_NAME = "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400";

export const SELECT_CLASS_NAME = "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400";

export const TEXTAREA_CLASS_NAME = "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400";

export const BUTTON_PRIMARY = "w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500";

export const BUTTON_SECONDARY = "w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:text-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600";

export const BUTTON_DANGER = "px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 dark:hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500";

// Utility functions
export const formatNumber = (num: number): string => {
  return num.toLocaleString('en-GB', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-GB');
};

export const calculateItemTotal = (quantity: number, price: number): number => {
  return quantity * price;
};

export const calculateSubtotal = (items: any[]): number => {
  return items.reduce((sum, item) => sum + calculateItemTotal(item.quantity || 0, item.price || 0), 0);
};

export const calculateVat = (subtotal: number, includeVat: boolean): number => {
  return includeVat ? subtotal * 0.2 : 0;
};

export const calculateTotal = (subtotal: number, vat: number): number => {
  return subtotal + vat;
};

export const filterOrders = (orders: any[], searchQuery: string, getSupplierName: (id: string) => string, getProjectName: (id: string) => string) => {
  const query = searchQuery.toLowerCase();
  return orders.filter((order) =>
    order.order_number?.toLowerCase().includes(query) ||
    getSupplierName(order.supplier_id)?.toLowerCase().includes(query) ||
    getProjectName(order.project_id)?.toLowerCase().includes(query) ||
    order.delivery_to?.toLowerCase().includes(query) ||
    order.notes?.toLowerCase().includes(query)
  );
};

export const generateOrderNumber = (companyPrefix: string): string => {
  const timestamp = Date.now().toString();
  const randomSuffix = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `${companyPrefix}-PO-${timestamp.slice(-6)}${randomSuffix}`;
};