import React from 'react';
import { Trash2 } from 'lucide-react';
import { Note } from '../../shared/types';
import { formatDate } from '../../shared/utils';

interface NotesListProps {
  notes: Note[];
  onDeleteNote: (noteId: string) => void;
}

export function NotesList({ notes, onDeleteNote }: NotesListProps) {
  if (notes.length === 0) {
    return (
      <p className="text-sm text-gray-500 dark:text-gray-400 italic">
        No notes added yet.
      </p>
    );
  }

  return (
    <div className="space-y-3 max-h-64 overflow-y-auto">
      {notes.map((note) => (
        <div key={note.id} className="p-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {formatDate(note.created_at)} by {note.created_by_name}
            </p>
            <button
              type="button"
              onClick={() => onDeleteNote(note.id)}
              className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              title="Delete Note"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </div>
          <p className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap">
            {note.content}
          </p>
        </div>
      ))}
    </div>
  );
}
