import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export function CheckIn() {
  const [loading, setLoading] = useState(true);
  const [site, setSite] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean | string>(false);
  const [formData, setFormData] = useState({
    full_name: '',
    company: '',
    phone: '',
    email: '',
    fit_to_work: true
  });
  
  // Get site_id from URL query parameter
  const urlParams = new URLSearchParams(window.location.search);
  const siteId = urlParams.get('site_id');

  useEffect(() => {
    if (!siteId) {
      setError('No site ID provided. Please scan a valid QR code.');
      setLoading(false);
      return;
    }

    async function initialize() {
      try {
        // Fetch user details
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setError('You must be logged in to check in.');
          setLoading(false);
          return;
        }
        setUser(user);
        
        // Get worker data if available
        const { data: workerData } = await supabase
          .from('workers')
          .select('*')
          .eq('email', user.email)
          .maybeSingle();
          
        if (workerData) {
          setFormData({
            full_name: workerData.full_name || user.user_metadata?.full_name || '',
            company: workerData.company || user.user_metadata?.company || '',
            phone: workerData.phone || user.user_metadata?.phone || '',
            email: user.email || '',
            fit_to_work: true
          });
        } else if (user.user_metadata) {
          setFormData({
            full_name: user.user_metadata.full_name || '',
            company: user.user_metadata.company || '',
            phone: user.user_metadata.phone || '',
            email: user.email || '',
            fit_to_work: true
          });
        }

        // Fetch site details
        const { data: siteData, error: siteError } = await supabase
          .from('sites')
          .select('*')
          .eq('id', siteId)
          .single();

        if (siteError) throw siteError;
        setSite(siteData);
        
        // Check if user is already checked in to this site and not checked out
        const { data: existingLog, error: logError } = await supabase
          .from('site_logs')
          .select('*')
          .eq('site_id', siteId)
          .eq('email', user.email)
          .is('logged_out_at', null)
          .maybeSingle();
        
        if (!logError && existingLog) {
          // User is already checked in, offer to check out
          setSuccess('already-checked-in');
        }
      } catch (error) {
        console.error('Error initializing check-in:', error);
        setError('Failed to load site information. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    initialize();
  }, [siteId]);

  const handleCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!user || !site) throw new Error('Missing user or site information');

      const { error } = await supabase
        .from('site_logs')
        .insert([
          {
            site_id: siteId,
            email: formData.email,
            full_name: formData.full_name,
            company: formData.company,
            phone: formData.phone,
            fit_to_work: formData.fit_to_work,
            logged_in_at: new Date().toISOString()
          }
        ]);

      if (error) throw error;
      setSuccess(true);
    } catch (error) {
      console.error('Error checking in:', error);
      setError('Failed to check in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setLoading(true);
    setError(null);

    try {
      if (!user || !site) throw new Error('Missing user or site information');

      // Find the open log entry by email instead of user_id
      const { data: logEntry, error: findError } = await supabase
        .from('site_logs')
        .select('id')
        .eq('site_id', siteId)
        .eq('email', user.email)
        .is('logged_out_at', null)
        .single();

      if (findError) throw findError;

      // Update the log entry with checkout time
      const { error: updateError } = await supabase
        .from('site_logs')
        .update({
          logged_out_at: new Date().toISOString()
        })
        .eq('id', logEntry.id);

      if (updateError) throw updateError;
      setSuccess('checked-out');
    } catch (error) {
      console.error('Error checking out:', error);
      setError('Failed to check out. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
          <div className="text-red-500 text-xl mb-4">Error</div>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
          <button
            onClick={() => window.location.href = '/'}
            className="px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (success === true) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
          <div className="text-green-500 text-xl mb-4">Successfully Checked In!</div>
          <p className="text-gray-600 dark:text-gray-300 mb-2">
            You have checked in to {site.name}.
          </p>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Remember to check out when you leave the site.
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (success === 'checked-out') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
          <div className="text-green-500 text-xl mb-4">Successfully Checked Out!</div>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            You have checked out from {site.name}.
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (success === 'already-checked-in') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="text-amber-500 text-xl text-center mb-4">Already Checked In</div>
          <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
            You are already checked in to {site.name}. Would you like to check out?
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={handleCheckOut}
              className="px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Check Out'}
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-6">
          Check In to Site
        </h1>
        {site && (
          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">{site.name}</h2>
            <p className="text-gray-600 dark:text-gray-300">
              {site.address}, {site.town}, {site.county}, {site.postcode}
            </p>
          </div>
        )}
        <form onSubmit={handleCheckIn} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={formData.full_name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, full_name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Company
            </label>
            <input
              type="text"
              value={formData.company}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, company: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Phone
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>
          <div className="flex items-center">
            <input
              id="fit_to_work"
              type="checkbox"
              checked={formData.fit_to_work}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, fit_to_work: e.target.checked })}
              className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
            />
            <label htmlFor="fit_to_work" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              I am fit and well to work today
            </label>
          </div>
          <div className="mt-6 flex justify-between">
            <button
              type="button"
              onClick={() => window.location.href = '/'}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-amber-500 rounded-md hover:bg-amber-600"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Check In'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 