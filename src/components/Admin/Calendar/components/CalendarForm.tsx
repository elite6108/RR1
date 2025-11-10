import React from 'react';
import type { CalendarCategory, CalendarFormData } from '../types';
import { colors } from '../utils';
import {
  FormContainer,
  FormHeader,
  FormContent,
  FormFooter,
  FormField,
  TextInput
} from '../../../../utils/form';

interface CalendarFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  newCalendar: CalendarFormData;
  setNewCalendar: (calendar: CalendarFormData) => void;
  editingCalendar: CalendarCategory | null;
}

export const CalendarForm = ({
  isOpen,
  onClose,
  onSubmit,
  newCalendar,
  setNewCalendar,
  editingCalendar,
}) => {
  if (!isOpen) return null;

  return (
    <FormContainer isOpen={isOpen} maxWidth="md">
      <FormHeader
        title={editingCalendar ? 'Edit Calendar' : 'Add New Calendar'}
        onClose={onClose}
      />
      
      <FormContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <FormField label="Name" required>
            <TextInput
              value={newCalendar.name}
              onChange={(e) => setNewCalendar({ ...newCalendar, name: e.target.value })}
            />
          </FormField>
          
          <FormField label="Color">
            <div className="flex flex-wrap gap-2">
              {colors.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setNewCalendar({ ...newCalendar, color })}
                  className={`w-8 h-8 rounded-full ${color} ${
                    newCalendar.color === color ? 'ring-2 ring-gray-400 ring-offset-2' : ''
                  } transition-all duration-200 hover:scale-110`}
                />
              ))}
            </div>
          </FormField>
        </form>
      </FormContent>
      
      <FormFooter
        onCancel={onClose}
        onSubmit={() => onSubmit({ preventDefault: () => {} } as React.FormEvent)}
        isLastStep={true}
        submitButtonText={editingCalendar ? 'Update Calendar' : 'Add Calendar'}
        showPrevious={false}
      />
    </FormContainer>
  );
};
