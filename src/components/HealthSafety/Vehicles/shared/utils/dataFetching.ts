import { supabase } from '../../../../../lib/supabase';
import type { StaffMember, User, Worker, DriverWithStaff } from '../types';

export const fetchStaff = async (): Promise<StaffMember[]> => {
  try {
    const { data, error } = await supabase
      .from('staff')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('Error fetching staff:', err);
    throw err;
  }
};

export const fetchUsers = async (): Promise<User[]> => {
  try {
    console.log('Fetching all verified users via Edge Function...');
    
    // Get current session to pass authorization header
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.access_token) {
      console.log('No valid session found');
      return [];
    }

    // Call the Edge Function to get all verified users
    const { data, error } = await supabase.functions.invoke('get-all-users', {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    if (error) {
      console.error('Edge function error:', error);
      // Fallback to current user only if Edge Function fails
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        return [{
          id: user.id,
          full_name: user.user_metadata?.display_name || user.user_metadata?.full_name || user.email || 'Current User',
          email: user.email || ''
        }];
      }
      return [];
    }

    if (data?.users) {
      const users = data.users.map((user: any) => ({
        id: user.id,
        full_name: user.full_name,
        email: user.email
      }));
      console.log(`Successfully fetched ${users.length} verified users:`, users.map((u: any) => u.email));
      return users;
    }

    console.log('No users returned from Edge Function');
    return [];
  } catch (error) {
    console.error('Error fetching users:', error);
    // Fallback to current user only if there's an error
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        return [{
          id: user.id,
          full_name: user.user_metadata?.display_name || user.user_metadata?.full_name || user.email || 'Current User',
          email: user.email || ''
        }];
      }
    } catch (fallbackError) {
      console.error('Fallback error:', fallbackError);
    }
    return [];
  }
};

export const fetchCurrentUser = async (): Promise<User[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      return [{
        id: user.id,
        full_name: user.user_metadata?.display_name || user.user_metadata?.full_name || user.email || 'Current User',
        email: user.email || ''
      }];
    }
    return [];
  } catch (error) {
    console.error('Error fetching current user:', error);
    return [];
  }
};

export const fetchWorkers = async (): Promise<Worker[]> => {
  try {
    const { data, error } = await supabase
      .from('workers')
      .select('*')
      .order('full_name', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('Error fetching workers:', err);
    throw err;
  }
};

export const fetchDrivers = async (): Promise<DriverWithStaff[]> => {
  try {
    const { data, error } = await supabase
      .from('drivers')
      .select(`
        *,
        staff (
          name
        )
      `)
      .order('staff(name)', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('Error fetching drivers:', err);
    throw err;
  }
};

export const fetchVehicles = async () => {
  try {
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('Error fetching vehicles:', err);
    throw err;
  }
};

export const fetchVehicleChecklists = async () => {
  try {
    const { data, error } = await supabase
      .from('vehicle_checklists')
      .select('*')
      .order('check_date', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('Error fetching vehicle checklists:', err);
    throw err;
  }
};
