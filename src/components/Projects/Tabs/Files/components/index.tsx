import React, { useState, useEffect } from 'react';
import { 
  Folder,
  Image,
  FileText,
  ChevronRight
} from 'lucide-react';
import { supabase } from '../../../../../lib/supabase';
import { ProjectFile, FolderTreeItemProps, ImageThumbnailProps, FileTypeCategory } from '../types';
import { getFileTypeCategory } from '../utils';

// Folder Tree Item Component
export function FolderTreeItem({ folder, currentFolder, onFolderClick, level, allFolders, onMobileClose }: FolderTreeItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isSelected = currentFolder === (folder?.id || null);
  const childFolders = allFolders.filter(f => f.parent_folder_id === folder?.id);
  const hasChildren = childFolders.length > 0;

  useEffect(() => {
    // Auto-expand if this folder is in the current path
    if (folder && currentFolder?.includes(folder.id)) {
      setIsExpanded(true);
    }
  }, [currentFolder, folder]);

  const handleClick = () => {
    onFolderClick(folder?.id || null);
    // Close mobile sidebar when folder is selected
    if (onMobileClose) {
      onMobileClose();
    }
  };

  return (
    <div>
      <div
        className={`flex items-center px-2 py-2 cursor-pointer rounded text-sm transition-colors ${
          isSelected 
            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' 
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 active:bg-gray-200 dark:active:bg-gray-600'
        }`}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={handleClick}
      >
        {hasChildren && (
          <button
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="mr-1 p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded touch-manipulation"
          >
            <ChevronRight className={`h-3 w-3 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
          </button>
        )}
        {!hasChildren && <div className="w-5 mr-1" />}
        <Folder className="h-4 w-4 mr-2 text-blue-500 flex-shrink-0" />
        <span className="truncate">{folder ? folder.name : '📁 Root'}</span>
      </div>
      {isExpanded && hasChildren && (
        <div>
          {childFolders.map(childFolder => (
            <FolderTreeItem
              key={childFolder.id}
              folder={childFolder}
              currentFolder={currentFolder}
              onFolderClick={onFolderClick}
              level={level + 1}
              allFolders={allFolders}
              onMobileClose={onMobileClose}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Image Thumbnail Component
export function ImageThumbnail({ file, className = "", size = "md" }: ImageThumbnailProps) {
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const sizeClasses = {
    sm: "h-5 w-5",
    md: "h-8 w-8", 
    lg: "h-16 w-16"
  };

  useEffect(() => {
    const generateThumbnail = async () => {
      if (!file.storage_path || !file.mime_type?.startsWith('image/')) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase.storage
          .from('project-files')
          .createSignedUrl(file.storage_path, 3600);

        if (error) {
          console.error('Error creating thumbnail URL:', error);
          setHasError(true);
        } else if (data?.signedUrl) {
          setThumbnailUrl(data.signedUrl);
        } else {
          setHasError(true);
        }
      } catch (error) {
        console.error('Exception generating thumbnail:', error);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    generateThumbnail();
  }, [file.id, file.storage_path, file.mime_type]);

  if (!file.mime_type?.startsWith('image/') || hasError) {
    return <Image className={`${sizeClasses[size]} text-green-500 ${className}`} />;
  }

  if (isLoading) {
    return (
      <div className={`${sizeClasses[size]} ${className} bg-gray-200 dark:bg-gray-700 rounded animate-pulse flex items-center justify-center`}>
        <Image className="h-3 w-3 text-gray-400" />
      </div>
    );
  }

  if (thumbnailUrl) {
    return (
      <img
        src={thumbnailUrl}
        alt={file.name}
        className={`${sizeClasses[size]} ${className} object-cover rounded border border-gray-200 dark:border-gray-600`}
        onError={() => {
          setHasError(true);
          setThumbnailUrl(null);
        }}
      />
    );
  }

  return <Image className={`${sizeClasses[size]} text-green-500 ${className}`} />;
}

// File Icon Component
export function FileIcon({ file, size = "md" }: { file: ProjectFile; size?: "sm" | "md" | "lg" }) {
  if (file.is_folder) {
    const sizeClasses = {
      sm: "h-4 w-4",
      md: "h-5 w-5",
      lg: "h-8 w-8"
    };
    return <Folder className={`${sizeClasses[size]} text-blue-500`} />;
  }
  
  if (file.mime_type?.startsWith('image/')) {
    return <ImageThumbnail file={file} size={size} />;
  }
  
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5", 
    lg: "h-8 w-8"
  };
  return <FileText className={`${sizeClasses[size]} text-gray-500`} />;
}
