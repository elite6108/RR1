import React from 'react';
import { Key } from 'lucide-react';
import type { TabNavigationProps } from '../types';

const tabs = [
  { id: 'modules' as const, label: 'Modules', icon: null },
  { id: 'domains' as const, label: 'Domains', icon: null, className: 'hide' },
  { id: 'tokens' as const, label: 'Tokens', icon: null, className: 'hide' },
  { id: 'password' as const, label: 'Password', icon: Key }
];

export function TabNavigation({ activeTab, setActiveTab }: TabNavigationProps) {
  return (
    <div className="border-gray-200 mb-6">
      <nav className="flex space-x-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md ${
              activeTab === tab.id
                ? 'text-white bg-indigo-600 hover:bg-indigo-700'
                : 'text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${tab.className || ''}`}
          >
            {tab.icon && <tab.icon className="h-4 w-4 mr-1" />}
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
}