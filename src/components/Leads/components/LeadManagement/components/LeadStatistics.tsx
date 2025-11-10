import React from 'react';
import { Snowflake, TrendingUp } from 'lucide-react';
import { Lead } from '../../shared/types';
import { getLeadsByStatusAndPeriod } from '../../shared/utils';
import { StatisticCard } from './StatisticCard';

interface LeadStatisticsProps {
  leads: Lead[];
}

export function LeadStatistics({ leads }: LeadStatisticsProps) {
  const getColdLeads = (days: number | null) => getLeadsByStatusAndPeriod(leads, 'cold', days);
  const getConvertedLeads = (days: number | null) => getLeadsByStatusAndPeriod(leads, 'converted', days);

  const coldLeadsData = [
    { period: 'Past 30 Days', value: getColdLeads(30) },
    { period: 'Past 6 Months', value: getColdLeads(180) },
    { period: 'Past 12 Months', value: getColdLeads(365) },
    { period: 'All Time', value: getColdLeads(null) },
  ];

  const convertedLeadsData = [
    { period: 'Past 30 Days', value: getConvertedLeads(30) },
    { period: 'Past 6 Months', value: getConvertedLeads(180) },
    { period: 'Past 12 Months', value: getConvertedLeads(365) },
    { period: 'All Time', value: getConvertedLeads(null) },
  ];

  return (
    <div className="mt-6">
      {/* Cold Leads Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {coldLeadsData.map((data, index) => (
          <StatisticCard
            key={`cold-${index}`}
            title="Cold Leads"
            subtitle={data.period}
            value={data.value}
            icon={<Snowflake className="w-8 h-8" />}
            color="#9ca3af"
          />
        ))}
      </div>

      {/* Converted Leads Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {convertedLeadsData.map((data, index) => (
          <StatisticCard
            key={`converted-${index}`}
            title="Converted Leads"
            subtitle={data.period}
            value={data.value}
            icon={<TrendingUp className="w-8 h-8" />}
            color="#22c55e"
            backgroundColor="bg-green-50 dark:bg-green-900/20"
            borderColor="border-green-200 dark:border-green-800"
            textColor="text-green-600 dark:text-green-400"
          />
        ))}
      </div>
    </div>
  );
}
