import React from 'react';
import { RefreshCw } from 'lucide-react';
import type { TokensTabProps } from '../../types';

export function TokensTab({ domains, tokens, onGenerateToken, loading }: TokensTabProps) {
  return (
    <div className="space-y-4">
      <div className="border rounded-md">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Domain
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Token
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {domains.map((domain) => {
                const token = tokens.find(t => t.domain_name === domain.domain_name);
                return (
                  <tr key={domain.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {domain.domain_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {token?.token || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => onGenerateToken(domain.domain_name)}
                        disabled={loading}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                      >
                        <RefreshCw className="h-4 w-4 mr-1" />
                        {token?.token ? 'Regenerate' : 'Generate'} Token
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}