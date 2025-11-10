import React, { useState } from 'react';
import { PropertyDamageFormData } from '../types/PropertyDamageTypes';

interface PropertyDamageActionsStepProps {
  formData: PropertyDamageFormData;
  setFormData: React.Dispatch<React.SetStateAction<PropertyDamageFormData>>;
}

export const PropertyDamageActionsStep: React.FC<PropertyDamageActionsStepProps> = ({ formData, setFormData }) => {
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionDraft, setActionDraft] = useState({ title: '', dueDate: '', description: '' });

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">What actions have been taken to prevent a similar incident? *</label>
        <textarea 
          value={formData.actionsTaken} 
          onChange={e => setFormData({ ...formData, actionsTaken: e.target.value })} 
          rows={4} 
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white" 
          required 
        />
      </div>
      <div>
        <button 
          type="button" 
          onClick={() => setShowActionModal(true)} 
          className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add Action
        </button>
      </div>
      <div className="space-y-2">
        {formData.actions.map((action, idx) => (
          <div key={idx} className="flex items-center gap-2 border p-2 rounded">
            <div className="flex-1">
              <div className="font-semibold">{action.title}</div>
              <div className="text-xs text-gray-500">Due: {action.dueDate}</div>
              <div className="text-sm">{action.description}</div>
            </div>
            <button 
              type="button" 
              onClick={() => setFormData(fd => ({ ...fd, actions: fd.actions.filter((_, i) => i !== idx) }))} 
              className="text-red-600 hover:underline"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      
      {/* Modal for adding action */}
      {showActionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg w-full max-w-md relative">
            <button 
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-100 focus:outline-none" 
              onClick={() => setShowActionModal(false)}
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
                onClick={() => setShowActionModal(false)} 
                className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded"
              >
                Cancel
              </button>
              <button 
                type="button" 
                onClick={() => {
                  setFormData(fd => ({ ...fd, actions: [...fd.actions, actionDraft] }));
                  setActionDraft({ title: '', dueDate: '', description: '' });
                  setShowActionModal(false);
                }} 
                className="px-4 py-2 bg-indigo-600 text-white rounded"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
