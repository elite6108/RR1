import { useState } from 'react';
import { verifyAdminPassword } from '../../../../utils/adminPassword';

export const useHealthQuestionnaireAdmin = () => {
  const [isAdminView, setIsAdminView] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAdminPasswordSubmit = async (password: string): Promise<void> => {
    setLoading(true);
    setPasswordError('');
    
    try {
      const isValid = await verifyAdminPassword(password);
      if (isValid) {
        setIsAdminView(true);
        setShowAdminModal(false);
        setAdminPassword('');
        setPasswordError('');
      } else {
        setPasswordError('Incorrect password');
      }
    } catch (error) {
      setPasswordError('Error verifying password');
    } finally {
      setLoading(false);
    }
  };

  const handleExitAdminView = (): void => {
    setIsAdminView(false);
  };

  const handleShowAdminModal = (): void => {
    setShowAdminModal(true);
    setPasswordError('');
  };

  const handleCloseAdminModal = (): void => {
    setShowAdminModal(false);
    setAdminPassword('');
    setPasswordError('');
  };

  return {
    isAdminView,
    showAdminModal,
    adminPassword,
    passwordError,
    loading,
    setAdminPassword,
    handleAdminPasswordSubmit,
    handleExitAdminView,
    handleShowAdminModal,
    handleCloseAdminModal,
  };
};
