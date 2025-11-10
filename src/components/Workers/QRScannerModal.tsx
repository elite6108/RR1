import { useEffect, useRef, useState } from 'react';
// Remove Html5Qrcode import as we'll use a more direct approach

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCodeScanned: (decodedText: string) => void;
  scannedSiteId: string | null;
  scannedSiteName: string;
}

// We'll use a simple javascript QR code scanner library
// This will be loaded dynamically when needed
declare global {
  interface Window {
    jsQR?: (imageData: Uint8ClampedArray, width: number, height: number) => {
      data: string;
    } | null;
  }
}

export function QRScannerModal({
  isOpen,
  onClose,
  onCodeScanned,
  scannedSiteId,
  scannedSiteName,
}: QRScannerModalProps) {
  const [error, setError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationRef = useRef<number | null>(null);

  // Load the jsQR library dynamically
  useEffect(() => {
    if (isOpen && !window.jsQR) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.min.js';
      script.async = true;
      script.onload = () => {
        console.log('jsQR library loaded');
        if (!scannedSiteId) {
          startCamera();
        }
      };
      script.onerror = () => {
        setError('Failed to load QR scanner library. Please check your internet connection.');
      };
      document.body.appendChild(script);
      return () => {
        document.body.removeChild(script);
      };
    } else if (isOpen && window.jsQR && !scannedSiteId) {
      startCamera();
    }
    
    return () => {
      stopCamera();
    };
  }, [isOpen, scannedSiteId]);

  const startCamera = async () => {
    console.log('Starting camera...');
    setError(null);
    setScanning(true);
    
    if (!videoRef.current) {
      setError('Video element not available.');
      return;
    }
    
    try {
      // Determine if we're on mobile first
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      console.log('Device detected as:', isMobile ? 'mobile' : 'desktop');
      
      // First attempt: Try with environment-facing camera for mobile devices
      if (isMobile) {
        try {
          console.log('Mobile device detected - attempting to use back camera');
          const mobileConstraints = {
            video: {
              facingMode: { exact: 'environment' },
              width: { ideal: 1280 },
              height: { ideal: 720 }
            },
            audio: false
          };
          
          const stream = await navigator.mediaDevices.getUserMedia(mobileConstraints);
          streamRef.current = stream;
          
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.style.display = 'block';
            videoRef.current.play();
            
            videoRef.current.onloadedmetadata = () => {
              console.log('Video metadata loaded with back camera, starting QR detection...');
              startQRDetection();
            };
            return; // If successful, exit the function
          }
        } catch (exactErr) {
          console.log('Exact environment camera failed, trying ideal constraint:', exactErr);
          // Try with ideal instead of exact
          try {
            const mobileConstraintsIdeal = {
              video: {
                facingMode: 'environment',
                width: { ideal: 1280 },
                height: { ideal: 720 }
              },
              audio: false
            };
            
            const stream = await navigator.mediaDevices.getUserMedia(mobileConstraintsIdeal);
            streamRef.current = stream;
            
            if (videoRef.current) {
              videoRef.current.srcObject = stream;
              videoRef.current.style.display = 'block';
              videoRef.current.play();
              
              videoRef.current.onloadedmetadata = () => {
                console.log('Video metadata loaded with ideal back camera, starting QR detection...');
                startQRDetection();
              };
              return; // If successful, exit the function
            }
          } catch (idealErr) {
            console.log('Ideal environment camera also failed:', idealErr);
            // Continue to fallback methods
          }
        }
      }
      
      // Desktop or fallback attempt: Try with simple constraints
      try {
        console.log('Using simple constraints for desktop or as fallback');
        const simpleConstraints = {
          video: true,
          audio: false
        };
        
        const stream = await navigator.mediaDevices.getUserMedia(simpleConstraints);
        streamRef.current = stream;
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.style.display = 'block';
          videoRef.current.play();
          
          videoRef.current.onloadedmetadata = () => {
            console.log('Video metadata loaded with simple constraints, starting QR detection...');
            startQRDetection();
          };
          return; // If successful, exit the function
        }
      } catch (simpleErr) {
        console.log('Simple constraints failed, trying alternative methods:', simpleErr);
        // Continue to next method if this fails
      }
      
      // Final attempt: Try to enumerate devices and select appropriate camera
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      console.log('Available cameras:', videoDevices);
      
      let constraints: MediaStreamConstraints;
      
      if (videoDevices.length > 0) {
        // Use the first available camera
        console.log('Using first available camera from enumerated devices');
        constraints = {
          video: {
            deviceId: { exact: videoDevices[0].deviceId },
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        };
      } else {
        // Fallback to generic constraints
        console.log('No specific cameras found, using generic constraints');
        constraints = {
          video: true
        };
      }
      
      console.log('Using constraints:', constraints);
      
      // Get the camera stream
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.style.display = 'block';
        videoRef.current.play();
        
        // Wait for video to start playing before scanning
        videoRef.current.onloadedmetadata = () => {
          console.log('Video metadata loaded, starting QR detection...');
          startQRDetection();
        };
      }
    } catch (err) {
      console.error('Error starting camera:', err);
      handleCameraError(err);
      setScanning(false);
    }
  };
  
  const startQRDetection = () => {
    if (!window.jsQR) {
      console.error('jsQR library not loaded');
      setError('QR scanner library not loaded. Please refresh and try again.');
      return;
    }
    
    const scanQRCode = () => {
      if (!videoRef.current || !canvasRef.current || scannedSiteId) {
        return;
      }
      
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) return;
      
      // Make sure video is playing
      if (video.readyState !== video.HAVE_ENOUGH_DATA) {
        animationRef.current = requestAnimationFrame(scanQRCode);
        return;
      }
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw current video frame to canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Get image data for QR detection
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      
      // Detect QR code
      const code = window.jsQR?.(imageData.data, imageData.width, imageData.height);
      
      if (code && code.data && code.data.trim() !== '') {
        console.log('QR code detected:', code.data);
        console.log('QR code raw data type:', typeof code.data);
        console.log('First 50 characters:', code.data.substring(0, 50));
        
        // Only process QR codes with actual content
        if (code.data.trim().length > 0) {
          try {
            // Debug: Try to parse as URL to see if it's valid
            const testUrl = new URL(code.data);
            console.log('Successfully parsed as URL', {
              protocol: testUrl.protocol,
              host: testUrl.host,
              pathname: testUrl.pathname,
              search: testUrl.search
            });
          } catch (error) {
            console.error('Not a valid URL format:', error);
          }
          
          stopCamera();
          onCodeScanned(code.data);
          return;
        } else {
          console.log('Ignoring empty QR code data');
        }
      }
      
      // Continue scanning if no QR code detected
      animationRef.current = requestAnimationFrame(scanQRCode);
    };
    
    // Start the scanning loop
    scanQRCode();
  };
  
  const stopCamera = () => {
    console.log('Stopping camera...');
    
    // Stop animation frame
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    
    // Stop all media tracks
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    // Clear video source
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setScanning(false);
  };
  
  // Helper function to handle camera errors with specific messages
  const handleCameraError = (err: any) => {
    if (err instanceof Error) {
      switch (err.name) {
        case 'NotAllowedError':
          setError('Camera permission denied. Please allow camera access in your browser settings.');
          break;
        case 'NotReadableError':
          setError('Camera is in use by another application or has a hardware issue. Please close other camera apps and try again.');
          break;
        case 'NotFoundError':
          setError('No camera was found on your device.');
          break;
        case 'OverconstrainedError':
          setError('Your camera does not meet the required constraints. Try using a different device or browser.');
          break;
        default:
          setError(`Camera error: ${err.message}`);
      }
    } else {
      setError('Camera access failed. Please check your camera and try again.');
    }
  };
  
  const retryCamera = () => {
    stopCamera();
    setTimeout(() => {
      startCamera();
    }, 500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />

        <div className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
          <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 px-4 py-3">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
              Scan Site QR Code
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <svg 
                className="h-5 w-5" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <div className="h-full px-4 py-5 sm:p-6">
            {error && (
              <div className="mb-4 p-4 bg-red-50 dark:bg-red-900 rounded-md">
                <p className="text-red-800 dark:text-red-100">{error}</p>
              </div>
            )}

            {scannedSiteId ? (
              <div className="text-center py-4">
                <svg 
                  className="h-16 w-16 mx-auto text-green-500 mb-4" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                  Site Check-In Successful
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  You have checked in at: <span className="font-medium">{scannedSiteName}</span>
                </p>
              </div>
            ) : (
              <div className="text-center">
                <div className="mb-4">
                  <p className="text-gray-600 dark:text-gray-300 mb-2">
                    Position the QR code within the scanner
                  </p>
                </div>
                <div 
                  className="mx-auto overflow-hidden relative"
                  style={{ 
                    width: '100%', 
                    maxWidth: '500px', 
                    height: '300px', 
                    border: '1px solid #ccc',
                    backgroundColor: '#000',
                    position: 'relative',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  {/* QR Scanner elements */}
                  <video 
                    ref={videoRef}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      backgroundColor: '#000'
                    }}
                    width="640"
                    height="480"
                    autoPlay
                    playsInline
                    muted
                  />
                  <canvas 
                    ref={canvasRef} 
                    style={{ display: 'none' }} 
                  />
                  
                  {/* QR Scanner overlay - the white square corners */}
                  <div style={{
                    position: 'relative',
                    width: '250px',
                    height: '250px',
                    border: '2px solid transparent',
                    boxShadow: 'inset 0 0 0 5px rgba(255,255,255,0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 5
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: -2,
                      left: -2,
                      width: '30px',
                      height: '30px',
                      borderTop: '5px solid white',
                      borderLeft: '5px solid white',
                    }}></div>
                    <div style={{
                      position: 'absolute',
                      top: -2,
                      right: -2,
                      width: '30px',
                      height: '30px',
                      borderTop: '5px solid white',
                      borderRight: '5px solid white',
                    }}></div>
                    <div style={{
                      position: 'absolute',
                      bottom: -2,
                      left: -2,
                      width: '30px',
                      height: '30px',
                      borderBottom: '5px solid white',
                      borderLeft: '5px solid white',
                    }}></div>
                    <div style={{
                      position: 'absolute',
                      bottom: -2,
                      right: -2,
                      width: '30px',
                      height: '30px',
                      borderBottom: '5px solid white',
                      borderRight: '5px solid white',
                    }}></div>
                  </div>
                </div>
                {scanning ? (
                  <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                    Camera active - scanning for QR codes...
                  </p>
                ) : (
                  <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-2">
                    Initializing camera...
                  </p>
                )}
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Please allow camera access when prompted
                </p>
                {error && (
                  <button 
                    onClick={retryCamera}
                    className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Try Again
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-3 flex justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-100"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}