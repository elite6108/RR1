import React from 'react';
import { FormField, TextInput } from '../../../../utils/form';
import type { PasswordTabProps } from '../../types';

export function PasswordTab({
  currentPassword,
  setCurrentPassword,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  onSubmit,
  passwordError,
  passwordSuccess,
  loading
}: PasswordTabProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">Admin Password Settings</h3>
      
      <form onSubmit={onSubmit} className="space-y-4">
        <FormField
          label="Current Password"
          required
        >
          <TextInput
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </FormField>

        <FormField
          label="New Password"
          required
        >
          <TextInput
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </FormField>

        <FormField
          label="Confirm New Password"
          required
        >
          <TextInput
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </FormField>

        {passwordError && (
          <div className="text-red-600 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-md">
            {passwordError}
          </div>
        )}
        
        {passwordSuccess && (
          <div className="text-green-600 text-sm bg-green-50 dark:bg-green-900/20 p-3 rounded-md">
            {passwordSuccess}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {loading ? 'Updating...' : 'Update Password'}
        </button>
      </form>

      <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-md">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
              Important
            </h3>
            <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
              <p>
                Changing the admin password will affect all admin access across the application. 
                Make sure to remember the new password as it cannot be recovered.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}