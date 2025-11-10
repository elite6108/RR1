import React from 'react';
import { Check } from 'lucide-react';

interface SuccessMessageProps {
  message: string;
}

export function SuccessMessage({ message }: SuccessMessageProps) {
  return (
    <div className="mb-4 flex items-center gap-2 text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-4 rounded-md">
      <Check className="h-5 w-5 flex-shrink-0" />
      <p>{message}</p>
    </div>
  );
}