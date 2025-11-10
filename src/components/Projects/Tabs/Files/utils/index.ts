import { ProjectFile, FileTypeCategory } from '../types';

export const formatFileSize = (bytes?: number): string => {
  if (!bytes) return '';
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
};

export const getFileTypeCategory = (file: ProjectFile): FileTypeCategory => {
  if (!file.mime_type) {
    console.log('No MIME type for file:', file.name);
    // Try to determine from file extension
    const ext = file.name.toLowerCase().split('.').pop();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'].includes(ext || '')) return 'image';
    if (ext === 'pdf') return 'pdf';
    if (['doc', 'docx'].includes(ext || '')) return 'document';
    if (['xls', 'xlsx'].includes(ext || '')) return 'spreadsheet';
    if (['ppt', 'pptx'].includes(ext || '')) return 'presentation';
    if (['txt', 'csv', 'md'].includes(ext || '')) return 'text';
    return 'unknown';
  }
  
  const mimeType = file.mime_type.toLowerCase();
  console.log('Detecting file type for MIME:', mimeType);
  
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType === 'application/pdf') return 'pdf';
  if (mimeType.includes('document') || mimeType.includes('word') || mimeType.includes('msword')) return 'document';
  if (mimeType.includes('spreadsheet') || mimeType.includes('excel') || mimeType.includes('sheet')) return 'spreadsheet';
  if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) return 'presentation';
  if (mimeType.startsWith('text/') || mimeType.includes('csv')) return 'text';
  
  return 'other';
};

export const validateMove = (draggedFile: ProjectFile, targetFolderId: string | null, allFolders: ProjectFile[]): boolean => {
  // Can't move to the same location
  if (draggedFile.parent_folder_id === targetFolderId) {
    return false;
  }

  // If dragging a folder, make sure we're not moving it into itself or its children
  if (draggedFile.is_folder && targetFolderId) {
    // Check if target is the dragged folder itself
    if (targetFolderId === draggedFile.id) {
      return false;
    }

    // Check if target is a child of the dragged folder
    const isChildOfDragged = (folderId: string): boolean => {
      const folder = allFolders.find(f => f.id === folderId);
      if (!folder) return false;
      if (folder.parent_folder_id === draggedFile.id) return true;
      if (folder.parent_folder_id) return isChildOfDragged(folder.parent_folder_id);
      return false;
    };

    if (isChildOfDragged(targetFolderId)) {
      return false;
    }
  }

  return true;
};

export const getCurrentFolderName = (currentFolder: string | null, breadcrumbs: Array<{id: string, name: string}>): string => {
  if (!currentFolder) return 'Root';
  return breadcrumbs[breadcrumbs.length - 1]?.name || 'Unknown folder';
};
