import React from 'react';
import type { CalendarEvent, CalendarCategory } from '../types';
import { getMonthData, isWeekend, isDateInPast, eventColorStyles } from '../utils';

interface MonthViewProps {
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

export const MonthView = ({
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
}: MonthViewProps) => {
  const monthDays = getMonthData(currentDate);
  const eventLayouts: { event: CalendarEvent; key: string; top: string; left: string; width: string; }[] = [];
  
  const weekSlots: number[][][] = Array.from({ length: 6 }, () => Array.from({ length: 7 }, () => []));

  const sortedEvents = [...events].sort((a, b) => a.start.getTime() - b.start.getTime());
  const viewStart = monthDays[0];
  const viewEnd = monthDays[monthDays.length - 1];

  for (const event of sortedEvents) {
    const eventStart = new Date(event.start);
    eventStart.setHours(0, 0, 0, 0);
    const eventEnd = new Date(event.end);
    eventEnd.setHours(0, 0, 0, 0);

    if (eventEnd < viewStart || eventStart > viewEnd) continue;

    let currentDay = new Date(eventStart < viewStart ? viewStart : eventStart);
    
    while(currentDay <= eventEnd && currentDay <= viewEnd) {
      const weekIndex = monthDays.findIndex(d => d.toDateString() === currentDay.toDateString());
      if (weekIndex === -1) {
        currentDay.setDate(currentDay.getDate() + 1);
        continue;
      }
      
      const week = Math.floor(weekIndex / 7);
      if (week >= 6) break;

      const weekEndDay = monthDays[week * 7 + 6];

      const segStart = currentDay;
      const segEnd = eventEnd < weekEndDay ? eventEnd : weekEndDay;

      const segStartIndex = monthDays.findIndex(d => d.toDateString() === segStart.toDateString());
      const segEndIndex = monthDays.findIndex(d => d.toDateString() === segEnd.toDateString());

      const startDayOfWeek = segStartIndex % 7;
      const endDayOfWeek = segEndIndex % 7;
      const span = endDayOfWeek - startDayOfWeek + 1;
      
      let slot = 0;
      while(true) {
        let isTaken = false;
        for (let i = startDayOfWeek; i <= endDayOfWeek; i++) {
          if (weekSlots[week][i].includes(slot)) {
            isTaken = true;
            break;
          }
        }
        if (!isTaken) {
          for (let i = startDayOfWeek; i <= endDayOfWeek; i++) {
            weekSlots[week][i].push(slot);
          }
          break;
        }
        slot++;
      }
      
      eventLayouts.push({
        event,
        key: `${event.id}-${week}`,
        top: `calc(${week * 10}rem + 4rem + ${slot * 2.25}rem)`,
        left: `calc(${(startDayOfWeek / 7) * 100}% + 2px)`,
        width: `calc(${(span / 7) * 100}% - 4px)`,
      });

      currentDay = new Date(segEnd);
      currentDay.setDate(currentDay.getDate() + 1);
    }
  }

  return (
    <div className="relative">
      <div className="grid grid-cols-7">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
          <div key={day} className="pb-2 text-sm font-medium text-gray-600 text-left border-b-2 border-gray-200">
            {day}
          </div>
        ))}
        {monthDays.map((date, index) => {
          const isToday = date.toDateString() === new Date().toDateString();
          const isCurrentMonth = date.getMonth() === currentDate.getMonth();
          const weekend = isWeekend(date);
          const isPastDate = isDateInPast(date);
          const isDragOver = dragOverDate?.toDateString() === date.toDateString();
          
          return (
            <div
              key={index}
              className={`h-40 p-2 flex flex-col transition-colors duration-200 ${
                isPastDate ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
              } ${
                isToday ? 'border-2 border-blue-500' : 'border-b border-r'
              } ${
                isToday ? 'bg-blue-50 dark:bg-[#002949]' : ''
              } ${
                isCurrentMonth ? (weekend ? 'bg-pink-50 dark:bg-[#171e29]' : 'bg-white dark:bg-gray-800') : 'bg-gray-100 dark:bg-gray-700'
              } ${
                isDragOver && !isPastDate ? 'bg-blue-100 border-blue-300' : ''
              } ${
                isToday ? '' : 'border-gray-200 dark:border-[#32405a]'
              } ${
                !isToday && !isDragOver && !isPastDate ? 'hover:bg-gray-50 dark:hover:bg-[#2563eb]' : ''
              }`}
              onClick={() => onDateClick(date)}
              onDragOver={(e: any) => onDragOver(e, date)}
              onDragLeave={(e: any) => onDragLeave(e)}
              onDrop={(e: any) => onDrop(e, date)}
            >
              <div className={`text-sm mb-2 ${
                isPastDate && isCurrentMonth ? 'text-gray-400 dark:text-gray-500' :
                isCurrentMonth ? 'text-gray-800 dark:text-white' : 'text-gray-400'
              }`}>
                {date.getDate()}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none">
        {eventLayouts.map(({ event, key, top, left, width }) => {
          const calendar = calendars.find(c => c.id === event.calendarId);
          const styles = eventColorStyles[calendar?.color || 'bg-gray-400'];
          const isDragging = draggedEvent?.id === event.id;
          
          return (
            <div
              key={key} 
              onClick={(e: React.MouseEvent) => { e.stopPropagation(); onEventClick(event); }}
              className={`absolute pointer-events-auto p-1 rounded cursor-move transition-all duration-200 ${styles.bg} border-l-4 ${styles.border} ${
                isDragging ? 'opacity-60 scale-95 z-50' : 'hover:shadow-md'
              }`}
              style={{ top, left, width, height: '3rem' }}
              draggable
              onDragStart={(e: any) => onDragStart(e, event)}
              onDragEnd={(e: any) => onDragEnd(e)}
            >
              <div className="overflow-hidden">
                <p className={`text-xs truncate ${styles.text}`}>
                  {event.allDay ? 'All day' : event.start.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: false})}
                </p>
                <p className={`text-xs font-semibold truncate ${styles.text}`}>{event.title}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
