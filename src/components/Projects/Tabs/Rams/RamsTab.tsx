import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { handleViewPDF } from './utils/pdfGeneration';
import { useRamsSearch } from './hooks/useRamsSearch';
import { RamsTable } from './components/RamsTable';
import { RamsMobileView } from './components/RamsMobileView';
import type { RamsTabProps } from './types/rams';

export function RamsTab({ project, rams, isLoading, onRamsChange }: RamsTabProps) {
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  
  // Use the custom hook for search functionality
  const { searchQuery, setSearchQuery, filteredRams } = useRamsSearch(rams);

  // PDF generation handler
  const onViewPDF = async (ramsItem: any) => {
    await handleViewPDF(ramsItem, setGeneratingPDF, setPdfError);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header and controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">RAMS</h2>
      </div>

      {/* Search Box */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by RAMS number, project, site, task description..."
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      {pdfError && (
        <div className="mb-4 p-4 rounded-md bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
          <p>{pdfError}</p>
        </div>
      )}

      {/* RAMS Table/Cards */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        {/* Desktop Table View */}
        <RamsTable
          filteredRams={filteredRams}
          searchQuery={searchQuery}
          generatingPDF={generatingPDF}
          onViewPDF={onViewPDF}
        />

        {/* Mobile/Tablet Card View */}
        <RamsMobileView
          filteredRams={filteredRams}
          searchQuery={searchQuery}
          generatingPDF={generatingPDF}
          onViewPDF={onViewPDF}
        />
      </div>
    </div>
  );
} 