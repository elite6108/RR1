import { useState, useEffect } from 'react';
import { Activity, Note, Lead } from '../components/shared/types';
import { supabase } from '../../../lib/supabase';

interface UseLeadActivitiesProps {
  leadToEdit?: Lead | null;
  currentUser?: { name: string; email: string } | null;
}

export const useLeadActivities = ({ leadToEdit, currentUser }: UseLeadActivitiesProps) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [newActivity, setNewActivity] = useState({
    type: 'email_sent' as Activity['activity_type'],
    description: ''
  });
  const [newNote, setNewNote] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (leadToEdit && leadToEdit.id) {
      fetchActivities();
      fetchNotes();
    }
  }, [leadToEdit]);

  const fetchActivities = async () => {
    if (!leadToEdit?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('lead_activities')
        .select('*')
        .eq('lead_id', leadToEdit.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setActivities(data || []);
    } catch (err) {
      console.error('Error fetching activities:', err);
    }
  };

  const fetchNotes = async () => {
    if (!leadToEdit?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('lead_notes')
        .select('*')
        .eq('lead_id', leadToEdit.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotes(data || []);
    } catch (err) {
      console.error('Error fetching notes:', err);
    }
  };

  const addActivity = async () => {
    if (!leadToEdit?.id || !newActivity.description.trim()) return;

    try {
      const { error } = await supabase
        .from('lead_activities')
        .insert([{
          lead_id: leadToEdit.id,
          activity_type: newActivity.type,
          description: newActivity.description,
          created_by_name: currentUser?.name || 'Unknown User'
        }]);

      if (error) throw error;
      
      setNewActivity({ type: 'email_sent', description: '' });
      fetchActivities();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add activity');
    }
  };

  const deleteActivity = async (activityId: string) => {
    try {
      const { error } = await supabase
        .from('lead_activities')
        .delete()
        .eq('id', activityId);

      if (error) throw error;
      fetchActivities();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete activity');
    }
  };

  const addNote = async () => {
    if (!leadToEdit?.id || !newNote.trim()) return;

    try {
      const { error } = await supabase
        .from('lead_notes')
        .insert([{
          lead_id: leadToEdit.id,
          content: newNote,
          created_by_name: currentUser?.name || 'Unknown User'
        }]);

      if (error) throw error;
      
      setNewNote('');
      fetchNotes();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add note');
    }
  };

  const deleteNote = async (noteId: string) => {
    try {
      const { error } = await supabase
        .from('lead_notes')
        .delete()
        .eq('id', noteId);

      if (error) throw error;
      fetchNotes();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete note');
    }
  };

  return {
    activities,
    notes,
    newActivity,
    setNewActivity,
    newNote,
    setNewNote,
    error,
    setError,
    addActivity,
    deleteActivity,
    addNote,
    deleteNote,
  };
};
