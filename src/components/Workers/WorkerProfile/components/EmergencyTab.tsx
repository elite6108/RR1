import React from 'react';
import { Phone } from 'lucide-react';
import { WorkerFormData, ValidationErrors } from '../utils/profileUtils';

interface EmergencyTabProps {
  formData: WorkerFormData;
  validationErrors: ValidationErrors;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const EmergencyTab: React.FC<EmergencyTabProps> = ({
  formData,
  validationErrors,
  onChange
}) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Emergency Contact Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="emergency_contact_name"
          value={formData.emergency_contact_name}
          onChange={onChange}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500 dark:bg-gray-700 dark:text-white ${
            validationErrors.emergency_contact_name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
          }`}
          required
        />
        {validationErrors.emergency_contact_name && (
          <p className="mt-1 text-xs text-red-500">{validationErrors.emergency_contact_name}</p>
        )}
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Emergency Contact Phone <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Phone className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="tel"
            name="emergency_contact_phone"
            value={formData.emergency_contact_phone}
            onChange={onChange}
            className={`pl-10 w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500 dark:bg-gray-700 dark:text-white ${
              validationErrors.emergency_contact_phone ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
            required
          />
        </div>
        {validationErrors.emergency_contact_phone && (
          <p className="mt-1 text-xs text-red-500">{validationErrors.emergency_contact_phone}</p>
        )}
      </div>
    </div>
  );
};