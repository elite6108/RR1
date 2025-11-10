import React, { useState, useEffect, useMemo } from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { WorkerProfile } from '../WorkerProfile';
import { WorkerDashboardHeader } from '../WorkerDashboard/components/WorkerDashboardHeader';
import { RiskAssessmentTable } from './components/RiskAssessmentTable';
import { RiskAssessmentModal } from './components/RiskAssessmentModal';
import { useRiskAssessmentData } from './hooks/useRiskAssessmentData';
import { filterAndSortRiskAssessments, SortConfig, RiskAssessmentData } from './utils/riskAssessmentUtils';

export function WorkerRiskAssessment() {
  const navigate = useNavigate();
  const { riskAssessments, user, loading, error, refetchRiskAssessments } = useRiskAssessmentData();
  
  // UI State
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showRiskAssessmentModal, setShowRiskAssessmentModal] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState<RiskAssessmentData | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // Check for saved dark mode preference
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const handleSignOut = async () => {
    try {
      const { supabase } = await import('../../../lib/supabase');
      await supabase.auth.signOut();
      localStorage.removeItem('userType');
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

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

  const handleMyProfile = () => {
    setShowProfileModal(true);
    setIsMenuOpen(false);
  };

  const handleViewPDF = (assessment: RiskAssessmentData) => {
    setSelectedAssessment(assessment);
    setShowRiskAssessmentModal(true);
  };

  const handleCloseModal = () => {
    setShowRiskAssessmentModal(false);
    setSelectedAssessment(null);
  };

  const handleSignatureSuccess = () => {
    // Refresh the risk assessments list to update signature status
    refetchRiskAssessments();
  };

  const handleSignatureError = (message: string) => {
    console.error('Signature error:', message);
    // Could be enhanced to show user notification
  };

  const filteredAndSortedAssessments = useMemo(() => {
    return filterAndSortRiskAssessments(riskAssessments, searchQuery, sortConfig);
  }, [riskAssessments, searchQuery, sortConfig]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
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

        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Risk Assessments</h1>
        
        <RiskAssessmentTable
          riskAssessments={filteredAndSortedAssessments}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          sortConfig={sortConfig}
          setSortConfig={setSortConfig}
          onViewPDF={handleViewPDF}
          error={error}
          generatingPDF={false} // This will be managed by the modal
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

      <WorkerProfile 
        isOpen={showProfileModal} 
        onClose={() => setShowProfileModal(false)} 
        userEmail={user?.email}
      />

      <RiskAssessmentModal
        isOpen={showRiskAssessmentModal}
        onClose={handleCloseModal}
        assessment={selectedAssessment}
        user={user}
        onSignatureSuccess={handleSignatureSuccess}
        onSignatureError={handleSignatureError}
      />
    </div>
  );
}