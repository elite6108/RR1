import { useState, useEffect } from 'react';
import { supabase } from '../../../../lib/supabase';
import type { CalendarEvent, CalendarCategory, StaffMember, User, CombinedStaffUser } from '../types';
import { getUserIdHash } from '../utils';

export const useCalendarData = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [calendars, setCalendars] = useState<CalendarCategory[]>([]);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [combinedStaffUsers, setCombinedStaffUsers] = useState<CombinedStaffUser[]>([]);
  const [loading, setLoading] = useState(true);

  // Load calendar categories from Supabase
  const loadCalendarCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('calendar_categories')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;

      const categories: CalendarCategory[] = data.map(cat => ({
        id: cat.id,
        name: cat.name,
        color: cat.color
      }));

      setCalendars(categories);
      return categories;
    } catch (error) {
      console.error('Error loading calendar categories:', error);
      return [];
    }
  };

  // Load events from Supabase
  const loadEvents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('calendar')
        .select('*')
        .order('start_date', { ascending: true });

      if (error) throw error;

      const eventsData: CalendarEvent[] = data.map(event => ({
        id: event.id,
        title: event.title,
        start: new Date(event.start_date),
        end: new Date(event.end_date),
        allDay: event.all_day,
        location: event.location || '',
        notes: event.notes || '',
        calendarId: event.calendar_id,
        assigned_to: event.assigned_to || []
      }));

      setEvents(eventsData);
      return eventsData;
    } catch (error) {
      console.error('Error loading events:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Save event to Supabase
  const saveEvent = async (eventData: Partial<CalendarEvent>) => {
    try {
      const { data, error } = await supabase
        .from('calendar')
        .insert([{
          title: eventData.title,
          calendar_id: eventData.calendarId,
          all_day: eventData.allDay,
          start_date: eventData.start?.toISOString(),
          end_date: eventData.end?.toISOString(),
          location: eventData.location || null,
          notes: eventData.notes || null,
          assigned_to: eventData.assigned_to || []
        }])
        .select()
        .single();

      if (error) throw error;

      // Add the new event to local state
      const newEvent: CalendarEvent = {
        id: data.id,
        title: data.title,
        start: new Date(data.start_date),
        end: new Date(data.end_date),
        allDay: data.all_day,
        location: data.location || '',
        notes: data.notes || '',
        calendarId: data.calendar_id,
        assigned_to: data.assigned_to || []
      };

      setEvents(prev => [...prev, newEvent]);
      return newEvent;
    } catch (error) {
      console.error('Error saving event:', error);
      throw error;
    }
  };

  // Update event in Supabase
  const updateEvent = async (eventId: string, eventData: Partial<CalendarEvent>) => {
    try {
      const { data, error } = await supabase
        .from('calendar')
        .update({
          title: eventData.title,
          calendar_id: eventData.calendarId,
          all_day: eventData.allDay,
          start_date: eventData.start?.toISOString(),
          end_date: eventData.end?.toISOString(),
          location: eventData.location || null,
          notes: eventData.notes || null,
          assigned_to: eventData.assigned_to || []
        })
        .eq('id', eventId)
        .select()
        .single();

      if (error) throw error;

      // Update local state
      const updatedEvent: CalendarEvent = {
        id: data.id,
        title: data.title,
        start: new Date(data.start_date),
        end: new Date(data.end_date),
        allDay: data.all_day,
        location: data.location || '',
        notes: data.notes || '',
        calendarId: data.calendar_id,
        assigned_to: data.assigned_to || []
      };

      setEvents(prev => prev.map(e => e.id === eventId ? updatedEvent : e));
      return updatedEvent;
    } catch (error) {
      console.error('Error updating event:', error);
      throw error;
    }
  };

  // Delete event from Supabase
  const deleteEvent = async (eventId: string) => {
    try {
      const { error } = await supabase
        .from('calendar')
        .delete()
        .eq('id', eventId);

      if (error) throw error;

      setEvents(prev => prev.filter(e => e.id !== eventId));
    } catch (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
  };

  // Fetch staff from Supabase
  const fetchStaff = async () => {
    const { data, error } = await supabase
      .from('staff')
      .select('id, name, position')
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching staff:', error);
      return;
    }

    setStaff(data || []);
  };

  // Fetch users from Supabase
  const fetchUsers = async () => {
    try {
      console.log('Fetching all verified users via Edge Function...');
      
      // Get current session to pass authorization header
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        console.log('No valid session found');
        setUsers([]);
        return;
      }

      // Call the Edge Function to get all verified users
      const { data, error } = await supabase.functions.invoke('get-all-users', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        console.error('Edge function error:', error);
        // Fallback to current user only if Edge Function fails
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUsers([{
            id: user.id,
            full_name: user.user_metadata?.display_name || user.user_metadata?.full_name || user.email || 'Current User',
            email: user.email || ''
          }]);
          console.log('Fallback: Using current authenticated user only:', user.email);
        } else {
          setUsers([]);
        }
        return;
      }

      if (data?.users) {
        setUsers(data.users.map((user: any) => ({
          id: user.id,
          full_name: user.full_name,
          email: user.email
        })));
        console.log(`Successfully fetched ${data.users.length} verified users:`, data.users.map((u: any) => u.email));
      } else {
        console.log('No users returned from Edge Function');
        setUsers([]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      // Fallback to current user only if there's an error
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUsers([{
            id: user.id,
            full_name: user.user_metadata?.display_name || user.user_metadata?.full_name || user.email || 'Current User',
            email: user.email || ''
          }]);
          console.log('Error fallback: Using current authenticated user only:', user.email);
        } else {
          setUsers([]);
        }
      } catch (fallbackError) {
        console.error('Fallback error:', fallbackError);
        setUsers([]);
      }
    }
  };

  // Combine staff and users
  const combineStaffAndUsers = () => {
    const combined: CombinedStaffUser[] = [
      // Add staff members
      ...staff.map(staffMember => ({
        id: `staff_${staffMember.id}`,
        name: staffMember.name,
        type: 'staff' as const,
        original_id: staffMember.id,
        email: '', // Staff table doesn't have email in this interface
        position: staffMember.position
      })),
      // Add users from profiles, but exclude those who already exist as staff
      ...users.filter(user => !staff.some(staffMember => staffMember.name.toLowerCase().includes(user.full_name.toLowerCase()) || user.full_name.toLowerCase().includes(staffMember.name.toLowerCase())))
        .map(user => ({
          id: `user_${user.id}`,
          name: user.full_name || user.email || 'Unknown User',
          type: 'user' as const,
          original_id: user.id,
          email: user.email
        }))
    ];
    
    console.log('Combined staff and users for calendar:', combined);
    setCombinedStaffUsers(combined);
  };

  // Save calendar category to Supabase
  const saveCalendarCategory = async (categoryData: { name: string; color: string }) => {
    try {
      const { data, error } = await supabase
        .from('calendar_categories')
        .insert([{
          name: categoryData.name,
          color: categoryData.color
        }])
        .select()
        .single();

      if (error) throw error;

      const newCategory: CalendarCategory = {
        id: data.id,
        name: data.name,
        color: data.color
      };

      setCalendars(prev => [...prev, newCategory]);
      return newCategory;
    } catch (error) {
      console.error('Error saving calendar category:', error);
      throw error;
    }
  };

  // Update calendar category in Supabase
  const updateCalendarCategory = async (categoryId: string, categoryData: { name: string; color: string }) => {
    try {
      const { data, error } = await supabase
        .from('calendar_categories')
        .update({
          name: categoryData.name,
          color: categoryData.color
        })
        .eq('id', categoryId)
        .select()
        .single();

      if (error) throw error;

      const updatedCategory: CalendarCategory = {
        id: data.id,
        name: data.name,
        color: data.color
      };

      setCalendars(prev => prev.map(c => c.id === categoryId ? updatedCategory : c));
      return updatedCategory;
    } catch (error) {
      console.error('Error updating calendar category:', error);
      throw error;
    }
  };

  // Delete calendar category from Supabase
  const deleteCalendarCategory = async (categoryId: string) => {
    try {
      // Check if category has events
      const { data: eventsInCategory } = await supabase
        .from('calendar')
        .select('id')
        .eq('calendar_id', categoryId);

      if (eventsInCategory && eventsInCategory.length > 0) {
        alert('Cannot delete calendar with events. Please delete events first.');
        return;
      }

      const { error } = await supabase
        .from('calendar_categories')
        .delete()
        .eq('id', categoryId);

      if (error) throw error;

      setCalendars(prev => prev.filter(c => c.id !== categoryId));
    } catch (error) {
      console.error('Error deleting calendar category:', error);
      throw error;
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadCalendarCategories();
    loadEvents();
    fetchStaff();
    fetchUsers();
  }, []);

  // Combine staff and users when either list changes
  useEffect(() => {
    if (staff.length > 0 || users.length > 0) {
      combineStaffAndUsers();
    }
  }, [staff, users]);

  return {
    // Data
    events,
    calendars,
    staff,
    users,
    combinedStaffUsers,
    loading,
    
    // Event operations
    saveEvent,
    updateEvent,
    deleteEvent,
    loadEvents,
    
    // Calendar operations
    saveCalendarCategory,
    updateCalendarCategory,
    deleteCalendarCategory,
    loadCalendarCategories,
    
    // Staff/User operations
    fetchStaff,
    fetchUsers,
    combineStaffAndUsers,
    
    // State setters (for external updates)
    setEvents,
    setCalendars
  };
};
