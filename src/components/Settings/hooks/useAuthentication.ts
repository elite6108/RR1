import { useState } from 'react';
import { verifyAdminPassword } from '../../../utils/adminPassword';

export function useAuthentication() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const isValid = await verifyAdminPassword(password);
    if (isValid) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Incorrect password');
    }
    setLoading(false);
  };

  return {
    password,
    setPassword,
    isAuthenticated,
    error,
    loading,
    handlePasswordSubmit
  };
}