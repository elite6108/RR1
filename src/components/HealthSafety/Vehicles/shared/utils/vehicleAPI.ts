import { supabase } from '../../../../../lib/supabase';

// DVLA VES API function via Supabase Edge Function
// This calls our Supabase Edge Function which then calls the DVLA API
// This avoids CORS issues since the Edge Function runs server-side
export const callDVLAAPI = async (registrationNumber: string) => {
  try {
    const { data, error } = await supabase.functions.invoke('dvla-vehicle-lookup', {
      body: {
        registrationNumber: registrationNumber.replace(/\s+/g, '').toUpperCase()
      }
    });

    if (error) {
      throw new Error(error.message || 'Edge function error');
    }

    if (data.success) {
      return {
        success: true,
        data: data.data
      };
    } else {
      throw new Error(data.error || 'Unknown error from edge function');
    }
  } catch (error) {
    console.error('DVLA API Error:', error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Failed to retrieve vehicle data from DVLA'
    };
  }
};

// MOT History API function via Supabase Edge Function
// This calls our MOT lookup Edge Function to get vehicle model information
export const callMOTAPI = async (registrationNumber: string) => {
  try {
    const { data, error } = await supabase.functions.invoke('mot-lookup', {
      body: {
        registrationNumber: registrationNumber.replace(/\s+/g, '').toUpperCase()
      }
    });

    if (error) {
      throw new Error(error.message || 'MOT Edge function error');
    }

    if (data.success) {
      return {
        success: true,
        data: data.data
      };
    } else {
      throw new Error(data.error || 'Unknown error from MOT edge function');
    }
  } catch (error) {
    console.error('MOT API Error:', error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Failed to retrieve vehicle model from MOT API'
    };
  }
};
