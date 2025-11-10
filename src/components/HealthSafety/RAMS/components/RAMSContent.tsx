import React from 'react';
import { RAMSDesktopTable } from './RAMSDesktopTable';
import { RAMSMobileCards } from './RAMSMobileCards';
import type { RAMS } from '../../../../types/database';

interface RAMSContentProps {
  loading: boolean;
  entries: RAMS[];
  searchQuery: string;
  sortConfig: { key: string; direction: 'asc' | 'desc' } | null;
  onSort: (key: string) => void;
  onEdit: (entry: RAMS) => void;
  onViewPDF: (entry: RAMS) => void;
  onDelete: (entry: RAMS) => void;
  generatingPdfId: string | null;
}

export function RAMSContent({
  loading,
  entries,
  searchQuery,
  sortConfig,
  onSort,
  onEdit,
  onViewPDF,
  onDelete,
  generatingPdfId
}: RAMSContentProps) {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
        </div>
      ) : entries.length === 0 ? (
        <div className="flex items-center justify-center h-48 bg-gray-50 dark:bg-gray-700/50">
          <p className="text-gray-500 dark:text-gray-400">
            {searchQuery ? 'No matching RAMS found' : 'No RAMS yet'}
          </p>
        </div>
      ) : (
        <>
          <RAMSDesktopTable
            entries={entries}
            sortConfig={sortConfig}
            onSort={onSort}
            onEdit={onEdit}
            onViewPDF={onViewPDF}
            onDelete={onDelete}
            generatingPdfId={generatingPdfId}
          />
          <RAMSMobileCards
            entries={entries}
            onEdit={onEdit}
            onViewPDF={onViewPDF}
            onDelete={onDelete}
            generatingPdfId={generatingPdfId}
          />
        </>
      )}
    </div>
  );
}
