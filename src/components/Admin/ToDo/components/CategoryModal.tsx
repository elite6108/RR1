import React from 'react';
import { Search } from 'lucide-react';
import { getFilteredIcons } from '../utils/helpers';
import type { CategoryFormData } from '../types';
import {
  FormContainer,
  FormHeader,
  FormContent,
  FormFooter,
  FormField,
  TextInput
} from '../../../../utils/form';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  title: string;
  formData: CategoryFormData;
  onFormDataChange: (data: CategoryFormData) => void;
  iconSearch: string;
  onIconSearchChange: (search: string) => void;
  submitButtonText: string;
}

export const CategoryModal = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  formData,
  onFormDataChange,
  iconSearch,
  onIconSearchChange,
  submitButtonText
}) => {
  if (!isOpen) return null;

  const filteredIcons = getFilteredIcons(iconSearch);

  return (
    <FormContainer isOpen={isOpen} maxWidth="lg">
      <FormHeader
        title={title}
        onClose={onClose}
      />
      
      <FormContent>
        <form onSubmit={onSubmit}>
          <div className="space-y-4">
            <FormField label="Category Name" required>
              <TextInput
                value={formData.name}
                onChange={(e) => onFormDataChange({ ...formData, name: e.target.value })}
              />
            </FormField>
            
            <FormField label="Search Icons">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <TextInput
                  value={iconSearch}
                  onChange={(e) => onIconSearchChange(e.target.value)}
                  placeholder="Search icons..."
                  className="pl-10"
                />
              </div>
            </FormField>

            <FormField label="Select Icon">
              <div className="grid grid-cols-5 sm:grid-cols-6 gap-2 max-h-48 sm:max-h-64 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-md p-3">
                {filteredIcons.map((iconData) => {
                  const IconComponent = iconData.icon;
                  return (
                    <button
                      key={iconData.name}
                      type="button"
                      onClick={() => onFormDataChange({ ...formData, icon: iconData.name })}
                      className={`p-2 sm:p-2 rounded-md border-2 transition-colors ${
                        formData.icon === iconData.name
                          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                      }`}
                      title={iconData.name}
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
            </FormField>
          </div>
        </form>
      </FormContent>
      
      <FormFooter
        onCancel={onClose}
        onSubmit={() => onSubmit({ preventDefault: () => {} } as React.FormEvent)}
        isLastStep={true}
        submitButtonText={submitButtonText}
        showPrevious={false}
      />
    </FormContainer>
  );
};
