import React from 'react';
import { Calendar } from 'lucide-react';
import type { InventoryItem, InventoryItemCheck } from '../../shared/types';

interface InventoryItemComponentProps {
  item: InventoryItem;
  itemCheck?: InventoryItemCheck;
  onItemCheckChange: (itemId: string, field: keyof InventoryItemCheck, value: any) => void;
}

export const InventoryItemComponent: React.FC<InventoryItemComponentProps> = ({
  item,
  itemCheck,
  onItemCheckChange
}) => {
  const handlePresentChange = (isPresent: boolean) => {
    console.log('handlePresentChange called:', { itemId: item.id, isPresent, currentCheck: itemCheck });
    onItemCheckChange(item.id, 'is_present', isPresent);
    // If marking as not present, set condition to missing
    if (!isPresent) {
      onItemCheckChange(item.id, 'condition_status', 'missing');
    } else {
      // If marking as present and was missing, set to good
      if (itemCheck?.condition_status === 'missing') {
        onItemCheckChange(item.id, 'condition_status', 'good');
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'damaged':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'missing':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'replaced':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className={`p-4 border rounded-md space-y-4 ${getStatusColor(itemCheck?.condition_status || 'good')}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h4 className="font-medium text-gray-900">{item.item_name}</h4>
          {item.is_custom && (
            <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded font-medium">
              Custom
            </span>
          )}
        </div>
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
          {item.category}
        </span>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Present*</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handlePresentChange(true)}
                className={`px-4 py-2 text-sm font-medium rounded-md border transition-colors ${
                  itemCheck?.is_present === true
                    ? 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900 dark:text-green-200 dark:border-green-700'
                    : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600'
                }`}
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => handlePresentChange(false)}
                className={`px-4 py-2 text-sm font-medium rounded-md border transition-colors ${
                  itemCheck?.is_present === false
                    ? 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900 dark:text-red-200 dark:border-red-700'
                    : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600'
                }`}
              >
                No
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
            <select
              value={itemCheck?.condition_status || 'good'}
              onChange={e => onItemCheckChange(item.id, 'condition_status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm"
              disabled={itemCheck?.is_present === false}
            >
              <option value="good">Good</option>
              <option value="damaged">Damaged</option>
              <option value="missing">Missing</option>
              <option value="replaced">Replaced</option>
            </select>
          </div>
        </div>

        {itemCheck?.condition_status === 'replaced' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Calendar className="inline w-4 h-4 mr-1" />
              Replacement Date
            </label>
            <input
              type="date"
              value={itemCheck?.replacement_date || ''}
              onChange={e => onItemCheckChange(item.id, 'replacement_date', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm"
            />
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Notes 
          <span className="text-gray-400 text-xs">(optional)</span>
        </label>
        <textarea
          value={itemCheck?.notes || ''}
          onChange={e => onItemCheckChange(item.id, 'notes', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm"
          rows={2}
          placeholder="Add notes about this item's condition, location, or any issues..."
        />
      </div>
    </div>
  );
};
