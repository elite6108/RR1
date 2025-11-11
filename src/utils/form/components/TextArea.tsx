import React from 'react';

interface TextAreaProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  rows?: number;
  maxLength?: number;
  className?: string;
}

export function TextArea({ 
  id, 
  value, 
  onChange, 
  placeholder, 
  disabled = false, 
  rows = 4,
  maxLength,
  className = ''
}: TextAreaProps) {
  const baseClasses = "mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-500 resize-vertical";
  
  return (
    <textarea
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      rows={rows}
      maxLength={maxLength}
      className={`${baseClasses} ${className}`}
    />
  );
}
