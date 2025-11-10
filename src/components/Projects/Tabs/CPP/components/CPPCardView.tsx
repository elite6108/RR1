import React from 'react';
import { Loader2, FileText } from 'lucide-react';
import type { CPPListProps } from '../types';

/**
 * Mobile/tablet card view for CPPs
 */
export function CPPCardView({ 
  cpps, 
  generatingPDF, 
  processingCppId, 
  onViewPDF 
}: CPPListProps) {
  const isEmpty = cpps.length === 0;

  return (
    <div className="md:hidden">
      {isEmpty ? (
        <div className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
          No CPPs found for this project
        </div>
      ) : (
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {cpps.map((cpp) => (
            <CPPCard
              key={cpp.id}
              cpp={cpp}
              generatingPDF={generatingPDF}
              processingCppId={processingCppId}
              onViewPDF={onViewPDF}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Individual card component for CPP
 */
function CPPCard({ 
  cpp, 
  generatingPDF, 
  processingCppId, 
  onViewPDF 
}: {
  cpp: any;
  generatingPDF: boolean;
  processingCppId: string | null;
  onViewPDF: (cpp: any) => void;
}) {
  const isProcessing = generatingPDF && processingCppId === cpp.id;

  return (
    <div className="p-4 space-y-3">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {cpp.cpp_number || 'N/A'}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {new Date(cpp.created_at).toLocaleDateString()}
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewPDF(cpp);
            }}
            disabled={isProcessing}
            className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 disabled:opacity-50"
            title="Generate PDF"
          >
            {isProcessing ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <FileText className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
      
      <CPPCardDetails cpp={cpp} />
    </div>
  );
}

/**
 * Card details component showing CPP information
 */
function CPPCardDetails({ cpp }: { cpp: any }) {
  return (
    <div className="grid grid-cols-2 gap-2 text-sm">
      <div>
        <span className="font-medium text-gray-500 dark:text-gray-400">Project:</span>
        <p className="text-gray-900 dark:text-white">
          {cpp.front_cover?.projectName || 'N/A'}
        </p>
      </div>
      <div>
        <span className="font-medium text-gray-500 dark:text-gray-400">Client:</span>
        <p className="text-gray-900 dark:text-white">
          {cpp.front_cover?.clientName || 'N/A'}
        </p>
      </div>
      {cpp.front_cover?.siteAddress && (
        <div className="col-span-2">
          <span className="font-medium text-gray-500 dark:text-gray-400">Site Address:</span>
          <p className="text-gray-900 dark:text-white">
            {cpp.front_cover.siteAddress}
          </p>
        </div>
      )}
      {cpp.front_cover?.principalContractor && (
        <div className="col-span-2">
          <span className="font-medium text-gray-500 dark:text-gray-400">Principal Contractor:</span>
          <p className="text-gray-900 dark:text-white">
            {cpp.front_cover.principalContractor}
          </p>
        </div>
      )}
    </div>
  );
}
