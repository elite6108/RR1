import { useEffect, useState } from 'react';
import { Navigate, useNavigate, useLocation, useRoutes } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';

import { Dashboard } from './components/Dashboard';
import { WorkerDashboard } from './components/Workers/WorkerDashboard/WorkerDashboard';
import { AuthForm } from './components/AuthForm';
import { ForgotPassword } from './components/ForgotPassword';
import { ResetPassword } from './components/ResetPassword';
import { SiteCheckIn } from './components/Projects/SiteCheckIn';
import { WorkerRiskAssessment } from './components/Workers/WorkerRiskAssessment/WorkerRiskAssessment';
import { WorkerPolicies } from './components/Workers/WorkerPolicies/WorkerPolicies';
import { supabase } from './lib/supabase';
import type { User } from '@supabase/supabase-js';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [userType, setUserType] = useState<'staff' | 'worker' | null>(null);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<any[]>([]);
  const [pageTransition, setPageTransition] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  // Page transition effect
  useEffect(() => {
    // Trigger page transition animation on route change
    setPageTransition(true);
    
    // Reset transition after animation completes
    const timer = setTimeout(() => {
      setPageTransition(false);
    }, 300); // Animation duration

    return () => clearTimeout(timer);
  }, [location.pathname]);

  useEffect(() => {
    // Check if URL contains password reset parameters
    const checkForPasswordReset = () => {
      const hash = window.location.hash;
      if (hash && (hash.includes('type=recovery') || hash.includes('error_code=otp_expired'))) {
        window.location.href = '/reset-password';
      }
    };
    
    // Call the check immediately
    checkForPasswordReset();
    
    // Check current session and determine user type
    const checkUserSession = async () => {
      setLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          setUser(null);
          setUserType(null);
          localStorage.removeItem('userType');
          setLoading(false);
          return;
        }
        
        const user = session.user;
        setUser(user);
        
        // Determine user type from metadata, which is reliable across domains
        const metadataUserType = user.user_metadata?.user_type as 'staff' | 'worker' | null;

        if (metadataUserType === 'worker') {
          // If metadata says user is a worker, ensure their worker record exists
          try {
            const { data: workerData, error: workerError } = await supabase
              .from('workers')
              .select('id')
              .eq('user_id', user.id)
              .maybeSingle();

            // If no worker record found, create one. This handles the first login after verification.
            if (!workerError && !workerData) {
              console.log('Worker record not found. Creating one now...');
              const { error: createError } = await supabase.from('workers').insert({
                user_id: user.id,
                email: user.email,
                full_name: user.user_metadata?.full_name,
                company: user.user_metadata?.company,
                phone: user.user_metadata?.phone,
                is_active: true,
              });

              if (createError) {
                console.error('Failed to create worker record on first login:', createError);
                // Log error but don't block the user
              }
            }
          } catch (e) {
            console.error('Error ensuring worker record exists:', e);
          }
          
          // Set user type to worker and save to localStorage for subsequent fast loads
          setUserType('worker');
          localStorage.setItem('userType', 'worker');

        } else {
          // Default to staff for any other case
          setUserType('staff');
          localStorage.setItem('userType', 'staff');
        }
      } catch (error) {
        console.error('Session check error:', error);
        // Handle general session check errors
        setUser(null);
        setUserType(null);
      } finally {
        setLoading(false);
      }
    };

    checkUserSession();

    // Fetch all projects
    const fetchProjects = async () => {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setProjects(data || []);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();

    // Also add an event listener for hash changes (for reset password links)
    const handleHashChange = () => {
      checkForPasswordReset();
    };
    
    window.addEventListener('hashchange', handleHashChange);

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      try {
        if (!session?.user) {
          setUser(null);
          setUserType(null);
          localStorage.removeItem('userType');
          return;
        }
        
        setUser(session.user);
        
        // Use the stored user type if available (from login verification)
        const storedUserType = localStorage.getItem('userType') as 'staff' | 'worker' | null;
        
        if (storedUserType) {
          setUserType(storedUserType);
          return;
        }
        
        // If no stored type or on sign in event, re-check status
        if (event === 'SIGNED_IN' || !storedUserType) {
          try {
            const { data: workerData, error: workerError } = await supabase
              .from('workers')
              .select('*')
              .eq('email', session.user.email)
              .maybeSingle();
            
            if (!workerError && workerData) {
              setUserType('worker');
              localStorage.setItem('userType', 'worker');
            } else {
              setUserType('staff');
              localStorage.setItem('userType', 'staff');
            }
          } catch (error) {
            console.error('Error checking worker status on auth change:', error);
            setUserType('staff');
            localStorage.setItem('userType', 'staff');
          }
        }
      } catch (error) {
        console.error('Auth state change error:', error);
      }
    });

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const routes: RouteObject[] = [
    {
      path: '/',
      element: user ? (
        userType === 'worker' ? (
          <WorkerDashboard selectedProjectId={null} />
        ) : (
          <Dashboard selectedProjectId={null} />
        )
      ) : (
        <Navigate to="/login" state={{ from: location }} replace />
      )
    },
    ...(projects?.map((project) => ({
      path: `/project/${project.id}`,
      element: user ? (
        userType === 'worker' ? (
          <WorkerDashboard selectedProjectId={project.id} />
        ) : (
          <Dashboard selectedProjectId={project.id} />
        )
      ) : (
        <Navigate to="/login" state={{ from: location }} replace />
      )
    })) || []),
    {
      path: '/site-checkin/:siteId',
      element: <SiteCheckIn />
    },
    {
      path: '/login',
      element: !user ? (
        <AuthForm onForgotPassword={() => navigate('/forgot-password')} />
      ) : (
        <Navigate to="/" replace />
      )
    },
    {
      path: '/forgot-password',
      element: <ForgotPassword onBackToLogin={() => navigate('/login')} />
    },
    {
      path: '/reset-password',
      element: <ResetPassword onBackToLogin={() => navigate('/login')} />
    },
    {
      path: '/workers/risk-assessments',
      element: user ? (
        userType === 'worker' ? (
          <WorkerRiskAssessment />
        ) : (
          <Navigate to="/" replace />
        )
      ) : (
        <Navigate to="/login" state={{ from: location }} replace />
      )
    },
    {
      path: '/workers/policies',
      element: user ? (
        userType === 'worker' ? (
          <WorkerPolicies />
        ) : (
          <Navigate to="/" replace />
        )
      ) : (
        <Navigate to="/login" state={{ from: location }} replace />
      )
    },
    {
      path: '/worker-dashboard',
      element: user ? (
        userType === 'worker' ? (
          <WorkerDashboard selectedProjectId={null} />
        ) : (
          <Navigate to="/" replace />
        )
      ) : (
        <Navigate to="/login" state={{ from: location }} replace />
      )
    },
    {
      path: '*',
      element: <Navigate to="/" replace />
    }
  ];

  const element = useRoutes(routes);

  // Show loading screen while checking user status, but maintain consistent hook calls
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Main content with transition - only animate the route content */}
      <div className="relative">
        {/* Page Transition Overlay - Only for main content */}
        <div 
          className={`absolute inset-0 z-50 bg-gradient-to-br from-indigo-500/15 via-purple-500/15 to-pink-500/15 backdrop-blur-sm transition-all duration-300 ${
            pageTransition 
              ? 'opacity-100 scale-100' 
              : 'opacity-0 scale-95 pointer-events-none'
          }`}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center space-y-4">
              {/* Loading spinner */}
              <div className="relative">
                <div className="w-12 h-12 border-3 border-white/30 border-t-white/70 rounded-full animate-spin"></div>
                <div className="absolute inset-0 w-12 h-12 border-3 border-transparent border-r-white/50 rounded-full animate-ping"></div>
              </div>
              {/* Loading text */}
              <div className="text-white font-medium text-sm tracking-wide animate-pulse">
                Loading...
              </div>
            </div>
          </div>
        </div>

        {/* Route content with transition */}
        <div 
          className={`transition-all duration-300 ${
            pageTransition 
              ? 'opacity-0 transform translate-y-2 scale-99' 
              : 'opacity-100 transform translate-y-0 scale-100'
          }`}
        >
          {element}
        </div>
      </div>
    </div>
  );
}

export default App;