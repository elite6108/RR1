import React from 'react';
import { ChevronLeft } from 'lucide-react';

interface RAMSBreadcrumbProps {
  onBack: () => void;
}

export function RAMSBreadcrumb({ onBack }: RAMSBreadcrumbProps) {
  return (
    <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-white">
      <button
        onClick={onBack}
        className="flex items-center text-gray-600 hover:text-gray-900 dark:text-white dark:hover:text-gray-200"
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Back to Health & Safety
      </button>
    </div>
  );
}
