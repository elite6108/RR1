import React from 'react';

interface LoadingSpinnerProps {
  className?: string;
}

/**
 * Loading spinner component
 */
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ className = '' }) => {
  return (
    <div className={`flex items-center justify-center h-64 ${className}`}>
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-500"></div>
    </div>
  );
};

export default LoadingSpinner;
