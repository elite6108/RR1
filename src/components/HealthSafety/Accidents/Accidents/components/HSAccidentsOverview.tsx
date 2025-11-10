import React from 'react';
import { FileText, FileCheck, ClipboardCheck } from 'lucide-react';
import SpotlightCard from '../../../../../styles/spotlight/SpotlightCard';
import { AccidentStats } from '../types';

interface HSAccidentsOverviewProps {
  stats: AccidentStats;
  onRefresh?: () => void;
}

export function HSAccidentsOverview({ stats, onRefresh }: HSAccidentsOverviewProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Accident Overview
        </h2>
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
          >
            Refresh Stats
          </button>
        )}
      </div>
      <p>The system will check every minute for new reports and update the counts below.</p>
      
      {/* Main Statistics - 3 Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Reports */}
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
                Total Reports
              </h3>
            </div>
            <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 text-left">
              {stats.totalReports}
            </div>
          </div>
          <div className="absolute -top-5 -right-1 w-16 h-16 pointer-events-none">
            <div className="absolute inset-0 flex items-center justify-center">
              <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-10 dark:opacity-20">
                <path fill="#fff7f6" d="M48.1,-58.9C61.4,-47.2,70.5,-31.1,74.9,-12.8C79.3,5.5,79,26,70.5,41.2C62,56.4,45.3,66.3,27.5,72.1C9.7,77.9,-9.2,79.5,-25.9,73.8C-42.6,68.1,-57.1,55.1,-66,39.1C-74.9,23.1,-78.2,4.1,-74.6,-13C-71,-30.1,-60.5,-45.2,-47.1,-57C-33.7,-68.8,-16.8,-77.3,0.9,-78.1C18.7,-78.9,37.3,-71.9,48.1,-58.9Z" transform="translate(100 100)" />
              </svg>
            </div>
            <FileText className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8" style={{ color: '#e84943' }} />
          </div>
        </SpotlightCard>

        {/* Pending Actions */}
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
                Pending Actions
              </h3>
            </div>
            <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 text-left">
              {stats.pendingActions}
            </div>
          </div>
          <div className="absolute -top-5 -right-1 w-16 h-16 pointer-events-none">
            <div className="absolute inset-0 flex items-center justify-center">
              <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-10 dark:opacity-20">
                <path fill="#fff7f6" d="M48.1,-58.9C61.4,-47.2,70.5,-31.1,74.9,-12.8C79.3,5.5,79,26,70.5,41.2C62,56.4,45.3,66.3,27.5,72.1C9.7,77.9,-9.2,79.5,-25.9,73.8C-42.6,68.1,-57.1,55.1,-66,39.1C-74.9,23.1,-78.2,4.1,-74.6,-13C-71,-30.1,-60.5,-45.2,-47.1,-57C-33.7,-68.8,-16.8,-77.3,0.9,-78.1C18.7,-78.9,37.3,-71.9,48.1,-58.9Z" transform="translate(100 100)" />
              </svg>
            </div>
            <FileCheck className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8" style={{ color: '#e84943' }} />
          </div>
        </SpotlightCard>

        {/* Days Since Last Incident */}
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
                Days Since Last Incident
              </h3>
            </div>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 text-left">
              {stats.daysSinceLastIncident}
            </div>
          </div>
          <div className="absolute -top-5 -right-1 w-16 h-16 pointer-events-none">
            <div className="absolute inset-0 flex items-center justify-center">
              <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-10 dark:opacity-20">
                <path fill="#fff7f6" d="M48.1,-58.9C61.4,-47.2,70.5,-31.1,74.9,-12.8C79.3,5.5,79,26,70.5,41.2C62,56.4,45.3,66.3,27.5,72.1C9.7,77.9,-9.2,79.5,-25.9,73.8C-42.6,68.1,-57.1,55.1,-66,39.1C-74.9,23.1,-78.2,4.1,-74.6,-13C-71,-30.1,-60.5,-45.2,-47.1,-57C-33.7,-68.8,-16.8,-77.3,0.9,-78.1C18.7,-78.9,37.3,-71.9,48.1,-58.9Z" transform="translate(100 100)" />
              </svg>
            </div>
            <ClipboardCheck className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8" style={{ color: '#e84943' }} />
          </div>
        </SpotlightCard>
      </div>

      {/* YTD Statistics */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Year to Date Statistics
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {/* 7 Day Incapacitation */}
          <SpotlightCard
            isDarkMode={document.documentElement.classList.contains('dark')}
            spotlightColor="rgba(233, 213, 255, 0.4)"
            darkSpotlightColor="rgba(233, 213, 255, 0.2)"
            size={200}
            className="bg-grey dark:bg-gray-800 rounded-2xl shadow-lg p-4 overflow-hidden relative"
          >
            <div className="relative z-10">
              <div className="mb-3">
                
                <h4 className="text-sm font-bold text-gray-800 dark:text-white text-left">
                  7 Day Incapacitation
                </h4>
              </div>
              <div className="text-xl font-bold text-gray-900 dark:text-white text-left">
                {stats.sevenDayIncapacitation}
              </div>
            </div>
          </SpotlightCard>

          {/* Fatality */}
          <SpotlightCard
            isDarkMode={document.documentElement.classList.contains('dark')}
            spotlightColor="rgba(254, 202, 202, 0.4)"
            darkSpotlightColor="rgba(254, 202, 202, 0.2)"
            size={200}
            className="bg-grey dark:bg-gray-800 rounded-2xl shadow-lg p-4 overflow-hidden relative"
          >
            <div className="relative z-10">
              <div className="mb-3">
               
                <h4 className="text-sm font-bold text-gray-800 dark:text-white text-left">
                  Fatality
                </h4>
              </div>
              <div className="text-xl font-bold text-red-600 dark:text-red-400 text-left">
                {stats.fatality}
              </div>
            </div>
          </SpotlightCard>

          {/* Hospital Treatment */}
          <SpotlightCard
            isDarkMode={document.documentElement.classList.contains('dark')}
            spotlightColor="rgba(167, 243, 208, 0.4)"
            darkSpotlightColor="rgba(167, 243, 208, 0.2)"
            size={200}
            className="bg-grey dark:bg-gray-800 rounded-2xl shadow-lg p-4 overflow-hidden relative"
          >
            <div className="relative z-10">
              <div className="mb-3">
               
                <h4 className="text-sm font-bold text-gray-800 dark:text-white text-left">
                  Hospital Treatment
                </h4>
              </div>
              <div className="text-xl font-bold text-gray-900 dark:text-white text-left">
                {stats.hospitalTreatment}
              </div>
            </div>
          </SpotlightCard>

          {/* Ill Health */}
          <SpotlightCard
            isDarkMode={document.documentElement.classList.contains('dark')}
            spotlightColor="rgba(253, 230, 138, 0.4)"
            darkSpotlightColor="rgba(253, 230, 138, 0.2)"
            size={200}
            className="bg-grey dark:bg-gray-800 rounded-2xl shadow-lg p-4 overflow-hidden relative"
          >
            <div className="relative z-10">
              <div className="mb-3">
              
                <h4 className="text-sm font-bold text-gray-800 dark:text-white text-left">
                  Ill Health
                </h4>
              </div>
              <div className="text-xl font-bold text-gray-900 dark:text-white text-left">
                {stats.illHealth}
              </div>
            </div>
          </SpotlightCard>

          {/* Minor Accident */}
          <SpotlightCard
            isDarkMode={document.documentElement.classList.contains('dark')}
            spotlightColor="rgba(196, 181, 253, 0.4)"
            darkSpotlightColor="rgba(196, 181, 253, 0.2)"
            size={200}
            className="bg-grey dark:bg-gray-800 rounded-2xl shadow-lg p-4 overflow-hidden relative"
          >
            <div className="relative z-10">
              <div className="mb-3">
              
                <h4 className="text-sm font-bold text-gray-800 dark:text-white text-left">
                  Minor Accident
                </h4>
              </div>
              <div className="text-xl font-bold text-gray-900 dark:text-white text-left">
                {stats.minorAccident}
              </div>
            </div>
          </SpotlightCard>

          {/* Non Fatal */}
          <SpotlightCard
            isDarkMode={document.documentElement.classList.contains('dark')}
            spotlightColor="rgba(134, 239, 172, 0.4)"
            darkSpotlightColor="rgba(134, 239, 172, 0.2)"
            size={200}
            className="bg-grey dark:bg-gray-800 rounded-2xl shadow-lg p-4 overflow-hidden relative"
          >
            <div className="relative z-10">
              <div className="mb-3">
               
                <h4 className="text-sm font-bold text-gray-800 dark:text-white text-left">
                  Non Fatal
                </h4>
              </div>
              <div className="text-xl font-bold text-gray-900 dark:text-white text-left">
                {stats.nonFatal}
              </div>
            </div>
          </SpotlightCard>

          {/* Occupational Disease */}
          <SpotlightCard
            isDarkMode={document.documentElement.classList.contains('dark')}
            spotlightColor="rgba(252, 211, 77, 0.4)"
            darkSpotlightColor="rgba(252, 211, 77, 0.2)"
            size={200}
            className="bg-grey dark:bg-gray-800 rounded-2xl shadow-lg p-4 overflow-hidden relative"
          >
            <div className="relative z-10">
              <div className="mb-3">
              
                <h4 className="text-sm font-bold text-gray-800 dark:text-white text-left">
                  Occupational Disease
                </h4>
              </div>
              <div className="text-xl font-bold text-gray-900 dark:text-white text-left">
                {stats.occupationalDisease}
              </div>
            </div>
          </SpotlightCard>

          {/* Personal Injury */}
          <SpotlightCard
            isDarkMode={document.documentElement.classList.contains('dark')}
            spotlightColor="rgba(147, 197, 253, 0.4)"
            darkSpotlightColor="rgba(147, 197, 253, 0.2)"
            size={200}
            className="bg-grey dark:bg-gray-800 rounded-2xl shadow-lg p-4 overflow-hidden relative"
          >
            <div className="relative z-10">
              <div className="mb-3">
                
                <h4 className="text-sm font-bold text-gray-800 dark:text-white text-left">
                  Personal Injury
                </h4>
              </div>
              <div className="text-xl font-bold text-gray-900 dark:text-white text-left">
                {stats.personalInjury}
              </div>
            </div>
          </SpotlightCard>

          {/* Specified Injuries */}
          <SpotlightCard
            isDarkMode={document.documentElement.classList.contains('dark')}
            spotlightColor="rgba(233, 213, 255, 0.4)"
            darkSpotlightColor="rgba(233, 213, 255, 0.2)"
            size={200}
            className="bg-grey dark:bg-gray-800 rounded-2xl shadow-lg p-4 overflow-hidden relative"
          >
            <div className="relative z-10">
              <div className="mb-3">
                
                <h4 className="text-sm font-bold text-gray-800 dark:text-white text-left">
                  Specified Injuries
                </h4>
              </div>
              <div className="text-xl font-bold text-gray-900 dark:text-white text-left">
                {stats.specifiedInjuries}
              </div>
            </div>
          </SpotlightCard>

          {/* Dangerous Occurrence */}
          <SpotlightCard
            isDarkMode={document.documentElement.classList.contains('dark')}
            spotlightColor="rgba(254, 202, 202, 0.4)"
            darkSpotlightColor="rgba(254, 202, 202, 0.2)"
            size={200}
            className="bg-grey dark:bg-gray-800 rounded-2xl shadow-lg p-4 overflow-hidden relative"
          >
            <div className="relative z-10">
              <div className="mb-3">
               
                <h4 className="text-sm font-bold text-gray-800 dark:text-white text-left">
                  Dangerous Occurrence
                </h4>
              </div>
              <div className="text-xl font-bold text-gray-900 dark:text-white text-left">
                {stats.dangerousOccurrence}
              </div>
            </div>
          </SpotlightCard>

          {/* Near Miss */}
          <SpotlightCard
            isDarkMode={document.documentElement.classList.contains('dark')}
            spotlightColor="rgba(167, 243, 208, 0.4)"
            darkSpotlightColor="rgba(167, 243, 208, 0.2)"
            size={200}
            className="bg-grey dark:bg-gray-800 rounded-2xl shadow-lg p-4 overflow-hidden relative"
          >
            <div className="relative z-10">
              <div className="mb-3">
              
                <h4 className="text-sm font-bold text-gray-800 dark:text-white text-left">
                  Near Miss
                </h4>
              </div>
              <div className="text-xl font-bold text-gray-900 dark:text-white text-left">
                {stats.nearMiss}
              </div>
            </div>
          </SpotlightCard>

          {/* Environmental */}
          <SpotlightCard
            isDarkMode={document.documentElement.classList.contains('dark')}
            spotlightColor="rgba(253, 230, 138, 0.4)"
            darkSpotlightColor="rgba(253, 230, 138, 0.2)"
            size={200}
            className="bg-grey dark:bg-gray-800 rounded-2xl shadow-lg p-4 overflow-hidden relative"
          >
            <div className="relative z-10">
              <div className="mb-3">
               
                <h4 className="text-sm font-bold text-gray-800 dark:text-white text-left">
                  Environmental
                </h4>
              </div>
              <div className="text-xl font-bold text-gray-900 dark:text-white text-left">
                {stats.environmental}
              </div>
            </div>
          </SpotlightCard>

          {/* Property Damage */}
          <SpotlightCard
            isDarkMode={document.documentElement.classList.contains('dark')}
            spotlightColor="rgba(196, 181, 253, 0.4)"
            darkSpotlightColor="rgba(196, 181, 253, 0.2)"
            size={200}
            className="bg-grey dark:bg-gray-800 rounded-2xl shadow-lg p-4 overflow-hidden relative"
          >
            <div className="relative z-10">
              <div className="mb-3">
               
                <h4 className="text-sm font-bold text-gray-800 dark:text-white text-left">
                  Property Damage
                </h4>
              </div>
              <div className="text-xl font-bold text-gray-900 dark:text-white text-left">
                {stats.propertyDamage}
              </div>
            </div>
          </SpotlightCard>

          {/* Unsafe Actions */}
          <SpotlightCard
            isDarkMode={document.documentElement.classList.contains('dark')}
            spotlightColor="rgba(134, 239, 172, 0.4)"
            darkSpotlightColor="rgba(134, 239, 172, 0.2)"
            size={200}
            className="bg-grey dark:bg-gray-800 rounded-2xl shadow-lg p-4 overflow-hidden relative"
          >
            <div className="relative z-10">
              <div className="mb-3">
              
                <h4 className="text-sm font-bold text-gray-800 dark:text-white text-left">
                  Unsafe Actions
                </h4>
              </div>
              <div className="text-xl font-bold text-gray-900 dark:text-white text-left">
                {stats.unsafeActions}
              </div>
            </div>
          </SpotlightCard>

          {/* Unsafe Conditions */}
          <SpotlightCard
            isDarkMode={document.documentElement.classList.contains('dark')}
            spotlightColor="rgba(252, 211, 77, 0.4)"
            darkSpotlightColor="rgba(252, 211, 77, 0.2)"
            size={200}
            className="bg-grey dark:bg-gray-800 rounded-2xl shadow-lg p-4 overflow-hidden relative"
          >
            <div className="relative z-10">
              <div className="mb-3">
              
                <h4 className="text-sm font-bold text-gray-800 dark:text-white text-left">
                  Unsafe Conditions
                </h4>
              </div>
              <div className="text-xl font-bold text-gray-900 dark:text-white text-left">
                {stats.unsafeConditions}
              </div>
            </div>
          </SpotlightCard>

          {/* Utility Damage */}
          <SpotlightCard
            isDarkMode={document.documentElement.classList.contains('dark')}
            spotlightColor="rgba(147, 197, 253, 0.4)"
            darkSpotlightColor="rgba(147, 197, 253, 0.2)"
            size={200}
            className="bg-grey dark:bg-gray-800 rounded-2xl shadow-lg p-4 overflow-hidden relative"
          >
            <div className="relative z-10">
              <div className="mb-3">
               
                <h4 className="text-sm font-bold text-gray-800 dark:text-white text-left">
                  Utility Damage
                </h4>
              </div>
              <div className="text-xl font-bold text-gray-900 dark:text-white text-left">
                {stats.utilityDamage}
              </div>
            </div>
          </SpotlightCard>
        </div>
      </div>
    </div>
  );
}
