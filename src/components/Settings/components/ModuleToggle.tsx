import React from 'react';

interface ModuleToggleProps {
  title: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}

export function ModuleToggle({ title, description, enabled, onToggle }: ModuleToggleProps) {
  return (
    <div className="flex items-center justify-between">
      <label className="flex items-center cursor-pointer">
        <div className="ml-3">
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {title}
          </span>
          <p className="text-sm text-gray-500 dark:text-gray-300">
            {description}
          </p>
        </div>
      </label>
      <button
        onClick={onToggle}
        className={`${
          enabled
            ? 'bg-indigo-600'
            : 'bg-gray-200 dark:bg-gray-600'
        } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2`}
      >
        <span
          className={`${
            enabled ? 'translate-x-5' : 'translate-x-0'
          } pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white dark:bg-gray-200 shadow ring-0 transition duration-200 ease-in-out`}
        />
      </button>
    </div>
  );
}