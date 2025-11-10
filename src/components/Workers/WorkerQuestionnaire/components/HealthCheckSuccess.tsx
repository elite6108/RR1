import React from 'react';

export const HealthCheckSuccess: React.FC = () => (
  <div className="text-center py-8">
    <svg 
      className="h-16 w-16 mx-auto text-green-500 mb-4" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
    <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
      Health Check Completed
    </h2>
    <p className="text-gray-600 dark:text-gray-300 mb-4">
      Your health check has been successfully submitted.
    </p>
  </div>
);
