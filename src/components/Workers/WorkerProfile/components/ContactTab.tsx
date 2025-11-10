import React from 'react';
import { Mail, Phone } from 'lucide-react';
import { WorkerFormData, ValidationErrors } from '../utils/profileUtils';

interface ContactTabProps {
  formData: WorkerFormData;
  validationErrors: ValidationErrors;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ContactTab: React.FC<ContactTabProps> = ({
  formData,
  validationErrors,
  onChange
}) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Email <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Mail className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={onChange}
            className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white bg-gray-100 dark:bg-gray-600"
            required
            readOnly
          />
        </div>
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          If you would like to change your email, please contact your administrator or customer services.
        </p>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Phone <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Phone className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={onChange}
            className={`pl-10 w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500 dark:bg-gray-700 dark:text-white ${
              validationErrors.phone ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
            required
          />
        </div>
        {validationErrors.phone && (
          <p className="mt-1 text-xs text-red-500">{validationErrors.phone}</p>
        )}
      </div>
    </div>
  );
};