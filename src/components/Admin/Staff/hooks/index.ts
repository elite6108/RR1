import { useState, useEffect } from 'react';
import { supabase } from '../../../../lib/supabase.ts';
import type { 
  StaffMember, 
  User, 
  WorkerPhone, 
  CombinedStaffUser, 
  UserDetails,
  CompanySettings
} from '../types';
import { generateToken } from '../utils';

export const useStaffData = () => {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [workerPhones, setWorkerPhones] = useState<WorkerPhone[]>([]);
  const [combinedStaffUsers, setCombinedStaffUsers] = useState<CombinedStaffUser[]>([]);
  const [userDetails, setUserDetails] = useState<UserDetails>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      console.log('Fetching all verified users via Edge Function...');
      
      // Get current session to pass authorization header
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        console.log('No valid session found');
        setUsers([]);
        return;
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
          setUsers([{
            id: user.id,
            full_name: user.user_metadata?.display_name || user.user_metadata?.full_name || user.email || 'Current User',
            email: user.email || ''
          }]);
          console.log('Fallback: Using current authenticated user only:', user.email);
        } else {
          setUsers([]);
        }
        return;
      }

      if (data?.users) {
        setUsers(data.users.map((user: any) => ({
          id: user.id,
          full_name: user.full_name,
          email: user.email,
          user_metadata: user.user_metadata,
        })));
        console.log(`Successfully fetched ${data.users.length} verified users:`, data.users.map((u: any) => u.email));
      } else {
        console.log('No users returned from Edge Function');
        setUsers([]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      // Fallback to current user only if there's an error
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUsers([{
            id: user.id,
            full_name: user.user_metadata?.display_name || user.user_metadata?.full_name || user.email || 'Current User',
            email: user.email || ''
          }]);
          console.log('Error fallback: Using current authenticated user only:', user.email);
        } else {
          setUsers([]);
        }
      } catch (fallbackError) {
        console.error('Fallback error:', fallbackError);
        setUsers([]);
      }
    }
  };

  const fetchWorkerPhones = async () => {
    try {
      const { data, error } = await supabase
        .from('workers')
        .select('email, phone');

      if (error) {
        console.error('Error fetching worker phones:', error);
        return;
      }

      setWorkerPhones(data || []);
    } catch (error) {
      console.error('Error in fetchWorkerPhones:', error);
    }
  };

  const fetchStaff = async () => {
    setError(null);
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('staff')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      setStaff(data || []);
    } catch (error) {
      setError('Failed to fetch staff members');
      console.error('Error fetching staff:', error);
    } finally {
      setLoading(false);
    }
  };

  const combineStaffAndUsers = () => {
    const combined: CombinedStaffUser[] = [
      ...staff.map(staffMember => {
        const workerPhone = workerPhones.find(p => p.email === staffMember.email);
        return {
          id: `staff_${staffMember.id}`,
          name: staffMember.name,
          type: 'staff' as const,
          original_id: staffMember.id,
          email: staffMember.email,
          position: staffMember.position,
          phone: workerPhone?.phone || staffMember.phone,
          ni_number: staffMember.ni_number,
          start_date: staffMember.start_date,
          token: staffMember.token
        };
      }),
      ...users.filter(user => !staff.some(staffMember => staffMember.email === user.email))
        .map(user => {
          const storedDetails = userDetails[user.id] || {};
          const workerPhone = workerPhones.find(p => p.email === user.email);
          const isWorker = !!workerPhone;

          return {
            id: `user_${user.id}`,
            name: storedDetails.name || user.full_name || user.email || 'Unknown User',
            type: (isWorker ? 'worker' : 'user') as 'worker' | 'user',
            original_id: user.id,
            email: user.email,
            position: storedDetails.position,
            phone: workerPhone?.phone || storedDetails.phone,
            ni_number: storedDetails.ni_number,
            start_date: storedDetails.start_date
          };
        })
    ];
    
    console.log('Combined staff and users:', combined);
    setCombinedStaffUsers(combined);
  };

  useEffect(() => {
    fetchStaff();
    fetchUsers();
    fetchWorkerPhones();
  }, []);

  useEffect(() => {
    // Combine staff and users when either list changes or user details are updated
    if (staff.length > 0 || users.length > 0 || workerPhones.length > 0) {
      combineStaffAndUsers();
    }
  }, [staff, users, userDetails, workerPhones]);

  return {
    staff,
    setStaff,
    users,
    setUsers,
    workerPhones,
    combinedStaffUsers,
    userDetails,
    setUserDetails,
    loading,
    error,
    setError,
    fetchStaff,
    fetchUsers
  };
};

export const useTokenManagement = () => {
  const [companySettings, setCompanySettings] = useState<CompanySettings | null>(null);
  const [tokenLoading, setTokenLoading] = useState<number | null>(null);
  const [companyToken, setCompanyToken] = useState<string>('');
  const [workerToken, setWorkerToken] = useState<string>('');

  const handleGenerateToken = async (staffId: number, setStaff: (fn: (prev: StaffMember[]) => StaffMember[]) => void) => {
    try {
      setTokenLoading(staffId);
      const newToken = generateToken();

      const { error } = await supabase
        .from('staff')
        .update({
          token: newToken
        })
        .eq('id', staffId);

      if (error) throw error;

      setStaff((prevStaff: StaffMember[]) => 
        prevStaff.map((member: StaffMember) => 
          member.id === staffId 
            ? { ...member, token: newToken }
            : member
        )
      );
    } catch (error) {
      console.error('Error generating token:', error);
    } finally {
      setTokenLoading(null);
    }
  };

  const fetchTokens = async () => {
    try {
      const { data, error } = await supabase
        .from('company_settings')
        .select('token, worker_token, id')
        .single();

      if (error) throw error;
      setCompanyToken(data?.token || '');
      setWorkerToken(data?.worker_token || '');
      setCompanySettings(data as CompanySettings);
    } catch (error) {
      console.error('Error fetching tokens:', error);
    }
  };

  const handleGenerateCompanyToken = async () => {
    try {
      setTokenLoading(0);
      const newToken = generateToken();

      if (!companySettings?.id) {
        const { data: settingsData, error: fetchError } = await supabase
          .from('company_settings')
          .select('id')
          .single();

        if (fetchError) throw fetchError;
        if (!settingsData?.id) throw new Error('No company settings found');
        setCompanySettings(settingsData as CompanySettings);
      }

      const { error } = await supabase
        .from('company_settings')
        .update({ token: newToken })
        .eq('id', companySettings?.id);

      if (error) throw error;
      setCompanyToken(newToken);
    } catch (error) {
      console.error('Error generating company token:', error);
    } finally {
      setTokenLoading(null);
    }
  };

  const handleGenerateWorkerToken = async () => {
    try {
      setTokenLoading(-1); // Use -1 to indicate worker token loading
      const newToken = generateToken();

      if (!companySettings?.id) {
        const { data: settingsData, error: fetchError } = await supabase
          .from('company_settings')
          .select('id')
          .single();

        if (fetchError) throw fetchError;
        if (!settingsData?.id) throw new Error('No company settings found');
        setCompanySettings(settingsData as CompanySettings);
      }

      const { error } = await supabase
        .from('company_settings')
        .update({ worker_token: newToken })
        .eq('id', companySettings?.id);

      if (error) throw error;
      setWorkerToken(newToken);
    } catch (error) {
      console.error('Error generating worker token:', error);
    } finally {
      setTokenLoading(null);
    }
  };

  return {
    companySettings,
    tokenLoading,
    companyToken,
    workerToken,
    handleGenerateToken,
    fetchTokens,
    handleGenerateCompanyToken,
    handleGenerateWorkerToken
  };
};
