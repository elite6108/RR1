import React from 'react';
import type { TaskFormData } from '../types';
import { Calendar } from '../../../../utils/calendar/Calendar';
import {
  FormContainer,
  FormHeader,
  FormContent,
  FormFooter,
  StepIndicator,
  FormField,
  TextInput,
  TextArea,
  Select
} from '../../../../utils/form';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  title: string;
  formData: TaskFormData;
  onFormDataChange: (data: TaskFormData) => void;
  submitButtonText: string;
}

export const TaskModal = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  formData,
  onFormDataChange,
  submitButtonText
}) => {
  if (!isOpen) return null;

  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' }
  ];

  return (
    <FormContainer isOpen={isOpen} maxWidth="4xl">
      <FormHeader
        title={title}
        onClose={onClose}
      />
      
      <FormContent>
        <StepIndicator
          currentStep={1}
          totalSteps={1}
          stepLabels={['Task Details']}
        />
        
        <form onSubmit={onSubmit}>
          <div className="max-h-[500px] overflow-y-auto pr-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-1">
                <FormField label="Task Name" required>
                  <TextInput
                    value={formData.name}
                    onChange={(e) => onFormDataChange({ ...formData, name: e.target.value })}
                  />
                </FormField>
              </div>

              <div className="col-span-1">
                <FormField label="Description" description="(optional)">
                  <TextArea
                    value={formData.description}
                    onChange={(e) => onFormDataChange({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                </FormField>
              </div>

              <div className="col-span-1">
                <FormField label="Priority" required>
                  <Select
                    value={formData.priority}
                    onChange={(e) => onFormDataChange({ ...formData, priority: e.target.value as TaskFormData['priority'] })}
                    options={priorityOptions}
                  />
                </FormField>
              </div>

              <div className="col-span-1">
                <FormField label="Due Date" required>
                  <Calendar
                    selectedDate={formData.due_date}
                    onDateSelect={(date) => onFormDataChange({ ...formData, due_date: date })}
                    placeholder="Select due date"
                    className="w-full"
                  />
                </FormField>
              </div>

              <div className="col-span-2">
                <FormField label="Notes" description="(optional)">
                  <TextArea
                    value={formData.notes}
                    onChange={(e) => onFormDataChange({ ...formData, notes: e.target.value })}
                    rows={3}
                    placeholder="Additional notes..."
                  />
                </FormField>
              </div>
            </div>
          </div>
        </form>
      </FormContent>
      
      <FormFooter
        onCancel={onClose}
        onSubmit={() => onSubmit({ preventDefault: () => {} } as React.FormEvent)}
        isLastStep={true}
        submitButtonText={submitButtonText}
        showPrevious={false}
      />
    </FormContainer>
  );
};
