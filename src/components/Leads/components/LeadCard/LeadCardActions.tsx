import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { scrollToTopOnMobile } from '../shared/utils';

interface LeadCardActionsProps {
  onEdit: () => void;
  onDelete: () => void;
}

export function LeadCardActions({ onEdit, onDelete }: LeadCardActionsProps) {
  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit();
    scrollToTopOnMobile();
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete();
  };

  return (
    <div className="flex space-x-1 opacity-0 group-hover:opacity-100 hover:opacity-100 transition-opacity">
      <button
        onClick={handleEditClick}
        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20"
        title="Edit"  
      >
        <Pencil className="h-4 w-4" />
      </button>
      <button
        onClick={handleDeleteClick}
        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
        title="Delete"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}
