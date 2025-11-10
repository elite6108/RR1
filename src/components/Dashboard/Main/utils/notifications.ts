import { supabase } from '../../../../lib/supabase';
import {
  Task,
  CalendarEvent,
} from '../../../../types/notifications';

// Define a common interface for notifications
export interface Notification {
  id: string;
  type: string;
  message: string;
  isOverdue: boolean;
  days: number;
  isDismissible?: boolean;
  taskId?: number;
  eventId?: string;
  isRecallable?: boolean;
}

// Date helper functions
const today = new Date();
today.setHours(0, 0, 0, 0); 

const getDaysDifference = (dateStr: string) => {
  const date = new Date(dateStr);
  date.setHours(0, 0, 0, 0);
  const diffTime = date.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const sixtyDaysFromNow = new Date();
sixtyDaysFromNow.setDate(today.getDate() + 60);

// Helper function to generate consistent user ID hash (matches Tasks.tsx)
const getUserIdHash = (userId: string): number => {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    const char = userId.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return -Math.abs(hash); // Make it negative to distinguish from staff IDs
};

// Function to fetch calendar event assignment notifications for current user
const fetchCalendarEventAssignmentNotifications = async (): Promise<Notification[]> => {
  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error('Error getting current user:', userError);
      return [];
    }

    // Get dismissed notifications for the current user
    const { data: dismissedData } = await supabase
      .from('dismissed_notifications')
      .select('notification_reference')
      .eq('user_id', user.id)
      .eq('notification_type', 'calendar_event_assignment');

    const dismissedEventIds = dismissedData?.map((d: any) => d.notification_reference) || [];

    // Get user hash for matching with event assignments
    const userHash = getUserIdHash(user.id);

    // Fetch calendar events where the current user is assigned
    const { data: events, error: eventsError } = await supabase
      .from('calendar')
      .select('*')
      .contains('assigned_to', [userHash])
      .gte('start_date', new Date().toISOString()); // Only future events

    if (eventsError) {
      console.error('Error fetching assigned calendar events:', eventsError);
      return [];
    }

    if (!events) return [];

    // Filter out dismissed notifications and create notification objects
    return events
      .filter((event: CalendarEvent) => !dismissedEventIds.includes(event.id.toString()))
      .map((event: CalendarEvent) => {
        const eventDate = new Date(event.start_date);
        const days = getDaysDifference(event.start_date);
        
        return {
          id: `calendar-event-assignment-${event.id}`,
          type: 'Calendar Event Assignment',
          message: `You have been assigned to event "${event.title}" on ${eventDate.toLocaleDateString()}`,
          isOverdue: days < 0,
          days: Math.abs(days),
          isDismissible: true,
          eventId: event.id,
        };
      });
  } catch (error) {
    console.error('Error fetching calendar event assignment notifications:', error);
    return [];
  }
};

// Function to dismiss a calendar event assignment notification
const dismissCalendarEventNotificationInternal = async (eventId: string): Promise<boolean> => {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error('Error getting current user:', userError);
      return false;
    }

    const { error } = await supabase
      .from('dismissed_notifications')
      .insert({
        user_id: user.id,
        notification_type: 'calendar_event_assignment',
        notification_reference: eventId.toString(),
        dismissed_at: new Date().toISOString(),
      });

    if (error) {
      console.error('Error dismissing calendar event notification:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error dismissing calendar event notification:', error);
    return false;
  }
};

// Function to recall/restore a dismissed calendar event notification
const recallDismissedCalendarEventNotificationInternal = async (eventId: string): Promise<boolean> => {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error('Error getting current user:', userError);
      return false;
    }

    const { error } = await supabase
      .from('dismissed_notifications')
      .delete()
      .eq('user_id', user.id)
      .eq('notification_type', 'calendar_event_assignment')
      .eq('notification_reference', eventId.toString());

    if (error) {
      console.error('Error recalling dismissed calendar event notification:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error recalling dismissed calendar event notification:', error);
    return false;
  }
};

// #region Fetching Functions

// Function to fetch task assignment notifications for current user
const fetchTaskAssignmentNotifications = async (): Promise<Notification[]> => {
  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error('Error getting current user:', userError);
      return [];
    }

    // Get dismissed notifications for the current user
    const { data: dismissedData } = await supabase
      .from('dismissed_notifications')
      .select('notification_reference')
      .eq('user_id', user.id)
      .eq('notification_type', 'task_assignment');

    const dismissedTaskIds = dismissedData?.map((d: any) => d.notification_reference) || [];

    // Get user hash for matching with task assignments
    const userHash = getUserIdHash(user.id);

    // Fetch tasks where the current user is assigned and task is not completed/deleted
    const { data: tasks, error: tasksError } = await supabase
      .from('tasks')
      .select('*')
      .contains('staff_ids', [userHash])
      .not('status', 'eq', 'completed');

    if (tasksError) {
      console.error('Error fetching assigned tasks:', tasksError);
      return [];
    }

    if (!tasks) return [];

    // Filter out dismissed notifications and create notification objects
    return tasks
      .filter((task: Task) => !dismissedTaskIds.includes(task.id.toString()))
      .map((task: Task) => ({
        id: `task-assignment-${task.id}`,
        type: 'Task Assignment',
        message: `You have been assigned "${task.title}"`,
        isOverdue: task.status === 'over_due',
        days: 0, // Task assignments don't have days calculation
        isDismissible: true,
        taskId: task.id,
      }));
  } catch (error) {
    console.error('Error fetching task assignment notifications:', error);
    return [];
  }
};

// Function to dismiss a task assignment notification
const dismissTaskNotificationInternal = async (taskId: number): Promise<boolean> => {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error('Error getting current user:', userError);
      return false;
    }

    const { error } = await supabase
      .from('dismissed_notifications')
      .insert({
        user_id: user.id,
        notification_type: 'task_assignment',
        notification_reference: taskId.toString(),
        dismissed_at: new Date().toISOString(),
      });

    if (error) {
      console.error('Error dismissing notification:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error dismissing task notification:', error);
    return false;
  }
};

// Function to recall/restore a dismissed notification
const recallDismissedNotificationInternal = async (taskId: number): Promise<boolean> => {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error('Error getting current user:', userError);
      return false;
    }

    const { error } = await supabase
      .from('dismissed_notifications')
      .delete()
      .eq('user_id', user.id)
      .eq('notification_type', 'task_assignment')
      .eq('notification_reference', taskId.toString());

    if (error) {
      console.error('Error recalling dismissed notification:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error recalling dismissed notification:', error);
    return false;
  }
};

// Function to fetch dismissed task notifications for the current user
const fetchDismissedTaskNotifications = async (): Promise<Notification[]> => {
  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error('Error getting current user:', userError);
      return [];
    }

    // Get dismissed notifications for the current user
    const { data: dismissedData } = await supabase
      .from('dismissed_notifications')
      .select('notification_reference, dismissed_at')
      .eq('user_id', user.id)
      .eq('notification_type', 'task_assignment')
      .order('dismissed_at', { ascending: false });

    if (!dismissedData || dismissedData.length === 0) return [];

    const taskIds = dismissedData.map((d: any) => parseInt(d.notification_reference));

    // Fetch the actual tasks to get their current status and details
    const { data: tasks, error: tasksError } = await supabase
      .from('tasks')
      .select('*')
      .in('id', taskIds);

    if (tasksError) {
      console.error('Error fetching dismissed tasks:', tasksError);
      return [];
    }

    if (!tasks) return [];

    // Create notification objects for dismissed tasks
    return tasks.map((task: any) => {
      const dismissedItem = dismissedData.find((d: any) => d.notification_reference === task.id.toString());
      return {
        id: `dismissed-task-${task.id}`,
        type: 'Dismissed Task Assignment',
        message: `"${task.title}" (dismissed ${new Date(dismissedItem.dismissed_at).toLocaleDateString()})`,
        isOverdue: task.status === 'over_due',
        days: 0,
        isDismissible: false, // Can't dismiss again, but can recall
        taskId: task.id,
        isRecallable: true,
      };
    });
  } catch (error) {
    console.error('Error fetching dismissed task notifications:', error);
    return [];
  }
};

const fetchActionPlanNotifications = async (): Promise<Notification[]> => {
  const { data, error } = await supabase
    .from('action_plan')
    .select('id, item, next_due')
    .or(`next_due.lte.${sixtyDaysFromNow.toISOString()},next_due.is.null`)


  if (error) {
    console.error('Error fetching action plan notifications:', error);
    return [];
  }

  return data
    .map((item: any) => {
      if (!item.next_due) return null;
      const days = getDaysDifference(item.next_due);
      const isOverdue = days < 0;

      if (days <= 60) {
        return {
          id: `action-plan-${item.id}`,
          type: 'Action Plan',
          message: `${item.item} review is ${isOverdue ? 'overdue' : 'due'} in ${Math.abs(days)} days`,
          isOverdue,
          days: Math.abs(days),
        };
      }
      return null;
    })
    .filter((item: Notification | null): item is Notification => item !== null);
};

const fetchCoshhNotifications = async (): Promise<Notification[]> => {
    const { data, error } = await supabase
        .from('coshh_assessments')
        .select('id, coshh_reference, review_date')
        .lte('review_date', sixtyDaysFromNow.toISOString());

    if (error) {
        console.error('Error fetching COSHH notifications:', error);
        return [];
    }

    return data.map((item: any) => {
        const days = getDaysDifference(item.review_date);
        const isOverdue = days < 0;
        return {
            id: `coshh-${item.id}`,
            type: 'COSHH Assessment',
            message: `${item.coshh_reference} review is ${isOverdue ? 'overdue' : 'due'} in ${Math.abs(days)} days`,
            isOverdue,
            days: Math.abs(days),
        };
    });
};

const fetchRiskAssessmentNotifications = async (): Promise<Notification[]> => {
    const { data, error } = await supabase
        .from('risk_assessments')
        .select('id, ra_id, review_date')
        .lte('review_date', sixtyDaysFromNow.toISOString());

    if (error) {
        console.error('Error fetching risk assessment notifications:', error);
        return [];
    }

    return data.map((item: any) => {
        const days = getDaysDifference(item.review_date);
        const isOverdue = days < 0;
        return {
            id: `risk-assessment-${item.id}`,
            type: 'Risk Assessment',
            message: `${item.ra_id} review is ${isOverdue ? 'overdue' : 'due'} in ${Math.abs(days)} days`,
            isOverdue,
            days: Math.abs(days),
        };
    });
};

const formatDateColumnName = (columnName: string) => {
    return columnName
        .replace('_date', '')
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

const fetchVehicleNotifications = async (): Promise<Notification[]> => {
    const dateColumns = ['mot_date', 'tax_date', 'insurance_date', 'breakdown_date', 'service_date'];
    const notifications: Notification[] = [];

    const { data, error } = await supabase.from('vehicles').select('*');

    if (error) {
        console.error('Error fetching vehicle notifications:', error);
        return [];
    }

    data.forEach((vehicle: any) => {
        dateColumns.forEach(col => {
            const date = vehicle[col] as string | null;
            if (date) {
                const days = getDaysDifference(date);
                if (days <= 60) {
                    const isOverdue = days < 0;
                    notifications.push({
                        id: `vehicle-${vehicle.id}-${col}`,
                        type: 'Vehicle',
                        message: `${vehicle.registration} ${formatDateColumnName(col)} is ${isOverdue ? 'overdue' : 'due'} in ${Math.abs(days)} days`,
                        isOverdue,
                        days: Math.abs(days),
                    });
                }
            }
        });
    });

    return notifications;
};

const fetchVehicleChecklistNotifications = async (): Promise<Notification[]> => {
    const { data, error } = await supabase
        .from('vehicle_checklists')
        .select('*, vehicles(registration)');

    if (error) {
        console.error('Error fetching vehicle checklist notifications:', error);
        return [];
    }

    return data.map((item: any) => {
        const checkDate = new Date(item.check_date);
        const dueDate = new Date(checkDate);
        
        if(item.frequency === 'daily') dueDate.setDate(checkDate.getDate() + 1);
        if(item.frequency === 'weekly') dueDate.setDate(checkDate.getDate() + 7);
        if(item.frequency === 'monthly') dueDate.setMonth(checkDate.getMonth() + 1);

        const days = getDaysDifference(dueDate.toISOString());
        const isOverdue = days < 0;

        if (isOverdue) {
             return {
                id: `vehicle-checklist-${item.id}`,
                type: 'Vehicle Checklist',
                message: `${(item.vehicles as any)?.registration || 'Unknown Vehicle'} checklist is overdue by ${Math.abs(days)} days`,
                isOverdue: true,
                days: Math.abs(days),
            };
        }
        return null;
    }).filter((item: Notification | null): item is Notification => item !== null);
};

const fetchEquipmentChecklistNotifications = async (): Promise<Notification[]> => {
    const { data: checklists, error } = await supabase
        .from('equipment_checklists')
        .select('*, equipment(name)');

    if (error) {
        console.error('Error fetching equipment checklist notifications:', error);
        return [];
    }

    return checklists.map((item: any) => {
        const checkDate = new Date(item.check_date);
        const dueDate = new Date(checkDate);
        
        if(item.frequency === 'daily') dueDate.setDate(checkDate.getDate() + 1);
        if(item.frequency === 'weekly') dueDate.setDate(checkDate.getDate() + 7);
        if(item.frequency === 'monthly') dueDate.setMonth(checkDate.getMonth() + 1);

        const days = getDaysDifference(dueDate.toISOString());
        const isOverdue = days < 0;

        if (isOverdue) {
            return {
                id: `equipment-checklist-${item.id}`,
                type: 'Equipment Checklist',
                message: `${(item.equipment as any)?.name || 'Unknown Equipment'} checklist is overdue by ${Math.abs(days)} days`,
                isOverdue: true,
                days: Math.abs(days),
            };
        }
        return null;
    }).filter((item: Notification | null): item is Notification => item !== null);
};

// New inspection notifications (only if frequency set)
const computeNextDueDays = (checkDate: string, frequency: string | null): number | null => {
  if (!frequency) return null;
  const d = new Date(checkDate);
  const due = new Date(d);
  if (frequency === 'daily') due.setDate(d.getDate() + 1);
  else if (frequency === 'weekly') due.setDate(d.getDate() + 7);
  else if (frequency === 'monthly') due.setMonth(d.getMonth() + 1);
  else return null;
  return getDaysDifference(due.toISOString());
};

const fetchGenericInspectionNotifications = async (
  table: string,
  typeLabel: string,
  idPrefix: string,
  titleBuilder?: (row: any) => string
): Promise<Notification[]> => {
  const { data, error } = await supabase.from(table).select('*');
  if (error || !data) return [];
  const notifications: Notification[] = [];
  data.forEach((row: any) => {
    const days = computeNextDueDays(row.check_date, row.frequency || null);
    if (days == null) return;
    if (days <= 0) {
      notifications.push({
        id: `${idPrefix}-${row.id}`,
        type: typeLabel,
        message: `${titleBuilder ? titleBuilder(row) : typeLabel} is overdue by ${Math.abs(days)} days`,
        isOverdue: true,
        days: Math.abs(days),
      });
    }
  });
  return notifications;
};

const fetchTrainingMatrixNotifications = async (): Promise<Notification[]> => {
    const { data, error } = await supabase
        .from('training_matrix')
        .select('*');

    if (error) {
        console.error('Error fetching training matrix notifications:', error);
        return [];
    }

    const notifications: Notification[] = [];
    data.forEach((matrix: any) => {
        const processItems = (items: any[], type: string, dateField: string, nameField: string) => {
            if (!items) return;
            items.forEach((item, index) => {
                if (item[dateField]) {
                    const days = getDaysDifference(item[dateField]);
                    if (days <= 60) {
                        const isOverdue = days < 0;
                        notifications.push({
                            id: `training-${matrix.id}-${type}-${index}`,
                            type: 'Training',
                            message: `${matrix.name}'s ${item[nameField]} is ${isOverdue ? 'overdue' : 'due'} in ${Math.abs(days)} days`,
                            isOverdue,
                            days: Math.abs(days),
                        });
                    }
                }
            });
        };

        processItems(matrix.training_records || [], 'record', 'expiry_date', 'training_name');
        processItems(matrix.certificates || [], 'certificate', 'date_expires', 'certificate_name');
        processItems(matrix.cards_tickets || [], 'card', 'date_expires', 'card_name');
    });

    return notifications;
};
// #endregion

// #region Aggregator
const fetchAllNotifications = async (): Promise<Notification[]> => {
    const allNotifications = await Promise.all([
        fetchActionPlanNotifications(),
        fetchCoshhNotifications(),
        fetchRiskAssessmentNotifications(),
        fetchVehicleNotifications(),
        fetchVehicleChecklistNotifications(),
        fetchEquipmentChecklistNotifications(),
        fetchTrainingMatrixNotifications(),
        // New inspections (overdue only when frequency exists)
        fetchGenericInspectionNotifications('crane_operator_inspections', 'Crane Inspection', 'crane'),
        fetchGenericInspectionNotifications('guarding_inspections', 'Guarding Inspection', 'guarding'),
        fetchGenericInspectionNotifications('forklift_daily_inspections', 'Forklift Inspection', 'forklift'),
        fetchGenericInspectionNotifications('motor_vehicle_inspections', 'Motor Vehicle Inspection', 'motor'),
        fetchGenericInspectionNotifications('ppe_inspections', 'PPE Inspection', 'ppe', () => 'PPE Inspection'),
        fetchGenericInspectionNotifications('site_inspections', 'Site Inspection', 'site'),
        fetchGenericInspectionNotifications('workshop_inspections', 'Workshop Inspection', 'workshop'),
    ]);

    return allNotifications.flat().sort((a, b) => {
        if (a.isOverdue && !b.isOverdue) return -1;
        if (!a.isOverdue && b.isOverdue) return 1;
        return a.days - b.days;
    });
};

// Function to fetch only task assignment notifications (for My Notifications tab)
const fetchMyNotifications = async (): Promise<Notification[]> => {
    const allMyNotifications = await Promise.all([
        fetchTaskAssignmentNotifications(),
        fetchCalendarEventAssignmentNotifications(),
    ]);
    
    return allMyNotifications.flat().sort((a, b) => {
        if (a.isOverdue && !b.isOverdue) return -1;
        if (!a.isOverdue && b.isOverdue) return 1;
        return a.days - b.days;
    });
};

// Function to fetch overdue notifications (excluding task assignments)
const fetchOverdueNotifications = async (): Promise<Notification[]> => {
    const allNotifications = await fetchAllNotifications();
    return allNotifications.filter(n => n.isOverdue);
};

// Function to fetch due soon notifications (excluding task assignments)
const fetchDueSoonNotifications = async (): Promise<Notification[]> => {
    const allNotifications = await fetchAllNotifications();
    return allNotifications.filter(n => !n.isOverdue);
};
// #endregion

export { 
    fetchAllNotifications, 
    fetchMyNotifications, 
    fetchOverdueNotifications, 
    fetchDueSoonNotifications,
    dismissTaskNotificationInternal as dismissTaskNotification,
    recallDismissedNotificationInternal as recallDismissedNotification,
    fetchDismissedTaskNotifications,
    dismissCalendarEventNotificationInternal as dismissCalendarEventNotification,
    recallDismissedCalendarEventNotificationInternal as recallDismissedCalendarEventNotification
};
