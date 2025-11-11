import React from 'react';

interface DateInputProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  min?: string;
  max?: string;
  className?: string;
}

export function DateInput({ 
  id, 
  value, 
  onChange, 
  disabled = false, 
  min,
  max,
  className = ''
}: DateInputProps) {
  const baseClasses = "mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-500";
  
  return (
    <input
      type="date"
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      min={min}
      max={max}
      className={`${baseClasses} ${className}`}
    />
  );
}
