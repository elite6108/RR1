import React from 'react';
import type { TrainingMatrixItem, DueDate } from '../types';
import { getTrainingName, getExpiryColorClass, formatDate } from '../utils/constants';

interface DueDatesDisplayProps {
  training: TrainingMatrixItem;
}

export function DueDatesDisplay({ training }: DueDatesDisplayProps) {
  const dueDates: DueDate[] = [];

  // Add training records with expiry dates
  if (training.training_records && training.training_records.length > 0) {
    training.training_records.forEach((record: any) => {
      if (record.expiry_date) {
        dueDates.push({
          type: 'Training',
          name: getTrainingName(record.training_item_id),
          expiry: record.expiry_date
        });
      }
    });
  }

  // Add cards & tickets with expiry dates
  if (training.cards_tickets && training.cards_tickets.length > 0) {
    training.cards_tickets.forEach((card: any) => {
      if (card.date_expires) {
        dueDates.push({
          type: 'Card/Ticket',
          name: `${card.card_type} (${card.issuer})`,
          expiry: card.date_expires
        });
      }
    });
  }

  // Add certificates with expiry dates
  if (training.certificates && training.certificates.length > 0) {
    training.certificates.forEach((cert: any) => {
      if (cert.date_expires) {
        dueDates.push({
          type: 'Certificate',
          name: cert.certificate_name,
          expiry: cert.date_expires
        });
      }
    });
  }

  if (dueDates.length === 0) {
    return <span className="text-gray-400 text-xs">No expiry dates</span>;
  }

  return (
    <div className="space-y-1">
      {dueDates.map((item, index) => (
        <div key={index} className="text-xs">
          <div className="font-medium text-gray-700 dark:text-gray-300">{item.name}</div>
          <div className="text-gray-500 dark:text-gray-300">
            {item.type}: <span className={getExpiryColorClass(item.expiry)}>{formatDate(item.expiry)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}