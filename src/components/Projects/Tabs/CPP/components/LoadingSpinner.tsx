import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
  className?: string;
}

/**
 * Loading spinner component
 */
export function LoadingSpinner({ 
  message = "Loading...", 
  className = "flex items-center justify-center h-48" 
}: LoadingSpinnerProps) {
  return (
    <div className={className}>
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-2"></div>
        {message && (
          <p className="text-gray-500 dark:text-gray-400 text-sm">{message}</p>
        )}
      </div>
    </div>
  );
}
