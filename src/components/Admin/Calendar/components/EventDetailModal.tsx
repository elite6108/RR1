import React from 'react';
import { createPortal } from 'react-dom';
import { X, Pencil, Trash2, Calendar as CalendarIcon, MapPin, FileText } from 'lucide-react';
import type { CalendarEvent, CalendarCategory } from '../types';
import { eventColorStyles } from '../utils';

interface EventDetailModalProps {
  isOpen: boolean;
  event: CalendarEvent | null;
  calendars: CalendarCategory[];
  onClose: () => void;
  onEdit: (event: CalendarEvent) => void;
  onDelete: (event: CalendarEvent) => void;
}

export const EventDetailModal: React.FC<EventDetailModalProps> = ({
  isOpen,
  event,
  calendars,
  onClose,
  onEdit,
  onDelete,
}) => {
  if (!isOpen || !event) return null;

  const calendar = calendars.find(c => c.id === event.calendarId);
  const styles = eventColorStyles[calendar?.color || 'bg-gray-400'];

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose} 
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 z-10">
          <X className="w-6 h-6" />
        </button>

        <div className={`p-4 rounded-t-lg ${styles.bg}`}>
          <h2 className={`text-xl font-bold uppercase pr-8 ${styles.text}`}>{event.title}</h2>
        </div>

        <div className="p-6 space-y-4 text-gray-700">
          <div className="flex items-center space-x-3">
            <CalendarIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
            <span className="text-sm">
              {event.start.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              {!event.allDay && ` (${event.start.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })} - ${event.end.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })})`}
            </span>
          </div>
          {event.location && (
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <span className="text-sm">{event.location}</span>
            </div>
          )}
          {event.notes && (
            <div className="flex items-center space-x-3">
              <FileText className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <span className="text-sm">{event.notes}</span>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row justify-end items-center p-4 bg-gray-50 rounded-b-lg space-y-2 sm:space-y-0 sm:space-x-4">
          <button 
            onClick={() => {
              onClose();
              onEdit(event);
            }}
            className="flex items-center justify-center w-full sm:w-auto text-blue-600 hover:text-blue-800 font-semibold px-4 py-2 text-sm"
          >
            <Pencil className="w-4 h-4 mr-2" />
            Edit
          </button>
          <button 
            onClick={() => onDelete(event)}
            className="flex items-center justify-center w-full sm:w-auto text-red-600 hover:text-red-800 font-semibold px-4 py-2 text-sm"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
