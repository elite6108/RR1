import React from 'react';
import type { StepIndicatorProps } from '../types';

export function StepIndicator({ currentStep, totalSteps, stepLabels }: StepIndicatorProps) {
  return (
    <div className="mb-8 w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="text-base font-medium text-indigo-600">
          {stepLabels[currentStep - 1]}
        </div>
        <div className="text-sm text-gray-500">
          Step {currentStep} of {totalSteps}
        </div>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-indigo-600 h-2 rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>
    </div>
  );
}