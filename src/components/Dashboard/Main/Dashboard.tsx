import React, { useEffect, useRef } from 'react';
import { supabase } from '../../../lib/supabase';
import { useTheme } from '../../../context/ThemeContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Sidebar } from './components/Sidebar';
import { WidgetsTop } from './components/WidgetsTop';
import { DashboardWidgets } from './components/DashboardWidgets';
import { DashboardModals } from './components/DashboardModals';
import { DashboardSections } from './components/DashboardSections';
import { useModalStates } from './hooks/useModalStates';
import { useUIStates } from './hooks/useUIStates';
import { useDataStates } from './hooks/useDataStates';
import { usePasswordManagement } from './hooks/usePasswordManagement';
import { useDataFetching } from './hooks/useDataFetching';
import type { DashboardProps, OverdueCounts } from './types/dashboardTypes';

// Utility component for red asterisk
const RedAsterisk: React.FC<{ text: string }> = ({ text }) => {
  if (typeof text !== 'string') {
    return text as any;
  }
  const parts = text.split('*');
  if (parts.length <= 1) {
    return <>{text}</>;
  }
  return (
    <>
      {parts.map((part, i) => (
        <React.Fragment key={i}>
          {part}
          {i < parts.length - 1 && <span className="text-red-500">*</span>}
        </React.Fragment>
      ))}
    </>
  );
};

export function Dashboard({ selectedProjectId }: DashboardProps) {
  // Theme hook must be first to maintain hook order
  const { isDarkMode, toggleDarkMode } = useTheme();
  
  // All other hooks
  const modalStates = useModalStates();
  const uiStates = useUIStates();
  const dataStates = useDataStates();
  const passwordManagement = usePasswordManagement();

  // Data fetching
  const { fetchData, fetchActionPlanCounts, fetchOverdueCounts, fetchCompanyName, fetchCalendarEvents } = useDataFetching({
    setOrders: dataStates.setOrders,
    setProjects: dataStates.setProjects,
    setSuppliers: dataStates.setSuppliers,
    setCustomers: dataStates.setCustomers,
    setQuotes: dataStates.setQuotes,
    setLeads: dataStates.setLeads,
    setWorkers: dataStates.setWorkers,
    setSites: dataStates.setSites,
    setActionPlanCounts: dataStates.setActionPlanCounts,
    setOverdueCounts: (counts: Partial<OverdueCounts>) => {
      dataStates.setOverdueCounts(prev => ({ ...prev, ...counts }));
    },
    setCompanyName: dataStates.setCompanyName,
    setCompanyPrefix: dataStates.setCompanyPrefix,
    setTodaysEvents: dataStates.setTodaysEvents,
    setUpcomingEvents: dataStates.setUpcomingEvents,
    setLoadingEvents: dataStates.setLoadingEvents,
    setLoading: uiStates.setLoading,
  });

  // Refs
  const navbarRef = useRef<HTMLElement>(null);

  // Computed values
  const totalAmount = dataStates.orders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
  
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
    }).format(num);
  };

  // Handlers
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  const resetView = () => {
    modalStates.resetAllViews();
    uiStates.setActiveSection(null);
  };

  const handleCloseUserModal = () => {
    if (passwordManagement.canCloseUserModal()) {
      modalStates.setShowPasswordModal(false);
      passwordManagement.resetPasswordForm();
      passwordManagement.resetNameForm();
    }
  };

  const handleNameUpdate = () => {
    passwordManagement.handleNameUpdate(dataStates.selectedName, dataStates.setSelectedName);
  };

  const onBack = () => {
    modalStates.resetAllViews();
    uiStates.setActiveSection('health');
    modalStates.setShowHealthSafety(true);
  };

  // Effects
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      h1, h2, h3, h4, h5, h6, p, label {
        --tw-text-opacity: 1;
        color: rgb(55 65 81 / var(--tw-text-opacity));
      }
      .dark h1, .dark h2, .dark h3, .dark h4, .dark h5, .dark h6, .dark p, .dark label {
        --tw-text-opacity: 1;
        color: rgb(209 213 219 / var(--tw-text-opacity));
      }
      h1:has(span.text-red-500), h2:has(span.text-red-500), h3:has(span.text-red-500), h4:has(span.text-red-500), h5:has(span.text-red-500), h6:has(span.text-red-500), p:has(span.text-red-500), label:has(span.text-red-500) {
        display: inline;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              const redSpans = element.querySelectorAll('span.text-red-500');
              redSpans.forEach((span) => {
                if (span.textContent === '*') {
                  const parent = span.parentElement;
                  if (parent && ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'P', 'LABEL'].includes(parent.tagName)) {
                    parent.style.display = 'inline';
                  }
                }
              });
            }
          });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      uiStates.setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, [uiStates.setCurrentTime]);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const { error } = await supabase.from('customers').select('id').limit(1);
        uiStates.setConnectionStatus(error ? 'error' : 'connected');
      } catch {
        uiStates.setConnectionStatus('error');
      }
    };

    checkConnection();
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, [uiStates.setConnectionStatus]);

  useEffect(() => {
    const getUserProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.user_metadata?.full_name) {
          dataStates.setSelectedName(user.user_metadata.full_name);
        }
      } catch (error) {
        console.error('Error getting user profile:', error);
      }
    };

    getUserProfile();
  }, [dataStates.setSelectedName]);

  useEffect(() => {
    fetchData();
    fetchActionPlanCounts();
    fetchOverdueCounts();
    fetchCompanyName();
    fetchCalendarEvents();
  }, []);

  // Check if any section is active
  const isAnySectionActive = () => {
    return Object.values(modalStates).some(state => 
      typeof state === 'boolean' && state === true
    ) || uiStates.activeSection !== null;
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
      <Navbar 
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        handleSignOut={handleSignOut}
        setShowPasswordModal={modalStates.setShowPasswordModal}
        setShowCompanySettingsModal={modalStates.setShowCompanySettingsModal}
        setShowProjectModal={modalStates.setShowProjectModal}
        setShowPurchaseOrderModal={modalStates.setShowPurchaseOrderModal}
        setShowQuoteModal={modalStates.setShowQuoteModal}
        setShowSidebarNav={uiStates.setShowSidebarNav}
        resetView={resetView}
        isMenuOpen={uiStates.isMenuOpen}
        setIsMenuOpen={uiStates.setIsMenuOpen}
        isNewMenuOpen={uiStates.isNewMenuOpen}
        setIsNewMenuOpen={uiStates.setIsNewMenuOpen}
        userDisplayName={dataStates.selectedName}
      />
      
      <Sidebar
        showSidebarNav={uiStates.showSidebarNav}
        setShowSidebarNav={uiStates.setShowSidebarNav}
        expandedSections={uiStates.expandedSections}
        setExpandedSections={uiStates.setExpandedSections}
        resetView={resetView}
        setActiveSection={uiStates.setActiveSection}
        modules={uiStates.modules}
        {...modalStates}
        handleSignOut={handleSignOut}
      />

      <div className="flex flex-1 bg-gray-100 pt-12">
        <main className="flex-1 main-content-1698">
          <style dangerouslySetInnerHTML={{
            __html: `
              @media (min-width: 1698px) {
                .main-content-1698 {
                  margin-left: 4rem !important;
                }
              }
              @media (max-width: 1697px) {
                .main-content-1698 {
                  margin-left: 0 !important;
                }
              }
              @media (min-width: 1023px) and (max-width: 1664px) {
                .custom-responsive-padding {
                  padding-left: 2rem !important;
                }
              }
            `
          }} />
          
          <div 
            className={`relative transition-all duration-200 ${
              uiStates.componentTransition 
                ? 'opacity-0 transform translate-y-1 scale-99' 
                : 'opacity-100 transform translate-y-0 scale-100'
            }`}
          >
            <div 
              className={`absolute inset-0 z-40 bg-gradient-to-br from-blue-500/8 via-indigo-500/8 to-purple-500/8 backdrop-blur-sm transition-all duration-200 ${
                uiStates.componentTransition 
                  ? 'opacity-100' 
                  : 'opacity-0 pointer-events-none'
              }`}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex flex-col items-center space-y-2">
                  <div className="relative">
                    <div className="w-10 h-10 border-2 border-white/20 border-t-white/50 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 w-10 h-10 border-2 border-transparent border-r-white/30 rounded-full animate-ping"></div>
                  </div>
                  <div className="text-white font-medium text-xs tracking-wide animate-pulse">
                    Loading...
                  </div>
                </div>
              </div>
            </div>

            <div className="max-w-7xl mx-auto py-6 pl-4 pr-4 sm:pl-0 sm:pr-6 custom-responsive-padding lg:pr-8">
              <div className="sm:px-0">
                <DashboardSections
                  // Data props
                  orders={dataStates.orders}
                  projects={dataStates.projects}
                  suppliers={dataStates.suppliers}
                  customers={dataStates.customers}
                  quotes={dataStates.quotes}
                  leads={dataStates.leads}
                  workers={dataStates.workers}
                  sites={dataStates.sites}
                  totalAmount={totalAmount}
                  overdueCounts={dataStates.overdueCounts}
                  
                  // UI props
                  activeSection={uiStates.activeSection}
                  setActiveSection={uiStates.setActiveSection}
                  
                  // All modal states
                  {...modalStates}
                  
                  // Utility functions
                  fetchData={fetchData}
                  formatNumber={formatNumber}
                  onBack={onBack}
                />
                
                {!isAnySectionActive() && (
                  <>
                    <WidgetsTop
                      isDarkMode={isDarkMode}
                      setShowCalendar={modalStates.setShowCalendar}
                      todaysEvents={dataStates.todaysEvents}
                      upcomingEvents={dataStates.upcomingEvents}
                      calendarCategories={dataStates.calendarCategories}
                      loadingEvents={dataStates.loadingEvents}
                      upcomingEventIndex={uiStates.upcomingEventIndex}
                      handlePrevEvent={() => {
                        if (uiStates.upcomingEventIndex > 0) {
                          uiStates.setUpcomingEventIndex(uiStates.upcomingEventIndex - 1);
                        }
                      }}
                      handleNextEvent={() => {
                        if (uiStates.upcomingEventIndex < dataStates.upcomingEvents.length - 1) {
                          uiStates.setUpcomingEventIndex(uiStates.upcomingEventIndex + 1);
                        }
                      }}
                    />
                    
                    <DashboardWidgets
                      isDarkMode={isDarkMode}
                      modules={uiStates.modules}
                      resetView={resetView}
                      setActiveSection={uiStates.setActiveSection}
                      {...modalStates}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      <Footer 
        companyName={dataStates.companyName}
        connectionStatus={uiStates.connectionStatus}
        isDarkMode={isDarkMode}
        setShowModulesModal={modalStates.setShowModulesModal}
        setShowAppInfoModal={modalStates.setShowAppInfoModal}
        hasUserName={!!dataStates.selectedName}
      />

      {/* All Modals */}
      <DashboardModals
        // Password modal props
        showPasswordModal={modalStates.showPasswordModal}
        setShowPasswordModal={modalStates.setShowPasswordModal}
        selectedName={dataStates.selectedName}
        setSelectedName={dataStates.setSelectedName}
        nameError={passwordManagement.nameError}
        nameSuccess={passwordManagement.nameSuccess}
        loadingName={passwordManagement.loadingName}
        onNameUpdate={handleNameUpdate}
        newPassword={passwordManagement.newPassword}
        setNewPassword={passwordManagement.setNewPassword}
        confirmPassword={passwordManagement.confirmPassword}
        setConfirmPassword={passwordManagement.setConfirmPassword}
        passwordError={passwordManagement.passwordError}
        passwordSuccess={passwordManagement.passwordSuccess}
        onPasswordUpdate={passwordManagement.handlePasswordUpdate}
        canCloseUserModal={passwordManagement.canCloseUserModal}

        // Other modal props
        showCompanySettingsModal={modalStates.showCompanySettingsModal}
        setShowCompanySettingsModal={modalStates.setShowCompanySettingsModal}
        showPurchaseOrderModal={modalStates.showPurchaseOrderModal}
        setShowPurchaseOrderModal={modalStates.setShowPurchaseOrderModal}
        onPurchaseOrderSuccess={() => {
          fetchData();
          modalStates.setShowPurchaseOrderModal(false);
        }}
        showProjectModal={modalStates.showProjectModal}
        setShowProjectModal={modalStates.setShowProjectModal}
        onProjectSuccess={() => {
          fetchData();
          modalStates.setShowProjectModal(false);
        }}
        showQuoteModal={modalStates.showQuoteModal}
        setShowQuoteModal={modalStates.setShowQuoteModal}
        onQuoteSuccess={() => {
          fetchData();
          modalStates.setShowQuoteModal(false);
        }}
        showModulesModal={modalStates.showModulesModal}
        setShowModulesModal={modalStates.setShowModulesModal}
        modules={uiStates.modules}
        setModules={uiStates.setModules}
        showAppInfoModal={modalStates.showAppInfoModal}
        setShowAppInfoModal={modalStates.setShowAppInfoModal}
        isDarkMode={isDarkMode}
        showLicensesModal={modalStates.showLicensesModal}
        setShowLicensesModal={modalStates.setShowLicensesModal}
        licensesContent={dataStates.licensesContent}
        loadingLicenses={dataStates.loadingLicenses}
      />

      {/* Mobile styles */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @media (max-width: 640px) {
            dl dt, dl dd {
              text-align: left !important;
            }
            .flex.items-center.justify-between {
              align-items: flex-start;
            }
            .flex.items-center.justify-between > div:last-child {
              text-align: right;
            }
          }
        `,
        }}
      />
    </div>
  );
}