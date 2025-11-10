import React from 'react';
import { FileText, Trash2, Loader2 } from 'lucide-react';
import { SignOff } from '../types';

interface SignOffsTableProps {
  signoffs: SignOff[];
  generatingPdfId: string | null;
  onGeneratePDF: (signoff: SignOff) => void;
  onDelete: (signoff: SignOff) => void;
}

export function SignOffsTable({ 
  signoffs, 
  generatingPdfId, 
  onGeneratePDF, 
  onDelete 
}: SignOffsTableProps) {
  return (
    <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {signoffs.map((signoff) => (
            <tr key={signoff.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                {new Date(signoff.created_at).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => onGeneratePDF(signoff)}
                    disabled={generatingPdfId === signoff.id}
                    className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 disabled:opacity-50"
                    title="Generate PDF"
                  >
                    {generatingPdfId === signoff.id ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <FileText className="h-5 w-5" />
                    )}
                  </button>
                  <button
                    onClick={() => onDelete(signoff)}
                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                    title="Delete"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
