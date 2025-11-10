import { useState } from 'react';
import { updateAdminPassword } from '../../../utils/adminPassword';

export function usePasswordManagement() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);
    setPasswordError('');
    setPasswordSuccess('');
    
    const result = await updateAdminPassword(currentPassword, newPassword);
    
    if (result.success) {
      setPasswordSuccess('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordError('');
    } else {
      setPasswordError(result.error || 'Failed to update password');
    }
    setLoading(false);
  };

  const clearMessages = () => {
    setPasswordError('');
    setPasswordSuccess('');
  };

  return {
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    passwordError,
    passwordSuccess,
    loading,
    handlePasswordUpdate,
    clearMessages
  };
}