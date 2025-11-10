import React from 'react';
import { ChecklistDetailsStep } from './ChecklistDetailsStep';
import { ChecklistItemsStep } from './ChecklistItemsStep';
import { ChecklistNotesStep } from './ChecklistNotesStep';
import type { ChecklistFormStepsProps } from '../types';

export function ChecklistFormSteps({
  currentStep,
  createdByName,
  frequency,
  items,
  notes,
  onCreatedByNameChange,
  onFrequencyChange,
  onNotesChange,
  onAddItem,
  onItemChange,
  onImageUpload,
  onRemoveImage,
  onRemoveItem,
  uploadingImage
}: ChecklistFormStepsProps) {
  switch (currentStep) {
    case 1:
      return (
        <ChecklistDetailsStep
          createdByName={createdByName}
          frequency={frequency}
          onCreatedByNameChange={onCreatedByNameChange}
          onFrequencyChange={onFrequencyChange}
        />
      );
    case 2:
      return (
        <ChecklistItemsStep
          items={items}
          onAddItem={onAddItem}
          onItemChange={onItemChange}
          onImageUpload={onImageUpload}
          onRemoveImage={onRemoveImage}
          onRemoveItem={onRemoveItem}
          uploadingImage={uploadingImage}
        />
      );
    case 3:
      return (
        <ChecklistNotesStep
          notes={notes}
          onNotesChange={onNotesChange}
        />
      );
    default:
      return null;
  }
}
