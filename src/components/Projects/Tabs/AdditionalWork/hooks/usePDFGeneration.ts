import { useState } from 'react';
import { AdditionalWork } from '../types';
import { generateAdditionalWorkPDF } from '../../../../../utils/pdf/additionalwork/additionalworkPDFGenerator';
import { formatPDFFilename, isIOSDevice } from '../utils';

/**
 * Hook for managing PDF generation functionality
 */
export const usePDFGeneration = () => {
  const [generatingPdfId, setGeneratingPdfId] = useState<string | null>(null);
  const [pdfError, setPdfError] = useState<string | null>(null);

  /**
   * Generate and display PDF for additional work
   */
  const generatePDF = async (work: AdditionalWork, projectName: string) => {
    try {
      setGeneratingPdfId(work.id);
      setPdfError(null);
      
      // Open the window first (must be synchronous for iOS Safari)
      const newWindow = window.open('', '_blank');
      
      // Check if window was blocked
      if (!newWindow) {
        alert('Please allow popups for this site to view PDFs');
        return;
      }
      
      // Show loading state in the new window
      showLoadingState(newWindow);

      // Generate PDF
      const pdfDataUrl = await generateAdditionalWorkPDF({
        additionalWork: work,
        projectName: projectName
      });

      const formattedFilename = formatPDFFilename(work);
      
      // Check if window is still open
      if (newWindow.closed) {
        alert('PDF window was closed. Please try again.');
        return;
      }
      
      // Handle different devices
      if (isIOSDevice()) {
        await handleIOSPDF(newWindow, pdfDataUrl, formattedFilename);
      } else {
        await handleDesktopPDF(newWindow, pdfDataUrl, formattedFilename);
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      setPdfError(error instanceof Error ? error.message : 'An error occurred generating the PDF');
    } finally {
      setGeneratingPdfId(null);
    }
  };

  /**
   * Show loading state in new window
   */
  const showLoadingState = (window: Window) => {
    window.document.write(`
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
  };

  /**
   * Handle PDF display for iOS devices
   */
  const handleIOSPDF = async (window: Window, pdfDataUrl: string, filename: string) => {
    const response = await fetch(pdfDataUrl);
    const blob = await response.blob();
    const pdfUrl = URL.createObjectURL(blob);
    
    // Replace the loading content with PDF viewer for iOS
    window.document.open();
    window.document.write(getIOSPDFHTML(pdfUrl, filename));
    window.document.close();
  };

  /**
   * Handle PDF display for desktop devices
   */
  const handleDesktopPDF = async (window: Window, pdfDataUrl: string, filename: string) => {
    const htmlContent = getDesktopPDFHTML(pdfDataUrl, filename);
    window.document.open();
    window.document.write(htmlContent);
    window.document.close();
  };

  /**
   * Get HTML content for iOS PDF viewer
   */
  const getIOSPDFHTML = (pdfUrl: string, filename: string): string => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${filename}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body, html { margin: 0; padding: 0; height: 100%; overflow: hidden; }
          .pdf-container { width: 100%; height: 100%; }
          .download-bar { 
            position: fixed; top: 0; left: 0; right: 0; background: #f1f1f1; padding: 10px; 
            display: flex; justify-content: center; z-index: 1000; box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .download-button { 
            background: #0066cc; color: white; padding: 12px 24px; border: none; border-radius: 4px; 
            cursor: pointer; font-weight: bold; text-decoration: none; font-family: Arial, sans-serif;
            font-size: 16px; touch-action: manipulation;
          }
          .download-button:hover { background: #0055aa; }
          .pdf-view { margin-top: 60px; height: calc(100% - 60px); }
          .pdf-fallback { padding: 20px; text-align: center; font-family: Arial, sans-serif; }
          .pdf-fallback a { 
            color: #0066cc; text-decoration: none; font-weight: bold; font-size: 18px;
            display: inline-block; margin: 20px 0; padding: 15px 30px; background: #f0f0f0; border-radius: 5px;
          }
        </style>
      </head>
      <body>
        <div class="download-bar">
          <button id="download-btn" class="download-button">Download ${filename}</button>
        </div>
        <div class="pdf-view">
          <div class="pdf-fallback">
            <h2>PDF Ready for Download</h2>
            <p>Click the download button above to save the PDF file.</p>
            <a id="direct-link" href="${pdfUrl}" download="${filename}">Direct Download Link</a>
          </div>
        </div>
        <script>
          const pdfUrl = "${pdfUrl}";
          const fileName = "${filename}";
          
          function downloadPDF() {
            const a = document.createElement('a');
            a.href = pdfUrl;
            a.download = fileName;
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          }
          
          document.getElementById('download-btn').addEventListener('click', downloadPDF);
          document.getElementById('direct-link').addEventListener('click', function(e) {
            e.preventDefault();
            downloadPDF();
          });
          
          document.addEventListener('keydown', function(e) {
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
              e.preventDefault();
              downloadPDF();
            }
          });
          
          setTimeout(function() {
            if (confirm('Would you like to download the PDF now?')) {
              downloadPDF();
            }
          }, 1000);
          
          window.addEventListener('beforeunload', function() {
            URL.revokeObjectURL(pdfUrl);
          });
        </script>
      </body>
      </html>
    `;
  };

  /**
   * Get HTML content for desktop PDF viewer
   */
  const getDesktopPDFHTML = (pdfDataUrl: string, filename: string): string => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${filename}</title>
        <meta charset="UTF-8">
        <meta name="filename" content="${filename}">
        <style>
          body, html { margin: 0; padding: 0; height: 100%; overflow: hidden; }
          .pdf-container { width: 100%; height: 100%; }
          iframe { width: 100%; height: 100%; border: none; }
          .download-bar { 
            position: fixed; top: 0; left: 0; right: 0; background: #f1f1f1; padding: 10px; 
            display: flex; justify-content: center; z-index: 1000; box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .download-button { 
            background: #0066cc; color: white; padding: 8px 16px; border: none; border-radius: 4px; 
            cursor: pointer; font-weight: bold; text-decoration: none; font-family: Arial, sans-serif;
          }
          .download-button:hover { background: #0055aa; }
          .pdf-view { margin-top: 50px; height: calc(100% - 50px); }
          #pdf-name { font-weight: bold; margin-left: 10px; }
        </style>
      </head>
      <body>
        <div class="download-bar">
          <a id="download-btn" class="download-button" href="#">Download ${filename}</a>
        </div>
        <div class="pdf-view">
          <iframe id="pdf-iframe" style="width:100%; height:100%; border:none;"></iframe>
        </div>
        <script>
          const pdfDataUrl = "${pdfDataUrl}";
          const fileName = "${filename}";
          document.title = fileName;
          
          const base64Data = pdfDataUrl.split(',')[1];
          const binaryData = atob(base64Data);
          const array = new Uint8Array(binaryData.length);
          for (let i = 0; i < binaryData.length; i++) {
            array[i] = binaryData.charCodeAt(i);
          }
          
          const pdfBlob = new Blob([array], {type: 'application/pdf'});
          const pdfUrl = URL.createObjectURL(pdfBlob);
          
          document.getElementById('pdf-iframe').src = pdfUrl;
          
          const downloadBtn = document.getElementById('download-btn');
          downloadBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const a = document.createElement('a');
            a.href = pdfUrl;
            a.download = fileName;
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          });
          
          document.addEventListener('keydown', function(e) {
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
              e.preventDefault();
              downloadBtn.click();
            }
          });

          window.addEventListener('beforeunload', function() {
            URL.revokeObjectURL(pdfUrl);
          });
        </script>
      </body>
      </html>
    `;
  };

  return {
    generatingPdfId,
    pdfError,
    setPdfError,
    generatePDF,
  };
};
