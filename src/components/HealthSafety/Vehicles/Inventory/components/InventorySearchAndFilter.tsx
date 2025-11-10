import React from 'react';
import { Search, X } from 'lucide-react';
import type { InventorySearchAndFilterProps } from '../types/formTypes';

export const InventorySearchAndFilter: React.FC<InventorySearchAndFilterProps> = ({
  searchQuery,
  onSearchChange,
  totalItems,
  filteredItems
}) => {
  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Search Inventory Items
      </label>
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full px-4 py-2 pl-10 pr-10 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
          placeholder="Search by item name or category..."
        />
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      {searchQuery && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Showing {filteredItems} of {totalItems} items
        </p>
      )}
    </div>
  );
};
