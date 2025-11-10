import React, { useState } from 'react';
import { ChevronLeft, Plus, Search, FileText } from 'lucide-react';
import { CoshhAssessmentsProps } from '../types';
import { useAssessmentState } from '../hooks/useAssessmentState';
import { useAssessmentActions } from '../hooks/useAssessmentActions';
import { generateCoshhAssessmentPDF } from '../../../../../utils/pdf/coshh/coshhAssessmentPDFGenerator';
import { AssessmentTable } from './AssessmentTable';
import { AssessmentModals } from './AssessmentModals';
import { AssessmentForm } from './AssessmentForm';
import { ConfirmationPortal } from './ConfirmationPortal';

export function CoshhAssessments({ onBack }: CoshhAssessmentsProps) {
  const [confirmationState, setConfirmationState] = useState({
    isVisible: false,
    message: ''
  });

  const {
    assessments,
    loading,
    error,

    formData,
    searchState,
    pdfState,
    modalState,
    iconState,
    controlItems,
    ingredientItems,
    setFormData,
    setPdfState,
    setModalState,
    setControlItems,
    setIngredientItems,
    openAddModal,
    openEditModal,
    openDeleteModal,
    closeAllModals,
    updateSearchTerm,
    updatePpeSearchQuery,
    updateHazardSearchQuery,
    setCurrentStep,
    fetchAssessments
  } = useAssessmentState();

  const { deleteAssessment, exportAssessment, importAssessment, submitAssessment } = useAssessmentActions();

  const handleAdd = () => {
    openAddModal();
  };

  const handleEdit = (assessment: any) => {
    openEditModal(assessment);
  };

  const handleDelete = (assessment: any) => {
    openDeleteModal(assessment);
  };

  const handleViewPDF = async (assessment: any) => {
    try {
      setPdfState({ downloadingPDF: true });

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
            <p>Generating COSHH Assessment PDF...</p>
          </div>
        </body>
        </html>
      `);

      const pdfDataUrl = await generateCoshhAssessmentPDF(assessment);
      
      // Format filename with assessment name and date
      const formattedDate = new Date().toISOString().split('T')[0];
      const substanceName = assessment.substance_name.replace(/[^a-zA-Z0-9]/g, '-');
      const formattedFilename = `COSHH-Assessment-${substanceName}-${formattedDate}.pdf`;

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
                <h2>COSHH Assessment PDF Ready for Download</h2>
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
                if (confirm('Would you like to download the COSHH Assessment PDF now?')) {
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
              font-family: Arial, sans-serif;
            }
            .download-button:hover { background: #0055aa; }
            .pdf-view { margin-top: 50px; height: calc(100% - 50px); }
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
            const pdfDataUrl = "${pdfDataUrl}";
            const fileName = "${formattedFilename}";
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
        
        newWindow.document.open();
        newWindow.document.write(htmlContent);
        newWindow.document.close();
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setPdfState({ downloadingPDF: false });
    }
  };

  const handleConfirmDelete = async () => {
    if (!modalState.selectedAssessment) return;

    try {
      await deleteAssessment(modalState.selectedAssessment);
      closeAllModals();
      fetchAssessments();
    } catch (error) {
      console.error('Error deleting assessment:', error);
      alert('Error deleting assessment. Please try again.');
    }
  };

  const handleExport = (assessment: any) => {
    try {
      exportAssessment(assessment);
    } catch (error) {
      console.error('Error exporting assessment:', error);
      alert('Error exporting assessment. Please try again.');
    }
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const content = e.target?.result as string;
        const importData = JSON.parse(content);

        await importAssessment(importData);
        closeAllModals();
        fetchAssessments();
        alert('Assessment imported successfully!');
      } catch (error) {
        console.error('Error importing assessment:', error);
        alert('Error importing assessment. Please check the file format.');
      }
    };
    reader.readAsText(file);
  };

  const handleFormSubmit = async (assessmentData: any) => {
    try {
      const isEdit = modalState.showEditModal && !!modalState.selectedAssessment;
      await submitAssessment(assessmentData, isEdit);
      closeAllModals();
      fetchAssessments();
      
      // Show confirmation portal instead of browser alert
      setConfirmationState({
        isVisible: true,
        message: `COSHH Assessment ${isEdit ? 'updated' : 'saved'} successfully!`
      });
    } catch (error) {
      console.error('Error submitting assessment:', error);
      alert(`Error ${modalState.showEditModal ? 'updating' : 'creating'} assessment. Please try again.`);
    }
  };

  const filteredAssessments = searchState.filteredAssessments;

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button 
            onClick={fetchAssessments}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Breadcrumb Navigation */}
      <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-white mb-6">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900 dark:text-white dark:hover:text-gray-200"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to COSHH Management
        </button>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            COSHH Assessments
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Manage Control of Substances Hazardous to Health assessments
          </p>
        </div>
      </div>

      {/* Search and Actions */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search assessments..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            value={searchState.searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <button
            onClick={handleAdd}
            className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Assessment
          </button>
          <button
            onClick={() => {
              setModalState(prev => ({ 
                ...prev, 
                showImportExportModal: true,
                importExportMode: 'export',
                selectedForExport: null
              }));
            }}
            className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <FileText className="h-4 w-4 mr-2" />
            Import - Export
          </button>
        </div>
      </div>

      {/* Assessments Table */}
      <AssessmentTable
        assessments={filteredAssessments}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onDownloadPDF={handleViewPDF}
        onExport={handleExport}
        downloadingPDF={pdfState.downloadingPDF}
      />

      {/* Assessment Form */}
      <AssessmentForm
        modalState={modalState}
        formData={formData}
        setFormData={setFormData}
        onCloseModals={closeAllModals}
        onSubmit={handleFormSubmit}
        currentStep={modalState.currentStep}
        setCurrentStep={setCurrentStep}
        ppeSearchQuery={searchState.ppeSearchQuery}
        setPpeSearchQuery={updatePpeSearchQuery}
        hazardSearchQuery={searchState.hazardSearchQuery}
        setHazardSearchQuery={updateHazardSearchQuery}
        iconUrls={iconState.iconUrls}
        hazardIconUrls={iconState.hazardIconUrls}
        loadingIcons={iconState.loadingIcons}
        loadingHazardIcons={iconState.loadingHazardIcons}
        ingredientItems={ingredientItems}
        setIngredientItems={setIngredientItems}
        controlItems={controlItems}
        setControlItems={setControlItems}
      />

      {/* Import/Export and Delete Modals */}
      <AssessmentModals
        modalState={modalState}
        assessments={assessments}
        onCloseModals={closeAllModals}
        onConfirmDelete={handleConfirmDelete}
        onExport={handleExport}
        onImport={handleImport}
        setModalState={setModalState}
      />

      {/* Confirmation Portal */}
      <ConfirmationPortal
        isVisible={confirmationState.isVisible}
        message={confirmationState.message}
        onClose={() => setConfirmationState({ isVisible: false, message: '' })}
      />
    </div>
  );
}
