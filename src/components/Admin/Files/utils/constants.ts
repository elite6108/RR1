export const ACCEPTED_FILE_TYPES = "image/*,.pdf,.doc,.docx,.txt,.csv,.xlsx,.xls,.ppt,.pptx";

export const FILE_TYPE_CATEGORIES = {
  FOLDER: 'folder',
  IMAGE: 'image',
  VIDEO: 'video',
  AUDIO: 'audio',
  PDF: 'pdf',
  FILE: 'file'
} as const;

export const STORAGE_BUCKET = 'company-files';

export const MAX_FILE_NAME_LENGTH = 30;
export const BREADCRUMB_MAX_LENGTH = 35;

export const UPLOAD_PROGRESS_STEPS = {
  START: 25,
  UPLOADED: 75,
  COMPLETE: 100
} as const;
