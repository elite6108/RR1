import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

// Import refactored components and hooks
import { WorkerDashboardHeader } from './components/WorkerDashboardHeader';
import { WorkerDashboardFooter } from './components/WorkerDashboardFooter';
import { WorkerWelcomeWidget } from './components/WorkerWelcomeWidget';
import { WorkerRow1Widgets } from './components/WorkerRow1Widgets';
import { WorkerRow2HRWidgets } from './components/WorkerRow2HRWidgets';
import { useWorkerDashboardData } from './hooks/useWorkerDashboardData';
import { useWorkerModals } from './hooks/useWorkerModals';
import { useFileHandling } from './hooks/useFileHandling';
import { isHealthQuestionnaireNeeded } from './utils/dashboardUtils';
import { WorkerDashboardProps } from './types/workerDashboardTypes';

// Import existing modals and components
import { WorkerProfile } from '../WorkerProfile';
import { MainQuestionnaire } from '../WorkerQuestionnaire/MainQuestionnaire';
import { ShortQuestionnaire } from '../WorkerQuestionnaire/ShortQuestionnaire';
import { QRScannerModal } from '../QRScannerModal.tsx';
import { SiteHealthCheck } from '../SiteHealthCheck';
import { NotificationModal } from '../NotificationModal';
import { WorkerAnnualLeave } from '../WorkerAnnualLeave/WorkerAnnualLeave';

export function WorkerDashboard({}: WorkerDashboardProps) {
  const navigate = useNavigate();
  const [isEditMode, setIsEditMode] = useState(false);

  // Use our custom hooks
  const {
    user,
    loading,
    currentTime,
    isDarkMode,
    companyName,
    handbookSignedDate,
    annualTrainingSignedDate,
    policyCounts,
    riskAssessmentCounts,
    fetchSignatureStatuses,
    toggleDarkMode
  } = useWorkerDashboardData();

  const {
    // Modal states
    showProfileModal,
    setShowProfileModal,
    showMainQuestionnaireModal,
    setShowMainQuestionnaireModal,
    showShortQuestionnaireModal,
    setShowShortQuestionnaireModal,
    showQRScannerModal,
    setShowQRScannerModal,
    showHealthCheckModal,
    setShowHealthCheckModal,
    showFileModal,
    setShowFileModal,
    showNotificationModal,
    setShowNotificationModal,
    showAnnualLeaveModal,
    setShowAnnualLeaveModal,
    isMenuOpen,
    setIsMenuOpen,
    
    // QR Scanner states
    scannedSiteId,
    setScannedSiteId,
    scannedSiteName,
    setScannedSiteName,
    pendingQRScan,
    setPendingQRScan,
    
    // Notification states
    notificationData,
    
    // Handlers
    handleMyProfile,
    handleAnnualLeave,
    showNotification,
    closeNotification
  } = useWorkerModals();

  const {
    // File states
    selectedFile,
    setSelectedFile,
    filePreviewUrl,
    setFilePreviewUrl,
    signature,
    canvasRef,
    
    // File handlers
    handleOpenFile: openFile,
    handleOpenAnnualTraining: openAnnualTraining,
    
    // Signature handlers
    handleSignatureStart,
    handleSignatureStartTouch,
    handleSignatureMove,
    handleSignatureMoveTouch,
    handleSignatureEnd,
    handleSignatureEndTouch,
    handleClearSignature,
    handleSubmitHandbookSignature
  } = useFileHandling();

  // Additional handlers
  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem('userType');
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleHealthQuestionnaire = () => {
    // Only open the questionnaire if it's needed or user hasn't done one yet
    if (
      user?.last_health_questionnaire === undefined ||
      user?.last_health_questionnaire === null ||
      isHealthQuestionnaireNeeded(user)
    ) {
      setIsEditMode(false); // New questionnaire
      setShowMainQuestionnaireModal(true);
      setIsMenuOpen(false);
    }
  };

  const handleEditHealthQuestionnaire = () => {
    // Open the questionnaire in edit mode for users who already have a valid questionnaire
    setIsEditMode(true); // Edit mode
    setShowMainQuestionnaireModal(true);
    setIsMenuOpen(false);
  };

  const handleStartQRScan = () => {
    setScannedSiteId(null);
    setScannedSiteName('');
    setPendingQRScan(true);
    
    // Show the health check modal first
    setShowHealthCheckModal(true);
  };

  const handleHealthCheckComplete = () => {
    // Close health check modal
    setShowHealthCheckModal(false);
    
    // Now show the QR scanner modal after health check is complete
    if (pendingQRScan) {
      setShowQRScannerModal(true);
      setPendingQRScan(false);
    }
  };

  const handleCompletedHealthCheck = () => {
    // After health check is completed, show QR scanner
    setShowShortQuestionnaireModal(false);
    setShowQRScannerModal(true);
  };

  const handleOpenFile = async () => {
    const success = await openFile();
    if (success) {
      setShowFileModal(true);
    }
  };

  const handleOpenAnnualTraining = async () => {
    const success = await openAnnualTraining();
    if (success) {
      setShowFileModal(true);
    }
  };

  const handleQRCodeScanned = async (decodedText: string) => {
    try {
      console.log('QR Code scanned:', decodedText);
      
      if (decodedText.startsWith('SITE:')) {
        const siteId = decodedText.replace('SITE:', '');
        console.log('Extracted Site ID:', siteId);
        
        // Fetch site details
        const { data: siteData, error: siteError } = await supabase
          .from('sites')
          .select('name')
          .eq('id', siteId)
          .single();
        
        if (siteError) {
          console.error('Error fetching site:', siteError);
          alert('Invalid site QR code. Site not found.');
          return;
        }
        
        setScannedSiteId(siteId);
        setScannedSiteName(siteData.name || 'Unknown Site');
        setShowQRScannerModal(false);
        
        // Navigate to the site check-in page
        navigate(`/site-checkin/${siteId}`);
      } else {
        alert('Invalid QR code format. Please scan a valid site QR code.');
      }
    } catch (error) {
      console.error('Error processing QR code:', error);
      alert('Failed to process QR code. Please try again.');
    }
  };

  const handleSubmitSignature = async () => {
    await handleSubmitHandbookSignature(
      () => {
        // Success callback
        const isAnnualTraining = selectedFile?.is_annual_training;
        const successMessage = isAnnualTraining ? 'Annual Training signed successfully!' : 'Employee Safety Handbook signed successfully!';
        
        setShowFileModal(false);
        showNotification('success', 'Document Signed', successMessage);
        
        // Refresh signature statuses
        if (user?.email) {
          fetchSignatureStatuses(user.email);
        }
      },
      (errorMessage) => {
        // Error callback
        showNotification('error', 'Signing Failed', errorMessage);
      }
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Header */}
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
        {/* Welcome Widget */}
        <WorkerWelcomeWidget
          user={user}
          currentTime={currentTime}
          companyName={companyName}
        />

        {/* First Row of Widgets */}
        <WorkerRow1Widgets
          user={user}
          handleMyProfile={handleMyProfile}
          handleHealthQuestionnaire={handleHealthQuestionnaire}
          handleEditHealthQuestionnaire={handleEditHealthQuestionnaire}
          handleStartQRScan={handleStartQRScan}
          handleAnnualLeave={handleAnnualLeave}
        />

        {/* Second Row of HR Widgets */}
        <WorkerRow2HRWidgets
          handbookSignedDate={handbookSignedDate}
          annualTrainingSignedDate={annualTrainingSignedDate}
          policyCounts={policyCounts || { signed: 0, unsigned: 0 }}
          riskAssessmentCounts={riskAssessmentCounts || { signed: 0, unsigned: 0 }}
          handleOpenFile={handleOpenFile}
          handleOpenAnnualTraining={handleOpenAnnualTraining}
        />
      </div>

      {/* Footer */}
      <WorkerDashboardFooter />

      {/* Modals */}
      <WorkerProfile 
        isOpen={showProfileModal} 
        onClose={() => setShowProfileModal(false)} 
        userEmail={user?.email}
      />

      <MainQuestionnaire 
        isOpen={showMainQuestionnaireModal}
        onClose={() => {
          setShowMainQuestionnaireModal(false);
          setIsEditMode(false); // Reset edit mode when closing
        }}
        userEmail={user?.email}
        isEditMode={isEditMode}
      />

      <ShortQuestionnaire 
        isOpen={showShortQuestionnaireModal}
        onClose={() => setShowShortQuestionnaireModal(false)}
        userEmail={user?.email}
        onScanQRCode={handleCompletedHealthCheck}
      />

      <QRScannerModal
        isOpen={showQRScannerModal}
        onClose={() => setShowQRScannerModal(false)}
        onQRCodeScanned={handleQRCodeScanned}
      />

      <SiteHealthCheck
        isOpen={showHealthCheckModal}
        onClose={() => {
          setShowHealthCheckModal(false);
          setPendingQRScan(false);
        }}
        onComplete={handleHealthCheckComplete}
        userEmail={user?.email}
        onScanQRCode={handleCompletedHealthCheck}
      />

      <WorkerAnnualLeave
        isOpen={showAnnualLeaveModal}
        onClose={() => setShowAnnualLeaveModal(false)}
        userEmail={user?.email}
      />

      <NotificationModal
        isOpen={showNotificationModal}
        onClose={closeNotification}
        type={notificationData.type}
        title={notificationData.title}
        message={notificationData.message}
      />

      {/* File Modal */}
      {showFileModal && selectedFile && createPortal(
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {selectedFile.name}
              </h3>
              <button
                onClick={() => {
                  setShowFileModal(false);
                  setSelectedFile(null);
                  setFilePreviewUrl(null);
                }}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="flex-1 overflow-auto">
              <div className="flex flex-col md:flex-row h-full">
                {/* PDF Viewer Section */}
                <div className="w-full md:w-4/5 p-4">
                  {filePreviewUrl ? (
                    <div className="h-[600px] border border-gray-300 rounded-md overflow-hidden">
                      <iframe
                        src={filePreviewUrl}
                        className="w-full h-full border-0"
                        title={selectedFile.name}
                        style={{ minHeight: '600px' }}
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-[600px] border border-gray-300 rounded-md bg-gray-50 dark:bg-gray-700">
                      <p className="text-gray-500 dark:text-gray-400">Loading document...</p>
                    </div>
                  )}
                </div>

                {/* Signature Section */}
                <div className="w-full md:w-1/5 border-t md:border-t-0 md:border-l border-gray-200 dark:border-gray-700 p-4">
                  <div className="space-y-4">
                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                      By signing, I confirm that I have read and understood this document.
                    </p>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={user?.full_name || ''}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Signature
                      </label>
                      <canvas
                        ref={canvasRef}
                        width={300}
                        height={150}
                        className="border border-gray-300 rounded-md bg-white dark:bg-gray-700 w-full"
                        onMouseDown={handleSignatureStart}
                        onMouseMove={handleSignatureMove}
                        onMouseUp={handleSignatureEnd}
                        onMouseLeave={handleSignatureEnd}
                        onTouchStart={handleSignatureStartTouch}
                        onTouchMove={handleSignatureMoveTouch}
                        onTouchEnd={handleSignatureEndTouch}
                        style={{ touchAction: 'none' }}
                      />
                      <button
                        onClick={handleClearSignature}
                        className="mt-2 text-sm text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300"
                      >
                        Clear Signature
                      </button>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Date
                      </label>
                      <input
                        type="text"
                        value={new Date().toLocaleDateString()}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                      <button
                        onClick={() => {
                          setShowFileModal(false);
                          setSelectedFile(null);
                          setFilePreviewUrl(null);
                        }}
                        className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSubmitSignature}
                        disabled={!signature}
                        className="px-4 py-2 text-sm font-medium text-white bg-amber-500 rounded-md hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}