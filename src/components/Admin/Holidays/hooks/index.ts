import { useState, useEffect } from 'react';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '../../../../lib/supabase';
import { verifyAdminPassword } from '../../../../utils/adminPassword';
import type { LeaveRequest, LeaveEntitlement, ViewMode } from '../types';
import { calculateTotalDays } from '../utils';
import type { DateRange } from 'react-day-picker';

export const useHolidaysData = () => {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [entitlements, setEntitlements] = useState<LeaveEntitlement[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<SupabaseUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('my_requests');

  const initializeData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUser(user);
        
        // Check if user is admin based on user metadata or email
        const userType = user.user_metadata?.user_type;
        const isAdminEmail = user.email?.includes('admin') || user.email?.endsWith('@rockrevelations.co.uk');
        const isStaffUser = userType === 'staff';
        
        setIsAdmin(isAdminEmail || isStaffUser);
      }
    } catch (error) {
      console.error('Error initializing:', error);
    }
  };

  const fetchLeaveRequests = async () => {
    if (!currentUser) return;

    let query = supabase.from('annual_leave_requests').select('*');
    
    if (viewMode === 'my_requests') {
      query = query.eq('user_email', currentUser.email);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    setRequests(data || []);
  };

  const fetchEntitlements = async () => {
    const currentYear = new Date().getFullYear();
    const { data, error } = await supabase
      .from('annual_leave_entitlements')
      .select('*')
      .eq('year', currentYear)
      .order('user_name');
    
    if (error) throw error;
    setEntitlements(data || []);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchLeaveRequests(),
        fetchEntitlements()
      ]);
    } catch (err: any) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initializeData();
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchData();
    }
  }, [currentUser, viewMode]);

  return {
    requests,
    entitlements,
    loading,
    error,
    success,
    currentUser,
    isAdmin,
    isAdminAuthenticated,
    viewMode,
    setError,
    setSuccess,
    setIsAdminAuthenticated,
    setViewMode,
    fetchData
  };
};

export const useHolidayActions = (currentUser: SupabaseUser | null, fetchData: () => void) => {
  const [loading, setLoading] = useState(false);

  const handleSubmitRequest = async (
    dateRange: DateRange | undefined,
    leaveType: 'full_day' | 'half_day_morning' | 'half_day_afternoon',
    reason: string,
    setSuccess: (message: string | null) => void,
    setError: (message: string | null) => void,
    onSuccess: () => void
  ) => {
    if (!dateRange?.from || !currentUser) return;

    setLoading(true);
    setError(null);

    try {
      const userName = currentUser.user_metadata?.full_name || 
                      currentUser.user_metadata?.name || 
                      currentUser.email?.split('@')[0] || 
                      currentUser.email;
      const endDate = dateRange.to || dateRange.from;
      const totalDays = calculateTotalDays(dateRange.from, endDate, leaveType);

      // Ensure user has entitlement record
      await supabase.rpc('ensure_user_entitlement', {
        p_user_id: currentUser.id,
        p_user_email: currentUser.email,
        p_user_name: userName,
        p_user_type: 'staff'
      });

      const { error } = await supabase
        .from('annual_leave_requests')
        .insert({
          user_id: currentUser.id,
          user_email: currentUser.email,
          user_name: userName,
          user_type: 'staff',
          start_date: dateRange.from.toISOString().split('T')[0],
          end_date: endDate.toISOString().split('T')[0],
          total_days: totalDays,
          leave_type: leaveType,
          reason: reason || null,
          status: 'pending'
        });

      if (error) throw error;

      setSuccess('Leave request submitted successfully!');
      onSuccess();
      fetchData();

      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to submit request');
    } finally {
      setLoading(false);
    }
  };

  const handleApprovalAction = async (
    selectedRequest: LeaveRequest,
    action: 'approved' | 'denied',
    adminNotes: string,
    setSuccess: (message: string | null) => void,
    setError: (message: string | null) => void,
    onSuccess: () => void
  ) => {
    if (!selectedRequest || !currentUser) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('annual_leave_requests')
        .update({ 
          status: action,
          approved_by: currentUser.id,
          approved_at: new Date().toISOString(),
          admin_notes: adminNotes || null
        })
        .eq('id', selectedRequest.id);

      if (error) throw error;

      setSuccess(`Request ${action} successfully!`);
      onSuccess();
      fetchData();

      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update request');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminPasswordSubmit = async (
    adminPassword: string,
    setIsAdminAuthenticated: (value: boolean) => void,
    setSuccess: (message: string | null) => void,
    setError: (message: string | null) => void,
    onSuccess: () => void
  ) => {
    setLoading(true);
    
    const isValid = await verifyAdminPassword(adminPassword);
    if (isValid) {
      setIsAdminAuthenticated(true);
      setSuccess('Admin access granted!');
      onSuccess();
      setTimeout(() => setSuccess(null), 3000);
    } else {
      setError('Incorrect password');
      setTimeout(() => setError(null), 3000);
    }
    setLoading(false);
  };

  const handleUpdateEntitlement = async (
    selectedEntitlement: LeaveEntitlement,
    newEntitlement: number,
    setSuccess: (message: string | null) => void,
    setError: (message: string | null) => void,
    onSuccess: () => void
  ) => {
    if (!selectedEntitlement) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('annual_leave_entitlements')
        .update({
          total_entitlement: newEntitlement,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedEntitlement.user_id)
        .eq('year', selectedEntitlement.year);

      if (error) throw error;
      
      setSuccess('Entitlement updated successfully!');
      onSuccess();
      fetchData();

      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update entitlement');
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    handleSubmitRequest,
    handleApprovalAction,
    handleAdminPasswordSubmit,
    handleUpdateEntitlement
  };
};
