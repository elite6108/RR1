import React from 'react';
import { ChevronLeft, ChevronRight, Pencil, Trash2 } from 'lucide-react';
import type { CalendarEvent, CalendarCategory } from '../types';
import { getMonthData, isWeekend, isDateInPast, eventColorStyles, monthNames } from '../utils';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  currentDate: Date;
  events: CalendarEvent[];
  calendars: CalendarCategory[];
  onDateClick: (date: Date) => void;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onEditCalendar: (calendar: CalendarCategory) => void;
  onDeleteCalendar: (calendar: CalendarCategory) => void;
  onAddCalendar: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  onToggle,
  currentDate,
  events,
  calendars,
  onDateClick,
  onPreviousMonth,
  onNextMonth,
  onEditCalendar,
  onDeleteCalendar,
  onAddCalendar,
}) => {
  const miniCalendarDays = getMonthData(currentDate);

  return (
    <>
      {/* Sidebar */}
      <div className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out overflow-hidden ${isCollapsed ? 'w-0 p-0' : 'w-80 p-6'}`}>
        {/* Top Date Display */}
        <div className="mb-8">
          <h1 className="text-lg font-bold text-gray-800">
            {new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
          </h1>
          <p className="text-sm text-gray-500">
            {new Date().toLocaleDateString('en-US', { weekday: 'long' })}
          </p>
        </div>
        
        {/* Mini Calendar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h3>
            <div className="flex space-x-1">
              <button onClick={onPreviousMonth} className="p-1 hover:bg-gray-100 rounded">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button onClick={onNextMonth} className="p-1 hover:bg-gray-100 rounded">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-7 gap-y-2 text-xs text-center text-gray-500 mb-2">
            {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((day) => (
              <div key={day} className="font-medium">{day}</div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-y-2">
            {miniCalendarDays.map((date, index) => {
              const isSelected = date.toDateString() === currentDate.toDateString();
              const isCurrentMonth = date.getMonth() === currentDate.getMonth();
              const weekend = isWeekend(date);
              const isPastDate = isDateInPast(date);
              const hasEvents = events.some(event => {
                const eventDate = new Date(event.start);
                return eventDate.toDateString() === date.toDateString();
              });
              
              return (
                <button
                  key={index}
                  onClick={() => onDateClick(date)}
                  disabled={isPastDate}
                  className={`text-xs py-1 text-center w-8 h-8 rounded-full mx-auto flex items-center justify-center relative
                    ${!isCurrentMonth ? 'text-gray-300' : 'text-gray-800 dark:text-white'}
                    ${isPastDate && isCurrentMonth ? 'text-gray-400 cursor-not-allowed opacity-50' : ''}
                    ${isSelected ? 'bg-blue-600 text-white' : ''}
                    ${!isSelected && isCurrentMonth && weekend && !isPastDate ? 'bg-pink-100 dark:bg-[#171e29]' : ''}
                    ${!isSelected && isCurrentMonth && !weekend && !isPastDate ? 'hover:bg-gray-100 dark:hover:bg-gray-700' : ''}
                  `}
                >
                  {date.getDate()}
                  {hasEvents && isCurrentMonth && (
                    <div className={`absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full ${
                      isSelected ? 'bg-red-500' : 'bg-blue-500'
                    }`}></div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Calendars */}
        <div className="mb-8">
          <h3 className="uppercase text-xs font-bold text-gray-500 mb-4">Calendars</h3>
          <div className="space-y-3">
            {calendars.map(calendar => (
              <div key={calendar.id} className="flex items-center justify-between group">
                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full ${calendar.color} mr-3`}></div>
                  <span className="text-sm text-gray-700">{calendar.name}</span>
                </div>
                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100">
                  <button
                    onClick={(e) => { e.stopPropagation(); onEditCalendar(calendar); }}
                    className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded"
                    title="Edit calendar"
                  >
                    <Pencil className="w-5 h-5" />
                  </button>
                  {calendars.length > 1 && (
                    <button
                      onClick={(e) => { e.stopPropagation(); onDeleteCalendar(calendar); }}
                      className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded"
                      title="Delete calendar"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={onAddCalendar}
            className="w-full mt-4 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 text-sm font-semibold"
          >
            Add Calendars
          </button>
        </div>

        {/* Upcoming Events */}
        <div className="flex-1 flex flex-col min-h-0">
          <h3 className="uppercase text-xs font-bold text-gray-500 mb-2">Upcoming Events</h3>
          <div className="max-h-[235px] space-y-3 overflow-y-auto pr-2">
            {events
              .filter(event => {
                const now = new Date();
                const fiveDaysFromNow = new Date();
                fiveDaysFromNow.setDate(now.getDate() + 5);
                fiveDaysFromNow.setHours(23, 59, 59, 999); // End of the 5th day
                
                // Show events that:
                // 1. Start from now onwards (haven't passed yet)
                // 2. Are within the next 5 days
                return event.start >= now && event.start <= fiveDaysFromNow;
              })
              .sort((a, b) => a.start.getTime() - b.start.getTime())
              .map(event => {
                const calendar = calendars.find(c => c.id === event.calendarId);
                const styles = eventColorStyles[calendar?.color || 'bg-gray-400'];
                return (
                  <div key={event.id} className={`p-3 rounded-lg flex items-center bg-white border-l-4 ${styles.border}`}>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-800">{event.title}</p>
                      <p className="text-xs text-gray-500">
                        {event.start.toLocaleDateString([], {day: '2-digit', month: 'short', year: 'numeric'})}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        {event.allDay ? 'All Day' : `${event.start.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: false})} - ${event.end.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: false})}`}
                      </p>
                    </div>
                  </div>
                );
              })
            }
          </div>
        </div>
      </div>

      {/* Sidebar Toggle Button */}
      <button
        onClick={onToggle}
        className={`absolute top-14 -translate-y-1/2 bg-white border-2 border-gray-200 rounded-full p-0.5 z-20 hover:bg-gray-100 focus:outline-none transition-all duration-300 ease-in-out ${
          isCollapsed ? 'left-1' : 'left-80 -translate-x-1/2'
        }`}
      >
        {isCollapsed ? <ChevronRight className="w-4 h-4 text-gray-600" /> : <ChevronLeft className="w-4 h-4 text-gray-600" />}
      </button>
    </>
  );
};
