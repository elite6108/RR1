import React from 'react';
import { Plus, Search, ChevronLeft } from 'lucide-react';
import type { SearchBarProps } from '../types';

export function SearchBar({ 
  searchQuery, 
  onSearchChange, 
  onAddOrder, 
  hideBreadcrumbs = false, 
  onBack 
}: SearchBarProps) {
  return (
    <div className="space-y-4">
      {/* Breadcrumb Navigation */}
      {!hideBreadcrumbs && onBack && (
        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-white">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-900 dark:text-white dark:hover:text-gray-200"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Dashboard
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Purchase Orders</h2>
      </div>

      {/* Search Box with Add Button */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by order number, supplier, project, delivery address, or notes..."
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
          />
        </div>
        <div className="w-full sm:w-auto">
          <button
            onClick={onAddOrder}
            className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Purchase Order
          </button>
        </div>
      </div>
    </div>
  );
}