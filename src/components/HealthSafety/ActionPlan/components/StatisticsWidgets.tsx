import React from 'react';
import { Check, FileText, Calendar, AlertTriangle } from 'lucide-react';
import SpotlightCard from '../../../../styles/spotlight/SpotlightCard';
import { StatisticsWidgetsProps } from '../types';
import { getItemsDueInDays, getOverdueItems, getReportedIssuesCount } from '../utils/helpers';

export const StatisticsWidgets: React.FC<StatisticsWidgetsProps> = ({ actionPlans }) => {
  return (
    <div className="mt-6">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {/* Total Items Widget */}
        <SpotlightCard
          isDarkMode={document.documentElement.classList.contains('dark')}
          spotlightColor="rgba(251, 113, 133, 0.4)"
          darkSpotlightColor="rgba(251, 113, 133, 0.2)"
          size={400}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 overflow-hidden relative"
        >
          <div className="relative z-10">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mt-1 text-left">
                Total Items
              </h3>
            </div>
            <div className="text-lg font-medium text-gray-900 dark:text-white text-left">
              {actionPlans.length}
            </div>
          </div>
          <div className="absolute -top-5 -right-1 w-16 h-16 pointer-events-none">
            <div className="absolute inset-0 flex items-center justify-center">
              <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-10 dark:opacity-20">
                <path fill="#FFF6F6" d="M48.1,-58.9C61.4,-47.2,70.5,-31.1,74.9,-12.8C79.3,5.5,79,26,70.5,41.2C62,56.4,45.3,66.3,27.5,72.1C9.7,77.9,-9.2,79.5,-25.9,73.8C-42.6,68.1,-57.1,55.1,-66,39.1C-74.9,23.1,-78.2,4.1,-74.6,-13C-71,-30.1,-60.5,-45.2,-47.1,-57C-33.7,-68.8,-16.8,-77.3,0.9,-78.1C18.7,-78.9,37.3,-71.9,48.1,-58.9Z" transform="translate(100 100)" />
              </svg>
            </div>
            <Check className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8" style={{ color: '#e84943' }} />
          </div>
        </SpotlightCard>

        {/* Due in 30 Days Widget */}
        <SpotlightCard
          isDarkMode={document.documentElement.classList.contains('dark')}
          spotlightColor="rgba(251, 113, 133, 0.4)"
          darkSpotlightColor="rgba(251, 113, 133, 0.2)"
          size={400}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 overflow-hidden relative"
        >
          <div className="relative z-10">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mt-1 text-left">
                Due in 30 Days
              </h3>
            </div>
            <div className="text-lg font-medium text-gray-900 dark:text-white text-left">
              {getItemsDueInDays(actionPlans, 30)}
            </div>
          </div>
          <div className="absolute -top-5 -right-1 w-16 h-16 pointer-events-none">
            <div className="absolute inset-0 flex items-center justify-center">
              <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-10 dark:opacity-20">
                <path fill="#FFF6F6" d="M48.1,-58.9C61.4,-47.2,70.5,-31.1,74.9,-12.8C79.3,5.5,79,26,70.5,41.2C62,56.4,45.3,66.3,27.5,72.1C9.7,77.9,-9.2,79.5,-25.9,73.8C-42.6,68.1,-57.1,55.1,-66,39.1C-74.9,23.1,-78.2,4.1,-74.6,-13C-71,-30.1,-60.5,-45.2,-47.1,-57C-33.7,-68.8,-16.8,-77.3,0.9,-78.1C18.7,-78.9,37.3,-71.9,48.1,-58.9Z" transform="translate(100 100)" />
              </svg>
            </div>
            <FileText className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8" style={{ color: '#e84943' }} />
          </div>
        </SpotlightCard>

        {/* Due in 60 Days Widget */}
        <SpotlightCard
          isDarkMode={document.documentElement.classList.contains('dark')}
          spotlightColor="rgba(251, 113, 133, 0.4)"
          darkSpotlightColor="rgba(251, 113, 133, 0.2)"
          size={400}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 overflow-hidden relative"
        >
          <div className="relative z-10">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mt-1 text-left">
                Due in 60 Days
              </h3>
            </div>
            <div className="text-lg font-medium text-gray-900 dark:text-white text-left">
              {getItemsDueInDays(actionPlans, 60)}
            </div>
          </div>
          <div className="absolute -top-5 -right-1 w-16 h-16 pointer-events-none">
            <div className="absolute inset-0 flex items-center justify-center">
              <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-10 dark:opacity-20">
                <path fill="#FFF6F6" d="M48.1,-58.9C61.4,-47.2,70.5,-31.1,74.9,-12.8C79.3,5.5,79,26,70.5,41.2C62,56.4,45.3,66.3,27.5,72.1C9.7,77.9,-9.2,79.5,-25.9,73.8C-42.6,68.1,-57.1,55.1,-66,39.1C-74.9,23.1,-78.2,4.1,-74.6,-13C-71,-30.1,-60.5,-45.2,-47.1,-57C-33.7,-68.8,-16.8,-77.3,0.9,-78.1C18.7,-78.9,37.3,-71.9,48.1,-58.9Z" transform="translate(100 100)" />
              </svg>
            </div>
            <Calendar className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8" style={{ color: '#e84943' }} />
          </div>
        </SpotlightCard>

        {/* Overdue Items Widget */}
        <SpotlightCard
          isDarkMode={document.documentElement.classList.contains('dark')}
          spotlightColor="rgba(239, 68, 68, 0.4)"
          darkSpotlightColor="rgba(239, 68, 68, 0.2)"
          size={400}
          className="bg-red-50 dark:bg-red-900/20 rounded-2xl shadow-lg p-6 overflow-hidden relative border border-red-200 dark:border-red-800"
        >
          <div className="relative z-10">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mt-1 text-left">
                Overdue Items
              </h3>
            </div>
            <div className="text-lg font-medium text-red-600 dark:text-red-400 text-left">
              {getOverdueItems(actionPlans)}
            </div>
          </div>
          <div className="absolute -top-5 -right-1 w-16 h-16 pointer-events-none">
            <div className="absolute inset-0 flex items-center justify-center">
              <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-10 dark:opacity-20">
                <path fill="#FFF6F6" d="M48.1,-58.9C61.4,-47.2,70.5,-31.1,74.9,-12.8C79.3,5.5,79,26,70.5,41.2C62,56.4,45.3,66.3,27.5,72.1C9.7,77.9,-9.2,79.5,-25.9,73.8C-42.6,68.1,-57.1,55.1,-66,39.1C-74.9,23.1,-78.2,4.1,-74.6,-13C-71,-30.1,-60.5,-45.2,-47.1,-57C-33.7,-68.8,-16.8,-77.3,0.9,-78.1C18.7,-78.9,37.3,-71.9,48.1,-58.9Z" transform="translate(100 100)" />
              </svg>
            </div>
            <AlertTriangle className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8" style={{ color: '#dc2626' }} />
          </div>
        </SpotlightCard>

         {/* Issues Reported Widget */}
         <SpotlightCard
          isDarkMode={document.documentElement.classList.contains('dark')}
          spotlightColor="rgba(239, 68, 68, 0.4)"
          darkSpotlightColor="rgba(239, 68, 68, 0.2)"
          size={400}
          className="bg-red-50 dark:bg-red-900/20 rounded-2xl shadow-lg p-6 overflow-hidden relative border border-red-200 dark:border-red-800"
        >
          <div className="relative z-10">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mt-1 text-left">
                Issue Reported
              </h3>
            </div>
            <div className="text-lg font-medium text-red-600 dark:text-red-400 text-left">
              {getReportedIssuesCount(actionPlans)}
            </div>
          </div>
          <div className="absolute -top-5 -right-1 w-16 h-16 pointer-events-none">
            <div className="absolute inset-0 flex items-center justify-center">
              <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-10 dark:opacity-20">
                <path fill="#FFF6F6" d="M48.1,-58.9C61.4,-47.2,70.5,-31.1,74.9,-12.8C79.3,5.5,79,26,70.5,41.2C62,56.4,45.3,66.3,27.5,72.1C9.7,77.9,-9.2,79.5,-25.9,73.8C-42.6,68.1,-57.1,55.1,-66,39.1C-74.9,23.1,-78.2,4.1,-74.6,-13C-71,-30.1,-60.5,-45.2,-47.1,-57C-33.7,-68.8,-16.8,-77.3,0.9,-78.1C18.7,-78.9,37.3,-71.9,48.1,-58.9Z" transform="translate(100 100)" />
              </svg>
            </div>
            <AlertTriangle className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8" style={{ color: '#dc2626' }} />
          </div>
        </SpotlightCard>
      </div>
    </div>
  );
};
