import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../../../../lib/supabase';
import { Site, SiteCheckInFormData } from '../types';

export function useSiteCheckIn() {
  const { siteId } = useParams<{ siteId: string }>();
  const [site, setSite] = useState<Site | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<SiteCheckInFormData>({
    full_name: '',
    phone: '',
    company: '',
    email: '',
    fit_to_work: true
  });
  const [isCheckingIn, setIsCheckingIn] = useState(true);
  const [existingLog, setExistingLog] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showHealthCheck, setShowHealthCheck] = useState(false);
  const [healthCheckCompleted, setHealthCheckCompleted] = useState(false);

  useEffect(() => {
    if (siteId) {
      fetchSiteDetails();
      checkExistingLog();
    }
  }, [siteId]);

  const fetchSiteDetails = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('sites')
        .select('*')
        .eq('id', siteId)
        .single();

      if (error) throw error;
      setSite(data);
    } catch (error) {
      console.error('Error fetching site details:', error);
      setError('Failed to load site details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const checkExistingLog = async () => {
    try {
      // Get current user
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) return;
      
      // Check if user has an active log (checked in but not checked out)
      const { data, error } = await supabase
        .from('site_logs')
        .select('*')
        .eq('site_id', siteId)
        .eq('email', session.user.email)
        .is('logged_out_at', null)
        .order('logged_in_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        // PGRST116 is the error code when no rows are returned
        throw error;
      }

      if (data) {
        // User has an active log, they should check out
        setExistingLog(data);
        setIsCheckingIn(false);
        
        // Pre-fill form with existing data
        setFormData({
          full_name: data.full_name,
          phone: data.phone,
          company: data.company,
          email: data.email,
          fit_to_work: data.fit_to_work
        });
      } else {
        // No active log, user should check in
        // Pre-fill email if user is logged in
        if (session?.user?.email) {
          setFormData(prev => ({
            ...prev,
            email: session.user.email || ''
          }));
        }
      }
    } catch (error) {
      console.error('Error checking existing log:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleHealthCheckClose = () => {
    setShowHealthCheck(false);
  };

  const handleHealthCheckComplete = () => {
    setHealthCheckCompleted(true);
    setShowHealthCheck(false);
    // Automatically submit the form after health check is completed
    handleFormSubmit();
  };

  // Separate function to handle the actual form submission
  const handleFormSubmit = async () => {
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    
    try {
      // Get current user session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (isCheckingIn) {
        // Check in - use RPC function to bypass RLS
        const { error } = await supabase.rpc('create_site_log_with_health_check', {
          p_site_id: siteId,
          p_full_name: formData.full_name,
          p_phone: formData.phone,
          p_company: formData.company,
          p_email: formData.email,
          p_fit_to_work: formData.fit_to_work,
          p_health_check_completed: healthCheckCompleted
        });

        if (error) {
          console.error('Error creating site log:', error);
          // Fallback to direct insert if RPC fails (might still fail due to RLS)
          const { error: insertError } = await supabase
            .from('site_logs')
            .insert([
              {
                site_id: siteId,
                full_name: formData.full_name,
                phone: formData.phone,
                company: formData.company,
                email: formData.email,
                fit_to_work: formData.fit_to_work,
                logged_in_at: new Date().toISOString(),
                // If user is logged in, associate with their user ID
                ...(session?.user?.id ? { user_id: session.user.id } : {}),
                health_check_completed: healthCheckCompleted
              }
            ]);

          if (insertError) throw insertError;
        }
        
        setSuccess(`Successfully checked in to ${site?.name}`);
      } else {
        // Check out - use RPC function to bypass RLS
        const { error } = await supabase.rpc('update_site_log_checkout', {
          p_log_id: existingLog.id
        });

        if (error) {
          console.error('Error updating site log:', error);
          // Fallback to direct update if RPC fails
          const { error: updateError } = await supabase
            .from('site_logs')
            .update({ 
              logged_out_at: new Date().toISOString(),
              // If user is logged in, associate with their user ID
              ...(session?.user?.id ? { user_id: session.user.id } : {})
            })
            .eq('id', existingLog.id);

          if (updateError) throw updateError;
        }
        
        setSuccess(`Successfully checked out from ${site?.name}`);
        setExistingLog(null);
        setIsCheckingIn(true);
        setHealthCheckCompleted(false);
      }
    } catch (error: any) {
      console.error('Error during check-in/out:', error);
      setError(error.message || 'An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // If checking in and health check not completed, show health check modal
    if (isCheckingIn && !healthCheckCompleted) {
      setShowHealthCheck(true);
      return;
    }
    
    handleFormSubmit();
  };

  return {
    site,
    loading,
    formData,
    isCheckingIn,
    submitting,
    error,
    success,
    showHealthCheck,
    healthCheckCompleted,
    handleInputChange,
    handleSubmit,
    handleHealthCheckClose,
    handleHealthCheckComplete
  };
}
