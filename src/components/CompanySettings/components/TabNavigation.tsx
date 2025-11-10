import React from 'react';
import type { TabType } from '../types';

interface TabNavigationProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

const tabs = [
  { id: 'company' as const, label: 'Company Info' },
  { id: 'contact' as const, label: 'Contact' },
  { id: 'insurances' as const, label: 'Insurances' },
  { id: 'tax' as const, label: 'Tax Info' },
  { id: 'prefix' as const, label: 'Prefix' }
];

export function TabNavigation({ activeTab, setActiveTab }: TabNavigationProps) {
  return (
    <div className="flex flex-col sm:flex-row flex-wrap space-y-2 sm:space-y-0 sm:space-x-2 mb-6">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => setActiveTab(tab.id)}
          className={`px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
            activeTab === tab.id
            ? 'bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-600 dark:text-white dark:hover:bg-indigo-500'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}