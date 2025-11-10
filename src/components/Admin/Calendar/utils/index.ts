import type { CalendarEvent, CalendarCategory, EventColorStyles } from '../types';

// Helper function to generate consistent user ID hash
export const getUserIdHash = (userId: string): number => {
  const hash = Math.abs(userId.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0));
  return -hash; // Return negative to distinguish from staff IDs
};

// Helper function to check if a date is in the past
export const isDateInPast = (date: Date): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const checkDate = new Date(date);
  checkDate.setHours(0, 0, 0, 0);
  return checkDate < today;
};

// Convert date to local ISO string for datetime-local inputs
export const toLocalISOString = (date: Date): string => {
  const pad = (num: number) => num.toString().padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

// Format date for iCalendar format (YYYYMMDDTHHMMSSZ)
export const formatDateForICS = (date: Date): string => {
  const utcDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
  return utcDate.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
};

// Check if date is weekend (Saturday or Sunday)
export const isWeekend = (date: Date): boolean => {
  const day = date.getDay();
  return day === 0 || day === 6; // Sunday = 0, Saturday = 6
};

// Get time slots for week/day view
export const getTimeSlots = (): number[] => {
  const slots = [];
  for (let hour = 7; hour <= 20; hour++) {
    slots.push(hour);
  }
  return slots;
};

// Format time for display
export const formatTime = (hour: number): string => {
  if (hour === 0) return '12 AM';
  if (hour === 12) return '12 PM';
  if (hour < 12) return `${hour} AM`;
  return `${hour - 12} PM`;
};

// Check if event spans multiple days
export const isMultiDayEvent = (event: CalendarEvent): boolean => {
  const startDate = new Date(event.start);
  const endDate = new Date(event.end);
  return startDate.toDateString() !== endDate.toDateString();
};

// Check if this is the first day the event appears
export const isEventStartDate = (event: CalendarEvent, date: Date): boolean => {
  const eventStart = new Date(event.start);
  return eventStart.toDateString() === date.toDateString();
};

// Get calendar month data (starting Monday)
export const getMonthData = (currentDate: Date): Date[] => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const startDate = new Date(firstDay);
  
  const dayOfWeek = firstDay.getDay(); // 0=Sun, 1=Mon
  const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  startDate.setDate(startDate.getDate() - daysToSubtract);
  
  const days = [];
  const currentDay = new Date(startDate);
  
  for (let i = 0; i < 42; i++) { // 6 weeks for a complete view
    days.push(new Date(currentDay));
    currentDay.setDate(currentDay.getDate() + 1);
  }
  
  return days;
};

// Get week data (starting Monday for week view)
export const getWeekData = (currentDate: Date): Date[] => {
  const startOfWeek = new Date(currentDate);
  const day = startOfWeek.getDay();
  const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
  startOfWeek.setDate(diff);
  
  const days = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);
    days.push(day);
  }
  return days;
};

// Get events for a specific date
export const getEventsForDate = (events: CalendarEvent[], date: Date): CalendarEvent[] => {
  return events.filter(event => {
    const eventStart = new Date(event.start);
    const eventEnd = new Date(event.end);
    const dateStart = new Date(date);
    dateStart.setHours(0, 0, 0, 0);
    const dateEnd = new Date(date);
    dateEnd.setHours(23, 59, 59, 999);
    
    return (eventStart <= dateEnd && eventEnd >= dateStart);
  });
};

// Get events for a specific date and hour
export const getEventsForDateAndHour = (events: CalendarEvent[], date: Date, hour: number): CalendarEvent[] => {
  return events.filter(event => {
    const eventDate = new Date(event.start);
    const eventHour = eventDate.getHours();
    const eventEndDate = new Date(event.end);
    const eventEndHour = eventEndDate.getHours();
    
    return eventDate.toDateString() === date.toDateString() && 
           (event.allDay || (eventHour <= hour && hour <= eventEndHour));
  });
};

// Generate iCalendar (.ics) content
export const generateICSContent = (events: CalendarEvent[], calendars: CalendarCategory[]): string => {
  let icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Calendar App//Calendar Events//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH'
  ];

  events.forEach(event => {
    const calendar = calendars.find(c => c.id === event.calendarId);
    const now = new Date();
    
    icsContent.push(
      'BEGIN:VEVENT',
      `UID:${event.id}@calendar-app.com`,
      `DTSTAMP:${formatDateForICS(now)}`,
      `CREATED:${formatDateForICS(now)}`,
      `LAST-MODIFIED:${formatDateForICS(now)}`,
      `SUMMARY:${event.title.replace(/,/g, '\\,').replace(/;/g, '\\;').replace(/\n/g, '\\n')}`,
      event.allDay 
        ? `DTSTART;VALUE=DATE:${event.start.toISOString().split('T')[0].replace(/-/g, '')}`
        : `DTSTART:${formatDateForICS(event.start)}`,
      event.allDay 
        ? `DTEND;VALUE=DATE:${event.end.toISOString().split('T')[0].replace(/-/g, '')}`
        : `DTEND:${formatDateForICS(event.end)}`
    );

    if (event.location) {
      icsContent.push(`LOCATION:${event.location.replace(/,/g, '\\,').replace(/;/g, '\\;').replace(/\n/g, '\\n')}`);
    }

    if (event.notes) {
      icsContent.push(`DESCRIPTION:${event.notes.replace(/,/g, '\\,').replace(/;/g, '\\;').replace(/\n/g, '\\n')}`);
    }

    if (calendar) {
      icsContent.push(`CATEGORIES:${calendar.name.replace(/,/g, '\\,').replace(/;/g, '\\;')}`);
    }

    icsContent.push('END:VEVENT');
  });

  icsContent.push('END:VCALENDAR');
  return icsContent.join('\r\n');
};

// Download .ics file
export const downloadICSFile = (events: CalendarEvent[], calendars: CalendarCategory[]): void => {
  const icsContent = generateICSContent(events, calendars);
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `calendar-events-${new Date().toISOString().split('T')[0]}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Color schemes for events
export const colors = [
  'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-red-500', 
  'bg-yellow-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'
];

export const eventColorStyles: EventColorStyles = {
  'bg-blue-500': { bg: 'bg-blue-50', border: 'border-blue-500', text: 'text-blue-700', bgHover: 'hover:bg-blue-100' },
  'bg-green-500': { bg: 'bg-green-50', border: 'border-green-500', text: 'text-green-700', bgHover: 'hover:bg-green-100' },
  'bg-purple-500': { bg: 'bg-purple-50', border: 'border-purple-500', text: 'text-purple-700', bgHover: 'hover:bg-purple-100' },
  'bg-red-500': { bg: 'bg-red-50', border: 'border-red-500', text: 'text-red-700', bgHover: 'hover:bg-red-100' },
  'bg-yellow-500': { bg: 'bg-yellow-50', border: 'border-yellow-500', text: 'text-yellow-700', bgHover: 'hover:bg-yellow-100' },
  'bg-pink-500': { bg: 'bg-pink-50', border: 'border-pink-500', text: 'text-pink-700', bgHover: 'hover:bg-pink-100' },
  'bg-indigo-500': { bg: 'bg-indigo-50', border: 'border-indigo-500', text: 'text-indigo-700', bgHover: 'hover:bg-indigo-100' },
  'bg-teal-500': { bg: 'bg-teal-50', border: 'border-teal-500', text: 'text-teal-700', bgHover: 'hover:bg-teal-100' },
  'bg-gray-400': { bg: 'bg-gray-100', border: 'border-gray-400', text: 'text-gray-700', bgHover: 'hover:bg-gray-200' },
};

// Month names
export const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];
