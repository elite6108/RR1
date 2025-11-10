import React, { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { HSAccidentsActions } from './HSAccidentsActions';
import { HSAccidentsReports } from './HSAccidentsReports';
import { HSAccidentsStatistics } from './HSAccidentsStatistics';
import { HSAccidentsAnnualStats } from './HSAccidentsAnnualStats';
import { HSAccidentsOverview } from './Accidents/components/HSAccidentsOverview';
import { HSAccidentsNavigation } from './Accidents/components/HSAccidentsNavigation';
import { useAccidentStats } from './Accidents/hooks/useAccidentStats';
import { HSAccidentsProps } from './Accidents/types';

export function HSAccidents({ onBack, onShowReportingDashboard }: HSAccidentsProps) {
  const [showActions, setShowActions] = useState(false);
  const [showReports, setShowReports] = useState(false);
  const [showStatistics, setShowStatistics] = useState(false);
  const [showAnnualStats, setShowAnnualStats] = useState(false);
  
  const { stats, fetchStats } = useAccidentStats();

  if (showActions) {
    return <HSAccidentsActions onBack={() => setShowActions(false)} />;
  }

  if (showReports) {
    return <HSAccidentsReports onBack={() => setShowReports(false)} />;
  }

  if (showStatistics) {
    return <HSAccidentsStatistics onBack={() => setShowStatistics(false)} />;
  }

  if (showAnnualStats) {
    return <HSAccidentsAnnualStats onBack={() => setShowAnnualStats(false)} />;
  }

  return (
    <>
      {/* Breadcrumb Navigation */}
      <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-white mb-6">
        <button
          onClick={onShowReportingDashboard || onBack}
          className="flex items-center text-gray-600 hover:text-gray-900 dark:text-white dark:hover:text-gray-200"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Reporting
        </button>
      </div>

      <div className="space-y-6">
        <HSAccidentsOverview stats={stats} onRefresh={fetchStats} />
        <HSAccidentsNavigation
          onShowActions={() => setShowActions(true)}
          onShowReports={() => setShowReports(true)}
          onShowStatistics={() => setShowStatistics(true)}
          onShowAnnualStats={() => setShowAnnualStats(true)}
        />
      </div>
    </>
  );
}
