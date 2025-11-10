import React from 'react';

interface NumberInputProps {
  id?: string;
  value: number | string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
}

export function NumberInput({ 
  id, 
  value, 
  onChange, 
  placeholder, 
  disabled = false, 
  min,
  max,
  step = 1,
  className = ''
}: NumberInputProps) {
  const baseClasses = "mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-500";
  
  return (
    <input
      type="number"
      id={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      min={min}
      max={max}
      step={step}
      className={`${baseClasses} ${className}`}
    />
  );
}
