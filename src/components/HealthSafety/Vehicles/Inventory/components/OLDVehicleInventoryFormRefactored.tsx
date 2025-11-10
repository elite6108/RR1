import React from 'react';
import { Save, Loader2 } from 'lucide-react';
import { InventoryFormHeader } from './InventoryFormHeader';
import { InventoryFormBasicInfo } from './InventoryFormBasicInfo';
import { CustomItemForm } from './CustomItemForm';
import { InventorySearchAndFilter } from './InventorySearchAndFilter';
import { InventorySection } from './InventorySection';
import { useInventoryForm } from '../hooks/useInventoryForm';
import type { VehicleInventoryFormProps } from '../../shared/types';

export default function VehicleInventoryForm({
  vehicle,
  inventoryToEdit,
  onClose,
  onSuccess,
}: VehicleInventoryFormProps) {
  const {
    // Form data
    formData,
    setFormData,
    
    // UI state
    loading,
    error,
    successMessage,
    loadingItems,
    
    // Search and filter
    searchQuery,
    setSearchQuery,
    filteredItems,
    
    // Sections
    collapsedSections,
    categories,
    itemsByCategory,
    
    // Custom items
    showAddCustomItem,
    setShowAddCustomItem,
    customItemData,
    setCustomItemData,
    
    // Data
    inventoryItems,
    
    // Handlers
    handleItemCheckChange,
    handleToggleSection,
    handleToggleAllSections,
    handleAddCustomItem,
    handleSubmit,
  } = useInventoryForm({ vehicle, inventoryToEdit, onSuccess });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        
        {/* Header */}
        <InventoryFormHeader
          vehicle={vehicle}
          inventoryToEdit={inventoryToEdit}
          onClose={onClose}
        />

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Error Message */}
          {error && (
            <div className="mb-6 flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-4 rounded-md">
              <div className="h-5 w-5 flex-shrink-0 rounded-full bg-red-500 text-white flex items-center justify-center text-xs">!</div>
              <p>{error}</p>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 flex items-center gap-2 text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-4 rounded-md">
              <div className="h-5 w-5 flex-shrink-0 rounded-full bg-green-500 text-white flex items-center justify-center text-xs">✓</div>
              <p>{successMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <InventoryFormBasicInfo
              checkedBy={formData.checkedBy}
              notes={formData.notes}
              onCheckedByChange={(value) => setFormData(prev => ({ ...prev, checkedBy: value }))}
              onNotesChange={(value) => setFormData(prev => ({ ...prev, notes: value }))}
            />

            {/* Custom Item Form */}
            <CustomItemForm
              isVisible={showAddCustomItem}
              formData={customItemData}
              onFormDataChange={(data) => setCustomItemData(prev => ({ ...prev, ...data }))}
              onToggleVisibility={() => setShowAddCustomItem(!showAddCustomItem)}
              onAddItem={handleAddCustomItem}
            />

            {/* Search Bar */}
            <InventorySearchAndFilter
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              totalItems={inventoryItems.length}
              filteredItems={filteredItems.length}
            />

            {/* Inventory Items */}
            {loadingItems ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="animate-spin h-8 w-8 text-indigo-600" />
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Inventory Items ({searchQuery ? filteredItems.length : inventoryItems.length} items)
                  </h3>
                  {categories.length > 0 && (
                    <button
                      type="button"
                      onClick={handleToggleAllSections}
                      className="text-xs text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                    >
                      {categories.every(cat => collapsedSections[cat]) ? 'Expand All' : 'Collapse All'}
                    </button>
                  )}
                </div>
                
                {categories.length === 0 && searchQuery ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">
                      No items match your search "{searchQuery}"
                    </p>
                  </div>
                ) : (
                  categories.map(category => (
                    <InventorySection
                      key={category}
                      category={category}
                      items={itemsByCategory[category]}
                      isCollapsed={collapsedSections[category]}
                      itemChecks={formData.itemChecks}
                      onToggleSection={handleToggleSection}
                      onItemCheckChange={handleItemCheckChange}
                    />
                  ))
                )}
              </div>
            )}
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-4 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={loading || loadingItems}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                Saving...
              </>
            ) : (
              <>
                <Save className="-ml-1 mr-2 h-4 w-4" />
                {inventoryToEdit ? 'Update' : 'Save'} Inventory
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
