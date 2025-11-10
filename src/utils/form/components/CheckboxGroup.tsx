import React from 'react';

interface CheckboxOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface CheckboxGroupProps {
  options: CheckboxOption[];
  selectedValues: string[];
  onChange: (selectedValues: string[]) => void;
  disabled?: boolean;
  className?: string;
}

export function CheckboxGroup({ 
  options, 
  selectedValues, 
  onChange, 
  disabled = false,
  className = ''
}: CheckboxGroupProps) {
  const handleCheckboxChange = (value: string, checked: boolean) => {
    if (checked) {
      onChange([...selectedValues, value]);
    } else {
      onChange(selectedValues.filter(v => v !== value));
    }
  };

  return (
    <div className={`mt-1 space-y-2 ${className}`}>
      {options.map((option) => (
        <label 
          key={option.value} 
          className="flex items-center space-x-3 cursor-pointer"
        >
          <input
            type="checkbox"
            checked={selectedValues.includes(option.value)}
            onChange={(e) => handleCheckboxChange(option.value, e.target.checked)}
            disabled={disabled || option.disabled}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded disabled:cursor-not-allowed"
          />
          <span className={`text-sm ${disabled || option.disabled ? 'text-gray-400' : 'text-gray-700 dark:text-gray-300'}`}>
            {option.label}
          </span>
        </label>
      ))}
    </div>
  );
}
