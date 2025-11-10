import React, { useState } from 'react';
import { Pencil, Trash2, Eye } from 'lucide-react';
import { Worker } from '../types';
import { formatDate, isHealthQuestionnaireOverdue } from '../utils';
import { HealthQuestionnaireModal } from './HealthQuestionnaireModal';

interface WorkersCardsProps {
  workers: Worker[];
  onEdit: (worker: Worker) => void;
  onDelete: (id: string) => void;
  isAdminView: boolean;
}

export function WorkersCards({ workers, onEdit, onDelete, isAdminView }: WorkersCardsProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);

  const handleViewQuestionnaire = (worker: Worker) => {
    setSelectedWorker(worker);
    setModalOpen(true);
  };
  return (
    <div className="lg:hidden">
      <div className="space-y-4 p-4">
        {workers.map((worker) => (
          <div 
            key={worker.id} 
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-gray-200 dark:border-gray-700 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => onEdit(worker)}
          >
            <div className="flex items-start space-x-4 mb-3">
              {/* Photo */}
              <div className="flex-shrink-0">
                {worker.photo_url ? (
                  <img
                    src={worker.photo_url}
                    alt={worker.full_name}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                    <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                      {worker.full_name?.substring(0, 2).toUpperCase() || 'NA'}
                    </span>
                  </div>
                )}
              </div>
              
              {/* Name and Status */}
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                  {worker.full_name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {worker.company}
                </p>
              </div>
              
              {/* Status Badge */}
              <div className="flex-shrink-0">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    worker.is_active
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}
                >
                  {worker.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>

            {/* Contact Info and Details */}
            <div className="space-y-2 text-sm mb-4">
              {(worker.phone || worker.email) && (
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Contact:</span>
                  <div className="text-gray-900 dark:text-white text-right">
                    {worker.phone && <div>{worker.phone}</div>}
                    {worker.email && <div className="text-xs">{worker.email}</div>}
                  </div>
                </div>
              )}
              
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Health Questionnaire:</span>
                <div className="flex items-center space-x-2">
                  <span className={`font-medium ${
                    worker.last_health_questionnaire
                      ? isHealthQuestionnaireOverdue(worker.last_health_questionnaire)
                        ? 'text-red-600 dark:text-red-400'
                        : 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {worker.last_health_questionnaire 
                      ? formatDate(worker.last_health_questionnaire)
                      : 'Not provided'
                    }
                  </span>
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
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Emergency Contact:</span>
                <div className="text-gray-900 dark:text-white text-right">
                  {worker.emergency_contact_name && (
                    <div>{worker.emergency_contact_name}</div>
                  )}
                  {worker.emergency_contact_phone && (
                    <div className="text-xs">{worker.emergency_contact_phone}</div>
                  )}
                  {!worker.emergency_contact_name && !worker.emergency_contact_phone && (
                    <span className="text-gray-400 dark:text-gray-500">Not provided</span>
                  )}
                </div>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Signatures:</span>
                <div className="text-right">
                  <div className={worker.workers_safety_handbook && worker.workers_safety_handbook[0]?.signed_at ? 'text-green-500' : 'text-red-500'}>
                    Employee Handbook: {worker.workers_safety_handbook && worker.workers_safety_handbook[0]?.signed_at ? `Signed ${formatDate(worker.workers_safety_handbook[0].signed_at)}` : 'Not Signed'}
                  </div>
                  <div className={worker.workers_annual_training && worker.workers_annual_training[0]?.signed_at ? 'text-green-500' : 'text-red-500'}>
                    Annual Training: {worker.workers_annual_training && worker.workers_annual_training[0]?.signed_at ? `Signed ${formatDate(worker.workers_annual_training[0].signed_at)}` : 'Not Signed'}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Risk Assessments Signed:</span>
                <div className="text-right">
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
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-2 pt-3 border-t border-gray-200 dark:border-gray-600">
              <button
                onClick={(e: any) => {
                  e.stopPropagation();
                  onEdit(worker);
                }}
                className="p-2 text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md"
                title="Edit"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                onClick={(e: any) => {
                  e.stopPropagation();
                  onDelete(worker.id);
                }}
                className="p-2 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md"
                title="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
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
