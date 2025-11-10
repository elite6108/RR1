import React from 'react';

interface ChecklistNotesStepProps {
  notes: string;
  onNotesChange: (notes: string) => void;
}

export function ChecklistNotesStep({ notes, onNotesChange }: ChecklistNotesStepProps) {
  return (
    <div>
      <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
        Overall Notes <span className="text-gray-400 text-xs">(optional)</span>
      </label>
      <textarea
        id="notes"
        value={notes}
        onChange={e => onNotesChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
        rows={5}
        placeholder="Add any overall notes for this checklist"
      />
    </div>
  );
}
