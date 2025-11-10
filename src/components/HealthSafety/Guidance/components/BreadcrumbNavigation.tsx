import React from 'react';
import { ChevronLeft } from 'lucide-react';

interface BreadcrumbNavigationProps {
  onBack: () => void;
  backText?: string;
}

/**
 * Reusable breadcrumb navigation component
 * Provides consistent back navigation styling and behavior
 */
export const BreadcrumbNavigation: React.FC<BreadcrumbNavigationProps> = ({
  onBack,
  backText = "Back to Guidance"
}) => {
  return (
    <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-white mb-6">
      <button
        onClick={onBack}
        className="flex items-center text-gray-600 hover:text-gray-900 dark:text-white dark:hover:text-gray-200"
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        {backText}
      </button>
    </div>
  );
};
