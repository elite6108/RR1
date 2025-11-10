import React from 'react';
import { Mail, Phone, MessageSquare, Edit, Trash2 } from 'lucide-react';
import { Activity } from '../../shared/types';
import { formatDate } from '../../shared/utils';

interface ActivityListProps {
  activities: Activity[];
  onDeleteActivity: (activityId: string) => void;
}

export function ActivityList({ activities, onDeleteActivity }: ActivityListProps) {
  const getActivityIcon = (type: Activity['activity_type']) => {
    switch (type) {
      case 'email_sent': return <Mail className="h-4 w-4" />;
      case 'phone_call': return <Phone className="h-4 w-4" />;
      case 'note_added': return <MessageSquare className="h-4 w-4" />;
      case 'status_changed': return <Edit className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getActivityLabel = (type: Activity['activity_type']) => {
    switch (type) {
      case 'email_sent': return 'Email Sent';
      case 'phone_call': return 'Phone Call';
      case 'note_added': return 'Note Added';
      case 'status_changed': return 'Status Changed';
      default: return 'Activity';
    }
  };

  if (activities.length === 0) {
    return (
      <p className="text-sm text-gray-500 dark:text-gray-400 italic">
        No activities recorded yet.
      </p>
    );
  }

  return (
    <div className="space-y-3 max-h-64 overflow-y-auto">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start space-x-3 p-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg">
          <div className="flex-shrink-0 mt-0.5">
            {getActivityIcon(activity.activity_type)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {getActivityLabel(activity.activity_type)}
              </p>
              <div className="flex items-center space-x-2">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {formatDate(activity.created_at)}
                </p>
                <button
                  type="button"
                  onClick={() => onDeleteActivity(activity.id)}
                  className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  title="Delete Activity"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              {activity.description}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              by {activity.created_by_name}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
