import React from 'react';
import { CPPTableView } from './CPPTableView';
import { CPPCardView } from './CPPCardView';
import type { CPPListProps } from '../types';

/**
 * Main CPP list component that renders both desktop and mobile views
 */
export function CPPList({ 
  cpps, 
  generatingPDF, 
  processingCppId, 
  onViewPDF 
}: CPPListProps) {
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
      {/* Desktop Table View */}
      <CPPTableView
        cpps={cpps}
        generatingPDF={generatingPDF}
        processingCppId={processingCppId}
        onViewPDF={onViewPDF}
      />

      {/* Mobile/Tablet Card View */}
      <CPPCardView
        cpps={cpps}
        generatingPDF={generatingPDF}
        processingCppId={processingCppId}
        onViewPDF={onViewPDF}
      />
    </div>
  );
}
