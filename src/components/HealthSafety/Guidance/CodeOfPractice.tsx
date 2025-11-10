import React from 'react';
import { createPortal } from 'react-dom';
import { CodeOfPracticeDoc, DocumentListProps, UploadConfig } from './types';
import { useDocumentManagement } from './hooks';
import { 
  PDFViewerModal, 
  UploadModal, 
  EditDocumentModal,
  DocumentGrid, 
  SearchAndUpload, 
  BreadcrumbNavigation 
} from './components';

/**
 * Upload configuration for Code of Practice documents
 */
const CODE_OF_PRACTICE_CONFIG: UploadConfig = {
  pdfBucket: 'guidance-codeofpractice',
  thumbnailBucket: 'guidance-images',
  tableName: 'guidance_codeofpractice',
  maxPdfSize: 20 * 1024 * 1024, // 20MB
  maxThumbnailSize: 5 * 1024 * 1024, // 5MB
};

/**
 * Code of Practice document management component
 * Provides functionality to view, upload, and manage Code of Practice documents
 */
export function CodeOfPractice({ onBack }: DocumentListProps) {
  const {
    filteredDocuments,
    searchQuery,
    showUploadModal,
    showPDFModal,
    showEditModal,
    selectedPDF,
    selectedDocument,
    uploading,
    editing,
    deleting,
    error,
    loading,
    thumbnailUrls,
    handleViewPDF,
    handleUpload,
    handleEditDocument,
    handleDeleteDocument,
    setSearchQuery,
    showUploadModalFn,
    showEditModalFn,
    hideUploadModal,
    hideEditModal,
    hidePDFModal,
  } = useDocumentManagement<CodeOfPracticeDoc>(CODE_OF_PRACTICE_CONFIG);

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <BreadcrumbNavigation onBack={onBack} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Code of Practice Documents
        </h2>
      </div>

      {/* Search and Upload Controls */}
      <SearchAndUpload
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onUploadClick={showUploadModalFn}
        uploadButtonText="Upload Document"
        searchPlaceholder="Search documents..."
      />

      {/* Documents Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <DocumentGrid
          documents={filteredDocuments}
          loading={loading}
          thumbnailUrls={thumbnailUrls}
          onViewPDF={handleViewPDF}
          onEditDocument={showEditModalFn}
          emptyMessage="No documents found"
        />
      </div>

      {/* Upload Modal */}
      {showUploadModal && createPortal(
        <UploadModal
          onClose={hideUploadModal}
          onUpload={handleUpload}
          uploading={uploading}
          error={error}
          documentType="Code of Practice"
        />,
        document.body
      )}

      {/* Edit Modal */}
      {showEditModal && selectedDocument && createPortal(
        <EditDocumentModal
          onClose={hideEditModal}
          onEdit={handleEditDocument}
          onDelete={handleDeleteDocument}
          document={selectedDocument}
          thumbnailUrl={thumbnailUrls[selectedDocument.id]}
          editing={editing}
          deleting={deleting}
          error={error}
          documentType="Code of Practice"
        />,
        document.body
      )}

      {/* PDF Viewer Modal */}
      {showPDFModal && selectedPDF && createPortal(
        <PDFViewerModal
          onClose={hidePDFModal}
          pdfUrl={selectedPDF.url}
          title={selectedPDF.title}
        />,
        document.body
      )}
    </div>
  );
}