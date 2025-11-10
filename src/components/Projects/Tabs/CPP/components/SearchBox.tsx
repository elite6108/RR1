import React from 'react';
import { Search } from 'lucide-react';

interface SearchBoxProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  placeholder?: string;
}

/**
 * Search box component for filtering CPPs
 */
export function SearchBox({ 
  searchQuery, 
  onSearchChange, 
  placeholder = "Search by CPP number, project name, client, site address..." 
}: SearchBoxProps) {
  return (
    <div className="relative mb-6">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
      </div>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder={placeholder}
        className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      />
    </div>
  );
}
