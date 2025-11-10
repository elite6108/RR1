import React from 'react';
import { Icon } from '@iconify/react';

interface ScannerViewProps {
  scanning: boolean;
  scanError: string | null;
  scannerContainerRef: React.RefObject<HTMLDivElement>;
  onReset: () => void;
}

export function ScannerView({ scanning, scanError, scannerContainerRef, onReset }: ScannerViewProps) {
  return (
    <>
      <div className="max-w-md w-full bg-white shadow-md rounded-lg overflow-hidden dark:bg-gray-800 mb-6">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            Scan Site QR Code
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Position the QR code within the scanner to check in or out.
          </p>
        </div>
        
        <div 
          id="scanner" 
          ref={scannerContainerRef}
          className="w-full h-64 bg-gray-100 dark:bg-gray-700 flex items-center justify-center"
        >
          {scanError && (
            <div className="text-center p-4">
              <Icon icon="lucide:alert-circle" className="h-10 w-10 text-red-500 mx-auto mb-2" />
              <p className="text-red-500">{scanError}</p>
              <button
                onClick={onReset}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Try Again
              </button>
            </div>
          )}
          
          {scanning && !scanError && (
            <div className="text-center p-4">
              <Icon icon="lucide:loader-2" className="h-10 w-10 text-indigo-500 mx-auto mb-2 animate-spin" />
              <p className="text-gray-600 dark:text-gray-300">Scanning...</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="text-center mt-4 text-sm text-gray-500 dark:text-gray-400">
        <p>Make sure the QR code is well-lit and clearly visible.</p>
        <p className="mt-2">Having trouble? Ask your site manager for assistance.</p>
      </div>
    </>
  );
}
