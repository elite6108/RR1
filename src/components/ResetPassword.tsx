import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Icon } from '@iconify/react';

interface ResetPasswordProps {
  onBackToLogin: () => void;
}

export function ResetPassword({ onBackToLogin }: ResetPasswordProps) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string>('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showResetForm, setShowResetForm] = useState(true);
  const [needsEmail, setNeedsEmail] = useState(false);

  // Parse the URL hash to extract token and check for errors
  useEffect(() => {
    // Parse the hash from the URL
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const token = params.get('access_token');
    const type = params.get('type');

    console.log("URL hash:", hash);
    console.log("Access token value:", token);
    console.log("Has valid token:", !!token);
    console.log("Token length:", token?.length);
    console.log("Has recovery type:", type === 'recovery');
    console.log("Has expired error:", hash.includes('error=expired_token'));

    // Check for token in hash
    if (token && type === 'recovery') {
      setAccessToken(token);
      // Check if it's a short token (usually 6 digits) or a long JWT
      const isShortToken = token.length < 20;
      console.log("Is short token:", isShortToken);
      
      // If it's a short token and we don't have an email, we need to ask for it
      if (isShortToken && !getUserEmail()) {
        setNeedsEmail(true);
      }
    } else if (hash.includes('error=expired_token')) {
      setMessage({
        type: 'error',
        text: 'The recovery link has expired. Please request a new one.'
      });
      setShowResetForm(false);
    }
    
    // Debug info
    console.log("Full URL:", window.location.href);
    console.log("Current origin:", window.location.origin);
    console.log("Current pathname:", window.location.pathname);
  }, []);

  // Check session on component mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        console.log('Current session on load:', data);
      } catch (error) {
        console.error('Error checking session:', error);
      }
    };
    
    checkSession();
  }, []);

  // Get user email from localStorage (if it exists)
  const getUserEmail = () => {
    try {
      const storedEmail = localStorage.getItem('passwordResetEmail');
      return storedEmail || '';
    } catch (e) {
      return '';  
    }
  };

  // Handle form submission
  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate passwords match
    if (newPassword !== confirmPassword) {
      setMessage({
        type: 'error',
        text: 'Passwords do not match'
      });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      console.log('Starting password update process');
      
      if (accessToken && accessToken.length < 20) {
        console.log('Detected short recovery code:', accessToken);
        
        // IMPORTANT: For short tokens, we need to update the user directly with the code
        // and NOT try to verify it first (which was causing the failure)
        try {
          const { error } = await supabase.auth.updateUser({
            password: newPassword
          });
          
          if (error) {
            console.error('Direct password update failed:', error);
            // If direct update fails, try the OTP approach
            // Make sure we have a valid email - iOS Safari might have issues with localStorage
            if (!userEmail) {
              console.log('Email missing for OTP verification - attempting to extract from URL');
              // Try to extract email from URL hash or query params if available
              const urlParams = new URLSearchParams(window.location.search);
              const emailParam = urlParams.get('email');
              
              if (emailParam) {
                setUserEmail(emailParam);
                console.log('Email extracted from URL:', emailParam);
              }
            }
            
            if (!userEmail) {
              throw new Error('Email is required for password reset with a recovery code');
            }
            
            console.log('Using email for verification:', userEmail);
            const { error: otpError } = await supabase.auth.verifyOtp({
              email: userEmail, // Now we're sure it's not empty
              token: accessToken || '', // Ensure token is never null
              type: 'recovery'
            });
            
            if (otpError) {
              throw otpError;
            } else {
              // If OTP verification succeeds, try updating password again
              const { error: updateError } = await supabase.auth.updateUser({
                password: newPassword
              });
              
              if (updateError) throw updateError;
            }
          }
        } catch (finalError) {
          // Last resort - try with resetPasswordForEmail if we have user's email
          if (userEmail) {
            console.log('Attempting password reset with email and token');
            const { error: resetError } = await supabase.auth.resetPasswordForEmail(userEmail, {
              redirectTo: window.location.origin
            });
            
            if (resetError) throw resetError;
          } else {
            throw finalError;
          }
        }
      } else {
        // For long JWT tokens, first set the session
        console.log('Using standard JWT token approach');
        
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken || '', // Ensure access_token is never null
          refresh_token: ''
        });
        
        if (sessionError) {
          console.error('Error setting session:', sessionError);
          throw sessionError;
        }
        
        // Then update the password
        const { error } = await supabase.auth.updateUser({
          password: newPassword
        });
        
        if (error) {
          console.error('Error updating password:', error);
          throw error;
        }
      }

      console.log('Password successfully updated');
      setMessage({
        type: 'success',
        text: 'Your password has been updated successfully!'
      });
      
      // Clean up any stored email
      try {
        localStorage.removeItem('passwordResetEmail');
      } catch (e) {
        console.log('Could not clear localStorage');
      }
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        onBackToLogin();
      }, 2000);
    } catch (err) {
      console.error('Password update error (detailed):', err);
      setMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'An error occurred',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Reset your password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your new password below
          </p>
        </div>

        {message && (
          <div 
            className={`p-4 rounded-md text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}
          >
            {message.text}
          </div>
        )}

        {!accessToken && !message && (
          <div className="p-4 rounded-md text-sm bg-yellow-50 text-yellow-700">
            No reset token found. Please use the link sent to your email.
          </div>
        )}

        {showResetForm && accessToken && (
          <form className="mt-8 space-y-6" onSubmit={handleResetPassword}>
            {/* Show email input if needed for short tokens */}
            {(needsEmail || !userEmail) && (
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Your Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={userEmail || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setUserEmail(e.target.value);
                    try {
                      localStorage.setItem('passwordResetEmail', e.target.value);
                    } catch (err) {
                      console.error('Could not save email to localStorage:', err);
                    }
                  }}
                  required
                  className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm mt-1"
                  placeholder="Email associated with your account"
                />
                <p className="mt-1 text-xs text-gray-500">
                  The email is required to verify your recovery code
                </p>
              </div>
            )}

            <div>
              <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <input
                id="new-password"
                name="newPassword"
                type="password"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm mt-1"
                value={newPassword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                id="confirm-password"
                name="confirmPassword"
                type="password"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm mt-1"
                value={confirmPassword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Icon icon="lucide:loader-2" className="animate-spin h-5 w-5" />
                ) : (
                  <>
                    <Icon icon="lucide:key" className="h-5 w-5 mr-2" />
                    Update Password
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
