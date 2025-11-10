import React from 'react';
import type { CalendarEvent, CalendarCategory } from '../types';
import { getTimeSlots, formatTime, getEventsForDate, isDateInPast, eventColorStyles } from '../utils';

interface DayViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  calendars: CalendarCategory[];
  draggedEvent: CalendarEvent | null;
  dragOverDate: Date | null;
  onDateClick: (date: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
  onDragStart: (e: DragEvent, event: CalendarEvent) => void;
  onDragEnd: (e: DragEvent) => void;
  onDragOver: (e: DragEvent, targetDate: Date) => void;
  onDragLeave: (e: DragEvent) => void;
  onDrop: (e: DragEvent, targetDate: Date) => void;
}

export const DayView = ({
  currentDate,
  events,
  calendars,
  draggedEvent,
  dragOverDate,
  onDateClick,
  onEventClick,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragLeave,
  onDrop,
}: DayViewProps) => {
  const timeSlots = getTimeSlots();

  return (
    <div className="bg-white dark:bg-gray-800 relative">
      {/* Time Grid */}
      <div className="grid grid-cols-[auto_1fr]">
        <div className="w-16">
          {timeSlots.map(hour => (
            <div key={hour} className="h-20 text-right pr-2 border-r border-gray-100 dark:border-gray-700">
              <span className="text-xs text-gray-500 dark:text-gray-400 relative -top-2">
                {formatTime(hour).replace(' ', '')}
              </span>
            </div>
          ))}
        </div>
        <div className="relative bg-white dark:bg-gray-800">
          {timeSlots.map(hour => {
            const slotDate = new Date(currentDate);
            slotDate.setHours(hour, 0, 0, 0);
            const isPastSlot = isDateInPast(slotDate);
            const isDragOver = dragOverDate?.getTime() === slotDate.getTime();
            
            return (
              <div 
                key={hour} 
                className={`h-20 border-b border-gray-100 dark:border-gray-700 transition-colors duration-200 ${
                  isPastSlot ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
                } ${
                  isDragOver && !isPastSlot ? 'bg-blue-100 border-blue-300' : ''
                } ${
                  !isDragOver && !isPastSlot ? 'hover:bg-gray-50 dark:hover:bg-[#2563eb]' : ''
                }`}
                onClick={() => onDateClick(slotDate)}
                onDragOver={(e: any) => onDragOver(e, slotDate)}
                onDragLeave={(e: any) => onDragLeave(e)}
                onDrop={(e: any) => onDrop(e, slotDate)}
              />
            );
          })}
        </div>
      </div>
        
      {/* Floating Events */}
      <div className="absolute top-0 left-16 right-0 bottom-0 pointer-events-none">
        {(() => {
          const dayEvents = getEventsForDate(events, currentDate).filter(event => !event.allDay && event.end.getHours() >= 7 && event.start.getHours() <= 20);
          const sortedEvents = dayEvents.sort((a, b) => a.start.getTime() - b.start.getTime());
          
          const eventPositions = sortedEvents.map((event, index) => {
            const overlapping = sortedEvents.filter(otherEvent => 
              otherEvent !== event &&
              ((event.start >= otherEvent.start && event.start < otherEvent.end) ||
               (otherEvent.start >= event.start && otherEvent.start < event.end))
            );
            
            const totalOverlapping = overlapping.length + 1;
            const eventIndex = overlapping.filter(e => e.start <= event.start).length;
            
            return { event, totalOverlapping, eventIndex };
          });
          
          return eventPositions.map(({ event, totalOverlapping, eventIndex }) => {
            const startHour = event.start.getHours();
            const endHour = event.end.getHours();
            const startMinutes = event.start.getMinutes();
            const endMinutes = event.end.getMinutes();
            
            const topPosition = ((startHour - 7) * 80) + (startMinutes / 60 * 80);
            const duration = (endHour - startHour) + ((endMinutes - startMinutes) / 60);
            const height = Math.max(duration * 80, 20);
            const calendar = calendars.find(c => c.id === event.calendarId);
            const styles = eventColorStyles[calendar?.color || 'bg-gray-400'];
            const isDragging = draggedEvent?.id === event.id;
            
            const eventWidth = 100 / totalOverlapping;
            const eventLeft = eventWidth * eventIndex;
            
            return (
              <div
                key={event.id}
                onClick={() => onEventClick(event)}
                className={`absolute pointer-events-auto p-2 rounded-lg cursor-move transition-all duration-200 ${styles.bg} border-l-4 ${styles.border} ${styles.bgHover} ${
                  isDragging ? 'opacity-60 scale-95 z-50' : 'hover:shadow-md'
                }`}
                style={{
                  top: `${topPosition}px`,
                  left: `calc(${eventLeft}% + 8px)`,
                  width: `calc(${eventWidth}% - 16px)`,
                  height: `${height}px`
                }}
                draggable
                onDragStart={(e: any) => onDragStart(e, event)}
                onDragEnd={(e: any) => onDragEnd(e)}
              >
                <div className="overflow-hidden">
                  <p className={`text-xs truncate ${styles.text}`}>
                    {event.start.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: true}).toLowerCase()}
                  </p>
                  <p className={`text-sm font-semibold ${styles.text}`}>{event.title}</p>
                </div>
              </div>
            );
          });
        })()}
      </div>
    </div>
  );
};
