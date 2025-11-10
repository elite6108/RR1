import React from 'react';
import { Plus } from 'lucide-react';
import { TextArea } from '../../../../../utils/form';

interface NotesFormProps {
  newNote: string;
  onNoteChange: (note: string) => void;
  onAddNote: () => void;
}

export function NotesForm({ newNote, onNoteChange, onAddNote }: NotesFormProps) {
  return (
    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
      <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Add New Note</h4>
      <div className="space-y-3">
        <TextArea
          value={newNote}
          onChange={(e) => onNoteChange(e.target.value)}
          rows={3}
          placeholder="Add a note about this lead..."
        />
        <button
          type="button"
          onClick={onAddNote}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Note
        </button>
      </div>
    </div>
  );
}
