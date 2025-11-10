import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Calendar } from '../../../../utils/calendar/Calendar';
import { useLeaveSubmission } from '../hooks/useLeaveSubmission';
import { supabase } from '../../../../lib/supabase';
import { LeaveRequest } from '../utils/annualLeaveUtils';

interface LeaveRequestFormProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string;
  onSuccess: () => void;
}

export const LeaveRequestForm = ({
  isOpen,
  onClose,
  userEmail,
  onSuccess
}: LeaveRequestFormProps) => {
  const {
    dateRange,
    setDateRange,
    leaveType,
    setLeaveType,
    reason,
    setReason,
    loading,
    error,
    submitLeaveRequest,
    resetForm,
    clearMessages
  } = useLeaveSubmission();

  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [approvedRequests, setApprovedRequests] = useState<LeaveRequest[]>([]);

  // Fetch user's approved leave requests
  useEffect(() => {
    const fetchApprovedRequests = async () => {
      if (!userEmail || !isOpen) return;

      try {
        const { data, error } = await supabase
          .from('annual_leave_requests')
          .select('*')
          .eq('user_email', userEmail)
          .eq('status', 'approved');

        if (error) throw error;
        setApprovedRequests(data || []);
      } catch (err) {
        console.error('Error fetching approved requests:', err);
      }
    };

    fetchApprovedRequests();
  }, [userEmail, isOpen]);

  // Check if a date is already approved for leave
  const isDateApproved = (date: Date): boolean => {
    const dateStr = date.toISOString().split('T')[0];
    
    return approvedRequests.some(request => {
      const startDate = new Date(request.start_date);
      const endDate = new Date(request.end_date);
      const checkDate = new Date(dateStr);
      
      // Check if the date falls within any approved leave period
      return checkDate >= startDate && checkDate <= endDate;
    });
  };

  // Update dateRange when start/end dates change
  useEffect(() => {
    if (startDate && endDate) {
      setDateRange({
        from: new Date(startDate),
        to: new Date(endDate)
      });
    } else if (startDate) {
      setDateRange({
        from: new Date(startDate),
        to: new Date(startDate)
      });
    } else {
      setDateRange(undefined);
    }
  }, [startDate, endDate, setDateRange]);

  // Reset local state when form resets
  useEffect(() => {
    if (!dateRange) {
      setStartDate('');
      setEndDate('');
    }
  }, [dateRange]);

  const handleClose = () => {
    setStartDate('');
    setEndDate('');
    resetForm();
    clearMessages();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userEmail) return;

    await submitLeaveRequest(userEmail, () => {
      onSuccess();
      handleClose();
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-[60]">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">New Leave Request</h3>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Leave Type
              </label>
              <select
                value={leaveType}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setLeaveType(e.target.value as any)}
                className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="full_day">Full Day(s)</option>
                <option value="half_day_morning">Half Day (Morning)</option>
                <option value="half_day_afternoon">Half Day (Afternoon)</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Start Date
                </label>
                <Calendar
                  selectedDate={startDate}
                  onDateSelect={setStartDate}
                  isDisabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                  isApproved={isDateApproved}
                  placeholder="Select start date"
                  className="w-full"
                />
              </div>
              
              {leaveType === 'full_day' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    End Date
                  </label>
                  <Calendar
                    selectedDate={endDate}
                    onDateSelect={setEndDate}
                    isDisabled={(date) => {
                      const today = new Date(new Date().setHours(0, 0, 0, 0));
                      const startDateObj = startDate ? new Date(startDate) : today;
                      const minDate = new Date(Math.max(today.getTime(), startDateObj.getTime()));
                      return date < minDate;
                    }}
                    isApproved={isDateApproved}
                    placeholder="Select end date"
                    className="w-full"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Reason (Optional)
              </label>
              <textarea
                value={reason}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setReason(e.target.value)}
                rows={3}
                className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter reason for leave..."
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-600 rounded-md hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!startDate || (leaveType === 'full_day' && !endDate) || loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};