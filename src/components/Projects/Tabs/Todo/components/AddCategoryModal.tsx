import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Search } from 'lucide-react';
import { CategoryFormData } from '../types';
import { getFilteredIcons } from '../utils/helpers';

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CategoryFormData) => Promise<void>;
}

export const AddCategoryModal: React.FC<AddCategoryModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    icon: 'FileText'
  });
  const [iconSearch, setIconSearch] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClose = () => {
    setFormData({ name: '', icon: 'FileText' });
    setIconSearch('');
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      handleClose();
    } catch (error) {
      console.error('Error submitting category:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const filteredIcons = getFilteredIcons(iconSearch);

  return createPortal(
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-screen w-screen flex items-center justify-center z-50 p-4">
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Add New Category</h3>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                  setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-base"
                required
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category Icon
              </label>
              
              {/* Icon Search */}
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search icons..."
                  value={iconSearch}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setIconSearch(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-base"
                  disabled={isSubmitting}
                />
              </div>

              {/* Icon Grid */}
              <div className="grid grid-cols-5 sm:grid-cols-6 gap-2 max-h-48 sm:max-h-64 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-md p-3">
                {filteredIcons.map((iconData) => {
                  const IconComponent = iconData.icon;
                  return (
                    <button
                      key={iconData.name}
                      type="button"
                      onClick={() => setFormData({ ...formData, icon: iconData.name })}
                      className={`p-2 sm:p-2 rounded-md border-2 transition-colors ${
                        formData.icon === iconData.name
                          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                      }`}
                      title={iconData.name}
                      disabled={isSubmitting}
                    >
                      <IconComponent className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                    </button>
                  );
                })}
              </div>
              
              {filteredIcons.length === 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                  No icons found matching "{iconSearch}"
                </p>
              )}
              
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Selected: {formData.icon}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 order-2 sm:order-1"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 order-1 sm:order-2 disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Adding...' : 'Add Category'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>,
    document.body
  );
};
