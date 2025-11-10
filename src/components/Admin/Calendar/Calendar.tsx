import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { ArrowLeft, Plus, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';

// Import hooks
import { useCalendarData } from './hooks/useCalendarData';
import { useCalendarState } from './hooks/useCalendarState';
import { useDragAndDrop } from './hooks/useDragAndDrop';

// Import components
import { Sidebar } from './components/Sidebar';
import { MonthView } from './components/MonthView';
import { WeekView } from './components/WeekView';
import { DayView } from './components/DayView';
import { AgendaView } from './components/AgendaView';
import { EventForm } from './components/EventForm';
import { CalendarForm } from './components/CalendarForm';
import { EventDetailModal } from './components/EventDetailModal';
import { DeleteEventModal, DeleteCalendarModal } from './components/DeleteConfirmationModals';

// Import types and utils
import type { CalendarProps, EventFormData, CalendarEvent } from './types';
import { isDateInPast, monthNames } from './utils';

export function Calendar({ onBack }: CalendarProps) {
  // Data hooks
  const {
    events,
    calendars,
    combinedStaffUsers,
    loading,
    saveEvent,
    updateEvent,
    deleteEvent,
    saveCalendarCategory,
    updateCalendarCategory,
    deleteCalendarCategory,
  } = useCalendarData();

  // State hooks
  const {
    calendarState,
    modalStates,
    sidebarState,
    newEvent,
    newCalendar,
    updateCalendarState,
    updateModalStates,
    updateSidebarState,
    setNewEvent,
    setNewCalendar,
    goToPrevious,
    goToNext,
    goToToday,
    openEventForm,
    closeEventForm,
    openCalendarForm,
    closeCalendarForm,
    openEventDetailModal,
    closeEventDetailModal,
    openDeleteEventModal,
    closeDeleteEventModal,
    openDeleteCalendarModal,
    closeDeleteCalendarModal,
  } = useCalendarState();

  // Drag and drop state
  const [draggedEvent, setDraggedEvent] = useState<CalendarEvent | null>(null);
  const [dragOverDate, setDragOverDate] = useState<Date | null>(null);

  // Drag and drop hook
  const dragAndDropHandlers = useDragAndDrop({
    draggedEvent,
    setDraggedEvent,
    dragOverDate,
    setDragOverDate,
    updateEvent,
    view: calendarState.view,
  });

  // Event handlers
  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();

    if (calendarState.editingEvent) {
      const updatedEventData: Partial<EventFormData> = {
        title: newEvent.title || '',
        start: newEvent.allDay ? new Date(new Date(newEvent.start!).setHours(7,0,0,0)) : newEvent.start || new Date(),
        end: newEvent.allDay ? new Date(new Date(newEvent.start!).setHours(21,0,0,0)) : newEvent.end || new Date(),
        allDay: newEvent.allDay || false,
        location: newEvent.location || '',
        notes: newEvent.notes || '',
        calendarId: newEvent.calendarId || calendars[0]?.id || '',
        assigned_to: newEvent.assigned_to || []
      };
      await updateEvent(calendarState.editingEvent.id, updatedEventData);
    } else {
      const eventData: Partial<EventFormData> = {
        title: newEvent.title || '',
        start: newEvent.allDay ? new Date(new Date(newEvent.start!).setHours(7,0,0,0)) : newEvent.start || new Date(),
        end: newEvent.allDay ? new Date(new Date(newEvent.start!).setHours(21,0,0,0)) : newEvent.end || new Date(),
        allDay: newEvent.allDay || false,
        location: newEvent.location || '',
        notes: newEvent.notes || '',
        calendarId: newEvent.calendarId || calendars[0]?.id || '',
        assigned_to: newEvent.assigned_to || []
      };
      await saveEvent(eventData);
    }
    
    closeEventForm();
  };

  const handleUpdateCalendar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (calendarState.editingCalendar) {
      await updateCalendarCategory(calendarState.editingCalendar.id, newCalendar);
    } else {
      await saveCalendarCategory(newCalendar);
    }
    
    closeCalendarForm();
  };

  const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartTime = new Date(e.target.value);
    const currentEndTime = newEvent.end || newStartTime;
    
    // If end time is same or before start time, set end time to 1 hour after start
    let newEndTime = currentEndTime;
    if (currentEndTime <= newStartTime) {
      newEndTime = new Date(newStartTime.getTime() + 60 * 60 * 1000); // Add 1 hour
    }
    
    setNewEvent({ 
      ...newEvent, 
      start: newStartTime,
      end: newEndTime
    });
  };

  const handleDateClick = (date: Date) => {
    // Prevent adding events on past dates
    if (isDateInPast(date)) {
      return; // Do nothing if date is in the past
    }
    
    updateCalendarState({ selectedDate: date });
    // Create new date objects at local time to avoid timezone issues
    const startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 9, 0); // Default 9 AM
    const endDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 10, 0); // Default 10 AM
    setNewEvent({
      ...newEvent,
      start: startDate,
      end: endDate,
      allDay: false,
      calendarId: calendars[0]?.id || ''
    });
    openEventForm();
  };

  const handleDeleteEvent = async (eventId: string) => {
    await deleteEvent(eventId);
    closeDeleteEventModal();
    closeEventDetailModal();
  };

  const handleDeleteCalendar = async (calendarId: string) => {
    // Don't delete if it's the last calendar
    if (calendars.length <= 1) return;
    await deleteCalendarCategory(calendarId);
    closeDeleteCalendarModal();
  };

  // Set default calendar for new events when calendars change
  React.useEffect(() => {
    if (calendars.length > 0 && !newEvent.calendarId) {
      setNewEvent(prev => ({ ...prev, calendarId: calendars[0].id }));
    }
  }, [calendars, newEvent.calendarId, setNewEvent]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading calendar...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header and Breadcrumb */}
      <div className="px-0 py-0">
        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-white">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-900 dark:text-white dark:hover:text-gray-200"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Company Section
          </button>
        </div>
        <br />
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Calendar</h2>
      </div>

      {/* Main Calendar Layout */}
      <div className="flex relative rounded-lg overflow-hidden">
        <Sidebar
          isCollapsed={sidebarState.sidebarCollapsed}
          onToggle={() => updateSidebarState({ sidebarCollapsed: !sidebarState.sidebarCollapsed })}
          currentDate={calendarState.currentDate}
          events={events}
          calendars={calendars}
          onDateClick={handleDateClick}
          onPreviousMonth={goToPrevious}
          onNextMonth={goToNext}
          onEditCalendar={(calendar) => openCalendarForm(calendar)}
          onDeleteCalendar={(calendar) => openDeleteCalendarModal(calendar)}
          onAddCalendar={() => openCalendarForm()}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Main Calendar */}
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
              <h2 className="text-xl font-semibold text-gray-800 sm:pl-[87px]">
                {monthNames[calendarState.currentDate.getMonth()]} {calendarState.currentDate.getFullYear()}
              </h2>

              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-6 w-full sm:w-auto">
                <div className="flex items-center space-x-1 border border-gray-300 rounded-md p-1">
                  <button onClick={goToPrevious} className="p-1 rounded-md hover:bg-gray-100">
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                  </button>
                  <button onClick={goToToday} className="px-3 py-1 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md">
                    Today
                  </button>
                  <button onClick={goToNext} className="p-1 rounded-md hover:bg-gray-100">
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <button
                      onClick={() => updateSidebarState({ isViewDropdownOpen: !sidebarState.isViewDropdownOpen })}
                      className="flex items-center space-x-2 px-3 py-2 text-sm font-semibold border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                    >
                      <span className="capitalize">{calendarState.view}</span>
                      <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    </button>
                    {sidebarState.isViewDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg z-20 border">
                        <button onClick={() => { updateCalendarState({ view: 'day' }); updateSidebarState({ isViewDropdownOpen: false }); }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Day</button>
                        <button onClick={() => { updateCalendarState({ view: 'week' }); updateSidebarState({ isViewDropdownOpen: false }); }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Week</button>
                        <button onClick={() => { updateCalendarState({ view: 'month' }); updateSidebarState({ isViewDropdownOpen: false }); }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Month</button>
                        <button onClick={() => { updateCalendarState({ view: 'agenda' }); updateSidebarState({ isViewDropdownOpen: false }); }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Agenda</button>
                      </div>
                    )}
                  </div>
                  
                  <button
                    onClick={() => openEventForm()}
                    className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm font-semibold w-full sm:w-auto justify-center"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Event
                  </button>
                </div>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="flex-1 p-6 overflow-y-auto bg-white">
              {calendarState.view === 'month' && (
                <MonthView
                  currentDate={calendarState.currentDate}
                  events={events}
                  calendars={calendars}
                  draggedEvent={draggedEvent}
                  dragOverDate={dragOverDate}
                  onDateClick={handleDateClick}
                  onEventClick={openEventDetailModal}
                  onDragStart={dragAndDropHandlers.handleDragStart}
                  onDragEnd={dragAndDropHandlers.handleDragEnd}
                  onDragOver={dragAndDropHandlers.handleDragOver}
                  onDragLeave={dragAndDropHandlers.handleDragLeave}
                  onDrop={dragAndDropHandlers.handleDrop}
                />
              )}

              {calendarState.view === 'week' && (
                <WeekView
                  currentDate={calendarState.currentDate}
                  events={events}
                  calendars={calendars}
                  draggedEvent={draggedEvent}
                  dragOverDate={dragOverDate}
                  onDateClick={handleDateClick}
                  onEventClick={openEventDetailModal}
                  onDragStart={dragAndDropHandlers.handleDragStart}
                  onDragEnd={dragAndDropHandlers.handleDragEnd}
                  onDragOver={dragAndDropHandlers.handleDragOver}
                  onDragLeave={dragAndDropHandlers.handleDragLeave}
                  onDrop={dragAndDropHandlers.handleDrop}
                />
              )}

              {calendarState.view === 'day' && (
                <DayView
                  currentDate={calendarState.currentDate}
                  events={events}
                  calendars={calendars}
                  draggedEvent={draggedEvent}
                  dragOverDate={dragOverDate}
                  onDateClick={handleDateClick}
                  onEventClick={openEventDetailModal}
                  onDragStart={dragAndDropHandlers.handleDragStart}
                  onDragEnd={dragAndDropHandlers.handleDragEnd}
                  onDragOver={dragAndDropHandlers.handleDragOver}
                  onDragLeave={dragAndDropHandlers.handleDragLeave}
                  onDrop={dragAndDropHandlers.handleDrop}
                />
              )}

              {calendarState.view === 'agenda' && (
                <AgendaView
                  currentDate={calendarState.currentDate}
                  events={events}
                  calendars={calendars}
                  agendaDays={calendarState.agendaDays}
                  onEventClick={openEventDetailModal}
                  onLoadMore={() => updateCalendarState({ agendaDays: calendarState.agendaDays + 7 })}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <EventDetailModal
        isOpen={modalStates.showEventDetailModal}
        event={calendarState.selectedEvent}
        calendars={calendars}
        onClose={closeEventDetailModal}
        onEdit={(event) => {
          closeEventDetailModal();
          openEventForm(event);
        }}
        onDelete={openDeleteEventModal}
      />

      {modalStates.showEventForm && createPortal(
        <EventForm
          isOpen={modalStates.showEventForm}
          onClose={closeEventForm}
          onSubmit={handleAddEvent}
          newEvent={newEvent}
          setNewEvent={setNewEvent}
          calendars={calendars}
          combinedStaffUsers={combinedStaffUsers}
          editingEvent={calendarState.editingEvent}
          onStartTimeChange={handleStartTimeChange}
        />,
        document.body
      )}

      {modalStates.showCalendarForm && createPortal(
        <CalendarForm
          isOpen={modalStates.showCalendarForm}
          onClose={closeCalendarForm}
          onSubmit={handleUpdateCalendar}
          newCalendar={newCalendar}
          setNewCalendar={setNewCalendar}
          editingCalendar={calendarState.editingCalendar}
        />,
        document.body
      )}

      <DeleteEventModal
        isOpen={modalStates.showDeleteEventModal}
        event={calendarState.eventToDelete}
        onClose={closeDeleteEventModal}
        onConfirm={handleDeleteEvent}
      />

      <DeleteCalendarModal
        isOpen={modalStates.showDeleteCalendarModal}
        calendar={calendarState.calendarToDelete}
        onClose={closeDeleteCalendarModal}
        onConfirm={handleDeleteCalendar}
      />
    </div>
  );
}
