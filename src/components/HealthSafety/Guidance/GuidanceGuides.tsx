import React from 'react';
import { createPortal } from 'react-dom';
import { GuidanceGuide, DocumentListProps, UploadConfig } from './types';
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
 * Upload configuration for Guidance Guide documents
 */
const GUIDANCE_GUIDES_CONFIG: UploadConfig = {
  pdfBucket: 'guidance-guides',
  thumbnailBucket: 'guidance-images',
  tableName: 'guidance_guides',
  maxPdfSize: 20 * 1024 * 1024, // 20MB
  maxThumbnailSize: 5 * 1024 * 1024, // 5MB
};

/**
 * Guidance Guides document management component
 * Provides functionality to view, upload, and manage Guidance Guide documents
 */
export function GuidanceGuides({ onBack }: DocumentListProps) {
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
  } = useDocumentManagement<GuidanceGuide>(GUIDANCE_GUIDES_CONFIG);

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <BreadcrumbNavigation onBack={onBack} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Guidance Documents
        </h2>
      </div>

      {/* Search and Upload Controls */}
      <SearchAndUpload
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onUploadClick={showUploadModalFn}
        uploadButtonText="Upload Guide"
        searchPlaceholder="Search guides..."
      />

      {/* Guides Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <DocumentGrid
          documents={filteredDocuments}
          loading={loading}
          thumbnailUrls={thumbnailUrls}
          onViewPDF={handleViewPDF}
          onEditDocument={showEditModalFn}
          emptyMessage="No guides found"
        />
      </div>

      {/* Upload Modal */}
      {showUploadModal && createPortal(
        <UploadModal
          onClose={hideUploadModal}
          onUpload={handleUpload}
          uploading={uploading}
          error={error}
          documentType="Guide"
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
          documentType="Guide"
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