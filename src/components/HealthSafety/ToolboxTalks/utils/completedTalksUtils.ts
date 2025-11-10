import { supabase } from '../../../../lib/supabase';

export const fetchTalks = async () => {
  const { data, error } = await supabase
    .from('toolbox_talks')
    .select(
      `
      *,
      project:projects(name)
    `
    )
    .order('completed_date', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const deleteTalk = async (talkId: string) => {
  const { error } = await supabase
    .from('toolbox_talks')
    .delete()
    .eq('id', talkId);

  if (error) throw error;
};

export const filterTalks = (talks: any[], searchQuery: string) => {
  const query = searchQuery.toLowerCase();
  return talks.filter((talk) => (
    talk.talk_number?.toLowerCase().includes(query) ||
    talk.title?.toLowerCase().includes(query) ||
    talk.project?.name?.toLowerCase().includes(query) ||
    talk.site_reference?.toLowerCase().includes(query) ||
    talk.completed_by_name?.toLowerCase().includes(query)
  ));
};
