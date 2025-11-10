import React from 'react';
import { Search } from 'lucide-react';

interface SearchAndUploadProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onUploadClick: () => void;
  uploadButtonText?: string;
  searchPlaceholder?: string;
}

/**
 * Reusable search and upload component
 * Provides search input and upload button in a responsive layout
 */
export const SearchAndUpload: React.FC<SearchAndUploadProps> = ({
  searchQuery,
  onSearchChange,
  onUploadClick,
  uploadButtonText = "Upload Document",
  searchPlaceholder = "Search documents..."
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center">
      {/* Search Input */}
      <div className="relative flex-1 w-full">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
        />
      </div>
      
      {/* Upload Button */}
      <button
        onClick={onUploadClick}
        className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        {uploadButtonText}
      </button>
    </div>
  );
};
