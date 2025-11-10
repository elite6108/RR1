import React from 'react';
import { ChevronLeft, Plus } from 'lucide-react';

interface SubcontractorsHeaderProps {
  onBack: () => void;
  onAddContractor: () => void;
}

export const SubcontractorsHeader: React.FC<SubcontractorsHeaderProps> = ({
  onBack,
  onAddContractor,
}) => {
  return (
    <>
      {/* Breadcrumb Navigation */}
      <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-white mb-6">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900 dark:text-white dark:hover:text-gray-200"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Company Section
        </button>
      </div>

      {/* Header with Add button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Sub-contractor Management
        </h2>
      </div>
    </>
  );
};
