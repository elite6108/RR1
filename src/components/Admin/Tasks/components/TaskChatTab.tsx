import React from 'react';
import { Message } from '../types';

interface TaskChatTabProps {
  messages: Message[];
  newMessage: string;
  setNewMessage: React.Dispatch<React.SetStateAction<string>>;
  user: any;
  onSendMessage: () => void;
}

export const TaskChatTab: React.FC<TaskChatTabProps> = ({
  messages,
  newMessage,
  setNewMessage,
  user,
  onSendMessage,
}) => {
  return (
    <div className="space-y-4">
      <div className="h-96 flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 rounded-md">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.user_id === user?.id
                  ? 'justify-end'
                  : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[70%] rounded-lg px-4 py-2 ${
                  message.user_id === user?.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white border border-gray-200 dark:bg-gray-800 dark:text-white dark:border-gray-700'
                }`}
              >
                <div className="text-xs mb-1">
                  {message.user_name} •{' '}
                  {new Date(
                    message.created_at
                  ).toLocaleTimeString()}
                </div>
                <div className="text-sm">{message.message}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (user) {
                  onSendMessage();
                }
              }
            }}
            placeholder={
              user
                ? 'Type a message...'
                : 'Please log in to send messages'
            }
            disabled={!user}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-[#29303b] dark:border-gray-600 dark:text-white"
          />
          <button
            type="button"
            onClick={onSendMessage}
            disabled={!user || !newMessage.trim()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 dark:bg-gray-800 dark:text-white dark:hover:bg-blue-600 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};
