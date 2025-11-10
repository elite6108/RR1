import React from 'react';
import { Folder, FileText, FileIcon as FileIconLucide } from 'lucide-react';
import { getFileTypeCategory } from '../utils/helpers';
import { FILE_TYPE_CATEGORIES } from '../utils/constants';
import { ImageThumbnail } from './ImageThumbnail';
import type { FileIconProps } from '../types';

export const FileIcon: React.FC<FileIconProps> = ({ file, size = "md", className = "" }) => {
  const sizeClasses = { sm: "h-5 w-5", md: "h-12 w-12", lg: "h-20 w-20" };
  const iconClassName = `${sizeClasses[size]} flex-shrink-0 ${className}`;

  if (file.is_folder) {
    return <Folder className={`${iconClassName} text-blue-500`} />;
  }
  
  const fileType = getFileTypeCategory(file);
  if (fileType === FILE_TYPE_CATEGORIES.IMAGE) {
    return <ImageThumbnail file={file} size={size} className={className} />;
  }
  
  switch (fileType) {
    case FILE_TYPE_CATEGORIES.PDF:
      return <FileText className={`${iconClassName} text-red-500`} />;
    case FILE_TYPE_CATEGORIES.VIDEO:
      return <FileText className={`${iconClassName} text-purple-500`} />;
    case FILE_TYPE_CATEGORIES.AUDIO:
      return <FileText className={`${iconClassName} text-pink-500`} />;
    default:
      return <FileIconLucide className={`${iconClassName} text-gray-500`} />;
  }
};
