import React from 'react';
import { Clipboard, FileText, BarChart, Calendar } from 'lucide-react';
import SpotlightCard from '../../../../../styles/spotlight/SpotlightCard';

interface HSAccidentsNavigationProps {
  onShowActions: () => void;
  onShowReports: () => void;
  onShowStatistics: () => void;
  onShowAnnualStats: () => void;
}

export function HSAccidentsNavigation({
  onShowActions,
  onShowReports,
  onShowStatistics,
  onShowAnnualStats
}: HSAccidentsNavigationProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Actions Widget */}
      <SpotlightCard
        isDarkMode={document.documentElement.classList.contains('dark')}
        spotlightColor="rgba(251, 113, 133, 0.4)"
        darkSpotlightColor="rgba(251, 113, 133, 0.2)"
        size={400}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 overflow-hidden relative"
      >
        <button
          onClick={onShowActions}
          className="w-full text-left focus:outline-none"
        >
          <div className="relative z-10">
            <div className="mb-6">
              <p className="text-3xl font-bold text-pink-300 dark:text-pink-400 text-left">
                01
              </p>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mt-1 text-left">
                Actions
              </h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 text-left">
              View and manage accident actions
            </p>
          </div>
          <div className="absolute -top-5 -right-1 w-16 h-16 pointer-events-none">
            <div className="absolute inset-0 flex items-center justify-center">
              <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-10 dark:opacity-20">
                <path fill="#fff7f6" d="M48.1,-58.9C61.4,-47.2,70.5,-31.1,74.9,-12.8C79.3,5.5,79,26,70.5,41.2C62,56.4,45.3,66.3,27.5,72.1C9.7,77.9,-9.2,79.5,-25.9,73.8C-42.6,68.1,-57.1,55.1,-66,39.1C-74.9,23.1,-78.2,4.1,-74.6,-13C-71,-30.1,-60.5,-45.2,-47.1,-57C-33.7,-68.8,-16.8,-77.3,0.9,-78.1C18.7,-78.9,37.3,-71.9,48.1,-58.9Z" transform="translate(100 100)" />
              </svg>
            </div>
            <Clipboard className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8" style={{ color: '#e84943' }} />
          </div>
        </button>
      </SpotlightCard>

      {/* Reports Widget */}
      <SpotlightCard
        isDarkMode={document.documentElement.classList.contains('dark')}
        spotlightColor="rgba(251, 113, 133, 0.4)"
        darkSpotlightColor="rgba(251, 113, 133, 0.2)"
        size={400}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 overflow-hidden relative"
      >
        <button
          onClick={onShowReports}
          className="w-full text-left focus:outline-none"
        >
          <div className="relative z-10">
            <div className="mb-6">
              <p className="text-3xl font-bold text-pink-300 dark:text-pink-400 text-left">
                02
              </p>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mt-1 text-left">
                Reports
              </h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 text-left">
              Access accident reports
            </p>
          </div>
          <div className="absolute -top-5 -right-1 w-16 h-16 pointer-events-none">
            <div className="absolute inset-0 flex items-center justify-center">
              <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-10 dark:opacity-20">
                <path fill="#fff7f6" d="M48.1,-58.9C61.4,-47.2,70.5,-31.1,74.9,-12.8C79.3,5.5,79,26,70.5,41.2C62,56.4,45.3,66.3,27.5,72.1C9.7,77.9,-9.2,79.5,-25.9,73.8C-42.6,68.1,-57.1,55.1,-66,39.1C-74.9,23.1,-78.2,4.1,-74.6,-13C-71,-30.1,-60.5,-45.2,-47.1,-57C-33.7,-68.8,-16.8,-77.3,0.9,-78.1C18.7,-78.9,37.3,-71.9,48.1,-58.9Z" transform="translate(100 100)" />
              </svg>
            </div>
            <FileText className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8" style={{ color: '#e84943' }} />
          </div>
        </button>
      </SpotlightCard>

      {/* Statistics Widget */}
      <SpotlightCard
        isDarkMode={document.documentElement.classList.contains('dark')}
        spotlightColor="rgba(251, 113, 133, 0.4)"
        darkSpotlightColor="rgba(251, 113, 133, 0.2)"
        size={400}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 overflow-hidden relative"
      >
        <button
          onClick={onShowStatistics}
          className="w-full text-left focus:outline-none"
        >
          <div className="relative z-10">
            <div className="mb-6">
              <p className="text-3xl font-bold text-pink-300 dark:text-pink-400 text-left">
                03
              </p>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mt-1 text-left">
                Statistics
              </h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 text-left">
              View accident statistics
            </p>
          </div>
          <div className="absolute -top-5 -right-1 w-16 h-16 pointer-events-none">
            <div className="absolute inset-0 flex items-center justify-center">
              <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-10 dark:opacity-20">
                <path fill="#fff7f6" d="M48.1,-58.9C61.4,-47.2,70.5,-31.1,74.9,-12.8C79.3,5.5,79,26,70.5,41.2C62,56.4,45.3,66.3,27.5,72.1C9.7,77.9,-9.2,79.5,-25.9,73.8C-42.6,68.1,-57.1,55.1,-66,39.1C-74.9,23.1,-78.2,4.1,-74.6,-13C-71,-30.1,-60.5,-45.2,-47.1,-57C-33.7,-68.8,-16.8,-77.3,0.9,-78.1C18.7,-78.9,37.3,-71.9,48.1,-58.9Z" transform="translate(100 100)" />
              </svg>
            </div>
            <BarChart className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8" style={{ color: '#e84943' }} />
          </div>
        </button>
      </SpotlightCard>

      {/* Annual Statistics Widget */}
      <SpotlightCard
        isDarkMode={document.documentElement.classList.contains('dark')}
        spotlightColor="rgba(251, 113, 133, 0.4)"
        darkSpotlightColor="rgba(251, 113, 133, 0.2)"
        size={400}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 overflow-hidden relative"
      >
        <button
          onClick={onShowAnnualStats}
          className="w-full text-left focus:outline-none"
        >
          <div className="relative z-10">
            <div className="mb-6">
              <p className="text-3xl font-bold text-pink-300 dark:text-pink-400 text-left">
                04
              </p>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mt-1 text-left">
                Annual Statistics
              </h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 text-left">
              View yearly accident data
            </p>
          </div>
          <div className="absolute -top-5 -right-1 w-16 h-16 pointer-events-none">
            <div className="absolute inset-0 flex items-center justify-center">
              <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-10 dark:opacity-20">
                <path fill="#fff7f6" d="M48.1,-58.9C61.4,-47.2,70.5,-31.1,74.9,-12.8C79.3,5.5,79,26,70.5,41.2C62,56.4,45.3,66.3,27.5,72.1C9.7,77.9,-9.2,79.5,-25.9,73.8C-42.6,68.1,-57.1,55.1,-66,39.1C-74.9,23.1,-78.2,4.1,-74.6,-13C-71,-30.1,-60.5,-45.2,-47.1,-57C-33.7,-68.8,-16.8,-77.3,0.9,-78.1C18.7,-78.9,37.3,-71.9,48.1,-58.9Z" transform="translate(100 100)" />
              </svg>
            </div>
            <Calendar className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8" style={{ color: '#e84943' }} />
          </div>
        </button>
      </SpotlightCard>
    </div>
  );
}
