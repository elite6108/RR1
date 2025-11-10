import React from 'react';
import { ChevronLeft } from 'lucide-react';

interface FireDrillProps {
  onBack: () => void;
}

export function FireDrill({ onBack }: FireDrillProps) {
  return (
    <div>
      {/* Breadcrumb Navigation */}
      <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-white mb-6">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900 dark:text-white dark:hover:text-gray-200"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Fire Safety
        </button>
      </div>

      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
        Fire Drill Management
      </h2>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <p className="text-gray-600 dark:text-gray-300">
          Fire Drill management functionality will be implemented here.
        </p>
      </div>
    </div>
  );
}