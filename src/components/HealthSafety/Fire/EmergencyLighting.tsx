import React from 'react';
import { ChevronLeft } from 'lucide-react';

interface EmergencyLightingProps {
  onBack: () => void;
}

export function EmergencyLighting({ onBack }: EmergencyLightingProps) {
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
        Emergency Lighting
      </h2>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <p className="text-gray-600 dark:text-gray-300">
          Emergency Lighting management functionality will be implemented here.
        </p>
      </div>
    </div>
  );
}