import type { PDFWindowConfig } from '../types';

/**
 * Creates a loading window for PDF generation
 * @returns The new window object or null if blocked
 */
export function createLoadingWindow(): Window | null {
  const newWindow = window.open('', '_blank');
  
  if (!newWindow) {
    alert('Please allow popups for this site to view PDFs');
    return null;
  }
  
  // Show loading state in the new window
  newWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Generating PDF...</title>
      <style>
        body { font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background: #f5f5f5; }
        .loading { text-align: center; }
        .spinner { border: 4px solid #f3f3f3; border-top: 4px solid #3498db; border-radius: 50%; width: 40px; height: 40px; animation: spin 2s linear infinite; margin: 0 auto 20px; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      </style>
    </head>
    <body>
      <div class="loading">
        <div class="spinner"></div>
        <p>Generating PDF...</p>
      </div>
    </body>
    </html>
  `);
  
  return newWindow;
}

/**
 * Generates HTML content for iOS PDF viewer
 */
export function generateIOSPDFContent(config: PDFWindowConfig, pdfUrl: string): string {
  const { formattedFilename } = config;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${formattedFilename}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body, html { margin: 0; padding: 0; height: 100%; overflow: hidden; }
        .pdf-container { width: 100%; height: 100%; }
        .download-bar { 
          position: fixed; 
          top: 0; 
          left: 0; 
          right: 0; 
          background: #f1f1f1; 
          padding: 10px; 
          display: flex; 
          justify-content: center;
          z-index: 1000;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .download-button { 
          background: #0066cc; 
          color: white; 
          padding: 12px 24px; 
          border: none; 
          border-radius: 4px; 
          cursor: pointer; 
          font-weight: bold;
          text-decoration: none;
          font-family: Arial, sans-serif;
          font-size: 16px;
          touch-action: manipulation;
        }
        .download-button:hover { background: #0055aa; }
        .pdf-view { margin-top: 60px; height: calc(100% - 60px); }
        .pdf-fallback { 
          padding: 20px; 
          text-align: center; 
          font-family: Arial, sans-serif;
        }
        .pdf-fallback a { 
          color: #0066cc; 
          text-decoration: none; 
          font-weight: bold;
          font-size: 18px;
          display: inline-block;
          margin: 20px 0;
          padding: 15px 30px;
          background: #f0f0f0;
          border-radius: 5px;
        }
      </style>
    </head>
    <body>
      <div class="download-bar">
        <button id="download-btn" class="download-button">Download ${formattedFilename}</button>
      </div>
      <div class="pdf-view">
        <div class="pdf-fallback">
          <h2>PDF Ready for Download</h2>
          <p>Click the download button above to save the PDF file.</p>
          <a id="direct-link" href="${pdfUrl}" download="${formattedFilename}">
            Direct Download Link
          </a>
        </div>
      </div>
      <script>
        const pdfUrl = "${pdfUrl}";
        const fileName = "${formattedFilename}";
        
        // Download function
        function downloadPDF() {
          const a = document.createElement('a');
          a.href = pdfUrl;
          a.download = fileName;
          a.style.display = 'none';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }
        
        // Set up download button
        document.getElementById('download-btn').addEventListener('click', downloadPDF);
        document.getElementById('direct-link').addEventListener('click', function(e) {
          e.preventDefault();
          downloadPDF();
        });
        
        // Handle keyboard shortcuts
        document.addEventListener('keydown', function(e) {
          if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            downloadPDF();
          }
        });
        
        // Try to trigger download automatically (iOS Safari might block this)
        setTimeout(function() {
          if (confirm('Would you like to download the PDF now?')) {
            downloadPDF();
          }
        }, 1000);
        
        // Clean up when the window is closed
        window.addEventListener('beforeunload', function() {
          URL.revokeObjectURL(pdfUrl);
        });
      </script>
    </body>
    </html>
  `;
}

/**
 * Generates HTML content for desktop PDF viewer
 */
export function generateDesktopPDFContent(config: PDFWindowConfig): string {
  const { formattedFilename, pdfDataUrl } = config;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${formattedFilename}</title>
      <meta charset="UTF-8">
      <meta name="filename" content="${formattedFilename}">
      <style>
        body, html { margin: 0; padding: 0; height: 100%; overflow: hidden; }
        .pdf-container { width: 100%; height: 100%; }
        iframe { width: 100%; height: 100%; border: none; }
        .download-bar { 
          position: fixed; 
          top: 0; 
          left: 0; 
          right: 0; 
          background: #f1f1f1; 
          padding: 10px; 
          display: flex; 
          justify-content: center;
          z-index: 1000;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .download-button { 
          background: #0066cc; 
          color: white; 
          padding: 8px 16px; 
          border: none; 
          border-radius: 4px; 
          cursor: pointer; 
          font-weight: bold;
          text-decoration: none;
        }
        .download-button:hover { background: #0055aa; }
        .pdf-view { margin-top: 50px; height: calc(100% - 50px); }
        #pdf-name { font-weight: bold; margin-left: 10px; }
      </style>
    </head>
    <body>
      <div class="download-bar">
        <a id="download-btn" class="download-button" href="#">Download ${formattedFilename}</a>
      </div>
      <div class="pdf-view">
        <iframe id="pdf-iframe" style="width:100%; height:100%; border:none;"></iframe>
      </div>
      <script>
        // Store PDF data and filename
        const pdfDataUrl = "${pdfDataUrl}";
        const fileName = "${formattedFilename}";
        document.title = fileName;
        
        // Convert base64 data URL to Blob
        const base64Data = pdfDataUrl.split(',')[1];
        const binaryData = atob(base64Data);
        const array = new Uint8Array(binaryData.length);
        for (let i = 0; i < binaryData.length; i++) {
          array[i] = binaryData.charCodeAt(i);
        }
        
        // Create PDF blob
        const pdfBlob = new Blob([array], {type: 'application/pdf'});
        
        // Create object URL
        const pdfUrl = URL.createObjectURL(pdfBlob);
        
        // Set iframe source to view PDF
        document.getElementById('pdf-iframe').src = pdfUrl;
        
        // Set up download button
        const downloadBtn = document.getElementById('download-btn');
        downloadBtn.addEventListener('click', function(e) {
          e.preventDefault();
          
          // Create a temporary anchor for download
          const a = document.createElement('a');
          a.href = pdfUrl;
          a.download = fileName;
          a.style.display = 'none';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        });
        
        // Handle Ctrl+S keyboard shortcut
        document.addEventListener('keydown', function(e) {
          if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            downloadBtn.click();
          }
        });

        // Clean up when the window is closed
        window.addEventListener('beforeunload', function() {
          URL.revokeObjectURL(pdfUrl);
        });
      </script>
    </body>
    </html>
  `;
}

/**
 * Checks if the current device is iOS
 */
export function isIOSDevice(): boolean {
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

/**
 * Formats a CPP filename
 */
export function formatCPPFilename(cppNumber?: string): string {
  const cppNum = cppNumber || 'unknown';
  return cppNum.startsWith('CPP-') ? `${cppNum}.pdf` : `CPP-${cppNum}.pdf`;
}

/**
 * Creates a PDF blob URL from data URL
 */
export async function createPDFBlobUrl(pdfDataUrl: string): Promise<string> {
  const response = await fetch(pdfDataUrl);
  const blob = await response.blob();
  return URL.createObjectURL(blob);
}

/**
 * Displays PDF content in the provided window
 */
export async function displayPDFInWindow(
  targetWindow: Window,
  config: PDFWindowConfig
): Promise<void> {
  const { formattedFilename } = config;
  
  // Check if window is still open
  if (targetWindow.closed) {
    alert('PDF window was closed. Please try again.');
    return;
  }
  
  const isIOS = isIOSDevice();
  
  if (isIOS) {
    // iOS Safari - direct PDF approach
    const pdfUrl = await createPDFBlobUrl(config.pdfDataUrl);
    const htmlContent = generateIOSPDFContent(config, pdfUrl);
    
    // Replace the loading content with PDF viewer
    targetWindow.document.open();
    targetWindow.document.write(htmlContent);
    targetWindow.document.close();
  } else {
    // Desktop/non-iOS - iframe approach
    const htmlContent = generateDesktopPDFContent(config);
    
    targetWindow.document.open();
    targetWindow.document.write(htmlContent);
    targetWindow.document.close();
  }
}
