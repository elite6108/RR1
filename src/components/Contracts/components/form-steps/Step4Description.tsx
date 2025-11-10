import React from 'react';
import type { DescriptionTabsProps } from '../../types';

export function Step4Description({ 
  formData, 
  handleInputChange,
  setFormData,
  activeDescriptionTab,
  setActiveDescriptionTab,
  quotes = []
}: DescriptionTabsProps) {
  // Determine if all fields in the first tab are filled
  const isBuilderResponsibilitiesComplete =
    formData.builder_responsibilities &&
    (formData.manufacturing || formData.delivery || formData.installing);

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Select Quote <span className="text-gray-400 text-xs">(optional)</span>
        </label>
        <select
          name="quote_id"
          value={formData.quote_id}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="">Select a quote...</option>
          {quotes
            .filter(
              (quote) =>
                !formData.customer_id ||
                quote.customer_id === formData.customer_id
            )
            .map((quote) => (
              <option key={quote.id} value={quote.id}>
                {quote.quote_number}
              </option>
            ))}
        </select>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 mb-4">
        <button
          type="button"
          onClick={() => setActiveDescriptionTab('builder')}
          className={`px-4 py-2 text-sm font-medium rounded-t-md ${
            activeDescriptionTab === 'builder'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
          }`}
        >
          Builder Responsibilities
        </button>
        <button
          type="button"
          onClick={() => setActiveDescriptionTab('description')}
          className={`px-4 py-2 text-sm font-medium rounded-t-md ${
            activeDescriptionTab === 'description'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
          }`}
        >
          Description of Works
        </button>
      </div>

      {/* Tab content */}
      {activeDescriptionTab === 'builder' ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Builder Responsibilities <span className="text-gray-400 text-xs">(optional)</span>{' '}
              <span className="text-xs text-gray-500">
                (Select options that apply)
              </span>
            </label>
            <div className="flex flex-wrap gap-2 mb-4">
              <button
                type="button"
                name="manufacturing"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    manufacturing: !prev.manufacturing,
                  }))
                }
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  formData.manufacturing
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
                }`}
              >
                Manufacturing
              </button>
              <button
                type="button"
                name="delivery"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    delivery: !prev.delivery,
                  }))
                }
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  formData.delivery
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
                }`}
              >
                Delivery
              </button>
              <button
                type="button"
                name="installing"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    installing: !prev.installing,
                  }))
                }
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  formData.installing
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
                }`}
              >
                Installing
              </button>
            </div>
          </div>

          <div>
            <div className="flex justify-between">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Additional Builder Responsibilities <span className="text-gray-400 text-xs">(optional)</span>
              </label>
              <span className="text-xs text-gray-500 italic">
                Edit as required
              </span>
            </div>
            <textarea
              name="builder_responsibilities"
              value={formData.builder_responsibilities}
              onChange={handleInputChange}
              rows={6}
              placeholder="• Foundation and groundwork design / calculations 
• Full design and build package for the project
• Project management of project from start date
• Foundation works 
• Manufactured and installed as per order contract 
• Canopies manufactured and installed as per order contract"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {isBuilderResponsibilitiesComplete && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setActiveDescriptionTab('description')}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Continue to Description
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description of Works <span className="text-gray-400 text-xs">(optional)</span>
            </label>
            <textarea
              name="description_of_works"
              value={formData.description_of_works}
              onChange={handleInputChange}
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
      )}
    </div>
  );
}