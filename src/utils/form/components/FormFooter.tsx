import React from 'react';

interface FormFooterProps {
  onCancel: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
  onSubmit?: () => void;
  onSave?: () => void;
  showPrevious?: boolean;
  showSave?: boolean;
  isFirstStep?: boolean;
  isLastStep?: boolean;
  nextButtonText?: string;
  submitButtonText?: string;
  saveButtonText?: string;
  cancelButtonText?: string;
  previousButtonText?: string;
  disabled?: boolean;
  loading?: boolean;
}

export function FormFooter({
  onCancel,
  onPrevious,
  onNext,
  onSubmit,
  onSave,
  showPrevious = true,
  showSave = false,
  isFirstStep = false,
  isLastStep = false,
  nextButtonText = 'Next',
  submitButtonText = 'Submit',
  saveButtonText = 'Save',
  cancelButtonText = 'Cancel',
  previousButtonText = 'Previous',
  disabled = false,
  loading = false
}: FormFooterProps) {
  const handlePrimaryAction = () => {
    if (isLastStep && onSubmit) {
      onSubmit();
    } else if (onNext) {
      onNext();
    }
  };

  return (
    <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700">
      <div>
        {showPrevious && !isFirstStep && onPrevious && (
          <button
            type="button"
            onClick={onPrevious}
            disabled={disabled || loading}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {previousButtonText}
          </button>
        )}
      </div>
      
      <div className="flex space-x-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {cancelButtonText}
        </button>
        
        {showSave && onSave && (
          <button
            type="button"
            onClick={onSave}
            disabled={disabled || loading}
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
          >
            {loading && (
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            <span>{saveButtonText}</span>
          </button>
        )}
        
        {(onNext || onSubmit) && (
          <button
            type="button"
            onClick={handlePrimaryAction}
            disabled={disabled || loading}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
          >
            {loading && (
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            <span>
              {isLastStep ? submitButtonText : nextButtonText}
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
