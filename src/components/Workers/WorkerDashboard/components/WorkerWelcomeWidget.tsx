import React from 'react';
import { WorkerUser } from '../types/workerDashboardTypes';

interface WorkerWelcomeWidgetProps {
  user: WorkerUser | null;
  currentTime: Date;
  companyName: string;
}

export function WorkerWelcomeWidget({ user, currentTime, companyName }: WorkerWelcomeWidgetProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
      <h2>Worker Portal</h2>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        Welcome, {user?.full_name || 'Worker'}
      </h1>
      <p className="text-gray-600 dark:text-gray-300">
        {currentTime.toLocaleDateString('en-GB', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}{' '}
        | {currentTime.toLocaleTimeString('en-GB')}
      </p>
      {user?.company && (
        <p className="text-gray-600 dark:text-gray-300 mt-1">
          Company: {user.company}
        </p>
      )}
      {user?.last_health_questionnaire ? (
        <p className="text-amber-600 dark:text-amber-400 mt-1">
          Health Questionnaire completed on{' '}
          {new Date(user.last_health_questionnaire).toLocaleDateString(
            'en-GB'
          )}
          . Next review will be 6 months time{' '}
          {new Date(
            new Date(user.last_health_questionnaire).setMonth(
              new Date(user.last_health_questionnaire).getMonth() + 6
            )
          ).toLocaleDateString('en-GB')}
        </p>
      ) : (
        <p className="text-red-600 dark:text-red-400 mt-1">
          Health Questionnaire has not been completed. You will need to do
          this every 6 months before you scan a site QR code.
        </p>
      )}
    </div>
  );
}