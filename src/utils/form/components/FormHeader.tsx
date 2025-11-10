import React from 'react';
import { X } from 'lucide-react';

interface FormHeaderProps {
  title: string;
  onClose: () => void;
  subtitle?: React.ReactNode;
}

export function FormHeader({ title, onClose, subtitle }: FormHeaderProps) {
  return (
    <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {title}
        </h2>
        {subtitle && (
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {subtitle}
          </div>
        )}
      </div>
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        aria-label="Close"
      >
        <X className="h-6 w-6" />
      </button>
    </div>
  );
}
