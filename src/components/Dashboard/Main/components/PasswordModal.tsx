import React from 'react';
import { 
  FormContainer,
  FormHeader,
  FormContent
} from '../../../../utils/form';

interface PasswordModalProps {
  // Name management
  selectedName: string;
  setSelectedName: (name: string) => void;
  nameError: string | null;
  nameSuccess: boolean;
  loadingName: boolean;
  onNameUpdate: () => void;

  // Password management
  newPassword: string;
  setNewPassword: (password: string) => void;
  confirmPassword: string;
  setConfirmPassword: (password: string) => void;
  passwordError: string | null;
  passwordSuccess: boolean;
  onPasswordUpdate: (e: React.FormEvent) => void;

  // Modal management
  canCloseUserModal: () => boolean;
  onClose: () => void;
}

export function PasswordModal({
  selectedName,
  setSelectedName,
  nameError,
  nameSuccess,
  loadingName,
  onNameUpdate,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  passwordError,
  passwordSuccess,
  onPasswordUpdate,
  canCloseUserModal,
  onClose,
}: PasswordModalProps) {
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPasswordUpdate(e);
  };

  return (
    <FormContainer isOpen={true} maxWidth="md">
      <FormHeader
        title={`User Settings ${!canCloseUserModal() ? '(Full Name Required)' : ''}`}
        onClose={onClose}
      />
      
      <FormContent>
        {/* Name Management Section */}
        <div className="mb-6">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            You will have to enter your full name the first time using this app.
          </p>
          
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Full Name *
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={selectedName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSelectedName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              placeholder="Enter your full name"
            />
            <button
              onClick={onNameUpdate}
              disabled={loadingName}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingName ? 'Saving...' : 'Save'}
            </button>
          </div>
          {nameError && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{nameError}</p>
          )}
          {nameSuccess && (
            <p className="mt-2 text-sm text-green-600 dark:text-green-400">
              Name updated successfully!
            </p>
          )}
        </div>

        <hr className="border-gray-200 dark:border-gray-700 mb-6" />

        {/* Password Update Section */}
        <form onSubmit={handlePasswordSubmit}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="new-password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                New Password *
              </label>
              <input
                type="password"
                id="new-password"
                value={newPassword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter new password"
              />
            </div>
            <div>
              <label
                htmlFor="confirm-password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Confirm Password *
              </label>
              <input
                type="password"
                id="confirm-password"
                value={confirmPassword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                placeholder="Confirm new password"
              />
            </div>
            {passwordError && (
              <p className="text-sm text-red-600 dark:text-red-400">{passwordError}</p>
            )}
            {passwordSuccess && (
              <p className="text-sm text-green-600 dark:text-green-400">
                Password updated successfully!
              </p>
            )}
          </div>
        </form>
      </FormContent>

      {/* Custom Footer for this modal's specific needs */}
      <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Cancel
        </button>
        
        <div className="flex space-x-2">
          <button
            type="submit"
            onClick={handlePasswordSubmit}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            Update Password
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={!canCloseUserModal()}
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </FormContainer>
  );
}