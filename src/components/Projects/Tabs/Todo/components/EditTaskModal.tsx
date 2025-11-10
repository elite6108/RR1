import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { Task, TaskFormData } from '../types';
import { Calendar } from '../../../../../utils/calendar/Calendar';

interface EditTaskModalProps {
  isOpen: boolean;
  task: Task | null;
  onClose: () => void;
  onSubmit: (taskId: string, data: TaskFormData) => Promise<void>;
}

export const EditTaskModal: React.FC<EditTaskModalProps> = ({
  isOpen,
  task,
  onClose,
  onSubmit
}) => {
  const [formData, setFormData] = useState<TaskFormData>({
    name: '',
    description: '',
    priority: 'medium',
    due_date: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (task) {
      setFormData({
        name: task.name,
        description: task.description || '',
        priority: task.priority,
        due_date: task.due_date || '',
        notes: task.notes || ''
      });
    }
  }, [task]);

  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
      priority: 'medium',
      due_date: '',
      notes: ''
    });
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!task) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit(task.id, formData);
      handleClose();
    } catch (error) {
      console.error('Error updating task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };



  if (!isOpen || !task) return null;

  return createPortal(
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-screen w-screen flex items-center justify-center z-50 p-4">
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl mx-4">
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Edit Task</h3>
            <button
              type="button"
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1"
              disabled={isSubmitting}
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Step Indicator */}
          <div className="mb-8 w-full">
            <div className="flex items-center justify-between mb-4">
              <div className="text-base font-medium text-indigo-600">
                Task Details
              </div>
              <div className="text-sm text-gray-500">
                Step 1 of 1
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-indigo-600 h-2 rounded-full transition-all duration-300 ease-in-out"
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="max-h-[500px] overflow-y-auto pr-4">
              <div className="grid grid-cols-2 gap-4 singlerow">
                <div className="fullw">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Task Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-base"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="fullw">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description <span className="text-gray-400 text-xs">(optional)</span>
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-base resize-none"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="fullw">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Priority *
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as TaskFormData['priority'] })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-base"
                    disabled={isSubmitting}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div className="fullw">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Due Date *
                  </label>
                  <Calendar
                    selectedDate={formData.due_date}
                    onDateSelect={(date) => setFormData({ ...formData, due_date: date })}
                    placeholder="Select due date"
                    className="w-full"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="col-span-2 fullw">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Notes <span className="text-gray-400 text-xs">(optional)</span>
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-base resize-none"
                    placeholder="Additional notes..."
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Updating...' : 'Update Task'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>,
    document.body
  );
};
