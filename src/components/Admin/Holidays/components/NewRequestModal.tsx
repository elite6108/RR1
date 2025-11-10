import React, { useState } from 'react';
import { Calendar } from '../../../../utils/calendar/Calendar';

type DateRange = {
  from?: Date;
  to?: Date;
};
import {
  FormContainer,
  FormHeader,
  FormContent,
  FormFooter,
  FormField,
  Select,
  TextArea
} from '../../../../utils/form';

interface NewRequestModalProps {
  showModal: boolean;
  onClose: () => void;
  onSubmit: (
    dateRange: DateRange | undefined,
    leaveType: 'full_day' | 'half_day_morning' | 'half_day_afternoon',
    reason: string
  ) => void;
  loading: boolean;
}

export function NewRequestModal({ showModal, onClose, onSubmit, loading }: NewRequestModalProps) {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [leaveType, setLeaveType] = useState<'full_day' | 'half_day_morning' | 'half_day_afternoon'>('full_day');
  const [reason, setReason] = useState('');

  // Convert our start/end dates to DateRange format for compatibility
  const dateRange: DateRange | undefined = startDate && endDate ? {
    from: new Date(startDate),
    to: new Date(endDate)
  } : startDate ? {
    from: new Date(startDate),
    to: new Date(startDate)
  } : undefined;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(dateRange, leaveType, reason);
  };

  const resetForm = () => {
    setStartDate('');
    setEndDate('');
    setLeaveType('full_day');
    setReason('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!showModal) return null;

  const leaveTypeOptions = [
    { value: 'full_day', label: 'Full Day(s)' },
    { value: 'half_day_morning', label: 'Half Day (Morning)' },
    { value: 'half_day_afternoon', label: 'Half Day (Afternoon)' }
  ];

  return (
    <FormContainer isOpen={showModal} maxWidth="2xl">
      <FormHeader
        title="New Leave Request"
        onClose={handleClose}
      />
      
      <FormContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label="Leave Type" required>
            <Select
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value as any)}
              options={leaveTypeOptions}
            />
          </FormField>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Start Date" required>
              <Calendar
                selectedDate={startDate}
                onDateSelect={setStartDate}
                isDisabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                placeholder="Select start date"
                className="w-full"
              />
            </FormField>
            
            {leaveType === 'full_day' && (
              <FormField label="End Date" required>
                <Calendar
                  selectedDate={endDate}
                  onDateSelect={setEndDate}
                  isDisabled={(date) => {
                    const today = new Date(new Date().setHours(0, 0, 0, 0));
                    const startDateObj = startDate ? new Date(startDate) : today;
                    return date.getTime() < Math.max(today.getTime(), startDateObj.getTime());
                  }}
                  placeholder="Select end date"
                  className="w-full"
                />
              </FormField>
            )}
          </div>

          <FormField label="Reason" description="(Optional)">
            <TextArea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              placeholder="Enter reason for leave..."
            />
          </FormField>
        </form>
      </FormContent>
      
      <FormFooter
        onCancel={handleClose}
        onSubmit={() => handleSubmit({ preventDefault: () => {} } as React.FormEvent)}
        isLastStep={true}
        submitButtonText={loading ? 'Submitting...' : 'Submit Request'}
        disabled={!startDate || (leaveType === 'full_day' && !endDate) || loading}
        loading={loading}
        showPrevious={false}
      />
    </FormContainer>
  );
}
