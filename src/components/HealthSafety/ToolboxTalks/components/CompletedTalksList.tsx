import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { supabase } from '../../../../lib/supabase';
import {
  ChevronLeft,
  AlertTriangle,
  Trash2,
  FileText,
  Loader2,
  Search
} from 'lucide-react';
import { generateToolboxPDF } from '../../../../utils/pdf/toolbox/toolboxPDFGenerator';
import { createPdfViewerHtml, createIOSPdfViewerHtml } from '../utils/pdfViewerUtils';
import { fetchTalks, deleteTalk, filterTalks } from '../utils/completedTalksUtils';

interface CompletedTalksListProps {
  onBack: () => void;
}

export function CompletedTalksList({ onBack }: CompletedTalksListProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [talks, setTalks] = useState<any[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [talkToDelete, setTalkToDelete] = useState<string | null>(null);
  const [generatingPdfId, setGeneratingPdfId] = useState<string | null>(null);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadTalks();
  }, []);

  const loadTalks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchTalks();
      setTalks(data);
    } catch (err) {
      console.error('Error fetching talks:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'An error occurred while fetching talks'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (talkId: string) => {
    setTalkToDelete(talkId);
    setShowDeleteModal(true);
  };

  const handleViewPDF = async (talk: any) => {
    try {
      setGeneratingPdfId(talk.id);
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

      // Generate PDF
      const pdfDataUrl = await generateToolboxPDF({
        talk,
        companySettings,
      });

      // Format filename for better clarity using talk number and title
      const formattedFilename = `Toolbox-Talk-${talk.talk_number || 'unknown'}-${talk.title?.replace(/\s+/g, '-') || 'untitled'}.pdf`;
      
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
        const htmlContent = createIOSPdfViewerHtml(pdfUrl, formattedFilename);
        newWindow.document.open();
        newWindow.document.write(htmlContent);
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
    if (!talkToDelete) return;

    setLoading(true);
    setError(null);

    try {
      await deleteTalk(talkToDelete);
      await loadTalks();
      setShowDeleteModal(false);
      setTalkToDelete(null);
    } catch (err) {
      console.error('Error deleting talk:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'An error occurred while deleting the talk'
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredTalks = filterTalks(talks, searchQuery);

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-white mb-6">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900 dark:text-white dark:hover:text-gray-200"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Toolbox Talks
        </button>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Completed Talks</h2>
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
          <div>
            <p className="font-medium">Error generating PDF</p>
            <p>{pdfError}</p>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search completed talks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
          </div>
        ) : filteredTalks.length === 0 ? (
          <div className="flex items-center justify-center h-48">
            <p className="text-gray-500 dark:text-gray-400">
              {searchQuery ? 'No talks match your search' : 'No completed talks yet'}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-700">
                      <th scope="col" className="py-3 px-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider first:rounded-tl-lg">
                        Talk ID
                      </th>
                      <th scope="col" className="py-3 px-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Title
                      </th>
                      <th scope="col" className="py-3 px-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Project
                      </th>
                      <th scope="col" className="py-3 px-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Site Reference
                      </th>
                      <th scope="col" className="py-3 px-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="py-3 px-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider last:rounded-tr-lg">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredTalks.map((talk, index) => (
                      <tr key={talk.id} className={index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700'}>
                        <td className="py-2 px-3 text-sm text-gray-900 dark:text-white first:rounded-bl-lg">
                          {talk.talk_number}
                        </td>
                        <td className="py-2 px-3 text-sm text-gray-500 dark:text-gray-400">
                          {talk.title}
                        </td>
                        <td className="py-2 px-3 text-sm text-gray-500 dark:text-gray-400">
                          {talk.project?.name}
                        </td>
                        <td className="py-2 px-3 text-sm text-gray-500 dark:text-gray-400">
                          {talk.site_reference}
                        </td>
                        <td className="py-2 px-3 text-sm text-gray-500 dark:text-gray-400">
                          {new Date(talk.completed_date).toLocaleDateString()}
                        </td>
                        <td className="py-2 px-3 text-right text-sm font-medium last:rounded-br-lg">
                          <div className="flex justify-end space-x-3">
                            <button
                              onClick={() => handleViewPDF(talk)}
                              disabled={generatingPdfId === talk.id}
                              className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 disabled:opacity-50"
                              title="View PDF"
                            >
                              {generatingPdfId === talk.id ? (
                                <Loader2 className="h-5 w-5 animate-spin text-green-600" />
                              ) : (
                                <FileText className="h-5 w-5" />
                              )}
                            </button>
                            <button
                              onClick={() => handleDelete(talk.id)}
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
            </div>

            {/* Mobile/Tablet Cards */}
            <div className="lg:hidden">
              <div className="p-4 space-y-4">
                {filteredTalks.map((talk) => (
                  <div 
                    key={talk.id}
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md p-4"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">
                          {talk.title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Talk ID: {talk.talk_number}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm mb-4">
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Project:</span>
                        <span className="text-gray-900 dark:text-white">{talk.project?.name || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Site Reference:</span>
                        <span className="text-gray-900 dark:text-white">{talk.site_reference || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Completed Date:</span>
                        <span className="text-gray-900 dark:text-white">
                          {new Date(talk.completed_date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                      <button
                        onClick={() => handleViewPDF(talk)}
                        disabled={generatingPdfId === talk.id}
                        className="flex items-center px-3 py-2 text-sm font-medium text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 disabled:opacity-50 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-md transition-colors"
                        title="View PDF"
                      >
                        {generatingPdfId === talk.id ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-1" />
                        ) : (
                          <FileText className="h-4 w-4 mr-1" />
                        )}
                      </button>
                      <button
                        onClick={() => handleDelete(talk.id)}
                        className="flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        createPortal(
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 dark:bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
            <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-sm w-full m-4">
              <div className="flex items-center justify-center mb-4">
                <AlertTriangle className="h-12 w-12 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white text-center mb-2">
                Confirm Deletion
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
                Are you sure you want to delete this talk? This action cannot be undone.
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setTalkToDelete(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 dark:hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>,
          document.body
        )
      )}
    </div>
  );
}
