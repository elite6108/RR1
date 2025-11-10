export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
  location?: string;
  notes?: string;
  calendarId: string;
  assigned_to?: number[];
}

export interface CalendarCategory {
  id: string;
  name: string;
  color: string;
}

export interface CalendarProps {
  onBack: () => void;
}

export interface StaffMember {
  id: number;
  name: string;
  position: string;
}

export interface User {
  id: string;
  full_name: string;
  email: string;
}

export interface CombinedStaffUser {
  id: string;
  name: string;
  type: 'staff' | 'user';
  original_id: string | number;
  email: string;
  position?: string;
}

export type ViewType = 'day' | 'week' | 'month' | 'agenda';

export interface EventColorStyle {
  bg: string;
  border: string;
  text: string;
  bgHover: string;
}

export interface EventColorStyles {
  [key: string]: EventColorStyle;
}

export interface EventFormData {
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
  location: string;
  notes: string;
  calendarId: string;
  assigned_to: number[];
}

export interface CalendarFormData {
  name: string;
  color: string;
}

// Drag and drop types
export interface DragState {
  draggedEvent: CalendarEvent | null;
  dragOverDate: Date | null;
}

// Modal states
export interface ModalStates {
  showEventForm: boolean;
  showCalendarForm: boolean;
  showEventDetailModal: boolean;
  showDeleteCalendarModal: boolean;
  showDeleteEventModal: boolean;
}

// Sidebar state
export interface SidebarState {
  sidebarCollapsed: boolean;
  isViewDropdownOpen: boolean;
}

// Calendar state
export interface CalendarState {
  currentDate: Date;
  view: ViewType;
  selectedDate: Date;
  agendaDays: number;
  editingEvent: CalendarEvent | null;
  selectedEvent: CalendarEvent | null;
  calendarToDelete: CalendarCategory | null;
  eventToDelete: CalendarEvent | null;
  editingCalendar: CalendarCategory | null;
}
