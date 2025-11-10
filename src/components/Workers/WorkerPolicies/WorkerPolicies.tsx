import React, { useState, useEffect, useMemo } from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { WorkerProfile } from '../WorkerProfile';
import { WorkerDashboardHeader } from '../WorkerDashboard/components/WorkerDashboardHeader';
import { PolicyTable } from './components/PolicyTable';
import { PolicyModal } from './components/PolicyModal';
import { NotificationModal } from './components/NotificationModal';
import { usePolicyData } from './hooks/usePolicyData';
import { filterAndSortPolicies, SortConfig } from './utils/policyUtils';

export function WorkerPolicies() {
  const navigate = useNavigate();
  const { policies, user, loading, error, refetchPolicies } = usePolicyData();
  
  // UI State
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState<any>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Notification modal states
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [notificationData, setNotificationData] = useState<{
    type: 'success' | 'error';
    title: string;
    message: string;
  }>({
    type: 'success',
    title: '',
    message: ''
  });

  useEffect(() => {
    // Check for saved dark mode preference
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('darkMode', String(newMode));

    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleSignOut = async () => {
    try {
      const { supabase } = await import('../../../lib/supabase');
      await supabase.auth.signOut();
      localStorage.removeItem('userType');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleMyProfile = () => {
    setShowProfileModal(true);
    setIsMenuOpen(false);
  };

  const showNotification = (type: 'success' | 'error', title: string, message: string) => {
    setNotificationData({ type, title, message });
    setShowNotificationModal(true);
  };

  const handleOpenPolicy = (policy: any) => {
    setSelectedPolicy(policy);
    setShowPolicyModal(true);
  };

  const handleClosePolicyModal = () => {
    setShowPolicyModal(false);
    setSelectedPolicy(null);
  };

  const handleSignatureSuccess = (message: string) => {
    showNotification('success', 'Policy Signed Successfully!', message);
  };

  const handleSignatureError = (message: string) => {
    showNotification('error', 'Failed to Save Signature', message);
  };

  const filteredAndSortedPolicies = useMemo(() => {
    return filterAndSortPolicies(policies, searchQuery, sortConfig);
  }, [policies, searchQuery, sortConfig]);

  if (loading && policies.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
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
            onClick={() => navigate('/worker-dashboard')}
            className="px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Top Navigation Bar */}
      <WorkerDashboardHeader
        user={user}
        isDarkMode={isDarkMode}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        toggleDarkMode={toggleDarkMode}
        handleMyProfile={handleMyProfile}
        handleSignOut={handleSignOut}
      />

      {/* Main Content */}
      <div className="py-6 px-4 sm:px-6 lg:px-8 flex-grow">
        <button
          onClick={() => navigate('/worker-dashboard')}
          className="mb-4 inline-flex items-center text-sm text-gray-600 hover:text-gray-900 dark:text-white dark:hover:text-gray-200"
        >
          <ArrowRight className="h-4 w-4 mr-1 rotate-180" />
          Back to Dashboard
        </button>

        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Company Policies</h1>
        
        <PolicyTable
          policies={filteredAndSortedPolicies}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          sortConfig={sortConfig}
          setSortConfig={setSortConfig}
          onOpenPolicy={handleOpenPolicy}
          error={error}
        />
      </div>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-4 mt-auto">
        <div className="px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 dark:text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} Worker Portal. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Profile Modal */}
      <WorkerProfile
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        userEmail={user?.email}
      />

      {/* Policy Modal */}
      <PolicyModal
        isOpen={showPolicyModal}
        onClose={handleClosePolicyModal}
        policy={selectedPolicy}
        user={user}
        onSignatureSuccess={handleSignatureSuccess}
        onSignatureError={handleSignatureError}
        onPolicyRefresh={refetchPolicies}
      />

      {/* Notification Modal */}
      <NotificationModal
        isOpen={showNotificationModal}
        onClose={() => setShowNotificationModal(false)}
        data={notificationData}
      />
    </div>
  );
}