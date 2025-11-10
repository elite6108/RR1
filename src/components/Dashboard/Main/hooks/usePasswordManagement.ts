import { useState } from 'react';
import { supabase } from '../../../../lib/supabase';

export function usePasswordManagement() {
  // Password form states
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // Name update states
  const [nameError, setNameError] = useState<string | null>(null);
  const [nameSuccess, setNameSuccess] = useState(false);
  const [loadingName, setLoadingName] = useState(false);

  // Password update handler
  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(false);

    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      setPasswordSuccess(true);
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      setPasswordError(error.message);
    }
  };

  // Name update handler
  const handleNameUpdate = async (newName: string, setSelectedName: (name: string) => void) => {
    setLoadingName(true);
    setNameError(null);
    setNameSuccess(false);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { error } = await supabase.auth.updateUser({
        data: { full_name: newName }
      });

      if (error) throw error;

      setSelectedName(newName);
      setNameSuccess(true);
    } catch (error: any) {
      setNameError(error.message);
    } finally {
      setLoadingName(false);
    }
  };

  // Check if user modal can be closed
  const canCloseUserModal = () => {
    return passwordSuccess || nameSuccess;
  };

  // Reset password form
  const resetPasswordForm = () => {
    setNewPassword('');
    setConfirmPassword('');
    setPasswordError(null);
    setPasswordSuccess(false);
  };

  // Reset name form
  const resetNameForm = () => {
    setNameError(null);
    setNameSuccess(false);
    setLoadingName(false);
  };

  return {
    // Password states
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    passwordError,
    setPasswordError,
    passwordSuccess,
    setPasswordSuccess,

    // Name states
    nameError,
    setNameError,
    nameSuccess,
    setNameSuccess,
    loadingName,
    setLoadingName,

    // Handlers
    handlePasswordUpdate,
    handleNameUpdate,
    canCloseUserModal,
    resetPasswordForm,
    resetNameForm,
  };
}