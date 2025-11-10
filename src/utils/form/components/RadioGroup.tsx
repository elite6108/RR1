import React from 'react';

interface RadioOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface RadioGroupProps {
  name: string;
  options: RadioOption[];
  selectedValue: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

export function RadioGroup({ 
  name,
  options, 
  selectedValue, 
  onChange, 
  disabled = false,
  className = ''
}: RadioGroupProps) {
  return (
    <div className={`mt-1 space-y-2 ${className}`}>
      {options.map((option) => (
        <label 
          key={option.value} 
          className="flex items-center space-x-3 cursor-pointer"
        >
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={selectedValue === option.value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled || option.disabled}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 disabled:cursor-not-allowed"
          />
          <span className={`text-sm ${disabled || option.disabled ? 'text-gray-400' : 'text-gray-700 dark:text-gray-300'}`}>
            {option.label}
          </span>
        </label>
      ))}
    </div>
  );
}
