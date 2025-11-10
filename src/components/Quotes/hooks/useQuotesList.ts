import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { generateQuotePDF } from '../../../utils/pdf/quotes/quotePDFGenerator';
import { createPdfViewerHtml } from '../utils/pdfHelpers';
import type { Quote, SortField, SortDirection } from '../types';
import { statusOrder } from '../utils/constants';

interface UseQuotesListProps {
  quotes: Quote[];
  onQuoteChange: () => void;
}

export const useQuotesList = ({ quotes, onQuoteChange }: UseQuotesListProps) => {
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [quoteToDelete, setQuoteToDelete] = useState<string | null>(null);
  const [quoteToEdit, setQuoteToEdit] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatingPdfId, setGeneratingPdfId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>('quote_date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Prevent body scroll when modal is open
  useEffect(() => {
    const isModalOpen = showQuoteModal || showDeleteModal;
    
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to restore scroll when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showQuoteModal, showDeleteModal]);

  const filterQuotes = (quotes: Quote[]) => {
    const query = searchQuery.toLowerCase();
    return quotes.filter(
      (quote) =>
        quote.quote_number.toLowerCase().includes(query) ||
        quote.customer?.company_name?.toLowerCase().includes(query) ||
        quote.customer?.customer_name.toLowerCase().includes(query) ||
        false
    );
  };

  // Sort quotes
  const sortedQuotes = [...filterQuotes(quotes)].sort((a, b) => {
    let aValue: string | number;
    let bValue: string | number;

    switch (sortField) {
      case 'quote_number':
        aValue = a.quote_number.toLowerCase();
        bValue = b.quote_number.toLowerCase();
        break;
      case 'quote_date':
        aValue = new Date(a.quote_date).getTime();
        bValue = new Date(b.quote_date).getTime();
        break;
      case 'customer':
        aValue = (a.customer?.company_name || a.customer?.customer_name || '').toLowerCase();
        bValue = (b.customer?.company_name || b.customer?.customer_name || '').toLowerCase();
        break;
      case 'amount':
        aValue = a.amount;
        bValue = b.amount;
        break;
      case 'status':
        aValue = statusOrder[a.status as keyof typeof statusOrder] || 0;
        bValue = statusOrder[b.status as keyof typeof statusOrder] || 0;
        break;
      default:
        aValue = '';
        bValue = '';
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleDeleteQuote = async (quoteId: string) => {
    setQuoteToDelete(quoteId);
    setShowDeleteModal(true);
  };

  const handleEditQuote = (quote: Quote) => {
    setQuoteToEdit(quote);
    setShowQuoteModal(true);
    
    // Scroll to top on mobile when modal opens
    if (window.innerWidth < 640) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleRowClick = (quote: Quote, event: React.MouseEvent<HTMLTableRowElement>) => {
    // Don't trigger row click if clicking on action buttons
    const target = event.target as HTMLElement;
    if (target.closest('button') || target.closest('svg')) {
      return;
    }
    
    handleEditQuote(quote);
  };

  const handleViewPDF = async (quote: Quote) => {
    try {
      setGeneratingPdfId(quote.id);
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

      if (companyError)
        throw new Error(
          `Failed to load company settings: ${companyError.message}`
        );
      if (!companySettings)
        throw new Error(
          'Company settings not found. Please set up your company details first.'
        );

      // Fetch project details
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .select('name')
        .eq('id', quote.project_id)
        .single();

      if (projectError)
        throw new Error(
          `Failed to load project details: ${projectError.message}`
        );
      if (!project) throw new Error('Project not found');

      // Fetch customer details
      const { data: customer, error: customerError } = await supabase
        .from('customers')
        .select('*')
        .eq('id', quote.customer_id)
        .single();

      if (customerError)
        throw new Error(
          `Failed to load customer details: ${customerError.message}`
        );
      if (!customer) throw new Error('Customer not found');

      // Format customer address
      const customerAddress = [
        customer.address_line1,
        customer.address_line2,
        customer.town,
        customer.county,
        customer.post_code,
      ]
        .filter(Boolean)
        .join(', ');

      // Format customer name
      const customerName = customer.company_name
        ? `${customer.company_name} (${customer.customer_name})`
        : customer.customer_name;

      // Format quote number for filename
      const formattedQuoteNumber = quote.quote_number.startsWith('OPG-Q-') 
        ? quote.quote_number 
        : `OPG-Q-${quote.quote_number.padStart(6, '0')}`;

      // Generate PDF
      const pdfDataUrl = await generateQuotePDF({
        quote,
        companySettings,
        customerName,
        customerAddress,
        projectName: project.name,
      });
      
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
            <title>${formattedQuoteNumber}.pdf</title>
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
              <button id="download-btn" class="download-button">Download ${formattedQuoteNumber}.pdf</button>
            </div>
            <div class="pdf-view">
              <div class="pdf-fallback">
                <h2>PDF Ready for Download</h2>
                <p>Click the download button above to save the PDF file.</p>
                <a id="direct-link" href="${pdfUrl}" download="${formattedQuoteNumber}.pdf">
                  Direct Download Link
                </a>
              </div>
            </div>
            <script>
              const pdfUrl = "${pdfUrl}";
              const fileName = "${formattedQuoteNumber}.pdf";
              
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
        const htmlContent = createPdfViewerHtml(pdfDataUrl, `${formattedQuoteNumber}.pdf`);
        
        newWindow.document.open();
        newWindow.document.write(htmlContent);
        newWindow.document.close();
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      setPdfError(
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred while generating the PDF'
      );
    } finally {
      setGeneratingPdfId(null);
    }
  };

  const confirmDelete = async () => {
    if (!quoteToDelete) return;

    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('quotes')
        .delete()
        .eq('id', quoteToDelete);

      if (error) throw error;
      onQuoteChange();
      setShowDeleteModal(false);
      setQuoteToDelete(null);
    } catch (err) {
      console.error('Error deleting quote:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'An error occurred while deleting the quote'
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    showQuoteModal,
    setShowQuoteModal,
    showDeleteModal,
    setShowDeleteModal,
    quoteToDelete,
    setQuoteToDelete,
    quoteToEdit,
    setQuoteToEdit,
    loading,
    error,
    generatingPdfId,
    searchQuery,
    setSearchQuery,
    pdfError,
    sortField,
    sortDirection,
    sortedQuotes,
    handleSort,
    handleDeleteQuote,
    handleEditQuote,
    handleRowClick,
    handleViewPDF,
    confirmDelete,
  };
};
