import React, { useState } from 'react';
import { Pencil, Trash2, Eye } from 'lucide-react';
import { Worker, SortField, SortDirection } from '../types';
import { formatDate, isHealthQuestionnaireOverdue } from '../utils';
import { HealthQuestionnaireModal } from './HealthQuestionnaireModal';

interface WorkersTableProps {
  workers: Worker[];
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
  onEdit: (worker: Worker) => void;
  onDelete: (id: string) => void;
  isAdminView: boolean;
}

export function WorkersTable({ 
  workers, 
  sortField, 
  sortDirection, 
  onSort, 
  onEdit, 
  onDelete,
  isAdminView
}: WorkersTableProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);

  const handleViewQuestionnaire = (worker: Worker) => {
    setSelectedWorker(worker);
    setModalOpen(true);
  };
  return (
    <div className="hidden lg:block">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Photo
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                onClick={() => onSort('full_name')}
              >
                <div className="flex items-center">
                  Full Name
                  {sortField === 'full_name' && (
                    <span className="ml-1">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Contact
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                onClick={() => onSort('last_health_questionnaire')}
              >
                <div className="flex items-center">
                  Health Questionnaire
                  {sortField === 'last_health_questionnaire' && (
                    <span className="ml-1">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Signatures
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {workers.map((worker) => (
              <tr 
                key={worker.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                onClick={() => onEdit(worker)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  {worker.photo_url ? (
                    <img
                      src={worker.photo_url}
                      alt={worker.full_name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                      <span className="text-gray-500 dark:text-gray-400 text-xs font-medium">
                        {worker.full_name?.substring(0, 2).toUpperCase() ||
                          'NA'}
                      </span>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  {worker.full_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {worker.phone || worker.email ? (
                    <div>
                      {worker.phone && (
                        <div>{worker.phone}</div>
                      )}
                      {worker.email && (
                        <div className="text-xs">{worker.email}</div>
                      )}
                    </div>
                  ) : (
                    <span className="text-gray-400 dark:text-gray-500">
                      Not provided
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  <div className="flex items-center space-x-2">
                    <div>
                      {worker.last_health_questionnaire ? (
                        <span className={`font-medium ${
                          isHealthQuestionnaireOverdue(worker.last_health_questionnaire)
                            ? 'text-red-600 dark:text-red-400'
                            : 'text-green-600 dark:text-green-400'
                        }`}>
                          {formatDate(worker.last_health_questionnaire)}
                        </span>
                      ) : (
                        <span className="text-red-600 dark:text-red-400 font-medium">
                          Not provided
                        </span>
                      )}
                    </div>
                    {worker.last_health_questionnaire && isAdminView && (
                      <button
                        onClick={(e: any) => {
                          e.stopPropagation();
                          handleViewQuestionnaire(worker);
                        }}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        title="View Health Questionnaire"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      worker.is_active
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}
                  >
                    {worker.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  <div>
                    <div className={worker.workers_safety_handbook && worker.workers_safety_handbook[0]?.signed_at ? 'text-green-500' : 'text-red-500'}>
                      Employee Handbook: {worker.workers_safety_handbook && worker.workers_safety_handbook[0]?.signed_at ? `Signed ${formatDate(worker.workers_safety_handbook[0].signed_at)}` : 'Not Signed'}
                    </div>
                    <div className={worker.workers_annual_training && worker.workers_annual_training[0]?.signed_at ? 'text-green-500' : 'text-red-500'}>
                      Annual Training: {worker.workers_annual_training && worker.workers_annual_training[0]?.signed_at ? `Signed ${formatDate(worker.workers_annual_training[0].signed_at)}` : 'Not Signed'}
                    </div>
                    <div className="mt-2">
                      <div className="text-gray-700 dark:text-gray-300 font-medium mb-1">Risk Assessments Signed:</div>
                      {worker.workers_risk_assessment_signatures && worker.workers_risk_assessment_signatures.length > 0 ? (
                        <div className="space-y-1">
                          {(() => {
                            // Group signatures by risk assessment ID and get the most recent one for each
                            const latestSignatures = worker.workers_risk_assessment_signatures.reduce((acc, signature) => {
                              const raId = signature.risk_assessments?.ra_id;
                              if (!raId) return acc;
                              
                              if (!acc[raId] || (signature.signed_at && (!acc[raId].signed_at || new Date(signature.signed_at) > new Date(acc[raId].signed_at)))) {
                                acc[raId] = signature;
                              }
                              return acc;
                            }, {} as Record<string, any>);
                            
                            return Object.values(latestSignatures).map((signature, index) => (
                              <div key={index} className="text-green-500 text-xs">
                                {signature.risk_assessments?.ra_id || 'N/A'}<br/>
                                {signature.risk_assessments?.name || 'Unknown Assessment'}<br/>
                                Signed: {signature.signed_at ? formatDate(signature.signed_at) : 'N/A'}
                              </div>
                            ));
                          })()}
                        </div>
                      ) : (
                        <div className="text-red-500 text-xs">No Risk Assessments Signed</div>
                      )}
                    </div>
                    <div className="mt-2">
                      <div className="text-gray-700 dark:text-gray-300 font-medium mb-1">Policies Signed:</div>
                      {(() => {
                        // Show policy signatures based on actual data structure
                        const policySignatures = worker.workers_policy_signatures || [];

                        if (policySignatures.length > 0) {
                          return (
                            <div className="space-y-1">
                              {policySignatures.map((signature, index) => {
                                let policyType = 'Unknown Policy';
                                if (signature.policy_id) {
                                  policyType = 'General Policy';
                                } else if (signature.other_policy_file_id) {
                                  policyType = 'Other Policy';
                                } else if (signature.hs_policy_file_id) {
                                  policyType = 'H&S Policy';
                                }

                                return (
                                  <div key={index} className={signature.signed_at ? "text-green-500 text-xs" : "text-red-500 text-xs"}>
                                    {policyType}<br/>
                                    ID: {signature.policy_id || signature.other_policy_file_id || signature.hs_policy_file_id || 'N/A'}<br/>
                                    {signature.signed_at ? `Signed: ${formatDate(signature.signed_at)}` : 'Not Signed'}
                                  </div>
                                );
                              })}
                            </div>
                          );
                        } else {
                          return <div className="text-red-500 text-xs">No Policies Signed</div>;
                        }
                      })()}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={(e: any) => {
                        e.stopPropagation();
                        onEdit(worker);
                      }}
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                      title="Edit"
                    >
                      <Pencil className="h-5 w-5" />
                    </button>
                    <button
                      onClick={(e: any) => {
                        e.stopPropagation();
                        onDelete(worker.id);
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
      
      {selectedWorker && (
        <HealthQuestionnaireModal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setSelectedWorker(null);
          }}
          workerEmail={selectedWorker.email}
          workerName={selectedWorker.full_name}
        />
      )}
    </div>
  );
}
