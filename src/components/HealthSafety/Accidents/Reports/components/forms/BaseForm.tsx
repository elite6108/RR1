'use client';

import React, { useState } from "react";
import { supabase } from "../../../../../../lib/supabase";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { ReactNode } from 'react';
// Remove UI library imports
// import { Button } from '@/components/ui/button';
// import { Card } from '@/components/ui/card';

export interface Step {
  id: string;
  title: string;
}

interface BaseFormProps {
  steps: Step[];
  currentStep: number;
  onNext: () => void;
  onPrevious: () => void;
  onSubmit: () => void;
  onCancel?: () => void;
  children: ReactNode;
  submitButtonProps?: {
    className?: string;
    disabled?: boolean;
    children?: ReactNode;
  };
  showModal?: boolean;
  onCloseModal?: () => void;
}

export default function BaseForm({
  steps,
  currentStep,
  onNext,
  onPrevious,
  onSubmit,
  onCancel,
  children,
  submitButtonProps = {},
  showModal = false,
  onCloseModal,
}: BaseFormProps) {
  // Safety check to prevent accessing undefined steps
  const currentStepTitle = steps && steps.length > 0 && currentStep < steps.length 
    ? steps[currentStep].title 
    : 'Loading...';

  return (
    <div className="border rounded-lg p-6 bg-white shadow dark:bg-gray-800 dark:border-gray-700">
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg w-full max-w-md relative">
            <button 
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-100 focus:outline-none"
              onClick={onCloseModal}
            >
              <X className="h-6 w-6" />
            </button>
            {children}
          </div>
        </div>
      )}

      {!showModal && (
        <>
          <div className="mb-8 w-full">
            <div className="flex items-center justify-between mb-4">
              <div className="text-base font-medium text-indigo-600 dark:text-indigo-400">
                {currentStepTitle}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Step {currentStep + 1} of {steps.length}
              </div>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-indigo-600 h-2 rounded-full transition-all duration-300 ease-in-out"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>

          <form onSubmit={(e: React.FormEvent) => e.preventDefault()}>
            {children}

            <div className="flex flex-col sm:flex-row justify-between mt-8 space-y-3 sm:space-y-0">
              <button
                type="button"
                onClick={onCancel}
                className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <div className="flex flex-col sm:flex-row gap-3">
                {currentStep > 0 && (
                  <button
                    type="button"
                    onClick={onPrevious}
                    className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:text-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1 inline" style={{ marginTop: '-2px' }} />
                    Previous
                  </button>
                )}
                <button
                  type="button"
                  onClick={currentStep === steps.length - 1 ? onSubmit : onNext}
                  className={submitButtonProps.className || "w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"}
                  disabled={submitButtonProps.disabled}
                >
                  {submitButtonProps.children || (currentStep === steps.length - 1 ? 'Submit' : (
                    <>
                      Next
                      <ChevronRight className="h-4 w-4 ml-1 inline" style={{ marginTop: '-2px' }} />
                    </>
                  ))}
                </button>
              </div>
            </div>
          </form>
        </>
      )}
    </div>
  );
} 