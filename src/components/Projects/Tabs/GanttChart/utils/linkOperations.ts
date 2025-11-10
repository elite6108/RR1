import { supabase } from '../../../../../lib/supabase';
import type { GanttLink } from '../types';

export const createLink = async (projectId: string, link: GanttLink): Promise<GanttLink | null> => {
  try {
    console.log('Link created:', link);
    const { data, error } = await supabase
      .from('gantt_links')
      .insert([{
        project_id: projectId,
        source_task_id: link.source,
        target_task_id: link.target,
        type: link.type
      }])
      .select()
      .single();

    if (error) throw error;

    const newLink: GanttLink = {
      id: data.id,
      source: data.source_task_id,
      target: data.target_task_id,
      type: data.type
    };

    return newLink;
  } catch (err) {
    console.error('Error saving link:', err);
    return null;
  }
};

export const deleteLink = async (linkId: number): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('gantt_links')
      .delete()
      .eq('id', linkId);

    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Error deleting link:', err);
    return false;
  }
};
