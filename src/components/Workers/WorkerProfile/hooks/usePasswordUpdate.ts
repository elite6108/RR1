import { useState } from 'react';
import { supabase } from '../../../../lib/supabase';
import { PasswordData, validatePassword } from '../utils/profileUtils';

export const usePasswordUpdate = () => {
  const [passwordData, setPasswordData] = useState<PasswordData>({
    password: '',
    confirmPassword: '',
  });
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(false);
    setUpdatingPassword(true);

    try {
      // Validate passwords
      const validationError = validatePassword(passwordData);
      if (validationError) {
        setPasswordError(validationError);
        return;
      }

      // Update the password
      const { error } = await supabase.auth.updateUser({
        password: passwordData.password,
      });

      if (error) throw error;

      // Clear password fields and show success message
      setPasswordData({
        password: '',
        confirmPassword: '',
      });

      setPasswordSuccess(true);
      setTimeout(() => {
        setPasswordSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error updating password:', error);
      setPasswordError('Failed to update password. Please try again.');
    } finally {
      setUpdatingPassword(false);
    }
  };

  return {
    passwordData,
    passwordError,
    passwordSuccess,
    updatingPassword,
    handlePasswordChange,
    handleUpdatePassword
  };
};