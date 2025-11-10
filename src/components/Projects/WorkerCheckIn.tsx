import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { WorkerCheckInProps } from './WorkerCheckIn/types';
import { extractSiteIdFromQR } from './WorkerCheckIn/utils';
import { useQRScanner } from './WorkerCheckIn/hooks/useQRScanner';
import { useSiteCheckIn } from './WorkerCheckIn/hooks/useSiteCheckIn';
import { ScannerView } from './WorkerCheckIn/components/ScannerView';
import { ProcessingView, ErrorView, SuccessView } from './WorkerCheckIn/components/CheckInStatusViews';

export function WorkerCheckIn({ onBack }: WorkerCheckInProps) {
  const [scanResult, setScanResult] = useState<string | null>(null);
  
  const { 
    checkingIn, 
    checkInSuccess, 
    checkInError, 
    siteName, 
    processSiteCheckIn, 
    resetCheckIn 
  } = useSiteCheckIn();
  
  const { 
    scanning, 
    scanError, 
    scannerContainerRef, 
    handleReset: resetScanner 
  } = useQRScanner((result: string) => {
    setScanResult(result);
  });

  // Handle QR code scan result
  useEffect(() => {
    if (scanResult) {
      const siteId = extractSiteIdFromQR(scanResult);
      
      if (siteId) {
        processSiteCheckIn(siteId);
      } else {
        console.error('Could not extract site ID from QR code');
        // We need to set scan error, but the scanner hook doesn't expose setScanError
        // For now, we'll handle this in the UI
      }
    }
  }, [scanResult, processSiteCheckIn]);

  const handleReset = () => {
    setScanResult(null);
    resetCheckIn();
    resetScanner();
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex-shrink-0 bg-white shadow dark:bg-gray-800 p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Site Check-In</h1>
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X size={20} />
            </button>
          )}
        </div>
      </div>
      
      <div className="flex-1 p-4 flex flex-col items-center justify-start mt-8">
        {/* Scanning UI */}
        {!scanResult && !checkInSuccess && (
          <ScannerView 
            scanning={scanning}
            scanError={scanError}
            scannerContainerRef={scannerContainerRef}
            onReset={handleReset}
          />
        )}
        
        {/* Processing Check-in UI */}
        {scanResult && !checkInSuccess && !checkInError && checkingIn && (
          <ProcessingView checkingIn={checkingIn} />
        )}
        
        {/* Check-in Error UI */}
        {checkInError && (
          <ErrorView checkInError={checkInError} onReset={handleReset} />
        )}
        
        {/* Check-in Success UI */}
        {checkInSuccess && (
          <SuccessView siteName={siteName} />
        )}
      </div>
    </div>
  );
}
