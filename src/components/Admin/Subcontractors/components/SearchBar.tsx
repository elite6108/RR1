import React from 'react';
import { Search, Plus } from 'lucide-react';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onAddContractor: () => void;
}

export const SearchBar = ({
  searchTerm,
  onSearchChange,
  onAddContractor,
}: SearchBarProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center mb-6">
      <div className="relative flex-1 w-full">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search contractors..."
          value={searchTerm}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
          className="w-full pl-10 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg-sm dark:bg-gray-700 dark:text-white focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <div className="w-full sm:w-auto">
        <button
          onClick={onAddContractor}
          className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Contractor
        </button>
      </div>
    </div>
  );
};
