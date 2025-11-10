import React from 'react';
import { Lock } from 'lucide-react';
import { PasswordData } from '../utils/profileUtils';

interface PasswordTabProps {
  passwordData: PasswordData;
  passwordError: string | null;
  passwordSuccess: boolean;
  updatingPassword: boolean;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUpdatePassword: (e: React.FormEvent) => void;
}

export const PasswordTab: React.FC<PasswordTabProps> = ({
  passwordData,
  passwordError,
  passwordSuccess,
  updatingPassword,
  onPasswordChange,
  onUpdatePassword
}) => {
  return (
    <div className="mt-6">
      <h4 className="text-lg font-medium text-gray-900 dark:text-white flex items-center mb-4">
        <Lock className="h-5 w-5 mr-2" />
        Update Password
      </h4>

      {passwordError && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-4">
          {passwordError}
        </div>
      )}

      {passwordSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded mb-4">
          Password updated successfully!
        </div>
      )}

      <form onSubmit={onUpdatePassword} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            New Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Lock className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="password"
              name="password"
              value={passwordData.password}
              onChange={onPasswordChange}
              className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
              minLength={6}
            />
          </div>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Must be at least 6 characters
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Confirm New Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Lock className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="password"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={onPasswordChange}
              className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={updatingPassword}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {updatingPassword ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                Updating...
              </>
            ) : (
              <>
                <Lock className="h-4 w-4 mr-2" />
                Update Password
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};