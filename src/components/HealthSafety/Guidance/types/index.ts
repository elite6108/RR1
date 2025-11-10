// Common document interface
export interface BaseDocument {
  id: string;
  title: string;
  file_path: string;
  thumbnail_path: string | null;
  created_at: string;
  updated_at: string;
}

// Code of Practice specific document
export interface CodeOfPracticeDoc extends BaseDocument {}

// Guidance Guide specific document
export interface GuidanceGuide extends BaseDocument {}

// Component prop interfaces
export interface DocumentListProps {
  onBack: () => void;
}

export interface UploadModalProps {
  onClose: () => void;
  onUpload: (title: string, pdfFile: File, thumbnailFile: File | null) => void;
  uploading: boolean;
  error: string | null;
  documentType?: string;
}

export interface EditDocumentModalProps {
  onClose: () => void;
  onEdit: (id: string, title: string, pdfFile: File | null, thumbnailFile: File | null) => void;
  onDelete: (id: string) => void;
  document: BaseDocument;
  thumbnailUrl?: string;
  editing: boolean;
  deleting: boolean;
  error: string | null;
  documentType?: string;
}

export interface PDFViewerModalProps {
  onClose: () => void;
  pdfUrl: string;
  title: string;
}

// State interfaces
export interface DocumentState<T extends BaseDocument> {
  documents: T[];
  searchQuery: string;
  showUploadModal: boolean;
  showPDFModal: boolean;
  showEditModal: boolean;
  selectedPDF: { url: string; title: string } | null;
  selectedDocument: T | null;
  uploading: boolean;
  editing: boolean;
  deleting: boolean;
  error: string | null;
  loading: boolean;
  thumbnailUrls: Record<string, string>;
}

// Upload configuration
export interface UploadConfig {
  pdfBucket: string;
  thumbnailBucket: string;
  tableName: string;
  maxPdfSize: number;
  maxThumbnailSize: number;
}

// File validation result
export interface FileValidationResult {
  isValid: boolean;
  error?: string;
}
