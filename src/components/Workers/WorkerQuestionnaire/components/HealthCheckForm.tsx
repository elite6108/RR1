import React from 'react';
import { Save } from 'lucide-react';

interface HealthCheckFormProps {
  loading: boolean;
  onSubmit: () => void;
}

export const HealthCheckForm: React.FC<HealthCheckFormProps> = ({
  loading,
  onSubmit
}) => (
  <div className="text-center py-8">
    <p className="text-gray-600 dark:text-gray-300 mb-4">
      Please complete the health check to continue.
    </p>
    <button
      onClick={onSubmit}
      className="px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600"
    >
      {loading ? (
        <span className="flex items-center">
          <span className="animate-spin h-4 w-4 mr-2 border-2 border-white border-opacity-20 border-t-white rounded-full"></span>
          Processing...
        </span>
      ) : (
        <span className="flex items-center">
          <Save className="h-4 w-4 mr-2" />
          Complete Health Check
        </span>
      )}
    </button>
  </div>
);
