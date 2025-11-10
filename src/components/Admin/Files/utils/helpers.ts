import type { CompanyFile } from '../types';
import { FILE_TYPE_CATEGORIES } from './constants';

export const getFileTypeCategory = (file: CompanyFile): string => {
  if (file.is_folder) return FILE_TYPE_CATEGORIES.FOLDER;
  const mimeType = file.mime_type || '';
  const extension = file.name.split('.').pop()?.toLowerCase() || '';
  
  if (mimeType.startsWith('image/')) return FILE_TYPE_CATEGORIES.IMAGE;
  if (mimeType.startsWith('video/')) return FILE_TYPE_CATEGORIES.VIDEO;
  if (mimeType.startsWith('audio/')) return FILE_TYPE_CATEGORIES.AUDIO;
  if (mimeType === 'application/pdf') return FILE_TYPE_CATEGORIES.PDF;
  
  return FILE_TYPE_CATEGORIES.FILE;
};

export const formatFileSize = (bytes?: number): string => {
  if (bytes === undefined || bytes === null) return '—';
  if (bytes === 0) return '0 Bytes';
  
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i];
};

export const truncateFileName = (fileName: string, maxLength: number = 30): string => {
  if (fileName.length <= maxLength) return fileName;
  
  const lastDotIndex = fileName.lastIndexOf('.');
  if (lastDotIndex === -1) {
    // No extension, just truncate
    return fileName.substring(0, maxLength - 3) + '...';
  }
  
  const extension = fileName.substring(lastDotIndex);
  const nameWithoutExt = fileName.substring(0, lastDotIndex);
  const availableLength = maxLength - extension.length - 3; // 3 for '...'
  
  if (availableLength <= 0) {
    // Extension is too long, just show extension
    return '...' + extension;
  }
  
  return nameWithoutExt.substring(0, availableLength) + '...' + extension;
};

export const validateMove = (draggedFile: CompanyFile, targetFolderId: string | null, allFolders: CompanyFile[]): boolean => {
  if (draggedFile.id === targetFolderId) return false;
  if (draggedFile.parent_folder_id === targetFolderId) return false;

  const isChildOfDragged = (folderId: string): boolean => {
    if (!folderId) return false;
    const folder = allFolders.find(f => f.id === folderId);
    if (!folder) return false;
    if (folder.parent_folder_id === draggedFile.id) return true;
    if (folder.parent_folder_id === null) return false;
    return isChildOfDragged(folder.parent_folder_id);
  };

  if (targetFolderId && isChildOfDragged(targetFolderId)) {
    console.error("Cannot move a folder into one of its own subfolders.");
    return false;
  }
  
  return true;
};

export const generateStoragePath = (fileName: string): string => {
  const fileId = crypto.randomUUID();
  const timestamp = Date.now();
  return `company-files/${fileId}-${timestamp}-${fileName}`;
};

export const parseFileNameAndExtension = (fileName: string): { name: string; extension: string } => {
  const lastDotIndex = fileName.lastIndexOf('.');
  if (lastDotIndex > 0) {
    return {
      name: fileName.substring(0, lastDotIndex),
      extension: fileName.substring(lastDotIndex)
    };
  }
  return {
    name: fileName,
    extension: ''
  };
};
