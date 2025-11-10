import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface AppInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode?: boolean;
}

export function AppInfoModal({ isOpen, onClose, isDarkMode }: AppInfoModalProps) {
  const [showLicenses, setShowLicenses] = useState(false);
  const [licensesContent, setLicensesContent] = useState('');
  const [loadingLicenses, setLoadingLicenses] = useState(false);

  const handleViewLicenses = async () => {
    setLoadingLicenses(true);
    try {
      const response = await fetch('/licenses.txt');
      const text = await response.text();
      setLicensesContent(text);
      setShowLicenses(true);
    } catch (error) {
      console.error('Failed to load licenses:', error);
      setLicensesContent('Failed to load license information.');
      setShowLicenses(true);
    } finally {
      setLoadingLicenses(false);
    }
  };

  if (!isOpen) return null;

  if (showLicenses) {
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
        <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-4xl w-full m-4 max-h-[80vh] flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Third-Party Licenses
            </h3>
            <button
              onClick={() => setShowLicenses(false)}
              className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {loadingLicenses ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
              </div>
            ) : (
              <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap bg-gray-50 dark:bg-gray-900 p-4 rounded-md border">
                {licensesContent}
              </pre>
            )}
          </div>
          
          <div className="mt-6 flex justify-end">
            <button
              onClick={() => setShowLicenses(false)}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full m-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            App Information
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-center mb-6">
            <img 
              src={isDarkMode ? "/images/stonepad-logo-w.png" : "/images/stonepad-logo-b.png"}
              alt="StonePad Logo" 
              className="h-12 w-auto"
            />
          </div>
          
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">App:</span>
              <span className="text-gray-900 dark:text-white">StonePad CRM</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Version:</span>
              <span className="text-gray-900 dark:text-white">1</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Support:</span>
              <a 
                href="mailto:stonepad@rockrevelations.co.uk"
                className="text-indigo-600 hover:text-indigo-700 dark:text-yellow-400 dark:hover:text-yellow-300 font-medium"
              >
                stonepad@rockrevelations.co.uk
              </a>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Licenses:</span>
              <button
                onClick={handleViewLicenses}
                disabled={loadingLicenses}
                className="text-indigo-600 hover:text-indigo-700 dark:text-yellow-400 dark:hover:text-yellow-300 font-medium disabled:opacity-50"
              >
                {loadingLicenses ? 'Loading...' : 'View Third-Party Licenses'}
              </button>
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
} 