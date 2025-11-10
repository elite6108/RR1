import { useState } from 'react';
import { DateRange } from 'react-day-picker';
import { supabase } from '../../../../lib/supabase';
import { LeaveType, calculateTotalDays } from '../utils/annualLeaveUtils';

export const useLeaveSubmission = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form state
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [leaveType, setLeaveType] = useState<LeaveType>('full_day');
  const [reason, setReason] = useState('');

  const resetForm = () => {
    setDateRange(undefined);
    setLeaveType('full_day');
    setReason('');
    setError(null);
    setSuccess(null);
  };

  const submitLeaveRequest = async (userEmail: string, onSuccess?: () => void) => {
    if (!dateRange?.from || !userEmail) {
      setError('Please select a date and ensure you are logged in');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('User not authenticated');

      // Get user name from auth metadata or email
      const userName = userData.user.user_metadata?.full_name || 
                      userData.user.user_metadata?.name || 
                      userEmail?.split('@')[0] || 
                      userEmail;

      const endDate = dateRange.to || dateRange.from;
      const totalDays = calculateTotalDays(dateRange.from, endDate, leaveType);

      // Ensure user has entitlement record
      await supabase.rpc('ensure_user_entitlement', {
        p_user_id: userData.user.id,
        p_user_email: userEmail,
        p_user_name: userName,
        p_user_type: 'worker'
      });

      const { error: insertError } = await supabase
        .from('annual_leave_requests')
        .insert({
          user_id: userData.user.id,
          user_email: userEmail,
          user_name: userName,
          user_type: 'worker',
          start_date: dateRange.from.toISOString().split('T')[0],
          end_date: endDate.toISOString().split('T')[0],
          total_days: totalDays,
          leave_type: leaveType,
          reason: reason || null,
          status: 'pending'
        });

      if (insertError) throw insertError;

      setSuccess('Leave request submitted successfully!');
      resetForm();
      
      if (onSuccess) {
        onSuccess();
      }

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      console.error('Error submitting leave request:', err);
      setError(err.message || 'Failed to submit request');
    } finally {
      setLoading(false);
    }
  };

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  return {
    // Form state
    dateRange,
    setDateRange,
    leaveType,
    setLeaveType,
    reason,
    setReason,
    
    // Submission state
    loading,
    error,
    success,
    
    // Actions
    submitLeaveRequest,
    resetForm,
    clearMessages
  };
};