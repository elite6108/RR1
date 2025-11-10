import React from 'react';

interface FormContentProps {
  children: React.ReactNode;
  className?: string;
}

export function FormContent({ children, className = '' }: FormContentProps) {
  return (
    <div className={`flex-1 overflow-y-auto p-6 ${className}`}>
      {children}
    </div>
  );
}
