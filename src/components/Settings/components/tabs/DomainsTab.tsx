import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { DomainsTabProps } from '../../types';

export function DomainsTab({ 
  domains, 
  newDomain, 
  setNewDomain, 
  onAddDomain, 
  onDeleteDomain, 
  loading 
}: DomainsTabProps) {
  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <input
          type="text"
          value={newDomain}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setNewDomain(e.target.value)
          }
          placeholder="Enter domain name"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
        <button
          onClick={onAddDomain}
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>

      <div className="border rounded-md">
        <div
          className="overflow-y-auto"
          style={{ maxHeight: '400px' }}
        >
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Domain Name
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {domains.map((domain) => (
                <tr key={domain.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {domain.domain_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => onDeleteDomain(domain)}
                      disabled={loading}
                      className="text-red-600 hover:text-red-900 disabled:opacity-50"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}