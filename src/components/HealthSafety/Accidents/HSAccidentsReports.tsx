import React from 'react';
import { HSAccidentsReportsMain } from './Reports/components/HSAccidentsReportsMain';
import { HSAccidentsReportsProps } from './Reports/types';

export function HSAccidentsReports({ onBack }: HSAccidentsReportsProps) {
  return <HSAccidentsReportsMain onBack={onBack} />;
}
