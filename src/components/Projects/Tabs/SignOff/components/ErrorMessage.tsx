import React from 'react';

interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="text-red-600 dark:text-red-400 p-4">
      {message}
    </div>
  );
}
