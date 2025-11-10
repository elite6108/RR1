import React, { useEffect, useState } from 'react';
import { 
  FormContainer,
  FormHeader,
  FormContent,
  FormFooter
} from '../../../../utils/form';
import { 
  fetchMyNotifications, 
  fetchOverdueNotifications, 
  fetchDueSoonNotifications,
  dismissTaskNotification,
  recallDismissedNotification,
  fetchDismissedTaskNotifications,
  dismissCalendarEventNotification,
  recallDismissedCalendarEventNotification,
  Notification 
} from '../utils/notifications';

interface NotificationModalProps {
  onClose: () => void;
  setNotificationCount: (count: number) => void;
}

export function NotificationModal({ onClose, setNotificationCount }: NotificationModalProps) {
  const [myNotifications, setMyNotifications] = useState<Notification[]>([]);
  const [overdueNotifications, setOverdueNotifications] = useState<Notification[]>([]);
  const [dueSoonNotifications, setDueSoonNotifications] = useState<Notification[]>([]);
  const [dismissedNotifications, setDismissedNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'my-notifications' | 'overdue' | 'due-soon'>('my-notifications');
  const [showDismissed, setShowDismissed] = useState(false);

  useEffect(() => {
    const getNotifications = async () => {
      setLoading(true);
      
      const [myNotifs, overdueNotifs, dueSoonNotifs, dismissedNotifs] = await Promise.all([
        fetchMyNotifications(),
        fetchOverdueNotifications(),
        fetchDueSoonNotifications(),
        fetchDismissedTaskNotifications(),
      ]);
      
      setMyNotifications(myNotifs);
      setOverdueNotifications(overdueNotifs);
      setDueSoonNotifications(dueSoonNotifs);
      setDismissedNotifications(dismissedNotifs);
      
      // Total notification count includes all types (dismissed don't count toward total)
      const totalCount = myNotifs.length + overdueNotifs.length + dueSoonNotifs.length;
      setNotificationCount(totalCount);
      
      setLoading(false);
    };

    getNotifications();
  }, [setNotificationCount]);

  // Get displayed notifications based on active tab
  const getDisplayedNotifications = () => {
    switch (activeTab) {
      case 'my-notifications':
        return myNotifications;
      case 'overdue':
        return overdueNotifications;
      case 'due-soon':
        return dueSoonNotifications;
      default:
        return [];
    }
  };

  const displayedNotifications = getDisplayedNotifications();

  // Handle dismissing task and calendar event notifications
  const handleDismissNotification = async (notification: Notification) => {
    if (notification.isDismissible) {
      let success = false;
      
      if (notification.taskId) {
        success = await dismissTaskNotification(notification.taskId);
      } else if (notification.eventId) {
        success = await dismissCalendarEventNotification(notification.eventId);
      }
      
      if (success) {
        // Remove the notification from active notifications
        setMyNotifications(prev => prev.filter(n => n.id !== notification.id));
        
        // Add to dismissed notifications
        const dismissedType = notification.taskId ? 'Dismissed Task Assignment' : 'Dismissed Calendar Event Assignment';
        const dismissedId = notification.taskId ? `dismissed-task-${notification.taskId}` : `dismissed-event-${notification.eventId}`;
        
        const dismissedNotif = {
          ...notification,
          id: dismissedId,
          type: dismissedType,
          message: `"${notification.message.replace(/You have been assigned (to event )?\"/, '').replace('"', '')}" (dismissed ${new Date().toLocaleDateString()})`,
          isDismissible: false,
          isRecallable: true,
        };
        setDismissedNotifications(prev => [dismissedNotif, ...prev]);
        
        // Update total count
        const totalCount = (myNotifications.length - 1) + overdueNotifications.length + dueSoonNotifications.length;
        setNotificationCount(totalCount);
      }
    }
  };

  // Handle recalling dismissed notifications
  const handleRecallNotification = async (notification: Notification) => {
    if (notification.isRecallable) {
      let success = false;
      
      if (notification.taskId) {
        success = await recallDismissedNotification(notification.taskId);
      } else if (notification.eventId) {
        success = await recallDismissedCalendarEventNotification(notification.eventId);
      }
      
      if (success) {
        // Remove from dismissed notifications
        setDismissedNotifications(prev => prev.filter(n => n.id !== notification.id));
        
        // Refresh active notifications to include the recalled one
        const refreshedNotifs = await fetchMyNotifications();
        setMyNotifications(refreshedNotifs);
        
        // Update total count
        const totalCount = refreshedNotifs.length + overdueNotifications.length + dueSoonNotifications.length;
        setNotificationCount(totalCount);
      }
    }
  };

  const getEmptyMessage = () => {
    switch (activeTab) {
      case 'my-notifications':
        return 'No task assignments.';
      case 'overdue':
        return 'No overdue items.';
      case 'due-soon':
        return 'No items due soon.';
      default:
        return 'No notifications.';
    }
  };

  return (
    <FormContainer isOpen={true} maxWidth="2xl">
      <FormHeader
        title="Notifications"
        subtitle="View your task assignments, overdue items, and items due soon."
        onClose={onClose}
      />
      
      <FormContent>
        {/* Tab Navigation */}
        <div className="mb-6 flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('my-notifications')}
            className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'my-notifications'
                ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            My Notifications ({myNotifications.length})
          </button>
          <button
            onClick={() => setActiveTab('overdue')}
            className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'overdue'
                ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Overdue ({overdueNotifications.length})
          </button>
          <button
            onClick={() => setActiveTab('due-soon')}
            className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'due-soon'
                ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Due Soon ({dueSoonNotifications.length})
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <p className="text-gray-500 dark:text-gray-400">Loading notifications...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Active Notifications */}
              <ul className="space-y-4">
                {displayedNotifications.map(notification => (
                  <li key={notification.id} className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700 relative">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-medium text-gray-800 dark:text-gray-100">
                          {notification.message}
                        </p>
                        {activeTab !== 'my-notifications' && (
                          <p className={`text-sm font-bold ${notification.isOverdue ? 'text-red-600 dark:text-red-400' : 'text-yellow-600 dark:text-yellow-400'}`}>
                            {notification.isOverdue
                              ? `Overdue by ${notification.days} day(s)`
                              : `Due in ${notification.days} day(s)`}
                          </p>
                        )}
                      </div>
                      {notification.isDismissible && (
                        <button
                          onClick={() => handleDismissNotification(notification)}
                          className="ml-4 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                          title="Dismiss notification"
                        >
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </li>
                ))}
                {displayedNotifications.length === 0 && (
                    <div className="text-center py-8">
                        <p className="text-gray-500 dark:text-gray-400">
                          {getEmptyMessage()}
                        </p>
                    </div>
                )}
              </ul>

              {/* Dismissed Notifications Section (only in My Notifications tab) */}
              {activeTab === 'my-notifications' && dismissedNotifications.length > 0 && (
                <div className="mt-6 border-t border-gray-200 dark:border-gray-600 pt-4">
                  <button
                    onClick={() => setShowDismissed(!showDismissed)}
                    className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 mb-3"
                  >
                    <svg 
                      className={`h-4 w-4 mr-2 transition-transform ${showDismissed ? 'rotate-90' : ''}`} 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    Dismissed Notifications ({dismissedNotifications.length})
                  </button>
                  
                  {showDismissed && (
                    <ul className="space-y-3">
                      {dismissedNotifications.map(notification => (
                        <li key={notification.id} className="p-3 rounded-lg bg-gray-100 dark:bg-gray-600 border-l-4 border-gray-300 dark:border-gray-500">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <p className="text-sm text-gray-700 dark:text-gray-300">
                                {notification.message}
                              </p>
                            </div>
                            {notification.isRecallable && (
                              <button
                                onClick={() => handleRecallNotification(notification)}
                                className="ml-4 text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
                                title="Restore notification"
                              >
                                Restore
                              </button>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </FormContent>

      <FormFooter
        onCancel={onClose}
        cancelButtonText="Close"
      />
    </FormContainer>
  );
}