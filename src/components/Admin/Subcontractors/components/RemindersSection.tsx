import React from 'react';
import { ChevronDown } from 'lucide-react';
import { Reminder } from '../types';

interface RemindersSectionProps {
  reminders: Reminder[];
  showReminders: boolean;
  onToggleReminders: () => void;
}

export const RemindersSection = ({
  reminders,
  showReminders,
  onToggleReminders,
}: RemindersSectionProps) => {
  if (reminders.length === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700 overflow-hidden shadow-lg">
        <button
          onClick={onToggleReminders}
          className="flex items-center justify-between w-full p-4 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Upcoming Reminders ({reminders.length})
          </h3>
          <ChevronDown 
            className={`h-5 w-5 text-gray-500 dark:text-gray-400 transform transition-transform duration-200 ${
              showReminders ? 'rotate-180' : ''
            }`}
          />
        </button>
        {showReminders && (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {reminders.map((reminder: Reminder, index: number) => (
              <div
                key={index}
                className={`p-4 ${
                  reminder.severity === 'danger'
                    ? 'bg-red-50 dark:bg-red-900/20'
                    : 'bg-yellow-50 dark:bg-yellow-900/20'
                }`}
              >
                <div className="flex items-center">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {reminder.title}
                    </h4>
                    <p
                      className={`text-sm ${
                        reminder.severity === 'danger'
                          ? 'text-red-600 dark:text-red-400'
                          : 'text-yellow-600 dark:text-yellow-400'
                      }`}
                    >
                      {reminder.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
