import React from 'react';
import { Lead } from '../../shared/types';
import { NotesForm } from '../components/NotesForm';
import { NotesList } from '../components/NotesList';
import { useLeadActivities } from '../../../hooks/useLeadActivities';

interface NotesStepProps {
  leadToEdit?: Lead | null;
  currentUser?: { name: string; email: string } | null;
}

export function NotesStep({ leadToEdit, currentUser }: NotesStepProps) {
  const {
    notes,
    newNote,
    setNewNote,
    addNote,
    deleteNote,
  } = useLeadActivities({ leadToEdit, currentUser });

  if (!leadToEdit) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">
          Notes will be available after creating the lead.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <NotesForm
        newNote={newNote}
        onNoteChange={setNewNote}
        onAddNote={addNote}
      />

      <div>
        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Notes</h4>
        <NotesList
          notes={notes}
          onDeleteNote={deleteNote}
        />
      </div>
    </div>
  );
}
