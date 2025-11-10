import React from 'react';
import { AlertCircle, AlertTriangle } from 'lucide-react';

interface ErrorMessageProps {
  error: string;
  variant?: 'error' | 'warning';
}

export function ErrorMessage({ error, variant = 'error' }: ErrorMessageProps) {
  const Icon = variant === 'error' ? AlertCircle : AlertTriangle;
  const colorClasses = variant === 'error' 
    ? 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20'
    : 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20';

  return (
    <div className={`flex items-center gap-2 text-sm ${colorClasses} p-4 rounded-md`}>
      <Icon className="h-5 w-5 flex-shrink-0" />
      <p>{error}</p>
    </div>
  );
}