import React from 'react';
import { Site, SiteCheckInFormData } from '../types';

interface SiteCheckInFormProps {
  site: Site;
  formData: SiteCheckInFormData;
  isCheckingIn: boolean;
  submitting: boolean;
  success: string | null;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function SiteCheckInForm({
  site,
  formData,
  isCheckingIn,
  submitting,
  success,
  onInputChange,
  onSubmit
}: SiteCheckInFormProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {isCheckingIn ? 'Check In to Site' : 'Check Out from Site'}
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          {site.name} - {site.address}, {site.town}, {site.postcode}
        </p>
      </div>

      <form onSubmit={onSubmit} className="p-6 space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Full Name
            </label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              value={formData.full_name}
              onChange={onInputChange}
              required
              disabled={!isCheckingIn || !!success}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:opacity-70"
            />
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={onInputChange}
              required
              disabled={!isCheckingIn || !!success}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:opacity-70"
            />
          </div>
          
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Company
            </label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={onInputChange}
              required
              disabled={!isCheckingIn || !!success}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:opacity-70"
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={onInputChange}
              required
              disabled={!isCheckingIn || !!success}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:opacity-70"
            />
          </div>
          
          {isCheckingIn && (
            <div className="sm:col-span-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="fit_to_work"
                  name="fit_to_work"
                  checked={formData.fit_to_work}
                  onChange={onInputChange}
                  disabled={!!success}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="fit_to_work" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  I confirm that I am fit to work and not under the influence of alcohol or drugs
                </label>
              </div>
            </div>
          )}
        </div>
        
        {!success && (
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
                isCheckingIn 
                  ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500' 
                  : 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-70`}
            >
              {submitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : isCheckingIn ? (
                'Check In'
              ) : (
                'Check Out'
              )}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
