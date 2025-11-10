import React from 'react';
import { FormData, ActionItem } from '../../types/FormData';
import ActionModal from '../ActionModal';

interface ActionsStepProps {
  formData: FormData;
  setFormData: (updater: (prev: FormData) => FormData) => void;
  showActionModal: boolean;
  setShowActionModal: (show: boolean) => void;
  actionDraft: ActionItem;
  setActionDraft: (action: ActionItem) => void;
}

export default function ActionsStep({
  formData,
  setFormData,
  showActionModal,
  setShowActionModal,
  actionDraft,
  setActionDraft
}: ActionsStepProps) {
  const handleAddAction = () => {
    setFormData(prev => ({ 
      ...prev, 
      actions: [...prev.actions, actionDraft] 
    }));
    setActionDraft({ title: '', dueDate: '', description: '' });
    setShowActionModal(false);
  };

  const handleRemoveAction = (index: number) => {
    setFormData(prev => ({ 
      ...prev, 
      actions: prev.actions.filter((_, i) => i !== index) 
    }));
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          What actions have been taken to prevent a similar incident? *
        </label>
        <p className="text-xs text-gray-500 mt-1">
          Please outline below what has been done to prevent a similar incident from recurring in the future. 
          Note: The details entered here are not designed to replace the detailed actions and recommendations 
          arising out of a thorough incident investigation, but to indicate to interested parties what interim 
          measures have been put in place, whilst such investigations are ongoing. In some circumstances, 
          the information entered here may be sufficient to close out the report in full, such as near miss, 
          minor accidents etc.
        </p>
        <br />
        <textarea 
          value={formData.actionsTaken} 
          onChange={e => setFormData(prev => ({ ...prev, actionsTaken: e.target.value }))} 
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
              onClick={() => handleRemoveAction(idx)} 
              className="text-red-600 hover:underline"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <ActionModal
        show={showActionModal}
        onClose={() => setShowActionModal(false)}
        actionDraft={actionDraft}
        setActionDraft={setActionDraft}
        onAdd={handleAddAction}
      />
    </div>
  );
}
