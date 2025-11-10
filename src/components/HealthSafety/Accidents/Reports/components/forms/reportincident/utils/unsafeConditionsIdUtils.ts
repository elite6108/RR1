import { supabase } from '../../../../../../../../lib/supabase';

export const getNextUnsafeConditionsId = async (): Promise<string> => {
  try {
    // Get the next sequential number from Supabase
    const { data, error } = await supabase
      .from('accidents_unsafeconditions')
      .select('auto_id')
      .order('auto_id', { ascending: false })
      .limit(1);

    if (error) {
      console.error('Error getting last report number:', error);
      return 'UC-00001';
    }

    if (data && data.length > 0) {
      const lastNumber = parseInt(data[0].auto_id.split('-')[1]);
      const nextNumber = (lastNumber + 1).toString().padStart(5, '0');
      return `UC-${nextNumber}`;
    } else {
      return 'UC-00001';
    }
  } catch (err) {
    console.error('Error in getNextUnsafeConditionsId:', err);
    return 'UC-00001';
  }
};
