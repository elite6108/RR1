import React, { useState } from 'react';
import {
  Home,
  Building,
  Users,
  FileText,
  ShoppingCart,
  HardHat,
  ChevronDown,
  ChevronUp,
  X,
  BookOpen,
  BarChart3,
  User,
  Settings,
  LogOut,
} from 'lucide-react';

interface SidebarProps {
  showSidebarNav: boolean;
  setShowSidebarNav: (show: boolean) => void;
  expandedSections: {
    quickActions: boolean;
    admin: boolean;
    customersAndProjects: boolean;
    purchaseOrders: boolean;
    quotes: boolean;
    healthAndSafety: boolean;
    training: boolean;
    reporting: boolean;
  };
  setExpandedSections: React.Dispatch<React.SetStateAction<{
    quickActions: boolean;
    admin: boolean;
    customersAndProjects: boolean;
    purchaseOrders: boolean;
    quotes: boolean;
    healthAndSafety: boolean;
    training: boolean;
    reporting: boolean;
  }>>;
  resetView: () => void;
  setActiveSection: (section: string) => void;
  modules: {
    admin: boolean;
    customersAndProjects: boolean;
    purchaseOrders: boolean;
    quotes: boolean;
    healthAndSafety: boolean;
    training: boolean;
    reporting: boolean;
  };
  // Action setters for different views
  setShowCalendar: (show: boolean) => void;
  setShowTasks: (show: boolean) => void;
  setShowToDo: (show: boolean) => void;
  setShowOrganisationChart: (show: boolean) => void;
  setShowStaff: (show: boolean) => void;
  setShowSubcontractors: (show: boolean) => void;
  setShowContractsManagement: (show: boolean) => void;
  setShowCustomersList: (show: boolean) => void;
  setShowProjectsList: (show: boolean) => void;
  setShowSitesList: (show: boolean) => void;
  setShowSiteSurvey: (show: boolean) => void;
  setShowWorkers: (show: boolean) => void;
  setShowLeadManagement: (show: boolean) => void;
  setShowPaymentInfo: (show: boolean) => void;
  setShowQuoteTerms: (show: boolean) => void;
  setShowQuotesList: (show: boolean) => void;
  setShowPurchaseOrdersList: (show: boolean) => void;
  setShowSuppliersList: (show: boolean) => void;
  setShowAccidents: (show: boolean) => void;
  setShowActionPlan: (show: boolean) => void;
  setShowCPP: (show: boolean) => void;
  setShowEquipment: (show: boolean) => void;
  setShowPolicies: (show: boolean) => void;
  setShowRAMSsubpage: (show: boolean) => void;
  setShowRiskAssessmentsubpage: (show: boolean) => void;
  setShowToolboxTalks: (show: boolean) => void;
  setShowVehicles: (show: boolean) => void;
  setShowDSE: (show: boolean) => void;
  setShowTrainingMatrix: (show: boolean) => void;
  setShowHolidays: (show: boolean) => void;
  setShowFiles: (show: boolean) => void;
  // Profile and Settings modal toggles (matching Navbar function names)
  setShowPasswordModal: (show: boolean) => void;
  setShowCompanySettingsModal: (show: boolean) => void;
  // Sign out function
  handleSignOut: () => void;
}

export function Sidebar({
  showSidebarNav,
  setShowSidebarNav,
  expandedSections,
  setExpandedSections,
  resetView,
  setActiveSection,
  modules,
  setShowCalendar,
  setShowTasks,
  setShowToDo,
  setShowOrganisationChart,
  setShowStaff,
  setShowSubcontractors,
  setShowContractsManagement,
  setShowCustomersList,
  setShowProjectsList,
  setShowSitesList,
  setShowSiteSurvey,
  setShowWorkers,
  setShowLeadManagement,
  setShowPaymentInfo,
  setShowQuoteTerms,
  setShowQuotesList,
  setShowPurchaseOrdersList,
  setShowSuppliersList,
  setShowAccidents,
  setShowActionPlan,
  setShowCPP,
  setShowEquipment,
  setShowPolicies,
  setShowRAMSsubpage,
  setShowRiskAssessmentsubpage,
  setShowToolboxTalks,
  setShowVehicles,
  setShowDSE,
  setShowTrainingMatrix,
  setShowHolidays,
  setShowFiles,
  setShowPasswordModal,
  setShowCompanySettingsModal,
  handleSignOut,
}: SidebarProps) {
  const [desktopExpandedSections, setDesktopExpandedSections] = useState<{[key: string]: boolean}>({});

  const allMenuItems = [
    {
      id: 'home',
      icon: Home,
      label: 'Home',
      action: () => resetView(),
      moduleKey: null, // Home is always visible
    },
    {
      id: 'company',
      icon: Building,
      label: 'Company',
      moduleKey: 'admin',
      submenu: [
        { label: 'Calendar', action: () => { resetView(); setShowCalendar(true); } },
        { label: 'Staff', action: () => { resetView(); setShowStaff(true); } },
        { label: 'Sub Contractors', action: () => { resetView(); setShowSubcontractors(true); } },
        { label: 'Organisation Chart', action: () => { resetView(); setShowOrganisationChart(true); } },
        { label: 'General Tasks', action: () => { resetView(); setShowTasks(true); } },
        { label: 'To Do', action: () => { resetView(); setShowToDo(true); } },
        { label: 'Files', action: () => { resetView(); setShowFiles(true); } },
        { label: 'Holidays', action: () => { resetView(); setShowHolidays(true); } },
      ]
    },
    {
      id: 'customers',
      icon: Users,
      label: 'Customers & Projects',
      moduleKey: 'customersAndProjects',
      submenu: [
        { label: 'Customers', action: () => { resetView(); setShowCustomersList(true); } },
        { label: 'Projects', action: () => { resetView(); setShowProjectsList(true); } },
        { label: 'Contracts', action: () => { resetView(); setShowContractsManagement(true); } },
        { label: 'Sites', action: () => { resetView(); setShowSitesList(true); } },
        { label: 'Site Survey', action: () => { resetView(); setShowSiteSurvey(true); } },
        { label: 'Workers', action: () => { resetView(); setShowWorkers(true); } },
      ]
    },
    {
      id: 'quotes',
      icon: FileText,
      label: 'Quotes',
      moduleKey: 'quotes',
      submenu: [
        { label: 'Quotes', action: () => { resetView(); setShowQuotesList(true); } },
        { label: 'Quote Terms', action: () => { resetView(); setShowQuoteTerms(true); } },
        { label: 'Lead Management', action: () => { resetView(); setShowLeadManagement(true); } },
        { label: 'Payment Terms', action: () => { resetView(); setShowPaymentInfo(true); } },
      ]
    },
    {
      id: 'purchase',
      icon: ShoppingCart,
      label: 'Purchase Orders',
      moduleKey: 'purchaseOrders',
      submenu: [
        { label: 'Suppliers', action: () => { resetView(); setShowSuppliersList(true); } },
        { label: 'Purchase Orders', action: () => { resetView(); setShowPurchaseOrdersList(true); } },
      ]
    },
    {
      id: 'health',
      icon: HardHat,
      label: 'Health & Safety',
      moduleKey: 'healthAndSafety',
      submenu: [
        { label: 'Safety Dashboard', action: () => { resetView(); setActiveSection('health'); } },
        { label: 'Accidents', action: () => { resetView(); setShowAccidents(true); } },
        { label: 'Action Plan', action: () => { resetView(); setShowActionPlan(true); } },
        { label: 'CPP', action: () => { resetView(); setShowCPP(true); } },
        { label: 'Equipment Management', action: () => { resetView(); setShowEquipment(true); } },
        { label: 'Policies', action: () => { resetView(); setShowPolicies(true); } },
        { label: 'Toolbox Talks', action: () => { resetView(); setShowToolboxTalks(true); } },
        { label: 'Vehicle Management', action: () => { resetView(); setShowVehicles(true); } },
        { label: 'Risk Assessments', action: () => { resetView(); setShowRiskAssessmentsubpage(true); } },
        { label: 'RAMS', action: () => { resetView(); setShowRAMSsubpage(true); } },
      ]
    },
    {
      id: 'training',
      icon: BookOpen,
      label: 'Training',
      moduleKey: 'training',
      submenu: [
        { label: 'DSE Assessment', action: () => { resetView(); setShowDSE(true); } },
        { label: 'Training Matrix', action: () => { resetView(); setShowTrainingMatrix(true); } },
      ]
    },
    {
      id: 'reporting',
      icon: BarChart3,
      label: 'Reporting',
      moduleKey: 'reporting',
      submenu: [
        { label: 'Accidents', action: () => { resetView(); setShowAccidents(true); } },
        { label: 'Action Plan', action: () => { resetView(); setShowActionPlan(true); } },
      ]
    },
  ];

  // Filter menu items based on enabled modules
  const menuItems = allMenuItems.filter(item => {
    if (item.moduleKey === null) return true; // Always show items without module key (like Home)
    return modules[item.moduleKey as keyof typeof modules];
  });

  const toggleDesktopSection = (sectionId: string) => {
    setDesktopExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  return (
    <>
      {/* Custom styles for responsive sidebar */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @media (min-width: 1698px) {
            .sidebar-1698 {
              display: flex !important;
            }
            .sidebar-mobile {
              display: none !important;
            }
          }
          @media (max-width: 1697px) {
            .sidebar-1698 {
              display: none !important;
            }
            .sidebar-mobile {
              display: block !important;
            }
          }
        `
      }} />

      {/* Desktop Sidebar - Always visible with icons, expands on hover */}
      <div className="sidebar-1698 fixed left-0 top-12 bottom-0 z-30">
        <div className="group bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out w-16 hover:w-64 flex flex-col shadow-lg h-full">
          <nav className="flex-1 pt-4 pb-4">
            <div className="space-y-1 px-2">
              {/* Profile and Settings buttons at top */}
              <div className="border-b border-gray-200 dark:border-gray-700 pb-2 mb-2">
                <button
                  onClick={() => setShowPasswordModal(true)}
                  className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                >
                  <div className="flex items-center">
                    <User className="h-5 w-5 flex-shrink-0" />
                    <span className="ml-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap overflow-hidden">
                      Profile
                    </span>
                  </div>
                </button>
                <button
                  onClick={() => setShowCompanySettingsModal(true)}
                  className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                >
                  <div className="flex items-center">
                    <Settings className="h-5 w-5 flex-shrink-0" />
                    <span className="ml-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap overflow-hidden">
                      Settings
                    </span>
                  </div>
                </button>
              </div>
              
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isExpanded = desktopExpandedSections[item.id];
                
                return (
                  <div key={item.id} className="relative">
                    <button
                      onClick={() => {
                        if (item.submenu) {
                          toggleDesktopSection(item.id);
                        } else if (item.action) {
                          item.action();
                        }
                      }}
                      className="w-full flex items-center justify-between px-3 py-3 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md group-hover:justify-between justify-center transition-all duration-200"
                    >
                      <div className="flex items-center">
                        <Icon className="h-5 w-5 flex-shrink-0" />
                        <span className="ml-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap overflow-hidden">
                          {item.label}
                        </span>
                      </div>
                      {item.submenu && (
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4 flex-shrink-0" />
                          ) : (
                            <ChevronDown className="h-4 w-4 flex-shrink-0" />
                          )}
                        </div>
                      )}
                    </button>
                    
                    {/* Submenu for expanded items */}
                    {isExpanded && item.submenu && (
                      <div className="mt-1 space-y-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {item.submenu.map((subItem, index) => (
                          <button
                            key={index}
                            onClick={subItem.action}
                            className="w-full text-left pl-12 pr-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors duration-200"
                          >
                            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap overflow-hidden">
                              {subItem.label}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
              
              {/* Sign out button at bottom of desktop sidebar */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center px-3 py-3 text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900 rounded-md group-hover:justify-start justify-center transition-all duration-200"
                >
                  <LogOut className="h-5 w-5 flex-shrink-0" />
                  <span className="ml-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap overflow-hidden">
                    Sign Out
                  </span>
                </button>
              </div>
            </div>
          </nav>
        </div>
      </div>

      {/* Mobile/Tablet Sidebar Overlay - Shows on mobile and tablet */}
      {showSidebarNav && (
        <div className="sidebar-mobile fixed inset-0 z-50">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowSidebarNav(false)}></div>
          <div className="fixed left-0 top-0 bottom-0 w-80 bg-white dark:bg-gray-800 shadow-xl overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Menu</h2>
              <button
                onClick={() => setShowSidebarNav(false)}
                className="p-2 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="p-4 space-y-4 pb-20">
              {/* Home */}
              <button
                onClick={() => {
                  resetView();
                  setShowSidebarNav(false);
                }}
                className="w-full flex items-center px-3 py-3 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
              >
                <Home className="h-5 w-5 flex-shrink-0 mr-3" />
                Home
              </button>

              {/* Profile and Settings buttons */}
              <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-4 space-y-2">
                <button
                  onClick={() => {
                    setShowPasswordModal(true);
                    setShowSidebarNav(false);
                  }}
                  className="w-full flex items-center px-3 py-3 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                >
                  <User className="h-5 w-5 flex-shrink-0 mr-3" />
                  Profile
                </button>
                <button
                  onClick={() => {
                    setShowCompanySettingsModal(true);
                    setShowSidebarNav(false);
                  }}
                  className="w-full flex items-center px-3 py-3 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                >
                  <Settings className="h-5 w-5 flex-shrink-0 mr-3" />
                  Settings
                </button>
              </div>

              {/* Company */}
              {modules.admin && (
                <div>
                  <button
                    onClick={() => setExpandedSections(prev => ({ ...prev, admin: !prev.admin }))}
                    className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 rounded-md"
                  >
                    <div className="flex items-center">
                      <Building className="h-5 w-5 flex-shrink-0 mr-3" />
                      Company
                    </div>
                    {expandedSections.admin ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </button>
                  {expandedSections.admin && (
                    <div className="ml-8 mt-2 space-y-1">
                      <button onClick={() => { resetView(); setShowCalendar(true); setShowSidebarNav(false); }} className="block w-full text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">Calendar</button>
                      <button onClick={() => { resetView(); setShowStaff(true); setShowSidebarNav(false); }} className="block w-full text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">Staff</button>
                      <button onClick={() => { resetView(); setShowSubcontractors(true); setShowSidebarNav(false); }} className="block w-full text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">Sub Contractors</button>
                      <button onClick={() => { resetView(); setShowOrganisationChart(true); setShowSidebarNav(false); }} className="block w-full text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">Organisation Chart</button>
                      <button onClick={() => { resetView(); setShowTasks(true); setShowSidebarNav(false); }} className="block w-full text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">General Tasks</button>
                      <button onClick={() => { resetView(); setShowToDo(true); setShowSidebarNav(false); }} className="block w-full text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">To Do</button>
                      <button onClick={() => { resetView(); setShowFiles(true); setShowSidebarNav(false); }} className="block w-full text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">Files</button>
                      <button onClick={() => { resetView(); setShowHolidays(true); setShowSidebarNav(false); }} className="block w-full text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">Holidays</button>
                    </div>
                  )}
                </div>
              )}

              {/* Customers & Projects */}
              {modules.customersAndProjects && (
                <div>
                  <button
                    onClick={() => setExpandedSections(prev => ({ ...prev, customersAndProjects: !prev.customersAndProjects }))}
                    className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 rounded-md"
                  >
                    <div className="flex items-center">
                      <Users className="h-5 w-5 flex-shrink-0 mr-3" />
                      Customers & Projects
                    </div>
                    {expandedSections.customersAndProjects ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </button>
                  {expandedSections.customersAndProjects && (
                    <div className="ml-8 mt-2 space-y-1">
                      <button onClick={() => { resetView(); setShowCustomersList(true); setShowSidebarNav(false); }} className="block w-full text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">Customers</button>
                      <button onClick={() => { resetView(); setShowProjectsList(true); setShowSidebarNav(false); }} className="block w-full text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">Projects</button>
                      <button onClick={() => { resetView(); setShowContractsManagement(true); setShowSidebarNav(false); }} className="block w-full text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">Contracts</button>
                      <button onClick={() => { resetView(); setShowSitesList(true); setShowSidebarNav(false); }} className="block w-full text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">Sites</button>
                      <button onClick={() => { resetView(); setShowSiteSurvey(true); setShowSidebarNav(false); }} className="block w-full text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">Site Survey</button>
                      <button onClick={() => { resetView(); setShowWorkers(true); setShowSidebarNav(false); }} className="block w-full text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">Workers</button>
                    </div>
                  )}
                </div>
              )}

              {/* Quotes */}
              {modules.quotes && (
                <div>
                  <button
                    onClick={() => setExpandedSections(prev => ({ ...prev, quotes: !prev.quotes }))}
                    className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 rounded-md"
                  >
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 flex-shrink-0 mr-3" />
                      Quotes
                    </div>
                    {expandedSections.quotes ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </button>
                  {expandedSections.quotes && (
                    <div className="ml-8 mt-2 space-y-1">
                      <button onClick={() => { resetView(); setShowQuotesList(true); setShowSidebarNav(false); }} className="block w-full text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">Quotes</button>
                      <button onClick={() => { resetView(); setShowQuoteTerms(true); setShowSidebarNav(false); }} className="block w-full text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">Quote Terms</button>
                      <button onClick={() => { resetView(); setShowLeadManagement(true); setShowSidebarNav(false); }} className="block w-full text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">Lead Management</button>
                      <button onClick={() => { resetView(); setShowPaymentInfo(true); setShowSidebarNav(false); }} className="block w-full text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">Payment Terms</button>
                    </div>
                  )}
                </div>
              )}

              {/* Purchase Orders */}
              {modules.purchaseOrders && (
                <div>
                  <button
                    onClick={() => setExpandedSections(prev => ({ ...prev, purchaseOrders: !prev.purchaseOrders }))}
                    className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 rounded-md"
                  >
                    <div className="flex items-center">
                      <ShoppingCart className="h-5 w-5 flex-shrink-0 mr-3" />
                      Purchase Orders
                    </div>
                    {expandedSections.purchaseOrders ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </button>
                  {expandedSections.purchaseOrders && (
                    <div className="ml-8 mt-2 space-y-1">
                      <button onClick={() => { resetView(); setShowSuppliersList(true); setShowSidebarNav(false); }} className="block w-full text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">Suppliers</button>
                      <button onClick={() => { resetView(); setShowPurchaseOrdersList(true); setShowSidebarNav(false); }} className="block w-full text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">Purchase Orders</button>
                    </div>
                  )}
                </div>
              )}

              {/* Health & Safety */}
              {modules.healthAndSafety && (
                <div>
                  <button
                    onClick={() => setExpandedSections(prev => ({ ...prev, healthAndSafety: !prev.healthAndSafety }))}
                    className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 rounded-md"
                  >
                    <div className="flex items-center">
                      <HardHat className="h-5 w-5 flex-shrink-0 mr-3" />
                      Health & Safety
                    </div>
                    {expandedSections.healthAndSafety ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </button>
                  {expandedSections.healthAndSafety && (
                    <div className="ml-8 mt-2 space-y-1">
                      <button onClick={() => { resetView(); setActiveSection('health'); setShowSidebarNav(false); }} className="block w-full text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">Safety Dashboard</button>
                      <button onClick={() => { resetView(); setShowAccidents(true); setShowSidebarNav(false); }} className="block w-full text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">Accidents</button>
                      <button onClick={() => { resetView(); setShowActionPlan(true); setShowSidebarNav(false); }} className="block w-full text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">Action Plan</button>
                      <button onClick={() => { resetView(); setShowCPP(true); setShowSidebarNav(false); }} className="block w-full text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">CPP</button>
                      <button onClick={() => { resetView(); setShowEquipment(true); setShowSidebarNav(false); }} className="block w-full text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">Equipment Management</button>
                      <button onClick={() => { resetView(); setShowPolicies(true); setShowSidebarNav(false); }} className="block w-full text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">Policies</button>
                      <button onClick={() => { resetView(); setShowToolboxTalks(true); setShowSidebarNav(false); }} className="block w-full text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">Toolbox Talks</button>
                      <button onClick={() => { resetView(); setShowVehicles(true); setShowSidebarNav(false); }} className="block w-full text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">Vehicle Management</button>
                      <button onClick={() => { resetView(); setShowRiskAssessmentsubpage(true); setShowSidebarNav(false); }} className="block w-full text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">Risk Assessments</button>
                      <button onClick={() => { resetView(); setShowRAMSsubpage(true); setShowSidebarNav(false); }} className="block w-full text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">RAMS</button>
                    </div>
                  )}
                </div>
              )}

              {/* Training */}
              {modules.training && (
                <div>
                  <button
                    onClick={() => setExpandedSections(prev => ({ ...prev, training: !prev.training }))}
                    className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 rounded-md"
                  >
                    <div className="flex items-center">
                      <BookOpen className="h-5 w-5 flex-shrink-0 mr-3" />
                      Training
                    </div>
                    {expandedSections.training ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </button>
                  {expandedSections.training && (
                    <div className="ml-8 mt-2 space-y-1">
                      <button onClick={() => { resetView(); setShowDSE(true); setShowSidebarNav(false); }} className="block w-full text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">DSE Assessment</button>
                      <button onClick={() => { resetView(); setShowTrainingMatrix(true); setShowSidebarNav(false); }} className="block w-full text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">Training Matrix</button>
                    </div>
                  )}
                </div>
              )}

              {/* Reporting */}
              {modules.reporting && (
                <div>
                  <button
                    onClick={() => setExpandedSections(prev => ({ ...prev, reporting: !prev.reporting }))}
                    className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 rounded-md"
                  >
                    <div className="flex items-center">
                      <BarChart3 className="h-5 w-5 flex-shrink-0 mr-3" />
                      Reporting
                    </div>
                    {expandedSections.reporting ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </button>
                  {expandedSections.reporting && (
                    <div className="ml-8 mt-2 space-y-1">
                      <button onClick={() => { resetView(); setShowAccidents(true); setShowSidebarNav(false); }} className="block w-full text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">Accidents</button>
                      <button onClick={() => { resetView(); setShowActionPlan(true); setShowSidebarNav(false); }} className="block w-full text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">Action Plan</button>
                    </div>
                  )}
                </div>
              )}

              {/* Sign Out */}
              <button
                onClick={handleSignOut}
                className="w-full flex items-center px-3 py-3 text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900 rounded-md"
              >
                <LogOut className="h-5 w-5 flex-shrink-0 mr-3" />
                Sign Out
              </button>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
