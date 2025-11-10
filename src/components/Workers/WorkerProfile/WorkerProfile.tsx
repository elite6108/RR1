import React, { useState, useEffect } from 'react';
import { User, Save, X } from 'lucide-react';
import { useWorkerProfile } from './hooks/useWorkerProfile';
import { usePhotoUpload } from './hooks/usePhotoUpload';
import { usePasswordUpdate } from './hooks/usePasswordUpdate';
import { ProfileTab } from './components/ProfileTab';
import { ContactTab } from './components/ContactTab';
import { NITab } from './components/NITab';
import { EmergencyTab } from './components/EmergencyTab';
import { PasswordTab } from './components/PasswordTab';
WorkerProfile 

interface WorkerProfileProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string;
}

export function WorkerProfile({
  isOpen,
  onClose,
  userEmail,
}: WorkerProfileProps) {
  const [activeTab, setActiveTab] = useState('profile');
  
  const {
    formData,
    loading,
    saving,
    error,
    success,
    validationErrors,
    handleChange,
    updateFormData,
    handleSave
  } = useWorkerProfile(userEmail);

  const {
    imagePreview,
    loading: photoLoading,
    fileInputRef,
    handleFileChange,
    handleRemovePhoto,
    triggerFileInput,
    setImagePreviewFromFilename
  } = usePhotoUpload(
    formData.email,
    (filename) => updateFormData({ photo_url: filename }),
    (errorMsg) => console.error('Photo error:', errorMsg) // Could be enhanced to show user notification
  );

  const {
    passwordData,
    passwordError,
    passwordSuccess,
    updatingPassword,
    handlePasswordChange,
    handleUpdatePassword
  } = usePasswordUpdate();

  // Set image preview when formData changes
  useEffect(() => {
    if (formData.photo_url) {
      setImagePreviewFromFilename(formData.photo_url);
    }
  }, [formData.photo_url, setImagePreviewFromFilename]);

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSave(setActiveTab);
  };

  const handlePhotoRemove = () => {
    handleRemovePhoto(formData.photo_url);
  };

  if (!isOpen) return null;

  const tabs = [
    { key: 'profile', label: 'Profile' },
    { key: 'contact', label: 'Contact' },
    { key: 'ni', label: 'NI & Driving Lic.' },
    { key: 'emergency', label: 'Emergency Contacts' },
    { key: 'password', label: 'Update Password' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />

        <div className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-3xl">
          <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 px-4 py-3">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
              <User className="h-5 w-5 mr-2" />
              Worker Profile
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="h-full max-h-[70vh] overflow-y-auto px-4 py-5 sm:p-6">
            {loading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-500"></div>
              </div>
            ) : (
              <>
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-4">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded mb-4">
                    Profile saved successfully!
                  </div>
                )}

                <div className="border-b border-gray-200 dark:border-gray-700">
                  <nav className="-mb-px flex flex-wrap gap-x-6" aria-label="Tabs">
                    {tabs.map((tab) => (
                      <button
                        key={tab.key}
                        type="button"
                        onClick={() => setActiveTab(tab.key)}
                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm focus:outline-none ${
                          activeTab === tab.key
                            ? 'border-amber-500 text-amber-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </nav>
                </div>

                <div className="mt-6">
                  <form onSubmit={onSave} id="worker-profile-form">
                    {activeTab === 'profile' && (
                      <ProfileTab
                        formData={formData}
                        validationErrors={validationErrors}
                        onChange={handleChange}
                        imagePreview={imagePreview}
                        photoLoading={photoLoading}
                        fileInputRef={fileInputRef}
                        onFileChange={handleFileChange}
                        onRemovePhoto={handlePhotoRemove}
                        onUploadClick={triggerFileInput}
                      />
                    )}
                    
                    {activeTab === 'contact' && (
                      <ContactTab
                        formData={formData}
                        validationErrors={validationErrors}
                        onChange={handleChange}
                      />
                    )}
                    
                    {activeTab === 'ni' && (
                      <NITab
                        formData={formData}
                        onChange={handleChange}
                      />
                    )}
                    
                    {activeTab === 'emergency' && (
                      <EmergencyTab
                        formData={formData}
                        validationErrors={validationErrors}
                        onChange={handleChange}
                      />
                    )}
                  </form>

                  {activeTab === 'password' && (
                    <PasswordTab
                      passwordData={passwordData}
                      passwordError={passwordError}
                      passwordSuccess={passwordSuccess}
                      updatingPassword={updatingPassword}
                      onPasswordChange={handlePasswordChange}
                      onUpdatePassword={handleUpdatePassword}
                    />
                  )}
                </div>
              </>
            )}
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-3 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-3 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="worker-profile-form"
              onClick={onSave}
              disabled={saving || loading}
              className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-amber-500 border border-transparent rounded-md hover:bg-amber-600 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Profile
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}