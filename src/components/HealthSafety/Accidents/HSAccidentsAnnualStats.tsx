import React from 'react';
import { HSAccidentsAnnualStatsMain } from './Statistics/components/HSAccidentsAnnualStatsMain';
import { HSAccidentsAnnualStatsProps } from './Statistics/types';

export function HSAccidentsAnnualStats({ onBack }: HSAccidentsAnnualStatsProps) {
  return <HSAccidentsAnnualStatsMain onBack={onBack} />;
}