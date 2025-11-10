import { supabase } from '../../../../../lib/supabase';
import { generateHSPolicyPDF } from '../../../../../utils/pdf/healthsafetypolicy/HSPolicyPDFGenerator';
import { PDFFile } from '../types';
import {
  generateSignedUrl,
  createPdfViewerHtml,
} from '../utils/pdfViewerHelpers';

export const handleViewPDF = async (
  file: PDFFile,
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
          ? `HS-Policy-${policyNumber}-${displayName}.pdf`
          : `HS-Policy-${displayName}.pdf`;

        // Check if window is still open
        if (newWindow.closed) {
          alert('PDF window was closed. Please try again.');
          return;
        }

        // For iOS Safari, try direct PDF display first
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

        if (isIOS) {
          // iOS Safari - direct PDF approach
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
      return;
    }

    // For created files
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
    // Parse content from JSON string
    let content;
    try {
      content = JSON.parse(file.content || '{}');
    } catch (err) {
      content = { sections: [] };
    }
    const combinedContent = content.sections
      .sort((a: any, b: any) => a.order - b.order)
      .map((section: any) => `<h2>${section.title}</h2>${section.content}`)
      .join('\n\n');
    // Generate PDF
    const pdfDataUrl = await generateHSPolicyPDF({
      title: file.displayName || '',
      content: combinedContent,
      policyNumber: parseInt(file.policy_number || '0'),
      companySettings,
      createdAt: file.created_at,
      updatedAt: file.updated_at,
    });
    // Format the filename
    const displayName = file.displayName || 'policy';
    const policyNumber = file.policy_number || '';
    const formattedFilename = policyNumber
      ? `HS-Policy-${policyNumber}-${displayName}.pdf`
      : `HS-Policy-${displayName}.pdf`;

    // Check if window is still open
    if (newWindow.closed) {
      alert('PDF window was closed. Please try again.');
      return;
    }

    // For iOS Safari, try direct PDF display first
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

    if (isIOS) {
      // iOS Safari - direct PDF approach
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
      const htmlContent = createPdfViewerHtml(pdfDataUrl, formattedFilename);

      newWindow.document.open();
      newWindow.document.write(htmlContent);
      newWindow.document.close();
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
  setLoading(true);
  setError(null);

  try {
    if (file.type === 'uploaded') {
      // Delete uploaded file from storage
      const { error: storageError } = await supabase.storage
        .from('hs-policies')
        .remove([file.name]);

      if (storageError) throw storageError;

      // Delete metadata for uploaded file
      const { error: metadataError } = await supabase
        .from('hs_policy_files')
        .delete()
        .eq('file_name', file.name);

      if (metadataError) throw metadataError;
    } else {
      // Delete created policy from database
      const { error: deleteError } = await supabase
        .from('hs_policy_files')
        .delete()
        .eq('id', file.id);

      if (deleteError) throw deleteError;
    }

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

export const saveDisplayName = async (
  file: PDFFile,
  newName: string,
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
      .from('hs_policy_files')
      .select('id')
      .eq('file_name', file.name)
      .single();

    let error;
    if (existingRecord) {
      // Update existing record
      const { error: updateError } = await supabase
        .from('hs_policy_files')
        .update({
          display_name: newName,
          updated_at: new Date().toISOString(),
        })
        .eq('file_name', file.name);
      error = updateError;
    } else {
      // Insert new record
      const { error: insertError } = await supabase
        .from('hs_policy_files')
        .insert({
          file_name: file.name,
          display_name: newName,
          user_id: user.id,
          type: file.type,
        });
      error = insertError;
    }

    if (error) throw error;

    setPdfFiles((prev) =>
      prev.map((f) => (f.id === file.id ? { ...f, displayName: newName } : f))
    );
  } catch (err) {
    console.error('Error saving display name:', err);
    setError(
      err instanceof Error
        ? err.message
        : 'An error occurred while saving the display name'
    );
  }
};
