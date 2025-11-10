import React from 'react';

export function WorkerDashboardFooter() {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-4 mt-auto">
      <div className="px-4 sm:px-6 lg:px-8">
        <p className="text-center text-gray-500 dark:text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} Worker Portal. All rights reserved.
        </p>
      </div>
    </footer>
  );
}