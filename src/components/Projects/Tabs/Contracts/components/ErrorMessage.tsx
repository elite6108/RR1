import React from 'react';

interface ErrorMessageProps {
  error: string | null;
  onDismiss?: () => void;
}

export function ErrorMessage({ error, onDismiss }: ErrorMessageProps) {
  if (!error) return null;

  return (
    <div className="mb-4 p-4 rounded-md bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
      <div className="flex justify-between items-start">
        <p>{error}</p>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="ml-4 text-red-400 hover:text-red-600 dark:text-red-500 dark:hover:text-red-300"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}
