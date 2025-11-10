import React from 'react';
import { X, AlertTriangle, ChevronLeft, ChevronRight, Save, Loader2 } from 'lucide-react';
import { useChecklistForm } from './hooks/useChecklistForm';
import { ChecklistFormSteps } from './components/ChecklistFormSteps';
import type { EquipmentChecklistFormProps } from './types';

const getStepLabel = (step: number) => {
  switch(step) {
    case 1: return 'Details';
    case 2: return 'Checklist Items';
    case 3: return 'Notes & Summary';
    default: return 'Details';
  }
};

export function EquipmentChecklistForm({ equipment, checklistToEdit, onClose, onSuccess }: EquipmentChecklistFormProps) {
  const {
    currentStep,
    loading,
    error,
    items,
    notes,
    createdByName,
    frequency,
    uploadingImage,
    setNotes,
    setCreatedByName,
    setFrequency,
    handleAddItem,
    handleImageUpload,
    handleRemoveImage,
    handleRemoveItem,
    handleItemChange,
    handleNext,
    handlePrevious,
    handleSubmit
  } = useChecklistForm(equipment, checklistToEdit);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSubmit(onSuccess);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center p-4 z-50">
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl mx-auto my-8 max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{checklistToEdit ? 'Edit Checklist' : 'New Equipment Checklist'}</h2>
            <p className="text-sm text-gray-500">for {equipment.name}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="p-6">
          <div className="mb-8 w-full">
            <div className="flex items-center justify-between mb-4">
              <div className="text-base font-medium text-indigo-600">
                {getStepLabel(currentStep)}
              </div>
              <div className="text-sm text-gray-500">
                Step {currentStep} of 3
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-indigo-600 h-2 rounded-full transition-all duration-300 ease-in-out"
                style={{ width: `${(currentStep / 3) * 100}%` }}
              />
            </div>
          </div>

          <form onSubmit={onSubmit} className="space-y-6">
            <ChecklistFormSteps
              currentStep={currentStep}
              createdByName={createdByName}
              frequency={frequency}
              items={items}
              notes={notes}
              onCreatedByNameChange={setCreatedByName}
              onFrequencyChange={setFrequency}
              onNotesChange={setNotes}
              onAddItem={handleAddItem}
              onItemChange={handleItemChange}
              onImageUpload={handleImageUpload}
              onRemoveImage={handleRemoveImage}
              onRemoveItem={handleRemoveItem}
              uploadingImage={uploadingImage}
              availableItems={[]}
            />
          </form>
        </div>

        {error && (
          <div className="px-6 py-4 border-t bg-red-50">
            <div className="flex items-center gap-2 text-sm text-red-600">
              <AlertTriangle className="h-5 w-5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between items-center p-6 border-t bg-gray-50">
           <div>
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handlePrevious}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </button>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700"
            >
              Cancel
            </button>
            {currentStep < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleSubmit(onSuccess)}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                <span className="ml-2">{checklistToEdit ? 'Save Changes' : 'Submit Checklist'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
