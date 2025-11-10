import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import SpotlightCard from '../../../../styles/spotlight/SpotlightCard';

interface CalendarEvent {
  id: string;
  title: string;
  start_date: string;
  end_date: string;
  all_day: boolean;
  calendar_id: string;
  location?: string;
  notes?: string;
}

interface CalendarCategory {
  id: string;
  name: string;
  color: string;
}

interface WidgetsTopProps {
  isDarkMode: boolean;
  setShowCalendar: (show: boolean) => void;
  todaysEvents: CalendarEvent[];
  upcomingEvents: CalendarEvent[];
  calendarCategories: CalendarCategory[];
  loadingEvents: boolean;
  upcomingEventIndex: number;
  handlePrevEvent: () => void;
  handleNextEvent: () => void;
}

export function WidgetsTop({
  isDarkMode,
  setShowCalendar,
  todaysEvents = [],
  upcomingEvents = [],
  calendarCategories = [],
  loadingEvents,
  upcomingEventIndex,
  handlePrevEvent,
  handleNextEvent,
}: WidgetsTopProps) {
  const today = new Date();
  const month = today.toLocaleDateString('en-US', { month: 'short' });
  const day = today.getDate();
  const weekday = today.toLocaleDateString('en-US', { weekday: 'long' });

  // Ensure arrays are defined with fallbacks
  const safeUpcomingEvents = upcomingEvents || [];
  const safeTodaysEvents = todaysEvents || [];
  const safeCalendarCategories = calendarCategories || [];

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mb-6">
      {/* Today's Events Widget */}
      <SpotlightCard
        isDarkMode={isDarkMode}
        spotlightColor="rgba(34, 197, 94, 0.15)"
        darkSpotlightColor="rgba(34, 197, 94, 0.25)"
        size={300}
        className="bg-white dark:bg-gray-900 overflow-hidden shadow-lg rounded-2xl"
      >
        <button onClick={() => setShowCalendar(true)} className="w-full h-full text-left">
          <div className="flex h-full p-1">
            <div className="w-2/5 p-4 rounded-xl flex flex-col justify-between bg-gradient-to-br from-cyan-500/80 to-blue-600/80">
              <div>
                <p className="text-4xl font-bold text-white">{month} {day}</p>
                <p className="text-lg text-white/90 mt-2">{weekday}</p>
              </div>
              <p className="text-md text-white/90">
                {safeTodaysEvents.length} event{safeTodaysEvents.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="w-3/5 flex flex-col p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Today's Events</h3>
              <div className="flex-1 space-y-3 overflow-y-auto max-h-36 pr-2">
                {loadingEvents ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 dark:border-white"></div>
                  </div>
                ) : safeTodaysEvents.length > 0 ? (
                  safeTodaysEvents.map((event) => {
                    const category = safeCalendarCategories.find(c => c.id === event.calendar_id);
                    const startDate = new Date(event.start_date);
                    const endDate = new Date(event.end_date);
                    return (
                      <div key={event.id} className="flex items-center space-x-3">
                        <div className={`w-1 h-10 rounded-full flex-shrink-0 ${category?.color || 'bg-gray-400'}`}></div>
                        <div>
                          <p className="text-gray-900 dark:text-white font-medium text-sm truncate">{event.title}</p>
                          <p className="text-gray-500 dark:text-white/70 text-xs">
                            {event.all_day 
                              ? 'All Day' 
                              : `${startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })} - ${endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}`}
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-gray-500 dark:text-white/70 text-center">
                    No events today
                  </p>
                )}
              </div>
            </div>
          </div>
        </button>
      </SpotlightCard>

      {/* Upcoming Events Widget */}
      <SpotlightCard
        isDarkMode={isDarkMode}
        spotlightColor="rgba(59, 130, 246, 0.15)"
        darkSpotlightColor="rgba(59, 130, 246, 0.25)"
        size={300}
        className="bg-white dark:bg-gray-900 overflow-hidden shadow-lg rounded-2xl"
      >
        <div
          onClick={() => setShowCalendar(true)}
          className="w-full h-full text-left cursor-pointer p-4 flex flex-col"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Upcoming Events
            </h3>
            {safeUpcomingEvents.length > 2 && (
              <div className="flex space-x-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevEvent();
                  }}
                  disabled={upcomingEventIndex === 0}
                  className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNextEvent();
                  }}
                  disabled={
                    upcomingEventIndex >=
                    safeUpcomingEvents.length - 2
                  }
                  className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
          <div className="flex-1">
            {loadingEvents ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 dark:border-white"></div>
              </div>
            ) : safeUpcomingEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 h-full">
                {safeUpcomingEvents
                  .slice(
                    upcomingEventIndex,
                    upcomingEventIndex + 2
                  )
                  .map((event) => {
                    const category =
                      safeCalendarCategories.find(
                        (c) => c.id === event.calendar_id
                      );
                    const startDate = new Date(
                      event.start_date
                    );
                    const endDate = new Date(event.end_date);
                    return (
                      <div
                        key={event.id}
                        className="flex items-center space-x-3"
                      >
                        <div
                          className={`w-1 h-10 rounded-full flex-shrink-0 ${
                            category?.color || 'bg-gray-400'
                          }`}
                        ></div>
                        <div>
                          <p className="text-gray-900 dark:text-white font-medium text-sm truncate">
                            {event.title}
                          </p>
                          <p className="text-gray-500 dark:text-white/70 text-xs">
                            {startDate.toLocaleDateString(
                              [],
                              {
                                month: 'short',
                                day: 'numeric',
                              }
                            )}
                            {event.all_day
                              ? ''
                              : `, ${startDate.toLocaleTimeString(
                                  [],
                                  {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: false,
                                  }
                                )} - ${endDate.toLocaleTimeString(
                                  [],
                                  {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: false,
                                  }
                                )}`}
                          </p>
                        </div>
                      </div>
                    );
                  })}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-sm text-gray-500 dark:text-white/70">
                  No upcoming events
                </p>
              </div>
            )}
          </div>
        </div>
      </SpotlightCard>
    </div>
  );
}
