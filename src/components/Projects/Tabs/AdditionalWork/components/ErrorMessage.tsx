import React from 'react';

interface ErrorMessageProps {
  error: string | null;
  className?: string;
}

/**
 * Error message display component
 */
const ErrorMessage: React.FC<ErrorMessageProps> = ({ error, className = '' }) => {
  if (!error) return null;

  return (
    <div className={`mb-4 p-4 rounded-md bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm ${className}`}>
      <p>{error}</p>
    </div>
  );
};

export default ErrorMessage;
