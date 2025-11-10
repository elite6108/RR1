import React from 'react';
import { createPortal } from 'react-dom';
import { PasswordModal } from './PasswordModal';
import { LicensesModal } from './LicensesModal';
import { AppInfoModal } from './AppInfoModal';
import { CompanySettingsForm } from '../../../CompanySettings';
import { PurchaseOrderForm } from '../../../PurchaseOrders/PurchaseOrders/PurchaseOrderForm';
import { ProjectForm } from '../../../Projects/ProjectForm';
import { QuoteForm } from '../../../Quotes';
import { ModulesModal } from '../../../Settings';
import type { ModulesConfig } from '../types/dashboardTypes';

interface DashboardModalsProps {
  // Password modal
  showPasswordModal: boolean;
  setShowPasswordModal: (show: boolean) => void;
  selectedName: string;
  setSelectedName: (name: string) => void;
  nameError: string | null;
  nameSuccess: boolean;
  loadingName: boolean;
  onNameUpdate: () => void;
  newPassword: string;
  setNewPassword: (password: string) => void;
  confirmPassword: string;
  setConfirmPassword: (password: string) => void;
  passwordError: string | null;
  passwordSuccess: boolean;
  onPasswordUpdate: (e: React.FormEvent) => void;
  canCloseUserModal: () => boolean;

  // Company settings modal
  showCompanySettingsModal: boolean;
  setShowCompanySettingsModal: (show: boolean) => void;

  // Purchase order modal
  showPurchaseOrderModal: boolean;
  setShowPurchaseOrderModal: (show: boolean) => void;
  onPurchaseOrderSuccess: () => void;

  // Project modal
  showProjectModal: boolean;
  setShowProjectModal: (show: boolean) => void;
  onProjectSuccess: () => void;

  // Quote modal
  showQuoteModal: boolean;
  setShowQuoteModal: (show: boolean) => void;
  onQuoteSuccess: () => void;

  // Modules modal
  showModulesModal: boolean;
  setShowModulesModal: (show: boolean) => void;
  modules: ModulesConfig;
  setModules: (modules: ModulesConfig) => void;

  // App info modal
  showAppInfoModal: boolean;
  setShowAppInfoModal: (show: boolean) => void;
  isDarkMode: boolean;

  // Licenses modal
  showLicensesModal: boolean;
  setShowLicensesModal: (show: boolean) => void;
  licensesContent: string;
  loadingLicenses: boolean;
}

export function DashboardModals({
  // Password modal props
  showPasswordModal,
  setShowPasswordModal,
  selectedName,
  setSelectedName,
  nameError,
  nameSuccess,
  loadingName,
  onNameUpdate,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  passwordError,
  passwordSuccess,
  onPasswordUpdate,
  canCloseUserModal,

  // Company settings modal props
  showCompanySettingsModal,
  setShowCompanySettingsModal,

  // Purchase order modal props
  showPurchaseOrderModal,
  setShowPurchaseOrderModal,
  onPurchaseOrderSuccess,

  // Project modal props
  showProjectModal,
  setShowProjectModal,
  onProjectSuccess,

  // Quote modal props
  showQuoteModal,
  setShowQuoteModal,
  onQuoteSuccess,

  // Modules modal props
  showModulesModal,
  setShowModulesModal,
  modules,
  setModules,

  // App info modal props
  showAppInfoModal,
  setShowAppInfoModal,
  isDarkMode,

  // Licenses modal props
  showLicensesModal,
  setShowLicensesModal,
  licensesContent,
  loadingLicenses,
}: DashboardModalsProps) {
  return (
    <>
      {/* Password Modal */}
      {showPasswordModal && createPortal(
        <PasswordModal
          selectedName={selectedName}
          setSelectedName={setSelectedName}
          nameError={nameError}
          nameSuccess={nameSuccess}
          loadingName={loadingName}
          onNameUpdate={onNameUpdate}
          newPassword={newPassword}
          setNewPassword={setNewPassword}
          confirmPassword={confirmPassword}
          setConfirmPassword={setConfirmPassword}
          passwordError={passwordError}
          passwordSuccess={passwordSuccess}
          onPasswordUpdate={onPasswordUpdate}
          canCloseUserModal={canCloseUserModal}
          onClose={() => setShowPasswordModal(false)}
        />,
        document.body
      )}

      {/* Company Settings Modal */}
      {showCompanySettingsModal && createPortal(
        <CompanySettingsForm
          onClose={() => setShowCompanySettingsModal(false)}
        />,
        document.body
      )}

      {/* Purchase Order Modal */}
      {showPurchaseOrderModal && createPortal(
        <PurchaseOrderForm
          onClose={() => setShowPurchaseOrderModal(false)}
          onSuccess={onPurchaseOrderSuccess}
        />,
        document.body
      )}

      {/* Project Modal */}
      {showProjectModal && createPortal(
        <ProjectForm
          onClose={() => setShowProjectModal(false)}
          onSuccess={onProjectSuccess}
        />,
        document.body
      )}

      {/* Quote Modal */}
      {showQuoteModal && createPortal(
        <QuoteForm
          onClose={() => setShowQuoteModal(false)}
          onSuccess={onQuoteSuccess}
        />,
        document.body
      )}

      {/* Modules Modal */}
      {showModulesModal && createPortal(
        <ModulesModal
          modules={modules}
          onModuleChange={(module, value) => {
            setModules({
              ...modules,
              [module]: value
            });
          }}
          onClose={() => setShowModulesModal(false)}
        />,
        document.body
      )}

      {/* App Info Modal */}
      {showAppInfoModal && createPortal(
        <AppInfoModal
          isOpen={showAppInfoModal}
          onClose={() => setShowAppInfoModal(false)}
          isDarkMode={isDarkMode}
        />,
        document.body
      )}

      {/* Licenses Modal */}
      <LicensesModal
        isOpen={showLicensesModal}
        onClose={() => setShowLicensesModal(false)}
        licensesContent={licensesContent}
        loadingLicenses={loadingLicenses}
      />
    </>
  );
}