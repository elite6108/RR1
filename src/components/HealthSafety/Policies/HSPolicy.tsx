import React, { useState, useEffect } from 'react';
import { ArrowRight, Plus, FileUp, Trash2, AlertTriangle, FileText, Loader2, ExternalLink, Edit2, Save, X, RefreshCw, ChevronLeft, Pencil, Search } from 'lucide-react';
import { supabase } from "../../../lib/supabase";
import { HSPolicyUploadModal } from './HSPolicyUploadModal';
import { generateHSPolicyPDF } from '../../../utils/pdf/healthsafetypolicy/HSPolicyPDFGenerator';
import { HSPolicyEditor } from './HSPolicyEditor';
import { createPortal } from 'react-dom';

interface HSPolicyProps {
  onBack: () => void;
}

interface PDFFile {
  id: string;
  name: string;
  type: 'uploaded' | 'created';
  policy_number?: string;
  created_at: string;
  updated_at?: string;
  size: number;
  url: string;
  signed_url?: string;
  displayName?: string;
  content?: string;
}

export function HSPolicy({ onBack }: HSPolicyProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pdfFiles, setPdfFiles] = useState<PDFFile[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<PDFFile | null>(null);
  const [editingFile, setEditingFile] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [savingName, setSavingName] = useState(false);
  const [showBlankModal, setShowBlankModal] = useState(false);
  const [generatingPdfId, setGeneratingPdfId] = useState<string | null>(null);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [selectedPolicyForEdit, setSelectedPolicyForEdit] = useState<PDFFile | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPDFFiles();
  }, []);

  // Prevent body scroll when any modal is open
  useEffect(() => {
    const isModalOpen = showUploadModal || showDeleteModal || showBlankModal;
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    // Cleanup function to restore scroll when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showUploadModal, showDeleteModal, showBlankModal]);

  useEffect(() => {
    if (showUploadModal) {
      console.log('Upload modal shown with props:', {
        bucketName: "hs-policies",
        metadataTable: "hs_policy_files"
      });
    }
  }, [showUploadModal]);

  const generateSignedUrl = async (fileName: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('hs-policies')
        .createSignedUrl(fileName, 60 * 60); // 1 hour expiry
      
      if (error) throw error;
      return data?.signedUrl || '';
    } catch (error) {
      console.error('Error generating signed URL:', error);
      return '';
    }
  };

  const fetchPDFFiles = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Starting to fetch PDF files...');

      // First, check if we can access the storage bucket
      const { data: bucketData, error: bucketError } = await supabase
        .storage
        .from('hs-policies')
        .list();
      
      if (bucketError) {
        console.error('Error accessing storage bucket:', bucketError);
        throw bucketError;
      }
      console.log('Storage bucket accessed successfully');
      console.log('Files in bucket:', bucketData);

      // Fetch metadata for uploaded files and created H&S policies
      const { data: policiesData, error: metadataError } = await supabase
        .from('hs_policy_files')
        .select('*')
        .order('created_at', { ascending: false });

      if (metadataError) {
        console.error('Error fetching metadata:', metadataError);
        throw metadataError;
      }
      console.log('Metadata fetched successfully');
      console.log('Number of policies in database:', policiesData?.length || 0);
      console.log('Policies data:', policiesData);

      const metadataMap = new Map(policiesData?.filter(p => p.type === 'uploaded').map(m => [m.file_name, m.display_name]) || []);
      console.log('Metadata map created');
      console.log('Number of entries in metadata map:', metadataMap.size);
      console.log('Metadata map entries:', Array.from(metadataMap.entries()));

      // Process uploaded files with signed URLs
      const uploadedFiles = await Promise.all(
        bucketData
          ?.filter(file => file.name.toLowerCase().endsWith('.pdf'))
          .map(async (file) => {
            const signedUrl = await generateSignedUrl(file.name);
            const fileData = {
              id: file.id,
              name: file.name,
              created_at: file.created_at,
              size: file.metadata?.size || 0,
              url: signedUrl,
              signed_url: signedUrl,
              displayName: metadataMap.get(file.name) || file.name.replace(/\.pdf$/i, ''),
              type: 'uploaded' as const
            };
            console.log('Processing uploaded file:', fileData);
            return fileData;
          }) || []
      );
      console.log('Processed uploaded files');
      console.log('Number of uploaded files:', uploadedFiles.length);
      console.log('Uploaded files:', uploadedFiles);

      // Process created policies
      const createdFiles = (policiesData || [])
        .filter(policy => policy.type === 'created')
        .map(policy => {
          // Ensure we have valid content for created policies
          let content = policy.content;
          
          if (content) {
            // Verify content is valid JSON
            try {
              JSON.parse(content);
              console.log(`Policy ${policy.id} has valid JSON content`);
            } catch (err) {
              console.error(`Invalid content in policy ${policy.id}:`, err);
              content = JSON.stringify({ sections: [] });
            }
          } else {
            console.warn(`Policy ${policy.id} has no content`);
            content = JSON.stringify({ sections: [] });
          }

          const policyData = {
            id: policy.id,
            name: policy.file_name,
            displayName: policy.display_name,
            created_at: policy.created_at,
            updated_at: policy.updated_at,
            size: 0,
            url: '',
            signed_url: '',
            type: 'created' as const,
            content: content,
            policy_number: policy.policy_number
          };
          console.log('Processing created policy:', policyData.id, policyData.displayName);
          return policyData;
        });
      console.log('Processed created files');
      console.log('Number of created files:', createdFiles.length);
      console.log('Created files:', createdFiles);

      // Combine both types of files
      const allFiles = [...createdFiles, ...uploadedFiles];
      console.log('Combined all files');
      console.log('Total number of files:', allFiles.length);
      console.log('All files:', allFiles);
      
      setPdfFiles(allFiles);
    } catch (err) {
      console.error('Error fetching PDF files:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while fetching PDF files');
    } finally {
      setLoading(false);
    }
  };

  // Add a function to refresh signed URLs
  const refreshSignedUrls = async () => {
    const updatedFiles = await Promise.all(
      pdfFiles.map(async (file) => {
        if (file.type === 'uploaded') {
          const signedUrl = await generateSignedUrl(file.name);
          return {
            ...file,
            url: signedUrl,
            signed_url: signedUrl,
          };
        }
        return file;
      })
    );
    setPdfFiles(updatedFiles);
  };

  // Refresh signed URLs every 45 minutes
  useEffect(() => {
    const interval = setInterval(refreshSignedUrls, 45 * 60 * 1000);
    return () => clearInterval(interval);
  }, [pdfFiles]);

  const handleDeleteFile = (file: PDFFile) => {
    setFileToDelete(file);
    setShowDeleteModal(true);
  };

  const startEditing = (file: PDFFile) => {
    setEditingFile(file.id);
    setEditingName(file.displayName || file.name.replace(/\.pdf$/i, ''));
  };

  const cancelEditing = () => {
    setEditingFile(null);
    setEditingName('');
  };

  const saveDisplayName = async (file: PDFFile, newName: string) => {
    try {
      setSavingName(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
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
            updated_at: new Date().toISOString()
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
            type: file.type
          });
        error = insertError;
      }

      if (error) throw error;

      setPdfFiles(prev => prev.map(f => 
        f.id === file.id ? { ...f, displayName: newName } : f
      ));
      setEditingFile(null);
      setEditingName('');
    } catch (err) {
      console.error('Error saving display name:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while saving the display name');
    } finally {
      setSavingName(false);
    }
  };

  const confirmDelete = async () => {
    if (!fileToDelete) return;
    
    setLoading(true);
    setError(null);

    try {
      if (fileToDelete.type === 'uploaded') {
        // Delete uploaded file from storage
        const { error: storageError } = await supabase
          .storage
          .from('hs-policies')
          .remove([fileToDelete.name]);

        if (storageError) throw storageError;

        // Delete metadata for uploaded file
        const { error: metadataError } = await supabase
          .from('hs_policy_files')
          .delete()
          .eq('file_name', fileToDelete.name);

        if (metadataError) throw metadataError;
      } else {
        // Delete created policy from database
        const { error: deleteError } = await supabase
          .from('hs_policy_files')
          .delete()
          .eq('id', fileToDelete.id);

        if (deleteError) throw deleteError;
      }
      
      await fetchPDFFiles();
      setShowDeleteModal(false);
      setFileToDelete(null);
    } catch (err) {
      console.error('Error deleting file:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while deleting the file');
    } finally {
      setLoading(false);
    }
  };

  const handleViewPDF = async (file: PDFFile) => {
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
          const displayName = file.displayName || file.name.replace(/\.pdf$/i, '');
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
      if (companyError) throw new Error(`Failed to load company settings: ${companyError.message}`);
      if (!companySettings) throw new Error('Company settings not found. Please set up your company details first.');
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
        companySettings
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

  // Helper function to create the HTML content for PDF viewer
  const createPdfViewerHtml = (pdfDataUrl: string, filename: string) => {
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

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleEditPolicy = (file: PDFFile) => {
    console.log("EDIT CLICK - Policy details:", {
      id: file.id,
      displayName: file.displayName,
      type: file.type,
      contentLength: file.content ? file.content.length : 0,
      hasContent: !!file.content
    });
    
    // Make sure the content field is populated if it exists
    if (file.type === 'created' && file.content) {
      try {
        // Validate content is properly parseable and has sections
        const parsedContent = JSON.parse(file.content);
        console.log("EDIT CLICK - Policy content parsed successfully:", {
          id: file.id,
          sectionsCount: parsedContent.sections ? parsedContent.sections.length : 0,
          hasValidSections: parsedContent.sections && Array.isArray(parsedContent.sections) && parsedContent.sections.length > 0
        });
        
        if (!parsedContent.sections || !Array.isArray(parsedContent.sections) || parsedContent.sections.length === 0) {
          console.warn("EDIT CLICK - Policy content has no valid sections:", parsedContent);
          setPdfError("Policy content does not have valid sections");
          return;
        }
        
        // Log first section for debugging
        if (parsedContent.sections.length > 0) {
          console.log("EDIT CLICK - First section preview:", {
            id: parsedContent.sections[0].id,
            title: parsedContent.sections[0].title,
            contentStart: parsedContent.sections[0].content ? parsedContent.sections[0].content.substring(0, 100) + '...' : 'No content'
          });
        }
        
        // Sections exist, continue with edit
        setSelectedPolicyForEdit({...file});  // Create a new object to ensure reference changes
        console.log("EDIT CLICK - Setting selectedPolicyForEdit:", {...file});
        setShowBlankModal(true);
      } catch (err) {
        console.error("EDIT CLICK - Error parsing policy content:", err);
        setPdfError("Could not parse policy content for editing");
        return;
      }
    } else if (file.type === 'created' && !file.content) {
      console.warn("EDIT CLICK - Created policy has no content data:", file);
      setPdfError("Policy content is missing");
      return;
    } else {
      // For uploaded files or any other case
      console.log("EDIT CLICK - Setting selectedPolicyForEdit (general case):", {...file});
      setSelectedPolicyForEdit({...file});  // Create a new object to ensure reference changes
      setShowBlankModal(true);
    }
  };

  const filteredPdfFiles = pdfFiles.filter(file =>
    file.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-full">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-white">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900 dark:text-white dark:hover:text-gray-200"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Health & Safety
        </button>
       
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mt-4 mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Health & Safety Policy</h2>
      </div>

      {error && (
        <div className="mb-4 flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-4 rounded-md">
          <AlertTriangle className="h-5 w-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {pdfError && (
        <div className="mb-4 flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-4 rounded-md">
          <AlertTriangle className="h-5 w-5 flex-shrink-0" />
          <p>{pdfError}</p>
        </div>
      )}

      {/* Search and Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search policies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 dark:focus:placeholder-gray-300 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 dark:border-gray-600 dark:text-white sm:text-sm"
          />
        </div>
        <div className="flex flex-col sm:flex-row w-full sm:w-auto space-y-2 sm:space-y-0 sm:space-x-4">
          <button
            onClick={() => setShowUploadModal(true)}
            className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700"
          >
            <FileUp className="h-4 w-4 mr-2" />
            Upload Policy
          </button>
          <button
            onClick={() => setShowBlankModal(true)}
            className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Policy
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
          </div>
        ) : pdfFiles.length === 0 ? (
          <div className="flex items-center justify-center h-48 bg-gray-50 dark:bg-gray-700/50">
            <p className="text-gray-500 dark:text-gray-400">No policies yet</p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white first:rounded-tl-lg">
                      Name
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Created
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Last Updated
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Type
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 last:rounded-tr-lg">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-600 bg-white dark:bg-gray-800">
                  {filteredPdfFiles.map((file) => (
                    <tr key={file.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900 dark:text-white first:rounded-bl-lg">
                        {editingFile === file.id ? (
                          <div className="flex items-center space-x-2">
                            <input
                              type="text"
                              value={editingName}
                              onChange={(e) => setEditingName(e.target.value)}
                              className="block w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                            <button
                              onClick={() => saveDisplayName(file, editingName)}
                              disabled={savingName}
                              className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                            >
                              <Save className="h-4 w-4" />
                            </button>
                            <button
                              onClick={cancelEditing}
                              className="text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <span className="mr-2">{file.displayName || file.name}</span>
                            <button
                              onClick={() => handleEditPolicy(file)}
                              className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                              title="Change Policy Name"
                            >
                              <Edit2 className="h-5 w-5" />
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {new Date(file.created_at).toLocaleDateString()}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {file.updated_at && file.updated_at !== file.created_at
                          ? new Date(file.updated_at).toLocaleDateString()
                          : '-'}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {file.type === 'uploaded' ? 'Uploaded' : 'Created'}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium last:rounded-br-lg">
                        <div className="flex justify-end space-x-4">
                        {file.type === 'created' && (
                            <button
                              onClick={() => handleEditPolicy(file)}
                              className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                              title="Edit"
                            >
                              <Pencil className="h-5 w-5" />
                            </button>
                          )}
                          <button
                            onClick={() => handleViewPDF(file)}
                            disabled={generatingPdfId === file.id}
                            className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 disabled:opacity-50"
                            title="View PDF"
                          >
                            {generatingPdfId === file.id ? (
                              <Loader2 className="h-5 w-5 animate-spin text-green-600" />
                            ) : (
                              <FileText className="h-5 w-5" />
                            )}
                          </button>                        
                          <button
                            onClick={() => handleDeleteFile(file)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                            title="Delete" 
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden">
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredPdfFiles.map((file) => (
                  <div key={file.id} className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm mx-4 my-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        {editingFile === file.id ? (
                          <div className="flex items-center space-x-2">
                            <input
                              type="text"
                              value={editingName}
                              onChange={(e) => setEditingName(e.target.value)}
                              className="block w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                            <button
                              onClick={() => saveDisplayName(file, editingName)}
                              disabled={savingName}
                              className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                            >
                              <Save className="h-4 w-4" />
                            </button>
                            <button
                              onClick={cancelEditing}
                              className="text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <h4 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400 mr-2">
                              {file.displayName || file.name}
                            </h4>
                            <button
                              onClick={() => handleEditPolicy(file)}
                              className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                              title="Change Policy Name"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        {file.type === 'created' && (
                          <button
                            onClick={() => handleEditPolicy(file)}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-1 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                            title="Edit"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleViewPDF(file)}
                          disabled={generatingPdfId === file.id}
                          className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 p-1 hover:bg-green-50 dark:hover:bg-green-900/20 rounded disabled:opacity-50"
                          title="View PDF"
                        >
                          {generatingPdfId === file.id ? (
                            <Loader2 className="h-4 w-4 animate-spin text-green-600" />
                          ) : (
                            <FileText className="h-4 w-4" />
                          )}
                        </button>
                        <button
                          onClick={() => handleDeleteFile(file)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-500 dark:text-gray-400 font-medium">Created:</span>
                        <p className="text-gray-900 dark:text-white mt-1">
                          {new Date(file.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400 font-medium">Last Updated:</span>
                        <p className="text-gray-900 dark:text-white mt-1">
                          {file.updated_at && file.updated_at !== file.created_at
                            ? new Date(file.updated_at).toLocaleDateString()
                            : '-'}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400 font-medium">Type:</span>
                        <p className="text-gray-900 dark:text-white mt-1">
                          {file.type === 'uploaded' ? 'Uploaded' : 'Created'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modals */}
      {showUploadModal && createPortal(
        <HSPolicyUploadModal
          onClose={() => setShowUploadModal(false)}
          onSuccess={fetchPDFFiles}
        />,
        document.body
      )}

      {showDeleteModal && fileToDelete && createPortal(
        <>
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 dark:bg-gray-900 dark:bg-opacity-50 z-50"></div>
          <div className="fixed inset-0 overflow-y-auto flex items-center justify-center z-50">
            <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-lg-xl p-6 max-w-sm w-full m-4">
            <div className="flex items-center justify-center mb-4">
              <AlertTriangle className="h-12 w-12 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white text-center mb-2">
              Confirm Deletion
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
              Are you sure you want to delete this policy? This action cannot be undone.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setFileToDelete(null);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
        </>,
        document.body
      )}

      {showBlankModal && createPortal(
        <HSPolicyEditor
          onClose={() => {
            setShowBlankModal(false);
            setSelectedPolicyForEdit(null);
          }}
          onSuccess={fetchPDFFiles}
          existingPolicy={selectedPolicyForEdit}
        />,
        document.body
      )}
    </div>
  );
}