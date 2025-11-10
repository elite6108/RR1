import { supabase } from '../../../../../lib/supabase';

export const generateNextCoshhReference = async (): Promise<string> => {
  try {
    // Fetch all assessments to find the highest COSHH reference number
    const { data, error } = await supabase
      .from('coshh_assessments')
      .select('coshh_reference')
      .order('coshh_reference', { ascending: false });

    if (error) throw error;

    let nextNumber = 1;

    if (data && data.length > 0) {
      // Find the highest number from existing COSHH references
      for (const assessment of data) {
        if (assessment.coshh_reference && assessment.coshh_reference.startsWith('COSHH-')) {
          const numberPart = assessment.coshh_reference.substring(6); // Remove 'COSHH-'
          const currentNumber = parseInt(numberPart, 10);
          if (!isNaN(currentNumber) && currentNumber >= nextNumber) {
            nextNumber = currentNumber + 1;
          }
        }
      }
    }

    // Format with zero padding to 5 digits
    return `COSHH-${nextNumber.toString().padStart(5, '0')}`;
  } catch (error) {
    console.error('Error generating COSHH reference:', error);
    return `COSHH-00001`; // Fallback to first number
  }
};
