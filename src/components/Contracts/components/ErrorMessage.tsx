import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ErrorMessageProps {
  error: string;
  variant?: 'error' | 'pdf-error';
}

export function ErrorMessage({ error, variant = 'error' }: ErrorMessageProps) {
  if (variant === 'pdf-error') {
    return (
      <div className="mb-4 flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-4 rounded-md">
        <AlertTriangle className="h-5 w-5 flex-shrink-0" />
        <div>
          <p className="font-medium">Error generating PDF</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-4 flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-4 rounded-md">
      <AlertTriangle className="h-5 w-5 flex-shrink-0" />
      <p>{error}</p>
    </div>
  );
}