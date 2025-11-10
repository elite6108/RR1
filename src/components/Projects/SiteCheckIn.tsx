import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SiteHealthCheck } from '../Workers/SiteHealthCheck';
import { useSiteCheckIn } from './Site/hooks/useSiteCheckIn';
import { SiteCheckInForm } from './Site/components/SiteCheckInForm';

export function SiteCheckIn() {
  const navigate = useNavigate();
  const {
    site,
    loading,
    formData,
    isCheckingIn,
    submitting,
    error,
    success,
    showHealthCheck,
    handleInputChange,
    handleSubmit,
    handleHealthCheckClose,
    handleHealthCheckComplete
  } = useSiteCheckIn();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (!site) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md max-w-md w-full">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Site Not Found</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">The site you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate('/')}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      {/* Health Check Modal */}
      <SiteHealthCheck 
        isOpen={showHealthCheck}
        onClose={handleHealthCheckClose}
        userEmail={formData.email}
        onComplete={handleHealthCheckComplete}
      />
      
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="mb-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
          >
            ← Back to Dashboard
          </button>
        </div>
        
        {error && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-400">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 text-green-700 dark:text-green-400">
            {success}
            <div className="mt-2">
              <button
                onClick={() => navigate('/')}
                className="text-sm font-medium text-green-700 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        )}
        
        <SiteCheckInForm
          site={site}
          formData={formData}
          isCheckingIn={isCheckingIn}
          submitting={submitting}
          success={success}
          onInputChange={handleInputChange}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
