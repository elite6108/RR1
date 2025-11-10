import React from 'react';
import { Loader2 } from 'lucide-react';
import { FormContainer, FormHeader, FormContent, FormFooter } from '../../../../../utils/form';
import { NumberPlate } from '../../shared/components/NumberPlate';
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

  const formTitle = `${inventoryToEdit ? 'Edit' : 'New'} Vehicle Inventory`;
  const formSubtitle = (
    <div className="flex items-center space-x-2">
      <NumberPlate registration={vehicle.registration} />
      <span className="text-sm text-gray-500 dark:text-gray-400">
        {vehicle.make} {vehicle.model}
      </span>
    </div>
  );

  const handleSave = () => {
    // Create a synthetic event to pass to handleSubmit
    const syntheticEvent = {
      preventDefault: () => {},
    } as React.FormEvent;
    handleSubmit(syntheticEvent);
  };

  return (
    <FormContainer isOpen={true} maxWidth="4xl">
      <FormHeader 
        title={formTitle}
        subtitle={formSubtitle}
        onClose={onClose}
      />
      
      <FormContent>
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
      </FormContent>

      <FormFooter
        onCancel={onClose}
        onSave={handleSave}
        showSave={true}
        saveButtonText={`${inventoryToEdit ? 'Update' : 'Save'} Inventory`}
        disabled={loading || loadingItems}
        loading={loading}
      />
    </FormContainer>
  );
}
