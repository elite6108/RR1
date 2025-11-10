import React from 'react';
import { ActionItem } from '../types/FormData';

interface ActionModalProps {
  show: boolean;
  onClose: () => void;
  actionDraft: ActionItem;
  setActionDraft: (action: ActionItem) => void;
  onAdd: () => void;
}

export default function ActionModal({
  show,
  onClose,
  actionDraft,
  setActionDraft,
  onAdd
}: ActionModalProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg w-full max-w-md relative">
        <button 
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-100 focus:outline-none" 
          onClick={onClose}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x h-6 w-6">
            <path d="M18 6 6 18"></path>
            <path d="m6 6 12 12"></path>
          </svg>
        </button>
        <h2 className="text-lg font-bold mb-4">Add Action</h2>
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Action Title *</label>
          <input 
            type="text" 
            value={actionDraft.title} 
            onChange={e => setActionDraft({ ...actionDraft, title: e.target.value })} 
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white" 
            required 
          />
        </div>
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Action Due Date *</label>
          <input 
            type="date" 
            value={actionDraft.dueDate} 
            onChange={e => setActionDraft({ ...actionDraft, dueDate: e.target.value })} 
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white" 
            required 
          />
        </div>
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Action Description *</label>
          <textarea 
            value={actionDraft.description} 
            onChange={e => setActionDraft({ ...actionDraft, description: e.target.value })} 
            rows={3} 
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white" 
            required 
          />
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button 
            type="button" 
            onClick={onClose} 
            className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded"
          >
            Cancel
          </button>
          <button 
            type="button" 
            onClick={onAdd} 
            className="px-4 py-2 bg-indigo-600 text-white rounded"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
