import React from 'react';
import { Edit, Trash2, ChevronUp, ChevronDown, ChevronRight, ChevronLeft } from 'lucide-react';
import type { ToolbarItem, GanttTask } from '../types';

interface GanttToolbarProps {
  selectedTask: number | null;
  apiRef: React.MutableRefObject<any>;
  onEditTask: (task: GanttTask) => void;
  onDeleteTask: (taskId: number) => void;
  onIndentRight: (taskId: number) => void;
  onIndentLeft: (taskId: number) => void;
}

export function GanttToolbar({
  selectedTask,
  apiRef,
  onEditTask,
  onDeleteTask,
  onIndentRight,
  onIndentLeft
}: GanttToolbarProps) {
  const toolbarItems: ToolbarItem[] = [
    {
      id: 'edit-task',
      comp: 'button',
      icon: React.createElement(Edit, { className: "h-4 w-4" }),
      text: '',
      className: 'p-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:text-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600',
      handler: () => {
        if (apiRef.current) {
          const selectedItemId = apiRef.current.getState().selected[0];
          const selectedItem = apiRef.current.getTask(selectedItemId);
          if (selectedItem) {
            onEditTask(selectedItem);
          }
        }
      },
    },
    {
      id: 'delete-task',
      comp: 'button',
      icon: React.createElement(Trash2, { className: "h-4 w-4" }),
      text: '',
      className: 'p-2 text-white bg-red-600 rounded-md hover:bg-red-700 dark:hover:bg-red-500',
      handler: () => {
        if (apiRef.current) {
          const selectedItemId = apiRef.current.getState().selected[0];
          if (selectedItemId) {
            onDeleteTask(selectedItemId);
          }
        }
      },
    },
    {
      id: 'move-up',
      comp: 'button',
      icon: React.createElement(ChevronUp, { className: "h-4 w-4" }),
      text: '',
      className: 'p-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:text-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600',
      handler: () => {
        if (apiRef.current) {
          const selectedItemId = apiRef.current.getState().selected[0];
          if (selectedItemId) {
            apiRef.current.exec('move-task', { id: selectedItemId, mode: 'up' });
          }
        }
      },
    },
    {
      id: 'move-down',
      comp: 'button',
      icon: React.createElement(ChevronDown, { className: "h-4 w-4" }),
      text: '',
      className: 'p-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:text-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600',
      handler: () => {
        if (apiRef.current) {
          const selectedItemId = apiRef.current.getState().selected[0];
          if (selectedItemId) {
            apiRef.current.exec('move-task', { id: selectedItemId, mode: 'down' });
          }
        }
      },
    },
    {
      id: 'indent-right',
      comp: 'button',
      icon: React.createElement(ChevronRight, { className: "h-4 w-4" }),
      text: '',
      className: 'p-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:text-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600',
      handler: () => {
        if (apiRef.current) {
          const selectedItemId = apiRef.current.getState().selected[0];
          if (selectedItemId) {
            onIndentRight(selectedItemId);
          }
        }
      },
    },
    {
      id: 'indent-left',
      comp: 'button',
      icon: React.createElement(ChevronLeft, { className: "h-4 w-4" }),
      text: '',
      className: 'p-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:text-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600',
      handler: () => {
        if (apiRef.current) {
          const selectedItemId = apiRef.current.getState().selected[0];
          if (selectedItemId) {
            onIndentLeft(selectedItemId);
          }
        }
      },
    },
  ];

  if (!selectedTask) return null;

  return (
    <div className="flex items-center gap-2">
      {toolbarItems.map((item) => (
        <button
          key={item.id}
          onClick={item.handler}
          className={item.className}
          title={item.id.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
        >
          {item.icon}
        </button>
      ))}
    </div>
  );
}
