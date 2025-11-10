import { supabase } from '../../../../../../../../lib/supabase';

export const getNextUnsafeActionsId = async (): Promise<string> => {
  try {
    // Get the next sequential number from Supabase
    const { data, error } = await supabase
      .from('accidents_unsafeactions')
      .select('auto_id')
      .order('auto_id', { ascending: false })
      .limit(1);

    if (error) {
      console.error('Error getting last report number:', error);
      return 'UA-00001';
    }

    if (data && data.length > 0) {
      const lastNumber = parseInt(data[0].auto_id.split('-')[1]);
      const nextNumber = (lastNumber + 1).toString().padStart(5, '0');
      return `UA-${nextNumber}`;
    } else {
      return 'UA-00001';
    }
  } catch (err) {
    console.error('Error in getNextUnsafeActionsId:', err);
    return 'UA-00001';
  }
};
