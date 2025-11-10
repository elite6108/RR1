import React, { useState } from 'react';
import { FormContainer, FormHeader, FormContent, FormFooter, StepIndicator } from '../../utils/form';
import type { ModulesModalProps } from './types';
import { useAuthentication } from './hooks/useAuthentication';
import { usePasswordManagement } from './hooks/usePasswordManagement';
import { AuthForm } from './components/AuthForm';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { ModulesTab, PasswordTab } from './components/tabs';



export function ModulesModal({
  onClose,
  modules,
  onModuleChange,
}: ModulesModalProps) {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [domainToDelete, setDomainToDelete] = useState('');
  
  const stepLabels = ['Modules', 'Password'];
  const totalSteps = stepLabels.length;
  
  // Custom hooks
  const { password, setPassword, isAuthenticated, error, loading: authLoading, handlePasswordSubmit } = useAuthentication();
  const {
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    passwordError,
    passwordSuccess,
    loading: passwordLoading,
    handlePasswordUpdate
  } = usePasswordManagement();

  const confirmDeleteDomain = async () => {
    setShowDeleteConfirm(false);
    setDomainToDelete('');
  };

  const cancelDeleteDomain = () => {
    setShowDeleteConfirm(false);
    setDomainToDelete('');
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <>
      <FormContainer isOpen={true} maxWidth="md">
        <FormHeader
          title="Settings"
          onClose={onClose}
        />

        {!isAuthenticated ? (
          <FormContent>
            <AuthForm
              password={password}
              setPassword={setPassword}
              onSubmit={handlePasswordSubmit}
              error={error}
              loading={authLoading}
              onAuthenticated={() => {}}
            />
          </FormContent>
        ) : (
          <>
            <FormContent>
              <StepIndicator
                currentStep={currentStep}
                totalSteps={totalSteps}
                stepLabels={stepLabels}
              />

              {/* Step Content */}
              {currentStep === 1 && (
                <ModulesTab modules={modules} onModuleChange={onModuleChange} />
              )}

              {currentStep === 2 && (
                <PasswordTab
                  currentPassword={currentPassword}
                  setCurrentPassword={setCurrentPassword}
                  newPassword={newPassword}
                  setNewPassword={setNewPassword}
                  confirmPassword={confirmPassword}
                  setConfirmPassword={setConfirmPassword}
                  onSubmit={handlePasswordUpdate}
                  passwordError={passwordError}
                  passwordSuccess={passwordSuccess}
                  loading={passwordLoading}
                />
              )}
            </FormContent>

            <FormFooter
              onCancel={onClose}
              onPrevious={handlePrevious}
              onNext={handleNext}
              showPrevious={true}
              isFirstStep={currentStep === 1}
              isLastStep={currentStep === totalSteps}
              nextButtonText={currentStep === 1 ? "Next (Optional)" : "Next"}
              previousButtonText="Previous"
              showSave={currentStep === 1}
              onSave={onClose}
              saveButtonText="Save Modules"
            />
          </>
        )}
      </FormContainer>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteConfirm}
        domainToDelete={domainToDelete}
        onConfirm={confirmDeleteDomain}
        onCancel={cancelDeleteDomain}
      />
    </>
  );
}
