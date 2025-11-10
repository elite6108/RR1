import React from 'react';
import { Loader2, FileText } from 'lucide-react';
import type { RAMS } from '../types/rams';

interface RamsMobileViewProps {
  filteredRams: RAMS[];
  searchQuery: string;
  generatingPDF: boolean;
  onViewPDF: (rams: RAMS) => void;
}

export function RamsMobileView({ filteredRams, searchQuery, generatingPDF, onViewPDF }: RamsMobileViewProps) {
  return (
    <div className="md:hidden">
      {filteredRams.length === 0 ? (
        <div className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
          {searchQuery ? 'No RAMS match your search criteria' : 'No RAMS found for this project'}
        </div>
      ) : (
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredRams.map((ram) => (
            <div key={ram.id} className="p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {ram.rams_number || 'N/A'}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {ram.expected_start_date ? new Date(ram.expected_start_date).toLocaleDateString() : new Date(ram.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewPDF(ram);
                    }}
                    disabled={generatingPDF}
                    className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                    title="Generate PDF"
                  >
                    {generatingPDF ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <FileText className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="font-medium text-gray-500 dark:text-gray-400">Client:</span>
                  <p className="text-gray-900 dark:text-white">{ram.client_name || ram.client_company || 'N/A'}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-500 dark:text-gray-400">Site:</span>
                  <p className="text-gray-900 dark:text-white">
                    {[ram.site_town, ram.site_county].filter(Boolean).join(', ') || ram.site_address || 'N/A'}
                  </p>
                </div>
                {ram.task_description && (
                  <div className="col-span-2">
                    <span className="font-medium text-gray-500 dark:text-gray-400">Task:</span>
                    <p className="text-gray-900 dark:text-white">{ram.task_description}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
