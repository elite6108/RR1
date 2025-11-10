import React from 'react';
import { Check } from 'lucide-react';

interface FooterProps {
  companyName: string;
  connectionStatus: 'checking' | 'connected' | 'error';
  isDarkMode: boolean;
  setShowModulesModal: (show: boolean) => void;
  setShowAppInfoModal: (show: boolean) => void;
  hasUserName: boolean;
}

export function Footer({
  companyName,
  connectionStatus,
  isDarkMode,
  setShowModulesModal,
  setShowAppInfoModal,
  hasUserName,
}: FooterProps) {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-4 md:mb-0">
            Company: {companyName}
          </div>
          <div className="flex flex-row justify-center md:justify-end items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
            <button
              onClick={() => setShowModulesModal(true)}
              className="text-indigo-600 hover:text-indigo-700 dark:text-yellow-400 dark:hover:text-yellow-300 font-medium inline-flex items-center"
            >
              ADMIN
              <div className="ml-2 flex items-center">
                {connectionStatus === 'checking' ? (
                  <div
                    className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"
                    title="Checking connection..."
                  />
                ) : connectionStatus === 'connected' ? (
                  <div
                    className="w-2 h-2 bg-green-500 rounded-full"
                    title="All systems operational"
                  />
                ) : (
                  <div
                    className="w-2 h-2 bg-red-500 rounded-full"
                    title="Connection issues detected"
                  />
                )}
                {hasUserName && (
                  <Check className="ml-1 h-3 w-3 text-green-500" title="User profile complete" />
                )}
              </div>
            </button>
            <span className="text-gray-400 dark:text-gray-600">|</span>
            <button
              onClick={() => setShowAppInfoModal(true)}
              className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-md"
            >
                          <img 
              src={isDarkMode ? "/images/stonepad-logo-w.png" : "/images/stonepad-logo-b.png"}
              alt="StonePad Logo" 
              className="h-4 w-auto"
            />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}