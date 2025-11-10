import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from '../App';
import { AuthForm } from './AuthForm';
import { ForgotPassword } from './ForgotPassword';
import { ResetPassword } from './ResetPassword';
import { CheckIn } from './Projects/CheckIn';
import { supabase } from '../lib/supabase';

// Auth protection wrapper component
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [hasSession, setHasSession] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Check if user has a session
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      setHasSession(!!data.session);
      setLoading(false);
    };
    
    checkSession();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!hasSession) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<AuthForm />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route 
          path="/check-in" 
          element={
            <ProtectedRoute>
              <CheckIn />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
