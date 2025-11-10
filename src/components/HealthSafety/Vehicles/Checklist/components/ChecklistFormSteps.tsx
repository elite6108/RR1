import React from 'react';
import { Plus } from 'lucide-react';
import { ChecklistItemComponent } from './ChecklistItemComponent';
import type { ChecklistItem } from '../../shared/types';

const OUTSIDE_CHECKLIST_ITEMS = [
  'Engine Oil',
  'Coolant Level',
  'Washer Fluid Level',
  'Washer & Wipers',
  'Lights (Front, Side, Rear)',
  'Horn',
  'Tyre Tread & Sidewalls',
  'Type Pressure',
  'Bodywork',
  'Glass (Windows)',
  'Mirrors',
];

const INSIDE_CHECKLIST_ITEMS = [
  'Seatbelt',
  'First Aid & Eye Wash',
  'Brakes',
  'Indicator',
  'Clean & Tidy',
];

interface ChecklistFormStepsProps {
  currentStep: number;
  items: ChecklistItem[];
  notes: string;
  setNotes: (notes: string) => void;
  uploadingImage: string | null;
  onItemChange: (id: string, field: keyof ChecklistItem, value: string) => void;
  onImageUpload: (itemId: string, file: File) => void;
  onRemoveImage: (itemId: string) => void;
  onRemoveItem: (id: string) => void;
  onAddItem: (category: 'inside' | 'outside') => void;
}

export const ChecklistFormSteps: React.FC<ChecklistFormStepsProps> = ({
  currentStep,
  items,
  notes,
  setNotes,
  uploadingImage,
  onItemChange,
  onImageUpload,
  onRemoveImage,
  onRemoveItem,
  onAddItem
}) => {
  const getAvailableItems = () => {
    const selectedItems = new Set(items.map(item => item.name).filter(Boolean));
    const outsideItems = OUTSIDE_CHECKLIST_ITEMS.filter(item => !selectedItems.has(item));
    const insideItems = INSIDE_CHECKLIST_ITEMS.filter(item => !selectedItems.has(item));
    return { outsideItems, insideItems };
  };

  const { outsideItems, insideItems } = getAvailableItems();

  switch (currentStep) {
    case 2:
      return (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Outside Checklist Items*</h3>
          {items.filter(item => OUTSIDE_CHECKLIST_ITEMS.includes(item.name) || item.temp_category === 'outside').map((item) => (
            <ChecklistItemComponent
              key={item.id}
              item={item}
              availableItems={outsideItems}
              uploadingImage={uploadingImage}
              onItemChange={onItemChange}
              onImageUpload={onImageUpload}
              onRemoveImage={onRemoveImage}
              onRemoveItem={onRemoveItem}
            />
          ))}
          <button
            type="button"
            onClick={() => onAddItem('outside')}
            className="w-full flex justify-center items-center gap-2 px-4 py-2 border border-dashed rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            <Plus size={16} /> Add Item
          </button>
        </div>
      );
    case 3:
      return (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Inside Checklist Items*</h3>
          {items.filter(item => INSIDE_CHECKLIST_ITEMS.includes(item.name) || item.temp_category === 'inside').map((item) => (
            <ChecklistItemComponent
              key={item.id}
              item={item}
              availableItems={insideItems}
              uploadingImage={uploadingImage}
              onItemChange={onItemChange}
              onImageUpload={onImageUpload}
              onRemoveImage={onRemoveImage}
              onRemoveItem={onRemoveItem}
            />
          ))}
          <button
            type="button"
            onClick={() => onAddItem('inside')}
            className="w-full flex justify-center items-center gap-2 px-4 py-2 border border-dashed rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            <Plus size={16} /> Add Item
          </button>
        </div>
      );
    case 4:
      return (
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">Overall Notes <span className="text-gray-400 text-xs">(optional)</span></label>
          <textarea
            id="notes"
            value={notes}
            onChange={e => setNotes(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            rows={5}
            placeholder="Add any overall notes for this checklist"
          />
        </div>
      );
    default:
      return null;
  }
};
