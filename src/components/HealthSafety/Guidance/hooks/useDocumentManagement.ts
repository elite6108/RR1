import { useState, useEffect } from 'react';
import { BaseDocument, DocumentState, UploadConfig } from '../types';
import { 
  fetchDocuments, 
  fetchThumbnailUrls, 
  uploadDocument, 
  updateDocument,
  deleteDocument,
  createPdfSignedUrl
} from '../utils';

/**
 * Custom hook for managing document state and operations
 * @param config - Upload configuration for the document type
 * @returns Document state and management functions
 */
export const useDocumentManagement = <T extends BaseDocument>(
  config: UploadConfig
) => {
  const [state, setState] = useState<DocumentState<T>>({
    documents: [],
    searchQuery: '',
    showUploadModal: false,
    showPDFModal: false,
    showEditModal: false,
    selectedPDF: null,
    selectedDocument: null,
    uploading: false,
    editing: false,
    deleting: false,
    error: null,
    loading: true,
    thumbnailUrls: {},
  });

  /**
   * Fetches documents and their thumbnail URLs
   */
  const loadDocuments = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const documents = await fetchDocuments<T>(config.tableName);
      setState(prev => ({ ...prev, documents }));

      if (documents.length > 0) {
        const thumbnailUrls = await fetchThumbnailUrls(documents);
        setState(prev => ({ ...prev, thumbnailUrls }));
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
      setState(prev => ({ 
        ...prev, 
        error: 'Failed to fetch documents' 
      }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  /**
   * Handles PDF viewing by creating signed URL
   */
  const handleViewPDF = async (document: T) => {
    try {
      setState(prev => ({ ...prev, error: null }));
      
      console.log('Attempting to load PDF:', {
        filePath: document.file_path,
        bucket: config.pdfBucket,
        title: document.title
      });
      
      const signedUrl = await createPdfSignedUrl(
        document.file_path, 
        config.pdfBucket
      );

      console.log('Successfully created signed URL:', signedUrl);

      setState(prev => ({
        ...prev,
        selectedPDF: {
          url: signedUrl,
          title: document.title
        },
        showPDFModal: true
      }));
    } catch (error) {
      console.error('Error getting PDF URL:', error);
      
      let errorMessage = 'Failed to load PDF';
      if (error instanceof Error) {
        if (error.message.includes('not found') || error.message.includes('Object not found')) {
          errorMessage = `PDF file "${document.title}" not found in storage. The file may have been deleted or moved. Please re-upload the document.`;
        } else if (error.message.includes('bucket')) {
          errorMessage = 'Storage configuration error. Please contact support.';
        } else if (error.message.includes('permission') || error.message.includes('access')) {
          errorMessage = 'Access denied. Please check storage permissions.';
        } else {
          errorMessage = error.message.includes('PDF file') ? error.message : `Error loading PDF: ${error.message}`;
        }
      }
      
      setState(prev => ({ 
        ...prev, 
        error: errorMessage
      }));
    }
  };

  /**
   * Handles document upload
   */
  const handleUpload = async (
    title: string, 
    pdfFile: File, 
    thumbnailFile: File | null
  ) => {
    setState(prev => ({ 
      ...prev, 
      uploading: true, 
      error: null 
    }));

    try {
      await uploadDocument(config, title, pdfFile, thumbnailFile);
      
      setState(prev => ({ 
        ...prev, 
        showUploadModal: false 
      }));
      
      // Refresh documents after successful upload
      await loadDocuments();
    } catch (error) {
      console.error('Error uploading document:', error);
      setState(prev => ({ 
        ...prev, 
        error: 'Error uploading document. Please try again.' 
      }));
    } finally {
      setState(prev => ({ ...prev, uploading: false }));
    }
  };

  /**
   * Handles document editing
   */
  const handleEditDocument = async (
    id: string,
    title: string,
    pdfFile: File | null,
    thumbnailFile: File | null
  ) => {
    setState(prev => ({ 
      ...prev, 
      editing: true, 
      error: null 
    }));

    try {
      const currentDocument = state.documents.find(doc => doc.id === id);
      if (!currentDocument) {
        throw new Error('Document not found');
      }

      await updateDocument(config, id, title, pdfFile, thumbnailFile, currentDocument);
      
      setState(prev => ({ 
        ...prev, 
        showEditModal: false,
        selectedDocument: null
      }));
      
      // Refresh documents after successful edit
      await loadDocuments();
    } catch (error) {
      console.error('Error editing document:', error);
      setState(prev => ({ 
        ...prev, 
        error: 'Error updating document. Please try again.' 
      }));
    } finally {
      setState(prev => ({ ...prev, editing: false }));
    }
  };

  /**
   * Handles document deletion
   */
  const handleDeleteDocument = async (id: string) => {
    setState(prev => ({ 
      ...prev, 
      deleting: true, 
      error: null 
    }));

    try {
      const documentToDelete = state.documents.find(doc => doc.id === id);
      if (!documentToDelete) {
        throw new Error('Document not found');
      }

      await deleteDocument(config, documentToDelete);
      
      setState(prev => ({ 
        ...prev, 
        showEditModal: false,
        selectedDocument: null
      }));
      
      // Refresh documents after successful deletion
      await loadDocuments();
    } catch (error) {
      console.error('Error deleting document:', error);
      setState(prev => ({ 
        ...prev, 
        error: 'Error deleting document. Please try again.' 
      }));
    } finally {
      setState(prev => ({ ...prev, deleting: false }));
    }
  };

  /**
   * Shows edit modal for a document
   */
  const showEditModal = (document: T) => {
    setState(prev => ({ 
      ...prev, 
      showEditModal: true,
      selectedDocument: document,
      error: null 
    }));
  };

  /**
   * Hides edit modal
   */
  const hideEditModal = () => {
    setState(prev => ({ 
      ...prev, 
      showEditModal: false,
      selectedDocument: null
    }));
  };

  /**
   * Updates search query
   */
  const setSearchQuery = (query: string) => {
    setState(prev => ({ ...prev, searchQuery: query }));
  };

  /**
   * Shows upload modal
   */
  const showUploadModal = () => {
    setState(prev => ({ 
      ...prev, 
      showUploadModal: true, 
      error: null 
    }));
  };

  /**
   * Hides upload modal
   */
  const hideUploadModal = () => {
    setState(prev => ({ ...prev, showUploadModal: false }));
  };

  /**
   * Hides PDF modal
   */
  const hidePDFModal = () => {
    setState(prev => ({ 
      ...prev, 
      showPDFModal: false, 
      selectedPDF: null 
    }));
  };

  /**
   * Filters documents based on search query
   */
  const filteredDocuments = state.documents.filter(doc =>
    doc.title.toLowerCase().includes(state.searchQuery.toLowerCase())
  );

  // Load documents on mount
  useEffect(() => {
    loadDocuments();
  }, []);

  // Prevent body scroll when modals are open
  useEffect(() => {
    if (state.showUploadModal || state.showPDFModal || state.showEditModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [state.showUploadModal, state.showPDFModal, state.showEditModal]);

  return {
    ...state,
    filteredDocuments,
    handleViewPDF,
    handleUpload,
    handleEditDocument,
    handleDeleteDocument,
    setSearchQuery,
    showUploadModalFn: showUploadModal,
    showEditModalFn: showEditModal,
    hideUploadModal,
    hideEditModal,
    hidePDFModal,
    refreshDocuments: loadDocuments,
  };
};
