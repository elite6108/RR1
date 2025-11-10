import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Icon } from '@iconify/react';
import { Turnstile } from '@marsidev/react-turnstile';
import Aurora from '../styles/aurora/Aurora';

interface AuthFormProps {
  onForgotPassword: () => void;
}

export function AuthForm({ onForgotPassword }: AuthFormProps) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLogin, setIsLogin] = useState(true);
  const [userType, setUserType] = useState<'staff' | 'worker'>('staff');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [domain, setDomain] = useState('');
  const [token, setToken] = useState('');
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Function to verify token using Edge Function
  const verifyToken = async (tokenToVerify: string): Promise<boolean> => {
    try {
      console.log('Verifying token:', tokenToVerify);
      
      const { data, error } = await supabase.functions.invoke('verify-token', {
        body: { 
          token: tokenToVerify
        }
      });

      if (error) {
        console.error('Edge function error:', error);
        return false;
      }

      console.log('Edge function response:', data);
      console.log('Token valid:', data?.valid);
      
      return data?.valid || false;
    } catch (error) {
      console.error('Token verification error:', error);
      return false;
    }
  };

  // Function to verify CAPTCHA using Edge Function
  const verifyCaptcha = async (captchaTokenToVerify: string): Promise<boolean> => {
    try {
      console.log('Verifying CAPTCHA token:', captchaTokenToVerify);
      
      const { data, error } = await supabase.functions.invoke('verify-captcha', {
        body: { 
          token: captchaTokenToVerify
        }
      });

      if (error) {
        console.error('CAPTCHA verification error:', error);
        return false;
      }

      console.log('CAPTCHA verification response:', data);
      
      return data?.valid || false;
    } catch (error) {
      console.error('CAPTCHA verification error:', error);
      return false;
    }
  };

  // Apply the background color based on the selected tab
  useEffect(() => {
    const body = document.querySelector('body');
    if (body) {
      // Aurora should always have dark background in both light and dark modes
      body.style.backgroundColor = userType === 'staff' ? 'rgb(31 41 55)' : 'rgb(55 65 81)';
    }

    // Clean up when component unmounts
    return () => {
      if (body) {
        body.style.backgroundColor = '';
      }
    };
  }, [userType, isDarkMode]);

  // Initialize dark mode from localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    setSuccessMessage('');
    
    // Reset form to login state
    setIsLogin(true);
    setEmail('');
    setPassword('');
    setName('');
    setCompany('');
    setPhone('');
    setToken('');
    setCaptchaToken(null);
    setCaptchaVerified(false);
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Verify CAPTCHA first
      if (!captchaToken) {
        throw new Error('Please complete the CAPTCHA verification.');
      }

      if (!captchaVerified) {
        const isCaptchaValid = await verifyCaptcha(captchaToken);
        if (!isCaptchaValid) {
          throw new Error('CAPTCHA verification failed. Please try again.');
        }
        setCaptchaVerified(true);
      }

      if (isLogin) {
        // First, validate user type BEFORE authentication to prevent wrong tab login
        const { data: validationData, error: validationError } = await supabase.functions.invoke('validate-user-type', {
          body: { 
            email,
            requestedUserType: userType
          }
        });

        if (validationError) {
          console.error('User type validation error:', validationError);
          throw new Error('Unable to validate user type. Please try again.');
        }

        if (!validationData?.valid) {
          throw new Error(validationData?.error || 'Invalid user type for this login method.');
        }

        // Now proceed with authentication since user type is valid
        const { error: authError, data } =
          await supabase.auth.signInWithPassword({
            email,
            password,
          });

        if (authError) throw authError;

        if (!data.user) {
          throw new Error('Authentication failed. Please try again.');
        }

        // For worker login, handle first-time login worker record creation
        if (userType === 'worker') {
          // Check if worker record exists, create if it doesn't (first login after signup)
          const { data: workerData, error: workerError } = await supabase
            .from('workers')
            .select('*')
            .eq('email', email)
            .single();

          if (workerError && workerError.code === 'PGRST116') {
            // Worker record doesn't exist, create it now (first login after signup)
            try {
              const { data: userData } = await supabase.auth.getUser();
              if (userData.user) {
                const newWorkerData = {
                  email,
                  full_name: userData.user.user_metadata?.full_name || '',
                  phone: userData.user.user_metadata?.phone || '',
                  company: userData.user.user_metadata?.company || '',
                  user_id: userData.user.id,
                  is_active: true,
                  last_short_questionnaire_date: null,
                  last_main_questionnaire_date: null,
                  created_at: new Date().toISOString(),
                  dob: null,
                  national_insurance: null,
                  emergency_contact_name: null,
                  emergency_contact_phone: null,
                  photo_url: null,
                };

                const { error: createError } = await supabase
                  .from('workers')
                  .insert([newWorkerData]);

                if (createError) {
                  console.error('Failed to create worker record on first login:', createError);
                  // Don't throw error here, let them proceed and create record later
                }
              }
            } catch (createErr) {
              console.error('Error creating worker record on first login:', createErr);
              // Don't throw error here, let them proceed
            }
          }
        }

        // Store user type in local storage for dashboard routing
        localStorage.setItem('userType', userType);

        // Redirect based on user type
        if (userType === 'worker') {
          navigate('/workerdashboard');
        } else {
          navigate('/dashboard');
        }
      } else {
        // For signup, verify token first
        const isValidToken = await verifyToken(token);
        if (!isValidToken) {
          throw new Error('Invalid token. Please check your token and try again.');
        }

        // Create the auth user
        const { error: authError, data } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
            data: {
              user_type: userType,
              full_name: name,
              company: company,
              phone: phone
            },
          },
        });

        if (authError) throw authError;

        // For workers, we'll create the worker record after email verification during first login
        // This avoids RLS issues during signup process

        // Store user type in local storage for when they verify and login
        localStorage.setItem('userType', userType);

        // After signup, user needs to verify email - show success modal instead of redirecting
        setError(null);
        setSuccessMessage(`Account created successfully! Please check your email (${email}) for a verification link. After verifying your email, you can log in to access your ${userType === 'worker' ? 'worker' : 'staff'} dashboard.`);
        setShowSuccessModal(true);
        
        // Reset form to login state
        setIsLogin(true);
        setEmail('');
        setPassword('');
        setName('');
        setCompany('');
        setPhone('');
        setToken('');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Authentication error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Aurora Background */}
      <div className="absolute inset-0 w-full h-full">
        <Aurora
          colorStops={["#3A29FF", "#FF94B4", "#FF3232", "#000"]}
          blend={isDarkMode ? 0.6 : 0.4}
          amplitude={1.2}
          speed={0.5}
        />
      </div>
      
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/20 dark:bg-black/40"></div>

      {/* Dark mode toggle button */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={toggleDarkMode}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-md hover:bg-white/90 dark:hover:bg-gray-700/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {isDarkMode ? (
            <Icon icon="lucide:sun" className="h-4 w-4" />
          ) : (
            <Icon icon="lucide:moon" className="h-4 w-4" />
          )}
        </button>
      </div>

      <div className="max-w-md w-full space-y-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md p-8 rounded-xl shadow-xl border border-white/20 dark:border-gray-700/20 relative z-10">
        <div className="text-center">
          <img 
            src={isDarkMode ? "/images/stonepad-logo-w.png" : "/images/stonepad-logo-b.png"}
            alt="StonePad Logo" 
            className="mx-auto max-w-[250px] h-auto"
          />
        </div>
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            {isLogin ? 'Sign in to your account' : 'Create new account'}
          </h2>
        </div>

        {/* User Type Tabs */}
        <div className="flex rounded-md shadow-sm mb-6">
          <button
            type="button"
            onClick={() => setUserType('staff')}
            className={`relative inline-flex items-center w-2/5 px-4 py-2 rounded-l-md border ${
              userType === 'staff'
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
            } text-sm font-medium focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500`}
          >
            <Icon icon="lucide:building-2" className="h-5 w-5 mr-2" />
            Staff
          </button>
          <button
            type="button"
            onClick={() => setUserType('worker')}
            className={`relative inline-flex items-center w-3/5 px-4 py-2 rounded-r-md border ${
              userType === 'worker'
                ? 'bg-amber-600 text-white border-amber-600'
                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
            } text-sm font-medium focus:z-10 focus:outline-none focus:ring-1 focus:ring-amber-500`}
          >
            <Icon icon="lucide:hard-hat" className="h-5 w-5 mr-2" />
            Subcontractor | Worker
          </button>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 p-4 rounded-md text-sm border border-red-200 dark:border-red-800">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleAuth}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              />
            </div>

            {/* Additional fields for worker signup */}
            {!isLogin && userType === 'worker' && (
              <>
                <div>
                  <label htmlFor="name" className="sr-only">
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Full Name (no middle name)"
                    value={name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="company" className="sr-only">
                    Company
                  </label>
                  <input
                    id="company"
                    name="company"
                    type="text"
                    required
                    className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Company"
                    value={company}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCompany(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="sr-only">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Phone Number"
                    value={phone}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="workerToken" className="sr-only">
                    Token
                  </label>
                  <input
                    id="workerToken"
                    name="workerToken"
                    type="text"
                    required
                    className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Token"
                    value={token}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setToken(e.target.value)}
                  />
                </div>
                <p className="text-gray-600 dark:text-gray-400">After you sign up, you will receive an email with a link to verify your account.</p>
              </>
            )}

            {/* Additional fields for staff signup */}
            {!isLogin && userType === 'staff' && (
              <>
                <div>
                  <label htmlFor="token" className="sr-only">
                    Token
                  </label>
                  <input
                    id="token"
                    name="token"
                    type="text"
                    required
                    className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Token"
                    value={token}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setToken(e.target.value)}
                  />
                </div>
                <p className="text-gray-600 dark:text-gray-400">After you sign up, you will receive an email with a link to verify your account.</p>
              </>
            )}

            {/* Turnstile CAPTCHA for all authentication scenarios */}
            <div>
              <label htmlFor="captchaToken" className="sr-only">
                Captcha Verification
              </label>
              <Turnstile
                siteKey="0x4AAAAAABkqb9JJNsTgnhVt"
                theme={isDarkMode ? "dark" : "light"}
                onSuccess={(token: string) => {
                  setCaptchaToken(token);
                  setCaptchaVerified(false); // Reset verification status when new token is received
                }}
                onExpire={() => {
                  setCaptchaToken(null);
                  setCaptchaVerified(false);
                }}
                onError={() => {
                  setCaptchaToken(null);
                  setCaptchaVerified(false);
                }}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                userType === 'staff'
                  ? 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500'
                  : 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500'
              }`}
            >
              {loading ? (
                <Icon icon="lucide:loader-2" className="animate-spin h-5 w-5" />
              ) : isLogin ? (
                <>
                  <Icon icon="lucide:log-in" className="h-5 w-5 mr-2" />
                  Sign in
                </>
              ) : (
                <>
                  <Icon icon="lucide:user-plus" className="h-5 w-5 mr-2" />
                  Sign up
                </>
              )}
            </button>
          </div>
        </form>

        <div className="text-center space-y-2">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setCaptchaToken(null);
              setCaptchaVerified(false);
              setError(null);
            }}
            className={`hover:underline text-sm font-medium ${
              userType === 'staff'
                ? 'text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300'
                : 'text-amber-600 hover:text-amber-500 dark:text-amber-400 dark:hover:text-amber-300'
            }`}
          >
            {isLogin
              ? "Don't have an account? Sign up"
              : 'Already have an account? Sign in'}
          </button>
          
          {isLogin && (
            <div className="text-center">
              <button
                onClick={onForgotPassword}
                type="button"
                className={`hover:underline text-sm font-medium ${
                  userType === 'staff'
                    ? 'text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300'
                    : 'text-amber-600 hover:text-amber-500 dark:text-amber-400 dark:hover:text-amber-300'
                }`}
              >
                Forgot your password?
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6 relative">
            {/* Success Icon */}
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-green-100 dark:bg-green-900/30 rounded-full">
              <Icon icon="lucide:check-circle" className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            
            {/* Title */}
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white text-center mb-4">
              Account Created Successfully!
            </h3>
            
            {/* Message */}
            <p className="text-gray-600 dark:text-gray-300 text-center mb-6 leading-relaxed">
              {successMessage}
            </p>
            
            {/* Button */}
            <button
              onClick={handleSuccessModalClose}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              Continue to Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
