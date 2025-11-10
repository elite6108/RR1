import React from 'react';

interface WorkerFormProps {
  formData: {
    full_name: string;
    phone: string;
    email: string;
    company: string;
    emergency_contact_name: string;
    emergency_contact_phone: string;
  };
  loading: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export function WorkerForm({ 
  formData, 
  loading, 
  onInputChange, 
  onSubmit, 
  onCancel 
}: WorkerFormProps) {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg overflow-hidden sm:rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
        Edit Worker
      </h2>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="full_name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Full Name *
            </label>
            <input
              type="text"
              name="full_name"
              id="full_name"
              required
              value={formData.full_name}
              onChange={onInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-lg-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Email *
            </label>
            <input
              type="email"
              name="email"
              id="email"
              required
              value={formData.email}
              onChange={onInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-lg-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Phone *
            </label>
            <input
              type="tel"
              name="phone"
              id="phone"
              required
              value={formData.phone}
              onChange={onInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-lg-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label
              htmlFor="company"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Company *
            </label>
            <input
              type="text"
              name="company"
              id="company"
              required
              value={formData.company}
              onChange={onInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-lg-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label
              htmlFor="emergency_contact_name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Emergency Contact Name *
            </label>
            <input
              type="text"
              name="emergency_contact_name"
              id="emergency_contact_name"
              required
              value={formData.emergency_contact_name}
              onChange={onInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-lg-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label
              htmlFor="emergency_contact_phone"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Emergency Contact Phone *
            </label>
            <input
              type="text"
              name="emergency_contact_phone"
              id="emergency_contact_phone"
              required
              value={formData.emergency_contact_phone}
              onChange={onInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-lg-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-lg-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-lg-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
}
