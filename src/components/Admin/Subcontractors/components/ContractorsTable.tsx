import React from 'react';
import {
  Trash2,
  Pencil,
  FileText,
  ClipboardCheck as ClipboardList,
  Loader2,
  RefreshCw,
  Clipboard,
} from 'lucide-react';
import { Subcontractor } from '../types';
import { formatDate, getDateStatus, getStatusLabel, getStatusStyle, getInsuranceDateStyle, getReviewDateStyle } from '../utils';

interface ContractorsTableProps {
  contractors: Subcontractor[];
  loading: boolean;
  error: string | null;
  successMessage: string | null;
  tokenLoading: string | null;
  generatingPdfId: string | null;
  onEdit: (contractor: Subcontractor) => void;
  onDelete: (id: string) => void;
  onReview: (contractor: Subcontractor) => void;
  onGeneratePDF: (contractor: Subcontractor) => void;
  onGenerateToken: (contractorId: string) => void;
  onCopyToken: (token: string) => void;
}

export const ContractorsTable: React.FC<ContractorsTableProps> = ({
  contractors,
  loading,
  error,
  successMessage,
  tokenLoading,
  generatingPdfId,
  onEdit,
  onDelete,
  onReview,
  onGeneratePDF,
  onGenerateToken,
  onCopyToken,
}) => {
  const renderTableContent = () => {
    if (loading) {
      return (
        <div className="text-center py-4 text-gray-500 dark:text-gray-400">
          Loading...
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center text-red-600 dark:text-red-400 py-4">
          {error}
        </div>
      );
    }

    if (successMessage) {
      return (
        <div className="text-center text-green-600 dark:text-green-400 py-4">
          {successMessage}
        </div>
      );
    }

    if (contractors.length === 0) {
      return (
        <div className="text-center text-gray-500 dark:text-gray-400 py-4">
          No contractors found
        </div>
      );
    }

    return (
      <div className="w-full overflow-x-auto">
        <div className="min-w-full">
          <table className="w-full divide-y divide-gray-200 dark:divide-gray-700 rounded-lg" style={{ minWidth: '900px' }}>
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider first:rounded-tl-lg">
                  Company Name
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Services Provided
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Address
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  SWMS
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Insurance Exp Date
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Review Date
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Token
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider last:rounded-tr-lg">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {contractors.map((contractor) => (
                <tr
                  key={contractor.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                  onClick={() => onEdit(contractor)}
                >
                  <td className="px-3 py-4 text-sm text-gray-900 dark:text-white">
                    <div className="max-w-32 truncate" title={contractor.company_name}>
                      {contractor.company_name}
                    </div>
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-900 dark:text-white">
                    <div className="max-w-32 truncate" title={contractor.services_provided}>
                      {contractor.services_provided}
                    </div>
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-900 dark:text-white">
                    <div className="max-w-32 truncate" title={contractor.address}>
                      {contractor.address}
                    </div>
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-900 dark:text-white">
                    <div className="flex flex-col space-y-1">
                      <div className="max-w-28 truncate text-xs" title={contractor.phone}>
                        {contractor.phone}
                      </div>
                      <div className="max-w-28 truncate text-xs text-gray-500 dark:text-gray-400" title={contractor.email}>
                        {contractor.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap">
                    {contractor.swms ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                        Yes
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200">
                        No
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap">
                    {(() => {
                      const status = getDateStatus(contractor.insurance_exp_date);
                      const label = getStatusLabel(status, 'insurance');
                      const dateStyle = getInsuranceDateStyle(contractor.insurance_exp_date);
                      return (
                        <div className={`${dateStyle} dark:text-white`}>
                          {formatDate(contractor.insurance_exp_date)}
                          {label && (
                            <span
                              className={`ml-2 text-xs font-medium ${
                                status === 'expired'
                                  ? 'text-red-600 dark:text-red-400'
                                  : status === 'due_soon'
                                  ? 'text-orange-600 dark:text-orange-400'
                                  : 'text-gray-600 dark:text-gray-400'
                              }`}
                            >
                              ({label})
                            </span>
                          )}
                        </div>
                      );
                    })()}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap">
                    {(() => {
                      const status = getDateStatus(contractor.review_date);
                      const label = getStatusLabel(status, 'review');
                      const dateStyle = getReviewDateStyle(contractor.review_date);
                      return (
                        <div className={`${dateStyle} dark:text-white`}>
                          {formatDate(contractor.review_date)}
                          {label && (
                            <span
                              className={`ml-2 text-xs font-medium ${
                                status === 'expired'
                                  ? 'text-red-600 dark:text-red-400'
                                  : status === 'due_soon'
                                  ? 'text-orange-600 dark:text-orange-400'
                                  : 'text-gray-600 dark:text-gray-400'
                              }`}
                            >
                              ({label})
                            </span>
                          )}
                        </div>
                      );
                    })()}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs">
                        {contractor.token || '-'}
                      </span>
                      {contractor.token && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onCopyToken(contractor.token!);
                          }}
                          className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                          title="Copy Token"
                        >
                          <Clipboard className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onGenerateToken(contractor.id);
                        }}
                        disabled={tokenLoading === contractor.id}
                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 disabled:opacity-50"
                        title={contractor.token ? 'Regenerate Token' : 'Generate Token'}
                      >
                        <RefreshCw className={`h-4 w-4 ${tokenLoading === contractor.id ? 'animate-spin' : ''}`} />
                      </button>
                    </div>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(contractor);
                        }}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        title="Edit"
                      >
                        <Pencil className="h-5 w-5" />
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onReview(contractor);
                        }}
                        className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                        title="Contractor Review"
                      >
                        <ClipboardList className="h-5 w-5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onGeneratePDF(contractor);
                        }}
                        disabled={generatingPdfId === contractor.id}
                        className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 disabled:opacity-50"
                        title="View PDF"
                      >
                        {generatingPdfId === contractor.id ? (
                          <Loader2 className="h-5 w-5 animate-spin text-green-600" />
                        ) : (
                          <FileText className="h-5 w-5" />
                        )}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(contractor.id);
                        }}
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
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="hidden lg:block">
        {renderTableContent()}
      </div>
    </div>
  );
};
