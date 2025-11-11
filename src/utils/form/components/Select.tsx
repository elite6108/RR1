import React from 'react';

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function Select({ 
  id, 
  value, 
  onChange, 
  options, 
  placeholder, 
  disabled = false,
  className = ''
}: SelectProps) {
  const baseClasses = "mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-500";
  
  return (
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className={`${baseClasses} ${className}`}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((option) => (
        <option 
          key={option.value} 
          value={option.value} 
          disabled={option.disabled}
        >
          {option.label}
        </option>
      ))}
    </select>
  );
}
