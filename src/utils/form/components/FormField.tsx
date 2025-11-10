import React from 'react';

interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
  description?: string;
}

export function FormField({ label, required = false, error, children, description }: FormFieldProps) {
  return (
    <div className="space-y-1">
      <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 h-5">
        <span>{label}</span>
        {required ? (
          <span className="text-red-500 ml-1">*</span>
        ) : (
          <span className="ml-1 text-transparent">*</span>
        )}
      </label>
      {description && (
        <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
      )}
      {children}
      {error && (
        <p className="text-red-500 text-xs mt-1">{error}</p>
      )}
    </div>
  );
}
