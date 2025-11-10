import React from 'react';

interface ReportDetailsStepProps {
  autoId: string;
  isLoadingId: boolean;
  reportType: string;
  category: string;
}

export default function ReportDetailsStep({
  autoId,
  isLoadingId,
  reportType,
  category
}: ReportDetailsStepProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">ID</label>
        <input 
          type="text" 
          value={isLoadingId ? 'Loading...' : autoId} 
          readOnly 
          disabled 
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white" 
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Report Type</label>
        <input 
          type="text" 
          value={reportType} 
          readOnly 
          disabled 
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white" 
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
        <input 
          type="text" 
          value={category} 
          readOnly 
          disabled 
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white" 
        />
      </div>
    </div>
  );
}
