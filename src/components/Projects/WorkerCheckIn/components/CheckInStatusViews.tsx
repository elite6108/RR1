import React from 'react';
import { Icon } from '@iconify/react';

interface ProcessingViewProps {
  checkingIn: boolean;
}

export function ProcessingView({ checkingIn }: ProcessingViewProps) {
  return (
    <div className="max-w-md w-full bg-white shadow-md rounded-lg overflow-hidden dark:bg-gray-800 p-6 text-center">
      <Icon icon="lucide:loader-2" className="h-12 w-12 text-indigo-500 mx-auto mb-4 animate-spin" />
      <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
        Processing Check-in
      </h2>
      <p className="text-gray-500 dark:text-gray-400">
        Please wait while we process your check-in...
      </p>
    </div>
  );
}

interface ErrorViewProps {
  checkInError: string;
  onReset: () => void;
}

export function ErrorView({ checkInError, onReset }: ErrorViewProps) {
  return (
    <div className="max-w-md w-full bg-white shadow-md rounded-lg overflow-hidden dark:bg-gray-800 p-6 text-center">
      <Icon icon="lucide:alert-circle" className="h-12 w-12 text-red-500 mx-auto mb-4" />
      <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
        Check-in Failed
      </h2>
      <p className="text-red-500 mb-4">
        {checkInError}
      </p>
      <button
        onClick={onReset}
        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
      >
        Try Again
      </button>
    </div>
  );
}

interface SuccessViewProps {
  siteName: string | null;
}

export function SuccessView({ siteName }: SuccessViewProps) {
  return (
    <div className="max-w-md w-full bg-white shadow-md rounded-lg overflow-hidden dark:bg-gray-800 p-6 text-center">
      <Icon icon="lucide:check-circle" className="h-12 w-12 text-green-500 mx-auto mb-4" />
      <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
        Check-in Successful
      </h2>
      <p className="text-gray-500 dark:text-gray-400 mb-1">
        {siteName && `You've been checked in at ${siteName}.`}
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Redirecting you to the site page...
      </p>
    </div>
  );
}
