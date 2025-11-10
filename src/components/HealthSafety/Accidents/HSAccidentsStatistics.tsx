import React from 'react';
import { HSAccidentsStatisticsMain } from './Statistics/components/HSAccidentsStatisticsMain';
import { HSAccidentsStatisticsProps } from './Statistics/types';

export function HSAccidentsStatistics({ onBack }: HSAccidentsStatisticsProps) {
  return <HSAccidentsStatisticsMain onBack={onBack} />;
}
