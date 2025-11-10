import React from 'react';
import { ClipboardSignature } from 'lucide-react';
import { WorkerFormData } from '../utils/profileUtils';

interface NITabProps {
  formData: WorkerFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const NITab: React.FC<NITabProps> = ({
  formData,
  onChange
}) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          National Insurance (Optional)
        </label>
        <input
          type="text"
          name="national_insurance"
          value={formData.national_insurance}
          onChange={onChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Driving Licence Number (Optional)
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <ClipboardSignature className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            name="driving_licence_number"
            value={formData.driving_licence_number}
            onChange={onChange}
            className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
      </div>
    </div>
  );
};