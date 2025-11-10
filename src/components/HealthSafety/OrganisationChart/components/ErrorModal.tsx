import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ErrorModalProps {
  error: string | null;
  setError: (error: string | null) => void;
}

export const ErrorModal: React.FC<ErrorModalProps> = ({ error, setError }) => {
  if (!error) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center gap-3 text-red-600 mb-4">
          <AlertTriangle className="w-6 h-6" />
          <h3 className="text-lg font-semibold">Error</h3>
        </div>
        <p className="text-gray-600 mb-6">{error}</p>
        <div className="flex justify-end">
          <button
            onClick={() => setError(null)}
            className="px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
