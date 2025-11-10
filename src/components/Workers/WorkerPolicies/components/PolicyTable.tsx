import React from 'react';
import { Search, ChevronUp, ChevronDown } from 'lucide-react';
import { PolicyData, SortConfig, getSignatureStatus, handleSort } from '../utils/policyUtils';

interface PolicyTableProps {
  policies: PolicyData[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortConfig: SortConfig | null;
  setSortConfig: (config: SortConfig | null) => void;
  onOpenPolicy: (policy: PolicyData) => void;
  error: string | null;
}

export const PolicyTable: React.FC<PolicyTableProps> = ({
  policies,
  searchQuery,
  setSearchQuery,
  sortConfig,
  setSortConfig,
  onOpenPolicy,
  error
}) => {
  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search policies..."
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 p-4 rounded-md">
            {error}
          </div>
        )}

        {policies.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">
              {searchQuery ? 'No matching policies found' : 'No policies available'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 rounded-lg overflow-hidden">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('name', sortConfig, setSortConfig)}
                  >
                    <div className="flex items-center gap-2">
                      Policy Name
                      {sortConfig?.key === 'name' && (
                        sortConfig.direction === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('created_at', sortConfig, setSortConfig)}
                  >
                    <div className="flex items-center gap-2">
                      Created
                      {sortConfig?.key === 'created_at' && (
                        sortConfig.direction === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('last_signed', sortConfig, setSortConfig)}
                  >
                    <div className="flex items-center gap-2">
                      Last Signed
                      {sortConfig?.key === 'last_signed' && (
                        sortConfig.direction === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Source
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">View</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {policies.map((policy) => (
                  <tr key={`${policy.source}-${policy.id}`} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td 
                      className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white cursor-pointer hover:text-amber-500 dark:hover:text-amber-400"
                      onClick={() => onOpenPolicy(policy)}
                    >
                      {policy.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(policy.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {(() => {
                        const status = getSignatureStatus(policy.last_signed);
                        return (
                          <span className={status.className}>
                            {status.text}
                          </span>
                        );
                      })()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {policy.source === 'hs_policy_files' ? 'Health & Safety' : 'Other'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => onOpenPolicy(policy)}
                        className="text-amber-500 hover:text-amber-600 dark:hover:text-amber-400"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                          <polyline points="14 2 14 8 20 8"></polyline>
                          <line x1="16" x2="8" y1="13" y2="13"></line>
                          <line x1="16" x2="8" y1="17" y2="17"></line>
                          <line x1="10" x2="8" y1="9" y2="9"></line>
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};