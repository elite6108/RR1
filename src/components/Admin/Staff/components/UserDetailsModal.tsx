import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import type { CombinedStaffUser, FormData, FormErrors } from '../types';
import { validatePhoneNumber, validateNINumber } from '../utils';

interface UserDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => Promise<void>;
  onConvertToStaff: () => Promise<void>;
  user: CombinedStaffUser | null;
}

export function UserDetailsModal({ isOpen, onClose, onSubmit, onConvertToStaff, user }: UserDetailsModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    name: user?.name || '',
    position: user?.position || '',
    email: user?.email || '',
    phone: user?.phone || '',
    ni_number: user?.ni_number || '',
    start_date: user?.start_date || '',
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  React.useEffect(() => {
    if (isOpen && user) {
      setFormData({
        name: user.name || '',
        position: user.position || '',
        email: user.email || '',
        phone: user.phone || '',
        ni_number: user.ni_number || '',
        start_date: user.start_date || '',
      });
      setCurrentStep(1);
      setFormErrors({});
    }
  }, [isOpen, user]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    setFormData(prev => ({ ...prev, phone: value }));
    if (value.length > 0) {
      const error = validatePhoneNumber(value);
      setFormErrors(prev => ({ ...prev, phone: error }));
    } else {
      setFormErrors(prev => ({ ...prev, phone: undefined }));
    }
  };

  const handleNIChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().replace(/\s/g, '');
    setFormData(prev => ({ ...prev, ni_number: value }));
    if (value.length > 0) {
      const error = validateNINumber(value);
      setFormErrors(prev => ({ ...prev, ni_number: error }));
    } else {
      setFormErrors(prev => ({ ...prev, ni_number: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep !== 3) {
      setCurrentStep((prev) => Math.min(prev + 1, 3));
      return;
    }

    setFormErrors({});

    // Validate phone number if provided
    if (formData.phone) {
      const phoneError = validatePhoneNumber(formData.phone);
      if (phoneError) {
        setFormErrors(prev => ({ ...prev, phone: phoneError }));
        return;
      }
    }

    // Validate NI number if provided
    if (formData.ni_number) {
      const niError = validateNINumber(formData.ni_number);
      if (niError) {
        setFormErrors(prev => ({ ...prev, ni_number: niError }));
        return;
      }
    }

    await onSubmit(formData);
  };

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const renderStepIndicator = () => {
    const stepLabels = ['Details', 'Contact', 'Employment'];
    
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

  if (!isOpen || !user) return null;

  return createPortal(
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 dark:bg-gray-900 dark:bg-opacity-50 overflow-y-auto flex items-center justify-center z-50 p-4">
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-lg w-full m-4">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          Edit User Details
        </h2>
        {renderStepIndicator()}
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {currentStep === 1 && (
            <div>
              <label htmlFor="user_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name *</label>
              <input
                type="text"
                id="user_name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
          )}
          {currentStep === 2 && (
            <>
              <div>
                <label htmlFor="user_email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email *</label>
                <input
                  type="email"
                  id="user_email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
              <div>
                <label htmlFor="user_phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
                    +44
                  </span>
                  <input
                    type="tel"
                    id="user_phone"
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-r-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                    maxLength={10}
                  />
                </div>
                {formErrors.phone && <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>}
              </div>
            </>
          )}
          {currentStep === 3 && (
            <>
              <div>
                <label htmlFor="user_position" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Position</label>
                <input
                  type="text"
                  id="user_position"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label htmlFor="user_ni_number" className="block text-sm font-medium text-gray-700 dark:text-gray-300">NI Number</label>
                <input
                  type="text"
                  id="user_ni_number"
                  value={formData.ni_number}
                  onChange={handleNIChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                />
                {formErrors.ni_number && <p className="text-red-500 text-xs mt-1">{formErrors.ni_number}</p>}
              </div>
              <div>
                <label htmlFor="user_start_date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Start Date</label>
                <input
                  type="date"
                  id="user_start_date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </>
          )}
          <div className="flex justify-between items-center pt-4">
            {currentStep > 1 && (
              <button type="button" onClick={prevStep} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600">Previous</button>
            )}
            <div className="ml-auto flex space-x-2">
              <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600">Cancel</button>
              {currentStep === 3 && user.type === 'user' && (
                <button 
                  type="button" 
                  onClick={onConvertToStaff}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Convert to Staff
                </button>
              )}
              <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                {currentStep === 3 ? 'Save Changes' : 'Next'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
