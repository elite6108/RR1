import { useState } from 'react';
import { supabase } from '../../../../../lib/supabase';
import { generateContractPDF } from '../../../../../utils/pdf/contracts/contractPDFGenerator';
import type { Contract, ContractPDFData } from '../types';

export interface UseContractPDFReturn {
  generatingPDF: boolean;
  pdfError: string | null;
  generatePDF: (contract: Contract) => Promise<void>;
  clearError: () => void;
}

export function useContractPDF(): UseContractPDFReturn {
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);

  const clearError = () => {
    setPdfError(null);
  };

  const generatePDF = async (contract: Contract) => {
    try {
      setGeneratingPDF(true);
      setPdfError(null);
      
      // Open the window first (must be synchronous for iOS Safari)
      const newWindow = window.open('', '_blank');
      
      // Check if window was blocked
      if (!newWindow) {
        alert('Please allow popups for this site to view PDFs');
        return;
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

      // Fetch company settings
      const { data: companySettings, error: companyError } = await supabase
        .from('company_settings')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (companyError) throw new Error(`Failed to load company settings: ${companyError.message}`);
      if (!companySettings) throw new Error('Company settings not found. Please set up your company details first.');

      // Ensure all required fields are present before generating PDF
      const contractForPDF: ContractPDFData = {
        ...contract,
        // Add necessary fields that might be missing
        site_address_line1: contract.site_address || '',
        site_address_line2: '',
        site_town: '',
        site_county: '',
        site_postcode: '',
        other_party_name: contract.customer?.company_name || contract.customer?.customer_name || 'Client',
        other_party_address_line1: '',
        other_party_address_line2: '',
        other_party_town: '',
        other_party_county: '',
        other_party_postcode: '',
        site_id: contract.site_id || null,
        site_manager: '',
        // Ensure description_of_works is never undefined
        description_of_works: contract.description_of_works || 'No description provided',
        // Ensure all numeric fields are properly formatted
        payment_amount: typeof contract.payment_amount === 'number' ? contract.payment_amount : 0,
        deposit_amount: typeof contract.deposit_amount === 'number' ? contract.deposit_amount : 0
      };

      const pdfUrl = await generateContractPDF({
        contract: contractForPDF,
        companySettings
      });
      
      // Format filename for better clarity
      const contractDate = contract.contract_date ? new Date(contract.contract_date).toISOString().split('T')[0] : 'undated';
      const customerName = contract.customer ? 
        (contract.customer.company_name || contract.customer.customer_name || 'Unknown') : 'Unknown';
      const formattedFilename = `Contract-${customerName.replace(/\s+/g, '-')}-${contractDate}.pdf`;
      
      // Check if window is still open
      if (newWindow.closed) {
        alert('PDF window was closed. Please try again.');
        return;
      }
      
      // For iOS Safari, try direct PDF display first
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      
      if (isIOS) {
        await handleIOSPDFDisplay(newWindow, pdfUrl, formattedFilename);
      } else {
        await handleDesktopPDFDisplay(newWindow, pdfUrl, formattedFilename);
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      setPdfError(error instanceof Error ? error.message : 'An error occurred generating the PDF');
    } finally {
      setGeneratingPDF(false);
    }
  };

  return {
    generatingPDF,
    pdfError,
    generatePDF,
    clearError
  };
}

async function handleIOSPDFDisplay(newWindow: Window, pdfUrl: string, formattedFilename: string) {
  // iOS Safari - direct PDF approach
  const response = await fetch(pdfUrl);
  const blob = await response.blob();
  const pdfBlobUrl = URL.createObjectURL(blob);
  
  // Replace the loading content with PDF viewer
  newWindow.document.open();
  newWindow.document.write(`
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
          <a id="direct-link" href="${pdfBlobUrl}" download="${formattedFilename}">
            Direct Download Link
          </a>
        </div>
      </div>
      <script>
        const pdfBlobUrl = "${pdfBlobUrl}";
        const fileName = "${formattedFilename}";
        
        // Download function
        function downloadPDF() {
          const a = document.createElement('a');
          a.href = pdfBlobUrl;
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
          URL.revokeObjectURL(pdfBlobUrl);
        });
      </script>
    </body>
    </html>
  `);
  newWindow.document.close();
}

async function handleDesktopPDFDisplay(newWindow: Window, pdfUrl: string, formattedFilename: string) {
  // Desktop/non-iOS - iframe approach
  const htmlContent = `
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
      const pdfUrl = "${pdfUrl}";
      const fileName = "${formattedFilename}";
      document.title = fileName;
      
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

  newWindow.document.open();
  newWindow.document.write(htmlContent);
  newWindow.document.close();
}
