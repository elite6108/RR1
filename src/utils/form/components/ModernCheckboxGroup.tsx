import React from 'react';

interface CheckboxOption {
  value: string;
  label: string;
  disabled?: boolean;
  description?: string;
}

interface ModernCheckboxGroupProps {
  options: CheckboxOption[];
  selectedValues: string[];
  onChange: (selectedValues: string[]) => void;
  disabled?: boolean;
  className?: string;
  layout?: 'vertical' | 'horizontal' | 'grid';
}

export function ModernCheckboxGroup({ 
  options, 
  selectedValues, 
  onChange, 
  disabled = false,
  className = '',
  layout = 'vertical'
}: ModernCheckboxGroupProps) {
  
  const handleCheckboxChange = (value: string, checked: boolean) => {
    if (checked) {
      onChange([...selectedValues, value]);
    } else {
      onChange(selectedValues.filter(v => v !== value));
    }
  };

  const getLayoutClasses = () => {
    switch (layout) {
      case 'horizontal':
        return 'flex flex-wrap gap-4';
      case 'grid':
        return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3';
      default:
        return 'space-y-3';
    }
  };

  return (
    <div className={`mt-1 ${getLayoutClasses()} ${className}`}>
      {options.map((option) => {
        const isSelected = selectedValues.includes(option.value);
        const isDisabled = disabled || option.disabled;
        
        return (
          <label 
            key={option.value} 
            className={`
              relative flex items-start p-4 border rounded-lg cursor-pointer transition-all duration-200 ease-in-out
              ${isSelected 
                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 ring-2 ring-indigo-500' 
                : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-500'
              }
              ${isDisabled 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:shadow-sm'
              }
            `}
          >
            {/* Hidden native checkbox for accessibility */}
            <input
              type="checkbox"
              value={option.value}
              checked={isSelected}
              onChange={(e) => !isDisabled && handleCheckboxChange(option.value, e.target.checked)}
              disabled={isDisabled}
              className="sr-only"
            />
            
            {/* Custom checkbox indicator */}
            <div className="flex-shrink-0 mr-3 mt-0.5">
              <div className={`
                w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200
                ${isSelected 
                  ? 'border-indigo-500 bg-indigo-500' 
                  : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                }
              `}>
                {isSelected && (
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </div>
            
            {/* Label and description */}
            <div className="flex-1 min-w-0">
              <span className={`
                block text-sm font-medium
                ${isSelected 
                  ? 'text-indigo-900 dark:text-indigo-100' 
                  : 'text-gray-900 dark:text-gray-100'
                }
                ${isDisabled ? 'text-gray-400 dark:text-gray-500' : ''}
              `}>
                {option.label}
              </span>
              {option.description && (
                <span className={`
                  block text-xs mt-1
                  ${isSelected 
                    ? 'text-indigo-700 dark:text-indigo-300' 
                    : 'text-gray-500 dark:text-gray-400'
                  }
                  ${isDisabled ? 'text-gray-400 dark:text-gray-500' : ''}
                `}>
                  {option.description}
                </span>
              )}
            </div>
            
            {/* Selection indicator */}
            {isSelected && (
              <div className="flex-shrink-0 ml-2">
                <svg className="w-5 h-5 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </label>
        );
      })}
    </div>
  );
}
