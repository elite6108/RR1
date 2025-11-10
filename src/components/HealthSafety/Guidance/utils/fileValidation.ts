import { FileValidationResult } from '../types';

// File size constants
const MAX_PDF_SIZE = 20 * 1024 * 1024; // 20MB
const MAX_THUMBNAIL_SIZE = 5 * 1024 * 1024; // 5MB

/**
 * Validates a PDF file for type and size constraints
 * @param file - The file to validate
 * @returns Validation result with success status and optional error message
 */
export const validatePdfFile = (file: File): FileValidationResult => {
  // Check file type
  if (file.type !== 'application/pdf') {
    return {
      isValid: false,
      error: 'Only PDF files are allowed'
    };
  }

  // Check file size
  if (file.size > MAX_PDF_SIZE) {
    return {
      isValid: false,
      error: 'PDF file size must be less than 20MB'
    };
  }

  return { isValid: true };
};

/**
 * Validates an image file for type and size constraints
 * @param file - The file to validate
 * @returns Validation result with success status and optional error message
 */
export const validateImageFile = (file: File): FileValidationResult => {
  // Check file type
  if (!file.type.startsWith('image/')) {
    return {
      isValid: false,
      error: 'Only image files are allowed for thumbnails'
    };
  }

  // Check file size
  if (file.size > MAX_THUMBNAIL_SIZE) {
    return {
      isValid: false,
      error: 'Thumbnail image size must be less than 5MB'
    };
  }

  return { isValid: true };
};

/**
 * Generates a unique filename with timestamp
 * @param originalName - The original filename
 * @returns Unique filename with timestamp prefix
 */
export const generateUniqueFileName = (originalName: string): string => {
  return `${Date.now()}-${originalName}`;
};

/**
 * Generic file validation function
 * @param file - The file to validate
 * @param type - File type ('pdf' or 'image')
 * @param maxSize - Maximum file size in bytes
 * @returns Validation result with success status and optional error message
 */
export const validateFile = (file: File, type: 'pdf' | 'image', maxSize: number): FileValidationResult => {
  if (type === 'pdf') {
    // Check PDF file type
    if (file.type !== 'application/pdf') {
      return {
        isValid: false,
        error: 'Only PDF files are allowed'
      };
    }
  } else if (type === 'image') {
    // Check image file type
    if (!file.type.startsWith('image/')) {
      return {
        isValid: false,
        error: 'Only image files are allowed for thumbnails'
      };
    }
  }

  // Check file size
  if (file.size > maxSize) {
    const maxSizeMB = Math.round(maxSize / (1024 * 1024));
    return {
      isValid: false,
      error: `File size must be less than ${maxSizeMB}MB`
    };
  }

  return { isValid: true };
};

/**
 * Formats file size for display
 * @param bytes - File size in bytes
 * @returns Formatted file size string
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
