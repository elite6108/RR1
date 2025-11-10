import { useState, useEffect } from 'react';
import type { 
  CalendarEvent, 
  CalendarCategory, 
  ViewType, 
  CalendarState, 
  ModalStates, 
  SidebarState, 
  DragState,
  EventFormData,
  CalendarFormData 
} from '../types';

export const useCalendarState = () => {
  // Calendar state
  const [calendarState, setCalendarState] = useState<CalendarState>({
    currentDate: new Date(),
    view: 'month' as ViewType,
    selectedDate: new Date(),
    agendaDays: 7,
    editingEvent: null,
    selectedEvent: null,
    calendarToDelete: null,
    eventToDelete: null,
    editingCalendar: null,
  });

  // Modal states
  const [modalStates, setModalStates] = useState<ModalStates>({
    showEventForm: false,
    showCalendarForm: false,
    showEventDetailModal: false,
    showDeleteCalendarModal: false,
    showDeleteEventModal: false,
  });

  // Sidebar state
  const [sidebarState, setSidebarState] = useState<SidebarState>({
    sidebarCollapsed: false,
    isViewDropdownOpen: false,
  });

  // Drag and drop state
  const [dragState, setDragState] = useState<DragState>({
    draggedEvent: null,
    dragOverDate: null,
  });

  // Form states
  const [newEvent, setNewEvent] = useState<Partial<EventFormData>>({
    title: '',
    start: new Date(),
    end: new Date(),
    allDay: false,
    location: '',
    notes: '',
    calendarId: '',
    assigned_to: []
  });

  const [newCalendar, setNewCalendar] = useState<CalendarFormData>({ 
    name: '', 
    color: 'bg-blue-500' 
  });

  // Calendar state updaters
  const updateCalendarState = (updates: Partial<CalendarState>) => {
    setCalendarState(prev => ({ ...prev, ...updates }));
  };

  const updateModalStates = (updates: Partial<ModalStates>) => {
    setModalStates(prev => ({ ...prev, ...updates }));
  };

  const updateSidebarState = (updates: Partial<SidebarState>) => {
    setSidebarState(prev => ({ ...prev, ...updates }));
  };

  const updateDragState = (updates: Partial<DragState>) => {
    setDragState(prev => ({ ...prev, ...updates }));
  };

  // Navigation functions
  const goToPrevious = () => {
    const newDate = new Date(calendarState.currentDate);
    if (calendarState.view === 'month') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else if (calendarState.view === 'week') {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setDate(newDate.getDate() - 1);
    }
    updateCalendarState({ currentDate: newDate });
  };

  const goToNext = () => {
    const newDate = new Date(calendarState.currentDate);
    if (calendarState.view === 'month') {
      newDate.setMonth(newDate.getMonth() + 1);
    } else if (calendarState.view === 'week') {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    updateCalendarState({ currentDate: newDate });
  };

  const goToToday = () => {
    updateCalendarState({ currentDate: new Date() });
  };

  // Modal control functions
  const openEventForm = (event?: CalendarEvent) => {
    if (event) {
      updateCalendarState({ editingEvent: event });
      setNewEvent({
        ...event,
        start: event.start,
        end: event.end,
      });
    } else {
      updateCalendarState({ editingEvent: null });
    }
    updateModalStates({ showEventForm: true });
  };

  const closeEventForm = () => {
    updateModalStates({ showEventForm: false });
    updateCalendarState({ editingEvent: null });
    setNewEvent({
      title: '',
      start: new Date(),
      end: new Date(),
      allDay: false,
      location: '',
      notes: '',
      calendarId: '',
      assigned_to: []
    });
  };

  const openCalendarForm = (calendar?: CalendarCategory) => {
    if (calendar) {
      updateCalendarState({ editingCalendar: calendar });
      setNewCalendar({ name: calendar.name, color: calendar.color });
    } else {
      updateCalendarState({ editingCalendar: null });
      setNewCalendar({ name: '', color: 'bg-blue-500' });
    }
    updateModalStates({ showCalendarForm: true });
  };

  const closeCalendarForm = () => {
    updateModalStates({ showCalendarForm: false });
    updateCalendarState({ editingCalendar: null });
    setNewCalendar({ name: '', color: 'bg-blue-500' });
  };

  const openEventDetailModal = (event: CalendarEvent) => {
    updateCalendarState({ selectedEvent: event });
    updateModalStates({ showEventDetailModal: true });
  };

  const closeEventDetailModal = () => {
    updateModalStates({ showEventDetailModal: false });
    updateCalendarState({ selectedEvent: null });
  };

  const openDeleteEventModal = (event: CalendarEvent) => {
    updateCalendarState({ eventToDelete: event });
    updateModalStates({ showDeleteEventModal: true });
  };

  const closeDeleteEventModal = () => {
    updateModalStates({ showDeleteEventModal: false });
    updateCalendarState({ eventToDelete: null });
  };

  const openDeleteCalendarModal = (calendar: CalendarCategory) => {
    updateCalendarState({ calendarToDelete: calendar });
    updateModalStates({ showDeleteCalendarModal: true });
  };

  const closeDeleteCalendarModal = () => {
    updateModalStates({ showDeleteCalendarModal: false });
    updateCalendarState({ calendarToDelete: null });
  };

  // Set up body scroll lock when modals are open
  useEffect(() => {
    const body = document.body;
    const isModalOpen = modalStates.showEventDetailModal || modalStates.showEventForm || modalStates.showCalendarForm;
    
    if (isModalOpen) {
      body.style.overflow = 'hidden';
      // Scroll to top of viewport when modal opens
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      body.style.overflow = 'unset';
    }
    
    // Cleanup function to restore scroll when component unmounts
    return () => {
      body.style.overflow = 'unset';
    };
  }, [modalStates.showEventDetailModal, modalStates.showEventForm, modalStates.showCalendarForm]);

  return {
    // State
    calendarState,
    modalStates,
    sidebarState,
    dragState,
    newEvent,
    newCalendar,
    
    // State updaters
    updateCalendarState,
    updateModalStates,
    updateSidebarState,
    updateDragState,
    setNewEvent,
    setNewCalendar,
    
    // Navigation
    goToPrevious,
    goToNext,
    goToToday,
    
    // Modal controls
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
  };
};
