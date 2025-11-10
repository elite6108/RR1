import React from 'react';
import type { CalendarEvent, CalendarCategory, CombinedStaffUser, EventFormData } from '../types';
import { toLocalISOString, getUserIdHash } from '../utils';
import { DateTimeCalendar } from '../../../../utils/calendar/Calendar';
import {
  FormContainer,
  FormHeader,
  FormContent,
  FormFooter,
  FormField,
  TextInput,
  TextArea,
  Select
} from '../../../../utils/form';

interface EventFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  newEvent: Partial<EventFormData>;
  setNewEvent: (event: Partial<EventFormData>) => void;
  calendars: CalendarCategory[];
  combinedStaffUsers: CombinedStaffUser[];
  editingEvent: CalendarEvent | null;
  onStartTimeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const EventForm = ({
  isOpen,
  onClose,
  onSubmit,
  newEvent,
  setNewEvent,
  calendars,
  combinedStaffUsers,
  editingEvent,
  onStartTimeChange,
}) => {
  if (!isOpen) return null;

  const calendarOptions = calendars.map(calendar => ({
    value: calendar.id,
    label: calendar.name
  }));

  return (
    <FormContainer isOpen={isOpen} maxWidth="md">
      <FormHeader
        title={editingEvent ? 'Edit Event' : 'Add New Event'}
        onClose={onClose}
      />
      
      <FormContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <FormField label="Title" required>
            <TextInput
              value={newEvent.title || ''}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
            />
          </FormField>
      
          <FormField label="Calendar">
            <Select
              value={newEvent.calendarId || ''}
              onChange={(e) => setNewEvent({ ...newEvent, calendarId: e.target.value })}
              options={calendarOptions}
            />
          </FormField>
      
          <FormField label="All Day">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700 dark:text-gray-300">Enable all day event</span>
              <button
                type="button"
                onClick={() => setNewEvent({ ...newEvent, allDay: !newEvent.allDay })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                  newEvent.allDay ? 'bg-indigo-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    newEvent.allDay ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </FormField>
      
          {!newEvent.allDay && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Start">
                <DateTimeCalendar
                  selectedDateTime={newEvent.start ? toLocalISOString(newEvent.start) : ''}
                  onDateTimeSelect={(dateTime) => {
                    const event = { target: { value: dateTime } } as React.ChangeEvent<HTMLInputElement>;
                    onStartTimeChange(event);
                  }}
                  placeholder="Select start date and time"
                  className="w-full"
                />
              </FormField>
              
              <FormField label="End">
                <DateTimeCalendar
                  selectedDateTime={newEvent.end ? toLocalISOString(newEvent.end) : ''}
                  onDateTimeSelect={(dateTime) => setNewEvent({ ...newEvent, end: new Date(dateTime) })}
                  placeholder="Select end date and time"
                  className="w-full"
                />
              </FormField>
            </div>
          )}
      
          <FormField label="Location">
            <TextInput
              value={newEvent.location || ''}
              onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
            />
          </FormField>
      
          <FormField label="Notes">
            <TextArea
              value={newEvent.notes || ''}
              onChange={(e) => setNewEvent({ ...newEvent, notes: e.target.value })}
              rows={3}
            />
          </FormField>

          <FormField label="Assigned Staff" description="(optional)">
            <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-md p-2 dark:bg-gray-700">
              {combinedStaffUsers.map((member) => {
                // For staff members, use their numeric ID directly
                // For users, we'll use negative IDs to distinguish them from staff
                let isChecked = false;
                if (member.type === 'staff') {
                  const staffId = member.original_id as number;
                  isChecked = (newEvent.assigned_to || []).includes(staffId);
                } else {
                  // For users, use the helper function to get consistent ID
                  const userId = member.original_id as string;
                  const negativeId = getUserIdHash(userId);
                  isChecked = (newEvent.assigned_to || []).includes(negativeId);
                }
                
                return (
                  <label
                    key={member.id}
                    className="relative flex items-center p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer group"
                  >
                    <div className="flex items-center h-5">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            let newStaffIds: number[];
                            
                            if (member.type === 'staff') {
                              // Handle staff members normally
                              const staffId = member.original_id as number;
                              newStaffIds = e.target.checked
                                ? [...(newEvent.assigned_to || []), staffId]
                                : (newEvent.assigned_to || []).filter((id) => id !== staffId);
                            } else {
                              // For users, use the helper function to get consistent ID
                              const userId = member.original_id as string;
                              const negativeId = getUserIdHash(userId);
                              
                              newStaffIds = e.target.checked
                                ? [...(newEvent.assigned_to || []), negativeId]
                                : (newEvent.assigned_to || []).filter((id) => id !== negativeId);
                            }
                            
                            setNewEvent({
                              ...newEvent,
                              assigned_to: newStaffIds,
                            });
                          }}
                          className="peer appearance-none h-5 w-5 border border-gray-300 rounded-md transition-all duration-200 ease-in-out cursor-pointer checked:border-indigo-600 checked:bg-indigo-600 hover:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/30"
                        />
                        <svg
                          className="absolute top-[42%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none text-white peer-checked:opacity-100 opacity-0 transition-opacity duration-200"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M13.3334 4L6.00008 11.3333L2.66675 8"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <div className="ml-3 flex items-center">
                        <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors duration-200">
                          {member.name}
                        </span>
                        <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                          {member.position || (member.type === 'user' ? 'User' : '')}
                        </span>
                        <span className={`ml-2 inline-flex px-1.5 py-0.5 text-xs font-semibold rounded-full ${
                          member.type === 'staff' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        }`}>
                          {member.type}
                        </span>
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          </FormField>
        </form>
      </FormContent>
      
      <FormFooter
        onCancel={onClose}
        onSubmit={() => onSubmit({ preventDefault: () => {} } as React.FormEvent)}
        isLastStep={true}
        submitButtonText={editingEvent ? 'Update Event' : 'Add Event'}
        showPrevious={false}
      />
    </FormContainer>
  );
};
