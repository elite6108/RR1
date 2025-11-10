import React from 'react';
import { Search, Plus } from 'lucide-react';
import { scrollToTopOnMobile } from '../../shared/utils';

interface LeadSearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onAddLead: () => void;
}

export function LeadSearchBar({ searchTerm, onSearchChange, onAddLead }: LeadSearchBarProps) {
  const handleAddLead = () => {
    onAddLead();
    scrollToTopOnMobile();
  };

  return (
    <div className="flex gap-4 items-center">
      {/* Search Bar - Full Width */}
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search leads..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white dark:bg-gray-700 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      {/* Controls - Far Right */}
      <div className="flex items-center gap-4 flex-shrink-0">
        <button
          onClick={handleAddLead}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Lead
        </button>
      </div>
    </div>
  );
}
