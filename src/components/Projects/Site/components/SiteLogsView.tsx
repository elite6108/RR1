import React from 'react';
import { ChevronLeft as ChevronLeftIcon } from 'lucide-react';
import { Site, SiteLog } from '../types';

interface SiteLogsViewProps {
  site: Site;
  siteLogs: SiteLog[];
  onBackToList: () => void;
}

export function SiteLogsView({ site, siteLogs, onBackToList }: SiteLogsViewProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <button
            onClick={onBackToList}
            className="flex items-center space-x-2 text-sm text-gray-500 dark:text-white mb-6"
          >
            <ChevronLeftIcon className="h-5 w-5 mr-2" />
            Back to Sites
          </button>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              {site.name} - Site Logs
            </h1>
          </div>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Address
              </h3>
              <p className="mt-1 text-base text-gray-900 dark:text-white">
                {site.address}, {site.town}, {site.county}, {site.postcode}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Site Manager
              </h3>
              <p className="mt-1 text-base text-gray-900 dark:text-white">
                {site.site_manager}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Contact
              </h3>
              <p className="mt-1 text-base text-gray-900 dark:text-white">
                {site.phone}
              </p>
            </div>
            {site.what3words && (
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  What3Words
                </h3>
                <div className="flex items-center justify-between">
                  <p className="mt-1 text-base text-gray-900 dark:text-white">
                    {site.what3words}
                  </p>
                  <button
                    onClick={() => window.open('https://what3words.com/', 'w3w_popup', 'width=800,height=600,scrollbars=yes,resizable=yes')}
                    className="ml-2 text-xs text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 underline"
                  >
                    Open W3W
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Logged In
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {siteLogs.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
                    >
                      No logs found for this site
                    </td>
                  </tr>
                ) : (
                  siteLogs.map((log) => (
                    <tr
                      key={log.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {log.full_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {log.company}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        <div>{log.phone}</div>
                        <div className="text-xs">{log.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            log.fit_to_work
                              ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                              : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                          }`}
                        >
                          {log.fit_to_work
                            ? 'Fit to Work'
                            : 'Not Fit to Work'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {new Date(log.logged_in_at).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
