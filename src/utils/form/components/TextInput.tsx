import React from 'react';

interface TextInputProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  type?: 'text' | 'email' | 'tel' | 'url' | 'password';
  maxLength?: number;
  className?: string;
}

export function TextInput({ 
  id, 
  value, 
  onChange, 
  placeholder, 
  disabled = false, 
  type = 'text',
  maxLength,
  className = ''
}: TextInputProps) {
  const baseClasses = "mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-500";
  
  return (
    <input
      type={type}
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      maxLength={maxLength}
      className={`${baseClasses} ${className}`}
    />
  );
}
