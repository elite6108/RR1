import React from 'react';
import type { CalendarEvent, CalendarCategory } from '../types';

interface AgendaViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  calendars: CalendarCategory[];
  agendaDays: number;
  onEventClick: (event: CalendarEvent) => void;
  onLoadMore: () => void;
}

export const AgendaView: React.FC<AgendaViewProps> = ({
  currentDate,
  events,
  calendars,
  agendaDays,
  onEventClick,
  onLoadMore,
}) => {
  const fromDate = new Date(currentDate);
  fromDate.setHours(0, 0, 0, 0);

  const agendaDates = [];
  for (let i = 0; i < agendaDays; i++) {
    const day = new Date(fromDate);
    day.setDate(fromDate.getDate() + i);
    agendaDates.push(day);
  }
  
  const agendaData = agendaDates.map(date => {
    const dayEvents = events
      .filter(event => new Date(event.start).toDateString() === date.toDateString())
      .sort((a, b) => a.start.getTime() - b.start.getTime());
    return { date, events: dayEvents };
  });

  return (
    <div className="bg-white dark:bg-gray-800 p-6 overflow-auto">
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {agendaData.map(({ date, events }) => (
          <div key={date.toISOString()} className="py-6">
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
              {date.toLocaleDateString('en-US', { weekday: 'long' })}
              <span className="text-gray-500 dark:text-gray-400 font-normal">, {date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</span>
            </h3>
            {events.length > 0 ? (
              <div className="mt-4 w-full divide-y divide-gray-100 dark:divide-gray-700">
                {events.map(event => {
                  const calendar = calendars.find(c => c.id === event.calendarId);
                  return (
                    <div key={event.id} className="group cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 py-4" onClick={() => onEventClick(event)}>
                      <div className="flex items-center space-x-3">
                        <div className={`w-1.5 h-10 rounded-full flex-shrink-0 ${calendar?.color}`}></div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {event.allDay ? 'All Day' : `${event.start.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })} - ${event.end.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`}
                          </p>
                          <p className="font-semibold text-gray-900 dark:text-white">{event.title}</p>
                          {event.location && <p className="text-sm text-gray-500 dark:text-gray-400">{event.location}</p>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="mt-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">No events scheduled.</p>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-6">
        <button
          onClick={onLoadMore}
          className="w-full bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 text-sm font-semibold"
        >
          Load 7 more days
        </button>
      </div>
    </div>
  );
};
