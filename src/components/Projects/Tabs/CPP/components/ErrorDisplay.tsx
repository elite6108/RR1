import React from 'react';

interface ErrorDisplayProps {
  error: string | null;
  onDismiss?: () => void;
}

/**
 * Error display component for PDF generation errors
 */
export function ErrorDisplay({ error, onDismiss }: ErrorDisplayProps) {
  if (!error) return null;

  return (
    <div className="mb-4 p-4 rounded-md bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
      <div className="flex justify-between items-start">
        <p className="flex-1">{error}</p>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="ml-2 text-red-400 hover:text-red-600 dark:text-red-300 dark:hover:text-red-100"
            aria-label="Dismiss error"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
