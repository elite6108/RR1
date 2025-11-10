import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ErrorMessageProps {
  error: string;
}

export function ErrorMessage({ error }: ErrorMessageProps) {
  return (
    <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20 p-4 rounded-md">
      <AlertTriangle className="h-5 w-5 flex-shrink-0" />
      <p>{error}</p>
    </div>
  );
}