import React from 'react';
import { Plus } from 'lucide-react';
import { ChecklistItemForm } from './ChecklistItemForm';
import { CHECKLIST_ITEMS } from '../utils/constants';
import type { ChecklistItem } from '../types';

interface ChecklistItemsStepProps {
  items: ChecklistItem[];
  onAddItem: () => void;
  onItemChange: (id: string, field: keyof ChecklistItem, value: string) => void;
  onImageUpload: (itemId: string, file: File) => void;
  onRemoveImage: (itemId: string) => void;
  onRemoveItem: (id: string) => void;
  uploadingImage: string | null;
}

export function ChecklistItemsStep({
  items,
  onAddItem,
  onItemChange,
  onImageUpload,
  onRemoveImage,
  onRemoveItem,
  uploadingImage
}: ChecklistItemsStepProps) {
  // Get available items (not yet selected)
  const getAvailableItems = () => {
    const selectedItems = new Set(items.map(item => item.name).filter(Boolean));
    return CHECKLIST_ITEMS.filter(item => !selectedItems.has(item));
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Checklist Items*</h3>
      {items.map((item, index) => (
        <ChecklistItemForm
          key={item.id}
          item={item}
          index={index}
          availableItems={getAvailableItems()}
          onItemChange={onItemChange}
          onImageUpload={onImageUpload}
          onRemoveImage={onRemoveImage}
          onRemoveItem={onRemoveItem}
          uploadingImage={uploadingImage}
        />
      ))}
      <button
        type="button"
        onClick={onAddItem}
        className="w-full flex justify-center items-center gap-2 px-4 py-2 border border-dashed rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
      >
        <Plus size={16} /> Add Item
      </button>
    </div>
  );
}
