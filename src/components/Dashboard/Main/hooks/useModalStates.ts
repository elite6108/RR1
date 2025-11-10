import { useState } from 'react';

export function useModalStates() {
  // Password and settings modals
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showCompanySettingsModal, setShowCompanySettingsModal] = useState(false);
  const [showModulesModal, setShowModulesModal] = useState(false);
  const [showAppInfoModal, setShowAppInfoModal] = useState(false);
  const [showLicensesModal, setShowLicensesModal] = useState(false);

  // Form modals
  const [showPurchaseOrderModal, setShowPurchaseOrderModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showQuoteModal, setShowQuoteModal] = useState(false);

  // List and management views
  const [showProjectsList, setShowProjectsList] = useState(false);
  const [showSuppliersList, setShowSuppliersList] = useState(false);
  const [showCustomersList, setShowCustomersList] = useState(false);
  const [showPurchaseOrdersList, setShowPurchaseOrdersList] = useState(false);
  const [showPurchaseOrdersDashboard, setShowPurchaseOrdersDashboard] = useState(false);
  const [showQuotesList, setShowQuotesList] = useState(false);
  const [showQuoteTerms, setShowQuoteTerms] = useState(false);
  const [showPaymentInfo, setShowPaymentInfo] = useState(false);
  const [showLeadManagement, setShowLeadManagement] = useState(false);
  const [showContractsManagement, setShowContractsManagement] = useState(false);

  // Health & Safety views
  const [showRAMS, setShowRAMS] = useState(false);
  const [showRAMSsubpage, setShowRAMSsubpage] = useState(false);
  const [showRiskAssessmentsubpage, setShowRiskAssessmentsubpage] = useState(false);
  const [showCPP, setShowCPP] = useState(false);
  const [showCDM, setShowCDM] = useState(false);
  const [showCOSHH, setShowCOSHH] = useState(false);
  const [showFire, setShowFire] = useState(false);
  const [showFirstAid, setShowFirstAid] = useState(false);
  const [showToolboxTalks, setShowToolboxTalks] = useState(false);
  const [showAccidents, setShowAccidents] = useState(false);
  const [showPolicies, setShowPolicies] = useState(false);
  const [showSignage, setShowSignage] = useState(false);
  const [showVehicles, setShowVehicles] = useState(false);
  const [showEquipment, setShowEquipment] = useState(false);
  const [showOrganisationChart, setShowOrganisationChart] = useState(false);
  const [showDSE, setShowDSE] = useState(false);
  const [showTrainingMatrix, setShowTrainingMatrix] = useState(false);
  const [showActionPlan, setShowActionPlan] = useState(false);
  const [showGuidance, setShowGuidance] = useState(false);
  const [showHealthSafety, setShowHealthSafety] = useState(false);

  // Admin views
  const [showStaff, setShowStaff] = useState(false);
  const [showTasks, setShowTasks] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showSubcontractors, setShowSubcontractors] = useState(false);
  const [showFiles, setShowFiles] = useState(false);
  const [showHolidays, setShowHolidays] = useState(false);
  const [showToDo, setShowToDo] = useState(false);

  // Dashboard views
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const [showCustomerProjectsDashboard, setShowCustomerProjectsDashboard] = useState(false);
  const [showQuotesDashboard, setShowQuotesDashboard] = useState(false);
  const [showReportingDashboard, setShowReportingDashboard] = useState(false);
  const [showTrainingDashboard, setShowTrainingDashboard] = useState(false);

  // Other views
  const [showSitesList, setShowSitesList] = useState(false);
  const [showWorkers, setShowWorkers] = useState(false);
  const [showSiteSurvey, setShowSiteSurvey] = useState(false);
  const [showDriversList, setShowDriversList] = useState(false);
  const [showVehicleChecklist, setShowVehicleChecklist] = useState(false);
  const [showEquipmentChecklist, setShowEquipmentChecklist] = useState(false);
  // New H&S subsections
  const [showPPE, setShowPPE] = useState(false);
  const [showSiteInspections, setShowSiteInspections] = useState(false);
  const [showWorkshop, setShowWorkshop] = useState(false);
  const [showEquipmentInspections, setShowEquipmentInspections] = useState(false);

  // Reset all views function
  const resetAllViews = () => {
    // Form modals
    setShowPurchaseOrderModal(false);
    setShowProjectModal(false);
    setShowQuoteModal(false);
    
    // List and management views
    setShowProjectsList(false);
    setShowSuppliersList(false);
    setShowCustomersList(false);
    setShowPurchaseOrdersList(false);
    setShowPurchaseOrdersDashboard(false);
    setShowQuotesList(false);
    setShowQuoteTerms(false);
    setShowPaymentInfo(false);
    setShowLeadManagement(false);
    setShowContractsManagement(false);
    
    // Health & Safety views
    setShowRAMS(false);
    setShowRAMSsubpage(false);
    setShowRiskAssessmentsubpage(false);
    setShowCPP(false);
    setShowCDM(false);
    setShowCOSHH(false);
    setShowFire(false);
    setShowToolboxTalks(false);
    setShowAccidents(false);
    setShowPolicies(false);
    setShowSignage(false);
    setShowVehicles(false);
    setShowEquipment(false);
    setShowOrganisationChart(false);
    setShowDSE(false);
    setShowTrainingMatrix(false);
    setShowActionPlan(false);
    setShowGuidance(false);
    setShowHealthSafety(false);
    
    // Admin views
    setShowStaff(false);
    setShowTasks(false);
    setShowCalendar(false);
    setShowSubcontractors(false);
    setShowFiles(false);
    setShowHolidays(false);
    setShowToDo(false);
    
    // Dashboard views
    setShowAdminDashboard(false);
    setShowCustomerProjectsDashboard(false);
    setShowQuotesDashboard(false);
    setShowReportingDashboard(false);
    setShowTrainingDashboard(false);
    
    // Other views
    setShowSitesList(false);
    setShowWorkers(false);
    setShowSiteSurvey(false);
    setShowDriversList(false);
    setShowVehicleChecklist(false);
    setShowEquipmentChecklist(false);
    setShowPPE(false);
    setShowSiteInspections(false);
    setShowWorkshop(false);
    setShowEquipmentInspections(false);
  };

  return {
    // Password and settings modals
    showPasswordModal,
    setShowPasswordModal,
    showCompanySettingsModal,
    setShowCompanySettingsModal,
    showModulesModal,
    setShowModulesModal,
    showAppInfoModal,
    setShowAppInfoModal,
    showLicensesModal,
    setShowLicensesModal,

    // Form modals
    showPurchaseOrderModal,
    setShowPurchaseOrderModal,
    showProjectModal,
    setShowProjectModal,
    showQuoteModal,
    setShowQuoteModal,

    // List and management views
    showProjectsList,
    setShowProjectsList,
    showSuppliersList,
    setShowSuppliersList,
    showCustomersList,
    setShowCustomersList,
    showPurchaseOrdersList,
    setShowPurchaseOrdersList,
    showPurchaseOrdersDashboard,
    setShowPurchaseOrdersDashboard,
    showQuotesList,
    setShowQuotesList,
    showQuoteTerms,
    setShowQuoteTerms,
    showPaymentInfo,
    setShowPaymentInfo,
    showLeadManagement,
    setShowLeadManagement,
    showContractsManagement,
    setShowContractsManagement,

    // Health & Safety views
    showRAMS,
    setShowRAMS,
    showRAMSsubpage,
    setShowRAMSsubpage,
    showRiskAssessmentsubpage,
    setShowRiskAssessmentsubpage,
    showCPP,
    setShowCPP,
    showCDM,
    setShowCDM,
    showCOSHH,
    setShowCOSHH,
    showFire,
    setShowFire,
    showFirstAid,
    setShowFirstAid,
    showToolboxTalks,
    setShowToolboxTalks,
    showAccidents,
    setShowAccidents,
    showPolicies,
    setShowPolicies,
    showSignage,
    setShowSignage,
    showVehicles,
    setShowVehicles,
    showEquipment,
    setShowEquipment,
    showOrganisationChart,
    setShowOrganisationChart,
    showDSE,
    setShowDSE,
    showTrainingMatrix,
    setShowTrainingMatrix,
    showActionPlan,
    setShowActionPlan,
    showGuidance,
    setShowGuidance,
    showHealthSafety,
    setShowHealthSafety,

    // Admin views
    showStaff,
    setShowStaff,
    showTasks,
    setShowTasks,
    showCalendar,
    setShowCalendar,
    showSubcontractors,
    setShowSubcontractors,
    showFiles,
    setShowFiles,
    showHolidays,
    setShowHolidays,
    showToDo,
    setShowToDo,

    // Dashboard views
    showAdminDashboard,
    setShowAdminDashboard,
    showCustomerProjectsDashboard,
    setShowCustomerProjectsDashboard,
    showQuotesDashboard,
    setShowQuotesDashboard,
    showReportingDashboard,
    setShowReportingDashboard,
    showTrainingDashboard,
    setShowTrainingDashboard,

    // Other views
    showSitesList,
    setShowSitesList,
    showWorkers,
    setShowWorkers,
    showSiteSurvey,
    setShowSiteSurvey,
    showDriversList,
    setShowDriversList,
    showVehicleChecklist,
    setShowVehicleChecklist,
    showEquipmentChecklist,
    setShowEquipmentChecklist,
    showPPE,
    setShowPPE,
    showSiteInspections,
    setShowSiteInspections,
    showWorkshop,
    setShowWorkshop,
    showEquipmentInspections,
    setShowEquipmentInspections,

    // Reset function
    resetAllViews,
  };
}