import React from 'react';
import type { CalendarEvent, CalendarCategory } from '../types';
import { getWeekData, isWeekend, isDateInPast, getTimeSlots, formatTime, getEventsForDate, isMultiDayEvent, eventColorStyles } from '../utils';

interface WeekViewProps {
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

export const WeekView = ({
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
}: WeekViewProps) => {
  const weekData = getWeekData(currentDate);
  const timeSlots = getTimeSlots();

  return (
    <div className="bg-white dark:bg-gray-800">
      {/* Week Header */}
      <div className="grid grid-cols-[auto_repeat(7,1fr)] bg-white dark:bg-gray-800 z-10 border-b border-gray-200 dark:border-gray-700 mb-4">
        <div className="w-16 border-r border-gray-200 dark:border-gray-700"></div>
        {weekData.map((date) => {
          const isToday = date.toDateString() === new Date().toDateString();
          const weekend = isWeekend(date);
          return (
            <div key={date.toISOString()} className={`p-2 text-center border-r border-gray-200 dark:border-gray-700 ${
              isToday ? 'bg-blue-50 dark:bg-[#002949]' : ''
            } ${
              weekend && !isToday ? 'bg-pink-50 dark:bg-[#171e29]' : ''
            }`}>
              <span className="text-xs text-gray-500 dark:text-gray-400">{date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()}</span>
              <h3 className={`text-xl font-semibold mt-1 ${isToday ? 'text-blue-600 dark:text-blue-400' : 'text-gray-800 dark:text-white'}`}>{date.getDate()}</h3>
            </div>
          );
        })}
      </div>
      
      {/* All Day Events */}
      <div className="relative border-b border-gray-200 dark:border-gray-700" style={{ height: '65px' }}>
        <div className="grid grid-cols-[auto_repeat(7,1fr)] h-full">
          <div className="w-16 flex items-center justify-center border-r border-gray-200 dark:border-gray-700">
            <span className="text-xs text-gray-500 dark:text-gray-400">All day</span>
          </div>
          {weekData.map((date, dayIndex) => (
            <div key={dayIndex} className="relative border-r border-gray-100 dark:border-gray-700 h-full"></div>
          ))}
        </div>
        <div className="absolute top-0 left-16 right-0 bottom-0 pointer-events-none">
          {(() => {
            const weekStart = weekData[0];
            const weekEnd = weekData[6];
            const allDayEvents = events.filter(e => e.allDay || isMultiDayEvent(e))
              .filter(e => new Date(e.start) <= weekEnd && new Date(e.end) >= weekStart);
            
            const slots: number[][] = Array.from({ length: 7 }, () => []);
            const layouts: any[] = [];

            allDayEvents.forEach(event => {
              const segStart = new Date(event.start) > weekStart ? new Date(event.start) : weekStart;
              const segEnd = new Date(event.end) < weekEnd ? new Date(event.end) : weekEnd;
              const startDay = Math.max(0, Math.floor((segStart.getTime() - weekStart.getTime()) / (1000*60*60*24)));
              const endDay = Math.min(6, Math.floor((segEnd.getTime() - weekStart.getTime()) / (1000*60*60*24)));
              const span = endDay - startDay + 1;
              
              let slot = 0;
              while(true){
                let taken = false;
                for(let i = startDay; i <= endDay; i++) if(slots[i]?.includes(slot)) taken = true;
                if(!taken) break;
                slot++;
              }
              for(let i = startDay; i <= endDay; i++) slots[i].push(slot);

              layouts.push({ event, slot, startDay, span });
            });

            return layouts.map(({event, slot, startDay, span}) => {
              const calendar = calendars.find(c => c.id === event.calendarId);
              const styles = eventColorStyles[calendar?.color || 'bg-gray-400'];
              return (
                <div key={event.id}
                  onClick={(e: React.MouseEvent) => { e.stopPropagation(); onEventClick(event); }}
                  className={`absolute pointer-events-auto p-1 rounded ${styles.bg} border-l-4 ${styles.border} cursor-pointer`}
                  style={{
                    top: `${slot * 1.75}rem`,
                    left: `calc(${(startDay / 7) * 100}% + 2px)`,
                    width: `calc(${(span / 7) * 100}% - 4px)`,
                    height: '3rem',
                  }}>
                  <div className="overflow-hidden">
                    <p className={`text-xs truncate ${styles.text}`}>
                      {event.allDay ? 'All day' : event.start.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: false})}
                    </p>
                    <p className={`text-xs font-semibold truncate ${styles.text}`}>{event.title}</p>
                  </div>
                </div>
              )
            });
          })()}
        </div>
      </div>
      
      {/* Week Body */}
      <div className="relative mt-2">
        {/* Time Grid */}
        <div className="grid grid-cols-[auto_repeat(7,1fr)]">
          <div className="w-16">
            {timeSlots.map(hour => (
              <div key={hour} className="h-16 text-right pr-2 border-r border-gray-200 dark:border-gray-700">
                <span className="text-xs text-gray-500 dark:text-gray-400 relative -top-2">{formatTime(hour)}</span>
              </div>
            ))}
          </div>
          {/* Day columns */}
          {weekData.map((date, dayIndex) => (
            <div key={dayIndex} className={`relative border-r border-gray-100 dark:border-gray-700 ${
              isWeekend(date) ? 'bg-pink-50 dark:bg-[#171e29]' : 'bg-white dark:bg-gray-800'
            }`}>
              {timeSlots.map(hour => {
                const slotDate = new Date(date);
                slotDate.setHours(hour, 0, 0, 0);
                const isPastSlot = isDateInPast(slotDate);
                const isDragOver = dragOverDate?.getTime() === slotDate.getTime();
                
                return (
                  <div 
                    key={hour} 
                    className={`h-16 border-t border-gray-100 dark:border-gray-700 transition-colors duration-200 ${
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
          ))}
        </div>
        
        {/* Floating Events */}
        <div className="absolute top-0 left-16 right-0 bottom-0 pointer-events-none">
          {weekData.map((date, dayIndex) => {
            const dayEvents = getEventsForDate(events, date).filter(event => !event.allDay && !isMultiDayEvent(event) && event.end.getHours() >= 7 && event.start.getHours() <= 20);
            if (dayEvents.length === 0) return null;
            
            // Sort events by start time
            const sortedEvents = dayEvents.sort((a, b) => a.start.getTime() - b.start.getTime());
            
            // Calculate overlaps and positions
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
              
              const topPosition = ((startHour - 7) * 64) + (startMinutes / 60 * 64);
              const duration = (endHour - startHour) + ((endMinutes - startMinutes) / 60);
              const height = Math.max(duration * 64, 20);
              const calendar = calendars.find(c => c.id === event.calendarId);
              const styles = eventColorStyles[calendar?.color || 'bg-gray-400'];
              const isDragging = draggedEvent?.id === event.id;
              
              const eventWidth = (100 / 7) / totalOverlapping;
              const eventLeft = (100 / 7) * dayIndex + (eventWidth * eventIndex);
              
              return (
                <div
                  key={event.id}
                  onClick={() => onEventClick(event)}
                  className={`absolute pointer-events-auto p-2 rounded-lg cursor-move transition-all duration-200 ${styles.bg} border-l-4 ${styles.border} ${styles.bgHover} ${
                    isDragging ? 'opacity-60 scale-95 z-50' : 'hover:shadow-md'
                  }`}
                  style={{
                    top: `${topPosition}px`,
                    left: `calc(${eventLeft}% + 4px)`,
                    width: `calc(${eventWidth}% - 8px)`,
                    height: `${height}px`
                  }}
                  draggable
                  onDragStart={(e: any) => onDragStart(e, event)}
                  onDragEnd={(e: any) => onDragEnd(e)}
                >
                  <div className="overflow-hidden">
                    <p className={`text-xs truncate ${styles.text}`}>{event.start.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                    <p className={`text-sm font-semibold truncate ${styles.text}`}>{event.title}</p>
                  </div>
                </div>
              );
            });
          })}
        </div>
      </div>
    </div>
  );
};
