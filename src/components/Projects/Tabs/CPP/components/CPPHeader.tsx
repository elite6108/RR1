import React from 'react';

interface CPPHeaderProps {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

/**
 * Header component for the CPP tab
 */
export function CPPHeader({ 
  title = "Construction Phase Plans",
  subtitle,
  actions 
}: CPPHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {subtitle}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex items-center space-x-2">
          {actions}
        </div>
      )}
    </div>
  );
}
