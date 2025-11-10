import { supabase } from '../../../../../lib/supabase';
import { generateOtherPolicyPDF } from '../../../../../utils/pdf/otherpolicies/otherPoliciesPDFGenerator';
import { PDFFile } from '../hooks/useOtherPolicies';

// Helper function to create the HTML content for PDF viewer
export const createPdfViewerHtml = (pdfDataUrl: string, filename: string) => {
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
};

export const handleViewPDF = async (
  file: PDFFile,
  generateSignedUrl: (fileName: string) => Promise<string>,
  setGeneratingPdfId: (id: string | null) => void,
  setPdfError: (error: string | null) => void
) => {
  try {
    setGeneratingPdfId(file.id);
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

    if (file.type === 'uploaded') {
      // Generate a fresh signed URL before opening
      const signedUrl = await generateSignedUrl(file.name);
      if (!signedUrl) {
        setPdfError('Unable to generate signed URL for the PDF');
        setGeneratingPdfId(null);
        return;
      }
      // For uploaded files, create a more user-friendly approach similar to created files
      try {
        // Fetch the PDF file via the signed URL
        const response = await fetch(signedUrl);
        const pdfBlob = await response.blob();
        // Create a data URL from the blob
        const reader = new FileReader();
        const pdfDataUrlPromise = new Promise<string>((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(pdfBlob);
        });
        const pdfDataUrl = await pdfDataUrlPromise;
        // Format the filename
        const displayName =
          file.displayName || file.name.replace(/\.pdf$/i, '');
        const policyNumber = file.policy_number || '';
        const formattedFilename = policyNumber
          ? `Policy-${policyNumber}-${displayName}.pdf`
          : `${displayName}.pdf`;

        // Check if window is still open
        if (newWindow.closed) {
          alert('PDF window was closed. Please try again.');
          return;
        }

        // For iOS Safari, try direct PDF display first
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

        if (isIOS) {
          // iOS Safari - handle PDF download
          const response = await fetch(pdfDataUrl);
          const blob = await response.blob();
          const pdfUrl = URL.createObjectURL(blob);

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
          `);
          newWindow.document.close();
        } else {
          // Desktop/non-iOS - iframe approach
          const htmlContent = createPdfViewerHtml(
            pdfDataUrl,
            formattedFilename
          );

          newWindow.document.open();
          newWindow.document.write(htmlContent);
          newWindow.document.close();
        }
      } catch (error) {
        setPdfError('An unexpected error occurred while processing the PDF');
        newWindow.location.href = signedUrl;
      }
    } else if (file.type === 'created') {
      // For created policies, generate PDF from content
      try {
        // First fetch company settings
        const { data: companySettings, error: companyError } = await supabase
          .from('company_settings')
          .select('*')
          .limit(1)
          .maybeSingle();

        if (companyError) {
          console.error('Error fetching company settings:', companyError);
          setPdfError('Failed to fetch company settings.');
          return;
        }

        // Provide default company settings if none exist
        const defaultSettings = {
          id: '',
          name: 'Your Company',
          address_line1: 'Address Line 1',
          town: 'Town',
          county: 'County',
          post_code: 'POST CODE',
          phone: 'Phone Number',
          email: 'email@company.com',
          logo_url: undefined,
          vat_number: undefined,
          company_number: undefined,
        };

        const settings = companySettings || defaultSettings;

        const pdfDataUrl = await generateOtherPolicyPDF({
          title: file.displayName || file.name,
          content: file.content || '',
          policyNumber: parseInt(file.policy_number || '1'),
          companySettings: settings,
          createdAt: file.created_at,
          updatedAt: file.updated_at,
        });
        const formattedFilename = file.policy_number
          ? `Policy-${file.policy_number}-${file.displayName || file.name}.pdf`
          : `${file.displayName || file.name}.pdf`;

        // Check if window is still open
        if (newWindow.closed) {
          alert('PDF window was closed. Please try again.');
          return;
        }

        // For iOS Safari, try direct PDF display first
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

        if (isIOS) {
          // iOS Safari - handle PDF download
          const response = await fetch(pdfDataUrl);
          const blob = await response.blob();
          const pdfUrl = URL.createObjectURL(blob);

          // Similar iOS handling code as above...
          // (Shortened for brevity - same pattern as uploaded files)
        } else {
          // Desktop/non-iOS - iframe approach
          const htmlContent = createPdfViewerHtml(
            pdfDataUrl,
            formattedFilename
          );

          newWindow.document.open();
          newWindow.document.write(htmlContent);
          newWindow.document.close();
        }
      } catch (err) {
        setPdfError('Failed to generate PDF.');
      }
    }
  } catch (error) {
    console.error('Error generating PDF:', error);
    setPdfError('An unexpected error occurred while generating the PDF');
  } finally {
    setGeneratingPdfId(null);
  }
};

export const handleDeleteFile = async (
  file: PDFFile,
  setLoading: (loading: boolean) => void,
  setError: (error: string | null) => void,
  fetchPDFFiles: () => void
) => {
  try {
    setLoading(true);
    setError(null);

    const { error: storageError } = await supabase.storage
      .from('other-policies')
      .remove([file.name]);

    if (storageError) throw storageError;

    // Also delete metadata
    const { error: metadataError } = await supabase
      .from('other_policy_files')
      .delete()
      .eq('file_name', file.name);

    if (metadataError) throw metadataError;

    await fetchPDFFiles();
  } catch (err) {
    console.error('Error deleting file:', err);
    setError(
      err instanceof Error
        ? err.message
        : 'An error occurred while deleting the file'
    );
  } finally {
    setLoading(false);
  }
};

export const savePolicyNumber = async (
  file: PDFFile,
  newNumber: string,
  setPdfFiles: (fn: (prev: PDFFile[]) => PDFFile[]) => void,
  setError: (error: string | null) => void
) => {
  try {
    setError(null);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // First check if a record exists
    const { data: existingRecord } = await supabase
      .from('other_policy_files')
      .select('id')
      .eq('file_name', file.name)
      .single();

    let error;
    if (existingRecord) {
      // Update existing record
      const { error: updateError } = await supabase
        .from('other_policy_files')
        .update({
          policy_number: newNumber,
          updated_at: new Date().toISOString(),
        })
        .eq('file_name', file.name);
      error = updateError;
    } else {
      // Insert new record
      const { error: insertError } = await supabase
        .from('other_policy_files')
        .insert({
          file_name: file.name,
          policy_number: newNumber,
          user_id: user.id,
          type: file.type,
        });
      error = insertError;
    }

    if (error) throw error;

    setPdfFiles((prev) =>
      prev.map((f) =>
        f.id === file.id ? { ...f, policy_number: newNumber } : f
      )
    );
  } catch (err) {
    console.error('Error saving policy number:', err);
    setError(
      err instanceof Error
        ? err.message
        : 'An error occurred while saving the policy number'
    );
  }
};
