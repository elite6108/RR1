import { supabase } from '../../../../../../../../lib/supabase';

export const generateFatalityId = async (): Promise<string> => {
  try {
    // Get the next sequential number from Supabase
    const { data, error } = await supabase
      .from('accidents_fatality')
      .select('auto_id')
      .order('auto_id', { ascending: false })
      .limit(1);

    if (error) {
      console.error('Error getting last report number:', error);
      return 'FT-00001';
    }

    if (data && data.length > 0) {
      const lastNumber = parseInt(data[0].auto_id.split('-')[1]);
      const nextNumber = (lastNumber + 1).toString().padStart(5, '0');
      return `FT-${nextNumber}`;
    } else {
      return 'FT-00001';
    }
  } catch (err) {
    console.error('Error in generateFatalityId:', err);
    return 'FT-00001';
  }
};
