import { supabase } from '../../../../lib/supabase';
import { generateCPPPDF } from '../../../../utils/pdf/cpp/cppPDFGenerator';
import type { CPP } from '../../../../types/database';

export async function handleCPPPDFGeneration(cpp: CPP): Promise<string> {
  // Fetch company settings
  const { data: companySettings, error: companyError } = await supabase
    .from('company_settings')
    .select('*')
    .limit(1)
    .maybeSingle();

  if (companyError)
    throw new Error(
      `Failed to load company settings: ${companyError.message}`
    );
  if (!companySettings)
    throw new Error(
      'Company settings not found. Please set up your company details first.'
    );

  // Generate PDF
  const pdfDataUrl = await generateCPPPDF({
    cpp,
    companySettings,
  });

  return pdfDataUrl;
}

export function formatCPPFilename(cpp: CPP): string {
  const cppNumber = cpp.cpp_number || 'unknown';
  return cppNumber.startsWith('CPP-') 
    ? `${cppNumber}.pdf` 
    : `CPP-${cppNumber}.pdf`;
}

export function createPdfViewerHtml(pdfDataUrl: string, filename: string): string {
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
        font-family: Arial, sans-serif;
      }
      .download-button:hover { background: #0055aa; }
      .pdf-view { margin-top: 50px; height: calc(100% - 50px); }
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
      // Store PDF data and filename
      const pdfDataUrl = "${pdfDataUrl}";
      const fileName = "${filename}";
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
        
        // Direct download approach with correct filename
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

      // Helper function to force download with proper filename
      function forceDownload(blob, filename) {
        const a = document.createElement('a');
        const url = URL.createObjectURL(blob);
        a.href = url;
        a.download = filename || 'download';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }

      // Clean up when the window is closed
      window.addEventListener('beforeunload', function() {
        URL.revokeObjectURL(pdfUrl);
      });
      
      // For browsers that don't support download attribute properly
      if (navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1) {
        downloadBtn.addEventListener('click', function(e) {
          e.preventDefault();
          alert('To download this PDF with the correct filename, please use the keyboard shortcut Command+S and manually type "${filename}" in the filename field.');
        });
      }
    </script>
  </body>
  </html>
  `;
}
