import React from 'react';
import { Plus, Trash2, Camera, Loader2, Eye } from 'lucide-react';
import type { ChecklistItem } from '../../shared/types';

interface ChecklistItemComponentProps {
  item: ChecklistItem;
  availableItems: string[];
  uploadingImage: string | null;
  onItemChange: (id: string, field: keyof ChecklistItem, value: string) => void;
  onImageUpload: (itemId: string, file: File) => void;
  onRemoveImage: (itemId: string) => void;
  onRemoveItem: (id: string) => void;
}

export const ChecklistItemComponent: React.FC<ChecklistItemComponentProps> = ({
  item,
  availableItems,
  uploadingImage,
  onItemChange,
  onImageUpload,
  onRemoveImage,
  onRemoveItem
}) => {
  return (
    <div className="p-4 border rounded-md bg-gray-50 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Item Name*</label>
          <select
            value={item.name}
            onChange={e => onItemChange(item.id, 'name', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          >
            <option value="">Select an item</option>
            {item.name && <option value={item.name}>{item.name}</option>}
            {availableItems.map(name => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status*</label>
          <select
            value={item.status}
            onChange={e => onItemChange(item.id, 'status', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          >
            <option value="pass">Pass</option>
            <option value="fail">Fail</option>
            <option value="n/a">N/A</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Item Notes <span className="text-gray-400 text-xs">(optional)</span></label>
        <textarea
          value={item.notes}
          onChange={e => onItemChange(item.id, 'notes', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          rows={2}
          placeholder="Add notes for this item"
        />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {!item.image_url && (
            <label htmlFor={`image-upload-${item.id}`} className="cursor-pointer text-sm font-medium text-indigo-600 hover:text-indigo-500 flex items-center gap-2">
              {uploadingImage === item.id ? <Loader2 className="animate-spin" /> : <Camera />}
              <span>Upload Image</span>
            </label>
          )}
          <input
            id={`image-upload-${item.id}`}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={e => e.target.files && onImageUpload(item.id, e.target.files[0])}
            disabled={!!uploadingImage}
          />
        </div>
        {item.signed_url && (
          <div className="relative group w-24 h-24 border rounded-md overflow-hidden">
            <img
              src={item.signed_url}
              alt="Checklist item thumbnail"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center gap-2">
              <a href={item.signed_url} target="_blank" rel="noopener noreferrer" className="text-white p-1 rounded-full bg-gray-700 bg-opacity-50 hover:bg-opacity-75">
                <Eye size={16} />
              </a>
              <button
                type="button"
                onClick={() => onRemoveImage(item.id)}
                className="text-white p-1 rounded-full bg-gray-700 bg-opacity-50 hover:bg-opacity-75"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        )}
        <button onClick={() => onRemoveItem(item.id)} className="text-red-600 hover:text-red-800 self-end">
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  );
};
