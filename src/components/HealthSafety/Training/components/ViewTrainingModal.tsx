import React from 'react';
import type { ViewTrainingModalProps } from '../types';
import { getTrainingName, formatDate } from '../utils/constants';
import { FormContainer, FormHeader, FormContent } from '../../../../utils/form';

export function ViewTrainingModal({ 
  isOpen, 
  selectedTraining, 
  certificateUrls, 
  onClose 
}: ViewTrainingModalProps) {
  if (!selectedTraining) return null;

  return (
    <FormContainer isOpen={isOpen} maxWidth="4xl">
      <FormHeader 
        title={`Training Details - ${selectedTraining.name}`}
        onClose={onClose}
      />
      <FormContent>
        <div className="space-y-6">
          {/* Staff Info */}
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Staff Information</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              <strong>Name:</strong> {selectedTraining.name}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              <strong>Position:</strong> {selectedTraining.position}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              <strong>Created:</strong> {formatDate(selectedTraining.created_at)}
            </p>
          </div>

          {/* Training Records */}
          {selectedTraining.training_records && selectedTraining.training_records.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Training Records</h3>
              <div className="space-y-3">
                {selectedTraining.training_records.map((record: any, index: number) => (
                  <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Training</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{getTrainingName(record.training_item_id)}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Status</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{record.status}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Stage</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{record.stage}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Date Added</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{record.date_added}</p>
                      </div>
                      {record.expiry_date && (
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Expiry Date</p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">{record.expiry_date}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cards & Tickets */}
          {selectedTraining.cards_tickets && selectedTraining.cards_tickets.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Cards & Tickets</h3>
              <div className="space-y-3">
                {selectedTraining.cards_tickets.map((card: any, index: number) => (
                  <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Issuer</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{card.issuer}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Card Type</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{card.card_type}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Card Number</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{card.card_number}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Date Added</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{card.date_added}</p>
                      </div>
                      {card.date_expires && (
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Expires</p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">{card.date_expires}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certificates */}
          {selectedTraining.certificates && selectedTraining.certificates.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Certificates</h3>
              <div className="space-y-3">
                {selectedTraining.certificates.map((cert: any, index: number) => (
                  <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Certificate Name</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{cert.certificate_name}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Date Added</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{formatDate(cert.date_added)}</p>
                      </div>
                      {cert.date_expires && (
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Expires</p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">{formatDate(cert.date_expires)}</p>
                        </div>
                      )}
                      {cert.file_path && (
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">File</p>
                          {certificateUrls[`cert-${index}`] ? (
                            <a 
                              href={certificateUrls[`cert-${index}`]} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-sm text-indigo-600 hover:text-indigo-500 dark:text-yellow-400 dark:hover:text-yellow-300"
                            >
                              View Certificate
                            </a>
                          ) : (
                            <span className="text-sm text-gray-500">Loading...</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No data message */}
          {(!selectedTraining.training_records || selectedTraining.training_records.length === 0) &&
           (!selectedTraining.cards_tickets || selectedTraining.cards_tickets.length === 0) &&
           (!selectedTraining.certificates || selectedTraining.certificates.length === 0) && (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">No training data available for this staff member.</p>
            </div>
          )}
        </div>
      </FormContent>
    </FormContainer>
  );
}