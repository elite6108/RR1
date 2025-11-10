import React from 'react';
import { FormField, TextInput } from '../../../utils/form';
import type { AuthFormProps } from '../types';

interface AuthFormComponentProps extends AuthFormProps {
  password: string;
  setPassword: (password: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  error: string;
  loading: boolean;
}

export function AuthForm({ 
  password, 
  setPassword, 
  onSubmit, 
  error, 
  loading 
}: AuthFormComponentProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <FormField
        label="Enter Admin Password"
        error={error}
        required
      >
        <TextInput
          id="password"
          type="password"
          value={password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setPassword(e.target.value)
          }
          placeholder="Enter password to modify modules"
        />
      </FormField>
      <button
        type="submit"
        disabled={loading}
        className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Authenticating...' : 'Authenticate'}
      </button>
    </form>
  );
}