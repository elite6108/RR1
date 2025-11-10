import React from 'react';
import { Plus } from 'lucide-react';
import type { CustomItemFormProps } from '../types/formTypes';

export const CustomItemForm: React.FC<CustomItemFormProps> = ({
  isVisible,
  formData,
  onFormDataChange,
  onToggleVisibility,
  onAddItem,
  loading = false
}) => {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onAddItem();
  };

  return (
    <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-md font-medium text-gray-700 dark:text-gray-300">
          Add Custom Item
        </h4>
        <button
          type="button"
          onClick={onToggleVisibility}
          className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-900 dark:text-indigo-300 dark:hover:bg-indigo-800"
        >
          <Plus className="h-4 w-4 mr-1" />
          {isVisible ? 'Cancel' : 'Add Item'}
        </button>
      </div>

      {isVisible && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Item Name*
              </label>
              <input
                type="text"
                value={formData.itemName}
                onChange={(e) => onFormDataChange({ itemName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter custom item name..."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => onFormDataChange({ category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="extra">Extra</option>
                <option value="tools">Tools</option>
                <option value="electrical">Electrical</option>
                <option value="safety">Safety</option>
                <option value="materials">Materials</option>
                <option value="equipment">Equipment</option>
              </select>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading || !formData.itemName.trim()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </button>
        </form>
      )}
    </div>
  );
};
