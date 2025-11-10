import React from 'react';
import { createPortal } from 'react-dom';
import { Trash2 } from 'lucide-react';
import type { CalendarEvent, CalendarCategory } from '../types';

interface DeleteEventModalProps {
  isOpen: boolean;
  event: CalendarEvent | null;
  onClose: () => void;
  onConfirm: (eventId: string) => void;
}

export const DeleteEventModal: React.FC<DeleteEventModalProps> = ({
  isOpen,
  event,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !event) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-center mb-4">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <Trash2 className="w-6 h-6 text-red-600" />
          </div>
        </div>
        <h3 className="text-lg font-medium text-gray-900 text-center mb-2">
          Delete Event
        </h3>
        <p className="text-sm text-gray-500 text-center mb-6">
          Are you sure you want to delete the event "{event.title}"? This action cannot be undone.
        </p>
        <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(event.id)}
            className="flex items-center justify-center w-full sm:w-auto text-red-600 hover:text-red-800 font-semibold px-4 py-2 text-sm bg-white border border-red-300 rounded-md hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Event
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

interface DeleteCalendarModalProps {
  isOpen: boolean;
  calendar: CalendarCategory | null;
  onClose: () => void;
  onConfirm: (calendarId: string) => void;
}

export const DeleteCalendarModal: React.FC<DeleteCalendarModalProps> = ({
  isOpen,
  calendar,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !calendar) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-center mb-4">
          <div className={`w-12 h-12 rounded-full ${calendar.color} flex items-center justify-center`}>
            <Trash2 className="w-6 h-6 text-white" />
          </div>
        </div>
        <h3 className="text-lg font-medium text-gray-900 text-center mb-2">
          Delete Calendar
        </h3>
        <p className="text-sm text-gray-500 text-center mb-6">
          Are you sure you want to delete the calendar "{calendar.name}"? This action cannot be undone and will also delete all events in this calendar.
        </p>
        <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(calendar.id)}
            className="flex items-center justify-center w-full sm:w-auto text-red-600 hover:text-red-800 font-semibold px-4 py-2 text-sm bg-white border border-red-300 rounded-md hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Calendar
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
