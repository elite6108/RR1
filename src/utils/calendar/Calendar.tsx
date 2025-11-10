import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

export interface CalendarProps {
  selectedDate: string;
  onDateSelect: (date: string) => void;
  isDisabled?: (date: Date) => boolean;
  isApproved?: (date: Date) => boolean;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function Calendar({ 
  selectedDate, 
  onDateSelect, 
  isDisabled = () => false,
  isApproved = () => false,
  placeholder = 'Select date',
  className = '',
  disabled = false
}: CalendarProps) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [buttonPosition, setButtonPosition] = useState({ top: 0, left: 0, width: 0 });
  const calendarRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Handle click outside to close calendar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node) &&
          buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setIsCalendarOpen(false);
      }
    };

    const handleResize = () => {
      if (isCalendarOpen) {
        updateButtonPosition();
      }
    };

    if (isCalendarOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('resize', handleResize);
      window.addEventListener('scroll', handleResize);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('scroll', handleResize);
      };
    }
  }, [isCalendarOpen]);

  const updateButtonPosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const calendarHeight = 350; // Approximate height of calendar
      const calendarWidth = 280; // Minimum width of calendar
      const padding = 8; // Padding from viewport edges
      
      // Use fixed positioning relative to viewport, not scroll position
      let top = rect.bottom + 8;
      let left = rect.left;
      
      // Check if calendar would go below viewport
      if (rect.bottom + calendarHeight > window.innerHeight) {
        // Position above the button instead
        top = rect.top - calendarHeight - 8;
      }
      
      // Check if calendar would go off the right edge
      if (left + calendarWidth > window.innerWidth - padding) {
        left = window.innerWidth - calendarWidth - padding;
      }
      
      // Check if calendar would go off the left edge
      if (left < padding) {
        left = padding;
      }
      
      // Ensure calendar doesn't go above viewport
      if (top < padding) {
        top = padding;
      }
      
      setButtonPosition({
        top,
        left,
        width: calendarWidth // Fixed width for calendar
      });
    }
  };

  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return placeholder;
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric'
    });
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const handleDateSelect = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    onDateSelect(dateStr);
    setIsCalendarOpen(false);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      if (direction === 'prev') {
        newMonth.setMonth(newMonth.getMonth() - 1);
      } else {
        newMonth.setMonth(newMonth.getMonth() + 1);
      }
      return newMonth;
    });
  };

  return (
    <div className={`relative ${className}`}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => {
          if (!disabled) {
            updateButtonPosition();
            setIsCalendarOpen(!isCalendarOpen);
          }
        }}
        disabled={disabled}
        className="w-full p-2 border border-gray-300 rounded-md shadow-lg-sm bg-white dark:bg-gray-700 hover:border-indigo-300 dark:hover:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-gray-900 dark:text-white text-left flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span>{formatDisplayDate(selectedDate)}</span>
        <CalendarIcon className="h-5 w-5 text-gray-400" />
      </button>

      {isCalendarOpen && createPortal(
        <div 
          ref={calendarRef}
          className="fixed z-[9999] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl p-4 min-w-[280px] max-w-[90vw] max-h-[80vh] overflow-auto"
          style={{
            top: `${buttonPosition.top}px`,
            left: `${buttonPosition.left}px`,
            width: `${buttonPosition.width}px`
          }}
        >
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={() => navigateMonth('prev')}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ChevronLeft className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </button>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h3>
            <button
              type="button"
              onClick={() => navigateMonth('next')}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ChevronRight className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          {/* Days of Week Header */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
              <div key={day} className={`text-center text-xs font-medium py-2 ${
                index === 0 || index === 6 
                  ? 'text-red-600 dark:text-red-400' 
                  : 'text-gray-500 dark:text-gray-400'
              }`}>
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1">
            {getDaysInMonth(currentMonth).map((date, index) => {
              if (!date) {
                return <div key={index} className="h-8 w-8"></div>;
              }

              const isSelected = selectedDate === date.toISOString().split('T')[0];
              const isDateDisabledForDate = isDisabled(date);
              const isDateApproved = isApproved(date);
              const isToday = date.toDateString() === new Date().toDateString();
              const isWeekend = date.getDay() === 0 || date.getDay() === 6; // Sunday = 0, Saturday = 6

              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => !isDateDisabledForDate && !isDateApproved && handleDateSelect(date)}
                  disabled={isDateDisabledForDate}
                  className={`h-8 w-8 text-sm rounded-lg transition-colors relative ${
                    isSelected
                      ? 'bg-indigo-600 text-white'
                      : isToday
                      ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400'
                      : isDateDisabledForDate
                      ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                      : isDateApproved
                      ? 'text-orange-600 dark:text-orange-400 cursor-not-allowed bg-orange-50 dark:bg-orange-900/20'
                      : isWeekend
                      ? 'text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <span className={isDateApproved ? 'line-through' : ''}>
                    {date.getDate()}
                  </span>
                </button>
              );
            })}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

// DateTime Calendar Component with time support
export interface DateTimeCalendarProps {
  selectedDateTime: string; // ISO string or datetime-local format
  onDateTimeSelect: (dateTime: string) => void;
  isDisabled?: (date: Date) => boolean;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function DateTimeCalendar({ 
  selectedDateTime, 
  onDateTimeSelect, 
  isDisabled = () => false,
  placeholder = 'Select date and time',
  className = '',
  disabled = false
}: DateTimeCalendarProps) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [buttonPosition, setButtonPosition] = useState({ top: 0, left: 0, width: 0 });
  const [selectedTime, setSelectedTime] = useState('09:00');
  const calendarRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Initialize time from selectedDateTime
  useEffect(() => {
    if (selectedDateTime) {
      const date = new Date(selectedDateTime);
      if (!isNaN(date.getTime())) {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        setSelectedTime(`${hours}:${minutes}`);
      }
    }
  }, [selectedDateTime]);

  // Handle click outside to close calendar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node) &&
          buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setIsCalendarOpen(false);
      }
    };

    const handleResize = () => {
      if (isCalendarOpen) {
        updateButtonPosition();
      }
    };

    if (isCalendarOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('resize', handleResize);
      window.addEventListener('scroll', handleResize);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('scroll', handleResize);
      };
    }
  }, [isCalendarOpen]);

  const updateButtonPosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const calendarHeight = 420; // Taller to accommodate time inputs
      const calendarWidth = 320; // Wider for time inputs
      const padding = 8;
      
      // Use fixed positioning relative to viewport, not scroll position
      let top = rect.bottom + 8;
      let left = rect.left;
      
      if (rect.bottom + calendarHeight > window.innerHeight) {
        top = rect.top - calendarHeight - 8;
      }
      
      if (left + calendarWidth > window.innerWidth - padding) {
        left = window.innerWidth - calendarWidth - padding;
      }
      
      if (left < padding) {
        left = padding;
      }
      
      if (top < padding) {
        top = padding;
      }
      
      setButtonPosition({
        top,
        left,
        width: calendarWidth
      });
    }
  };

  const formatDisplayDateTime = (dateTimeStr: string) => {
    if (!dateTimeStr) return placeholder;
    const date = new Date(dateTimeStr);
    if (isNaN(date.getTime())) return placeholder;
    
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric'
    }) + ' ' + date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const handleDateSelect = (date: Date) => {
    const [hours, minutes] = selectedTime.split(':');
    const newDateTime = new Date(date);
    newDateTime.setHours(parseInt(hours), parseInt(minutes));
    
    // Convert to datetime-local format
    const year = newDateTime.getFullYear();
    const month = String(newDateTime.getMonth() + 1).padStart(2, '0');
    const day = String(newDateTime.getDate()).padStart(2, '0');
    const hour = String(newDateTime.getHours()).padStart(2, '0');
    const minute = String(newDateTime.getMinutes()).padStart(2, '0');
    
    const datetimeLocalString = `${year}-${month}-${day}T${hour}:${minute}`;
    onDateTimeSelect(datetimeLocalString);
    setIsCalendarOpen(false);
  };

  const handleTimeChange = (newTime: string) => {
    setSelectedTime(newTime);
    
    if (selectedDateTime) {
      const currentDate = new Date(selectedDateTime);
      if (!isNaN(currentDate.getTime())) {
        const [hours, minutes] = newTime.split(':');
        currentDate.setHours(parseInt(hours), parseInt(minutes));
        
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        const hour = String(currentDate.getHours()).padStart(2, '0');
        const minute = String(currentDate.getMinutes()).padStart(2, '0');
        
        const datetimeLocalString = `${year}-${month}-${day}T${hour}:${minute}`;
        onDateTimeSelect(datetimeLocalString);
      }
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      if (direction === 'prev') {
        newMonth.setMonth(newMonth.getMonth() - 1);
      } else {
        newMonth.setMonth(newMonth.getMonth() + 1);
      }
      return newMonth;
    });
  };

  return (
    <div className={`relative ${className}`}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => {
          if (!disabled) {
            updateButtonPosition();
            setIsCalendarOpen(!isCalendarOpen);
          }
        }}
        disabled={disabled}
        className="w-full p-2 border border-gray-300 rounded-md shadow-lg-sm bg-white dark:bg-gray-700 hover:border-indigo-300 dark:hover:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-gray-900 dark:text-white text-left flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span>{formatDisplayDateTime(selectedDateTime)}</span>
        <CalendarIcon className="h-5 w-5 text-gray-400" />
      </button>

      {isCalendarOpen && createPortal(
        <div 
          ref={calendarRef}
          className="fixed z-[9999] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl p-4 min-w-[320px] max-w-[90vw] max-h-[80vh] overflow-auto"
          style={{
            top: `${buttonPosition.top}px`,
            left: `${buttonPosition.left}px`,
            width: `${buttonPosition.width}px`
          }}
        >
          {/* Time Selection */}
          <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Time
            </label>
            <div className="flex items-center justify-center space-x-2">
              {/* Hours */}
              <div className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => {
                    const [hours, minutes] = selectedTime.split(':');
                    const newHours = (parseInt(hours) + 1) % 24;
                    handleTimeChange(`${newHours.toString().padStart(2, '0')}:${minutes}`);
                  }}
                  className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors"
                >
                  <ChevronRight className="h-4 w-4 text-gray-600 dark:text-gray-400 rotate-[-90deg]" />
                </button>
                <div className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-center min-w-[50px] font-mono text-lg font-semibold text-gray-900 dark:text-white">
                  {selectedTime.split(':')[0]}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const [hours, minutes] = selectedTime.split(':');
                    const newHours = parseInt(hours) - 1 < 0 ? 23 : parseInt(hours) - 1;
                    handleTimeChange(`${newHours.toString().padStart(2, '0')}:${minutes}`);
                  }}
                  className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors"
                >
                  <ChevronRight className="h-4 w-4 text-gray-600 dark:text-gray-400 rotate-[90deg]" />
                </button>
              </div>
              
              {/* Separator */}
              <div className="text-xl font-bold text-gray-400 dark:text-gray-500">:</div>
              
              {/* Minutes */}
              <div className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => {
                    const [hours, minutes] = selectedTime.split(':');
                    const newMinutes = (parseInt(minutes) + 15) % 60;
                    handleTimeChange(`${hours}:${newMinutes.toString().padStart(2, '0')}`);
                  }}
                  className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors"
                >
                  <ChevronRight className="h-4 w-4 text-gray-600 dark:text-gray-400 rotate-[-90deg]" />
                </button>
                <div className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-center min-w-[50px] font-mono text-lg font-semibold text-gray-900 dark:text-white">
                  {selectedTime.split(':')[1]}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const [hours, minutes] = selectedTime.split(':');
                    const newMinutes = parseInt(minutes) - 15 < 0 ? 45 : parseInt(minutes) - 15;
                    handleTimeChange(`${hours}:${newMinutes.toString().padStart(2, '0')}`);
                  }}
                  className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors"
                >
                  <ChevronRight className="h-4 w-4 text-gray-600 dark:text-gray-400 rotate-[90deg]" />
                </button>
              </div>
            </div>
          </div>

          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={() => navigateMonth('prev')}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ChevronLeft className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </button>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h3>
            <button
              type="button"
              onClick={() => navigateMonth('next')}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ChevronRight className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          {/* Days of Week Header */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
              <div key={day} className={`text-center text-xs font-medium py-2 ${
                index === 0 || index === 6 
                  ? 'text-red-600 dark:text-red-400' 
                  : 'text-gray-500 dark:text-gray-400'
              }`}>
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1">
            {getDaysInMonth(currentMonth).map((date, index) => {
              if (!date) {
                return <div key={index} className="h-8 w-8"></div>;
              }

              const dateStr = selectedDateTime ? new Date(selectedDateTime).toISOString().split('T')[0] : '';
              const isSelected = dateStr === date.toISOString().split('T')[0];
              const isDateDisabledForDate = isDisabled(date);
              const isToday = date.toDateString() === new Date().toDateString();
              const isWeekend = date.getDay() === 0 || date.getDay() === 6;

              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => !isDateDisabledForDate && handleDateSelect(date)}
                  disabled={isDateDisabledForDate}
                  className={`h-8 w-8 text-sm rounded-lg transition-colors ${
                    isSelected
                      ? 'bg-indigo-600 text-white'
                      : isToday
                      ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400'
                      : isDateDisabledForDate
                      ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                      : isWeekend
                      ? 'text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

export default Calendar;
