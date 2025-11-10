import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import type { FirstAidKit } from '../types';
import { Calendar } from '../../../../../utils/calendar/Calendar';

interface FormData {
  name: string;
  location: string;
  serial_number: string;
  last_inspection_date: string;
  next_inspection_date: string;
}

interface FormErrors {
  name?: string;
  location?: string;
  serial_number?: string;
  last_inspection_date?: string;
  next_inspection_date?: string;
}

interface AddFirstAidKitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: Omit<FirstAidKit, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>;
  initialData?: FirstAidKit | null;
  isEditMode?: boolean;
}

export function AddFirstAidKitModal({ isOpen, onClose, onSubmit, initialData, isEditMode = false }: AddFirstAidKitModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    location: '',
    serial_number: '',
    last_inspection_date: '',
    next_inspection_date: '',
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  React.useEffect(() => {
    if (isOpen) {
      if (isEditMode && initialData) {
        setFormData({
          name: initialData.name || '',
          location: initialData.location || '',
          serial_number: initialData.serial_number || '',
          last_inspection_date: initialData.last_inspection_date || '',
          next_inspection_date: initialData.next_inspection_date || '',
        });
      } else {
        setFormData({
          name: '',
          location: '',
          serial_number: '',
          last_inspection_date: '',
          next_inspection_date: '',
        });
      }
      setCurrentStep(1);
      setFormErrors({});
    }
  }, [isOpen, isEditMode, initialData]);

  // Calculate next inspection date (monthly from last inspection)
  const handleLastInspectionChange = (newValue: string) => {
    setFormData(prev => ({ ...prev, last_inspection_date: newValue }));
    
    if (newValue) {
      const nextDate = new Date(newValue);
      nextDate.setMonth(nextDate.getMonth() + 1);
      const nextDateString = nextDate.toISOString().split('T')[0];
      setFormData(prev => ({ ...prev, next_inspection_date: nextDateString }));
    } else {
      setFormData(prev => ({ ...prev, next_inspection_date: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep !== 3) {
      nextStep();
      return;
    }

    setFormErrors({});

    // Validate required fields
    const errors: FormErrors = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.location.trim()) errors.location = 'Location is required';
    if (!formData.last_inspection_date) errors.last_inspection_date = 'Last inspection date is required';
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const submitData: Omit<FirstAidKit, 'id' | 'user_id' | 'created_at' | 'updated_at'> = {
      name: formData.name,
      location: formData.location,
      serial_number: formData.serial_number || undefined,
      last_inspection_date: formData.last_inspection_date,
      next_inspection_date: formData.next_inspection_date,
      status: 'active',
    };

    await onSubmit(submitData);
    onClose();
  };

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const renderStepIndicator = () => {
    const stepLabels = ['Basic Info', 'Location', 'Inspection'];
    
    return (
      <div className="mb-8 w-full">
        <div className="flex items-center justify-between mb-4">
          <div className="text-base font-medium text-indigo-600">
            {stepLabels[currentStep - 1]}
          </div>
          <div className="text-sm text-gray-500">
            Step {currentStep} of 3
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-indigo-600 h-2 rounded-full transition-all duration-300 ease-in-out"
            style={{ width: `${(currentStep / 3) * 100}%` }}
          />
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 dark:bg-gray-900 dark:bg-opacity-50 overflow-y-auto flex items-center justify-center z-50 p-4">
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-lg w-full m-4">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          {isEditMode ? 'Edit First Aid Kit' : 'Add First Aid Kit'}
        </h2>
        {renderStepIndicator()}
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {currentStep === 1 && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name *</label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                required
              />
              {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
            </div>
          )}
          {currentStep === 2 && (
            <>
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Location *</label>
                <input
                  type="text"
                  id="location"
                  value={formData.location}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, location: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                  required
                />
                {formErrors.location && <p className="text-red-500 text-xs mt-1">{formErrors.location}</p>}
              </div>
              <div>
                <label htmlFor="serialNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Serial Number</label>
                <input
                  type="text"
                  id="serialNumber"
                  value={formData.serial_number}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, serial_number: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </>
          )}
          {currentStep === 3 && (
            <>
              <div>
                <label htmlFor="lastInspectionDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Last Inspection Date *</label>
                <Calendar
                  selectedDate={formData.last_inspection_date}
                  onDateSelect={handleLastInspectionChange}
                  placeholder="Select last inspection date"
                  className="mt-1"
                  isDisabled={(date: Date) => {
                    const today = new Date();
                    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
                    return date > today || date < threeDaysAgo;
                  }}
                />
                {formErrors.last_inspection_date && <p className="text-red-500 text-xs mt-1">{formErrors.last_inspection_date}</p>}
              </div>
              <div>
                <label htmlFor="nextInspectionDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Next Inspection Date (Monthly)</label>
                <Calendar
                  selectedDate={formData.next_inspection_date}
                  onDateSelect={() => {}} // Read-only, no action needed
                  placeholder="Next inspection date"
                  className="mt-1"
                  disabled={true}
                />
                <p className="text-xs text-gray-500 mt-1">Automatically calculated as one month from last inspection</p>
              </div>
            </>
          )}
          <div className="flex justify-between items-center pt-4">
            {currentStep > 1 && (
              <button type="button" onClick={prevStep} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600">Previous</button>
            )}
            <div className="ml-auto flex space-x-2">
              <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600">Cancel</button>
              <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                {currentStep === 3 ? (isEditMode ? 'Update Kit' : 'Add Kit') : 'Next'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
