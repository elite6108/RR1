import { useState, useEffect } from 'react';
import { supabase } from '../../../../lib/supabase';
import { LeaveRequest, LeaveEntitlement, getDefaultEntitlement } from '../utils/annualLeaveUtils';

export const useAnnualLeaveData = (userEmail?: string) => {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [entitlement, setEntitlement] = useState<LeaveEntitlement | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaveRequests = async () => {
    if (!userEmail) return;

    const { data, error } = await supabase
      .from('annual_leave_requests')
      .select('*')
      .eq('user_email', userEmail)
      .order('created_at', { ascending: false });

    if (error) throw error;
    setRequests(data || []);
  };

  const fetchLeaveEntitlement = async () => {
    if (!userEmail) return;

    const currentYear = new Date().getFullYear();
    const { data, error } = await supabase
      .from('annual_leave_entitlements')
      .select('*')
      .eq('user_email', userEmail)
      .eq('year', currentYear)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    setEntitlement(data || getDefaultEntitlement(currentYear));
  };

  const fetchData = async () => {
    if (!userEmail) return;
    
    setLoading(true);
    setError(null);
    
    try {
      await Promise.all([
        fetchLeaveRequests(),
        fetchLeaveEntitlement()
      ]);
    } catch (err: any) {
      console.error('Error fetching annual leave data:', err);
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const refetchData = () => {
    fetchData();
  };

  useEffect(() => {
    if (userEmail) {
      fetchData();
    }
  }, [userEmail]);

  return {
    requests,
    entitlement,
    loading,
    error,
    refetchData,
    setError
  };
};