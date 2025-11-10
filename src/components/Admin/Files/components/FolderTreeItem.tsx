import React, { useState, useEffect } from 'react';
import { ChevronRight, Folder } from 'lucide-react';
import type { FolderTreeItemProps } from '../types';

export const FolderTreeItem: React.FC<FolderTreeItemProps> = ({
  folder,
  currentFolder,
  onFolderClick,
  level,
  allFolders,
  onMobileClose
}) => {
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
};
