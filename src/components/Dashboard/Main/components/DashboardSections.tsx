import React from 'react';
import { AdminDashboard } from '../../SubDashboard/AdminDashboard';
import { CustomerProjectsDashboard } from '../../SubDashboard/CustomerProjectsDashboard';
import { HealthSafetyDashboard } from '../../SubDashboard/HealthSafetyDashboard';
import { PurchaseOrdersDashboard } from '../../SubDashboard/PurchaseOrdersDashboard';
import { QuotesDashboard } from '../../SubDashboard/QuotesDashboard';
import { ReportingDashboard } from '../../SubDashboard/ReportingDashboard';
import { TrainingDashboard } from '../../SubDashboard/TrainingDashboard';
import { ContractsManagement } from '../../../Contracts/ContractsManagement';
import { LeadManagement } from '../../../Leads';
import { SiteLists } from '../../../Projects/SiteLists';
import { Workers } from '../../../Projects/Workers';
import { SiteSurvey } from '../../../SiteSurvey/SiteSurvey';

// Admin components
import { Staff } from '../../../Admin/Staff/Staff';
import { Tasks } from '../../../Admin/Tasks';
import { Calendar } from '../../../Admin/Calendar/Calendar';
import { Subcontractors } from '../../../Admin/Subcontractors';
import { Files } from '../../../Admin/Files/Files';
import { Holidays } from '../../../Admin/Holidays';
import { ToDo } from '../../../Admin/ToDo/ToDo';

// Customer & Project components
import { ProjectsList } from '../../../Projects/ProjectsList';
import { CustomersList } from '../../../Customers/CustomersList';

// Purchase Order components
import { SuppliersList } from '../../../PurchaseOrders/Suppliers/SuppliersList';
import { PurchaseOrdersList } from '../../../PurchaseOrders/PurchaseOrders';

// Quote components
import { QuotesList, QuoteTerms, PaymentInfo } from '../../../Quotes';

// Health & Safety components
import { HSToolboxTalks } from '../../../HealthSafety/ToolboxTalks/HSToolboxTalks';
import { HSAccidents } from '../../../HealthSafety/Accidents/HSAccidents';
import { HSPolicies } from '../../../HealthSafety/Policies/HSPolicies';
import { HSSignage } from '../../../HealthSafety/Signage/HSSignage';
import { HSVehicles } from '../../../HealthSafety/Vehicles/HSVehicles';
import { HSEquipment } from '../../../HealthSafety/Equipment/HSEquipment';
import { HSOrganisationChart } from '../../../HealthSafety/OrganisationChart/HSOrganisationChart';
import { RiskAssessmentsubpage } from '../../../HealthSafety/RiskAssessments/RiskAssessmentsubpage';
import { RAMSsubpage } from '../../../HealthSafety/RAMS/RAMSsubpage';
import { CPPsubpage } from '../../../HealthSafety/CPP/CPPsubpage';
import { CDM } from '../../../HealthSafety/CDM/CDM';
import { HSCoshh } from '../../../HealthSafety/COSHH/HSCoshh';
import { HSFire } from '../../../HealthSafety/Fire/HSFire';
import { HSFirstAid } from '../../../HealthSafety/FirstAid/HSFirstAid';
import { DisplayScreenAssessment } from '../../../HealthSafety/DSE/DisplayScreenAssessment';
import { TrainingMatrix } from '../../../HealthSafety/Training/TrainingMatrix';
import { ActionPlan } from '../../../HealthSafety/ActionPlan/ActionPlan';
import { HSGuidance } from '../../../HealthSafety/Guidance/HSGuidance';
import { HSPPE } from '../../../HealthSafety/PPE/HSPPE';
import { HSSiteInspections } from '../../../HealthSafety/SiteInspections/HSSiteInspections';
import { HSWorkshop } from '../../../HealthSafety/Workshop/HSWorkshop';

import type { 
  PurchaseOrder, 
  Project, 
  Supplier, 
  Customer, 
  Quote 
} from '../../../types/database';
import type { ActiveSection, OverdueCounts } from '../types/dashboardTypes';

interface DashboardSectionsProps {
  // Data
  orders: PurchaseOrder[];
  projects: Project[];
  suppliers: Supplier[];
  customers: Customer[];
  quotes: Quote[];
  leads: any[];
  workers: any[];
  sites: any[];
  totalAmount: number;
  overdueCounts: OverdueCounts;

  // Active section
  activeSection: ActiveSection;
  setActiveSection: (section: ActiveSection) => void;

  // Dashboard states
  showContractsManagement: boolean;
  setShowContractsManagement: (show: boolean) => void;
  showCustomerProjectsDashboard: boolean;
  setShowCustomerProjectsDashboard: (show: boolean) => void;
  showLeadManagement: boolean;
  setShowLeadManagement: (show: boolean) => void;
  showSitesList: boolean;
  setShowSitesList: (show: boolean) => void;
  showWorkers: boolean;
  setShowWorkers: (show: boolean) => void;
  showSiteSurvey: boolean;
  setShowSiteSurvey: (show: boolean) => void;

  // Admin states
  showStaff: boolean;
  setShowStaff: (show: boolean) => void;
  showTasks: boolean;
  setShowTasks: (show: boolean) => void;
  showCalendar: boolean;
  setShowCalendar: (show: boolean) => void;
  showSubcontractors: boolean;
  setShowSubcontractors: (show: boolean) => void;
  showFiles: boolean;
  setShowFiles: (show: boolean) => void;
  showHolidays: boolean;
  setShowHolidays: (show: boolean) => void;
  showToDo: boolean;
  setShowToDo: (show: boolean) => void;
  showAdminDashboard: boolean;
  setShowAdminDashboard: (show: boolean) => void;

  // Purchase Order states
  showProjectsList: boolean;
  setShowProjectsList: (show: boolean) => void;
  showSuppliersList: boolean;
  setShowSuppliersList: (show: boolean) => void;
  showCustomersList: boolean;
  setShowCustomersList: (show: boolean) => void;
  showPurchaseOrdersList: boolean;
  setShowPurchaseOrdersList: (show: boolean) => void;
  showPurchaseOrdersDashboard: boolean;
  setShowPurchaseOrdersDashboard: (show: boolean) => void;

  // Quote states
  showQuotesDashboard: boolean;
  setShowQuotesDashboard: (show: boolean) => void;
  showQuotesList: boolean;
  setShowQuotesList: (show: boolean) => void;
  showQuoteTerms: boolean;
  setShowQuoteTerms: (show: boolean) => void;
  showPaymentInfo: boolean;
  setShowPaymentInfo: (show: boolean) => void;

  // Health & Safety states
  showToolboxTalks: boolean;
  setShowToolboxTalks: (show: boolean) => void;
  showAccidents: boolean;
  setShowAccidents: (show: boolean) => void;
  showPolicies: boolean;
  setShowPolicies: (show: boolean) => void;
  showSignage: boolean;
  setShowSignage: (show: boolean) => void;
  showVehicles: boolean;
  setShowVehicles: (show: boolean) => void;
  showEquipment: boolean;
  setShowEquipment: (show: boolean) => void;
  showOrganisationChart: boolean;
  setShowOrganisationChart: (show: boolean) => void;
  showRiskAssessmentsubpage: boolean;
  setShowRiskAssessmentsubpage: (show: boolean) => void;
  showRAMSsubpage: boolean;
  setShowRAMSsubpage: (show: boolean) => void;
  showCPP: boolean;
  setShowCPP: (show: boolean) => void;
  showCDM: boolean;
  setShowCDM: (show: boolean) => void;
  showCOSHH: boolean;
  setShowCOSHH: (show: boolean) => void;
  showFire: boolean;
  setShowFire: (show: boolean) => void;
  showFirstAid: boolean;
  setShowFirstAid: (show: boolean) => void;
  showDSE: boolean;
  setShowDSE: (show: boolean) => void;
  showTrainingMatrix: boolean;
  setShowTrainingMatrix: (show: boolean) => void;
  showActionPlan: boolean;
  setShowActionPlan: (show: boolean) => void;
  showGuidance: boolean;
  setShowGuidance: (show: boolean) => void;
  showHealthSafety: boolean;
  setShowHealthSafety: (show: boolean) => void;
  showPPE: boolean;
  setShowPPE: (show: boolean) => void;
  showSiteInspections: boolean;
  setShowSiteInspections: (show: boolean) => void;
  showWorkshop: boolean;
  setShowWorkshop: (show: boolean) => void;

  // Dashboard states
  showReportingDashboard: boolean;
  setShowReportingDashboard: (show: boolean) => void;
  showTrainingDashboard: boolean;
  setShowTrainingDashboard: (show: boolean) => void;

  // Utility functions
  fetchData: () => void;
  formatNumber: (num: number) => string;
  onBack: () => void;
}

export function DashboardSections({
  // Data
  orders,
  projects,
  suppliers,
  customers,
  quotes,
  leads,
  workers,
  sites,
  totalAmount,
  overdueCounts,

  // Active section
  activeSection,
  setActiveSection,

  // All the state props...
  showContractsManagement,
  setShowContractsManagement,
  showCustomerProjectsDashboard,
  setShowCustomerProjectsDashboard,
  showLeadManagement,
  setShowLeadManagement,
  showSitesList,
  setShowSitesList,
  showWorkers,
  setShowWorkers,
  showSiteSurvey,
  setShowSiteSurvey,
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
  showAdminDashboard,
  setShowAdminDashboard,
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
  showQuotesDashboard,
  setShowQuotesDashboard,
  showQuotesList,
  setShowQuotesList,
  showQuoteTerms,
  setShowQuoteTerms,
  showPaymentInfo,
  setShowPaymentInfo,
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
  showRiskAssessmentsubpage,
  setShowRiskAssessmentsubpage,
  showRAMSsubpage,
  setShowRAMSsubpage,
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
  showPPE,
  setShowPPE,
  showSiteInspections,
  setShowSiteInspections,
  showWorkshop,
  setShowWorkshop,
  showReportingDashboard,
  setShowReportingDashboard,
  showTrainingDashboard,
  setShowTrainingDashboard,

  // Utility functions
  fetchData,
  formatNumber,
  onBack,
}: DashboardSectionsProps) {
  // Contracts Management
  if (showContractsManagement) {
    return (
      <ContractsManagement
        setShowContractsManagement={setShowContractsManagement}
        setShowCustomerProjectsDashboard={setShowCustomerProjectsDashboard}
      />
    );
  }

  // Customer Projects Dashboard
  if (showCustomerProjectsDashboard) {
    return (
      <CustomerProjectsDashboard
        setShowCustomerProjectsDashboard={setShowCustomerProjectsDashboard}
        setActiveSection={setActiveSection}
        onShowCustomersList={() => {
          setShowCustomersList(true);
          setShowCustomerProjectsDashboard(false);
        }}
        onShowProjectsList={() => {
          setShowProjectsList(true);
          setShowCustomerProjectsDashboard(false);
        }}
        onShowWorkers={() => {
          setShowWorkers(true);
          setShowCustomerProjectsDashboard(false);
        }}
        onShowSitesList={() => {
          setShowSitesList(true);
          setShowCustomerProjectsDashboard(false);
        }}
        onShowContracts={() => {
          setShowContractsManagement(true);
          setShowCustomerProjectsDashboard(false);
        }}
        onShowSiteSurvey={() => {
          setShowSiteSurvey(true);
          setShowCustomerProjectsDashboard(false);
        }}
        totalCustomers={customers.length}
        totalProjects={projects.length}
        totalWorkers={workers.length}
        totalSites={sites.length}
        totalContracts={0}
      />
    );
  }

  // Lead Management
  if (showLeadManagement) {
    return (
      <LeadManagement 
        onBack={() => {
          setShowLeadManagement(false);
          setActiveSection('quotes');
          setShowQuotesDashboard(true);
        }}
      />
    );
  }

  // Sites List
  if (showSitesList) {
    return (
      <SiteLists
        setShowCustomerProjectsDashboard={(show) => {
          setShowCustomerProjectsDashboard(show);
          setShowSitesList(false);
        }}
        setActiveSection={setActiveSection}
      />
    );
  }

  // Workers
  if (showWorkers) {
    return (
      <Workers
        onBack={() => {
          setShowWorkers(false);
          setActiveSection('customers');
          setShowCustomerProjectsDashboard(true);
        }}
      />
    );
  }

  // Site Survey
  if (showSiteSurvey) {
    return (
      <SiteSurvey
        onBack={() => {
          setShowSiteSurvey(false);
          setActiveSection('customers');
          setShowCustomerProjectsDashboard(true);
        }}
      />
    );
  }

  // Admin sections
  if (showStaff) {
    return (
      <Staff 
        setShowStaff={setShowStaff} 
        setShowAdminDashboard={() => {
          setShowStaff(false);
          setActiveSection('admin');
        }}
      />
    );
  }

  if (showTasks) {
    return (
      <Tasks 
        setShowTasks={setShowTasks}
        setShowAdminDashboard={() => {
          setShowTasks(false);
          setActiveSection('admin');
        }}
      />
    );
  }

  if (showCalendar) {
    return (
      <Calendar 
        onBack={() => {
          setShowCalendar(false);
          setActiveSection('admin');
        }}
      />
    );
  }

  if (showSubcontractors) {
    return (
      <Subcontractors 
        setShowSubcontractors={setShowSubcontractors}
        setShowAdminDashboard={() => {
          setShowSubcontractors(false);
          setActiveSection('admin');
        }}
      />
    );
  }

  if (showFiles) {
    return (
      <Files 
        onBack={() => {
          setShowFiles(false);
          setActiveSection('admin');
        }}
      />
    );
  }

  if (showHolidays) {
    return (
      <Holidays 
        setShowHolidays={setShowHolidays}
        setShowAdminDashboard={() => {
          setShowHolidays(false);
          setActiveSection('admin');
        }}
      />
    );
  }

  if (showToDo) {
    return (
      <ToDo 
        setShowToDo={setShowToDo}
        setShowAdminDashboard={() => {
          setShowToDo(false);
          setActiveSection('admin');
        }}
      />
    );
  }

  // Projects List
  if (showProjectsList) {
    return (
      <ProjectsList
        projects={projects}
        onProjectChange={fetchData}
        setShowCustomerProjectsDashboard={(show) => {
          setShowCustomerProjectsDashboard(show);
          setShowProjectsList(false);
        }}
        setActiveSection={setActiveSection}
      />
    );
  }

  // Suppliers List
  if (showSuppliersList) {
    return (
      <SuppliersList
        suppliers={suppliers}
        onSupplierChange={fetchData}
        onBack={() => {
          setShowSuppliersList(false);
          setActiveSection('purchase');
          setShowPurchaseOrdersDashboard(true);
        }}
      />
    );
  }

  // Purchase Orders Dashboard
  if (showPurchaseOrdersDashboard) {
    return (
      <PurchaseOrdersDashboard 
        setShowPurchaseOrdersDashboard={setShowPurchaseOrdersDashboard}
        setActiveSection={setActiveSection}
        onShowSuppliersList={() => setShowSuppliersList(true)}
        onShowPurchaseOrdersList={() => setShowPurchaseOrdersList(true)}
        totalAmount={totalAmount}
        formatNumber={formatNumber}
        totalSuppliers={suppliers.length}
        totalOrders={orders.length}
      />
    );
  }

  // Customers List
  if (showCustomersList) {
    return (
      <CustomersList
        customers={customers}
        onCustomerChange={fetchData}
        setShowCustomerProjectsDashboard={(show) => {
          setShowCustomerProjectsDashboard(show);
          setShowCustomersList(false);
        }}
        setActiveSection={setActiveSection}
      />
    );
  }

  // Purchase Orders List
  if (showPurchaseOrdersList) {
    return (
      <PurchaseOrdersList
        orders={orders}
        onOrderChange={fetchData}
        onBack={() => {
          setShowPurchaseOrdersList(false);
          setActiveSection('purchase');
          setShowPurchaseOrdersDashboard(true);
        }}
      />
    );
  }

  // Quotes Dashboard
  if (showQuotesDashboard) {
    return (
      <QuotesDashboard
        setShowQuotesDashboard={setShowQuotesDashboard}
        setActiveSection={setActiveSection}
        onShowQuotesList={() => {
          setShowQuotesList(true);
          setShowQuotesDashboard(false);
        }}
        onShowLeadManagement={() => {
          setShowLeadManagement(true);
          setShowQuotesDashboard(false);
        }}
        onShowQuoteTerms={() => {
          setShowQuoteTerms(true);
          setShowQuotesDashboard(false);
        }}
        onShowPaymentInfo={() => {
          setShowPaymentInfo(true);
          setShowQuotesDashboard(false);
        }}
        totalQuotes={quotes.length}
        totalLeads={leads.length}
      />
    );
  }

  // Quotes List
  if (showQuotesList) {
    return (
      <QuotesList
        quotes={quotes}
        onQuoteChange={fetchData}
        onBack={() => {
          setShowQuotesList(false);
          setActiveSection('quotes');
          setShowQuotesDashboard(true);
        }}
      />
    );
  }

  // Quote Terms
  if (showQuoteTerms) {
    return (
      <QuoteTerms 
        onBack={() => {
          setShowQuoteTerms(false);
          setActiveSection('quotes');
          setShowQuotesDashboard(true);
        }}
      />
    );
  }

  // Payment Info
  if (showPaymentInfo) {
    return (
      <PaymentInfo 
        onBack={() => {
          setShowPaymentInfo(false);
          setActiveSection('quotes');
          setShowQuotesDashboard(true);
        }}
      />
    );
  }

  // Health & Safety sections
  if (showToolboxTalks) {
    return (
      <HSToolboxTalks 
        onBack={() => {
          setShowToolboxTalks(false);
          setActiveSection('health');
          setShowHealthSafety(true);
        }} 
      />
    );
  }

  if (showAccidents) {
    return (
      <HSAccidents 
        onBack={() => {
          setShowAccidents(false);
          setActiveSection('health');
          setShowHealthSafety(true);
        }}
        onShowReportingDashboard={() => {
          setShowAccidents(false);
          setShowReportingDashboard(true);
        }}
      />
    );
  }

  if (showPolicies) {
    return (
      <HSPolicies 
        onBack={() => {
          setShowPolicies(false);
          setActiveSection('health');
          setShowHealthSafety(true);
        }} 
      />
    );
  }

  if (showSignage) {
    return (
      <HSSignage 
        onBack={() => {
          setShowSignage(false);
          setActiveSection('health');
          setShowHealthSafety(true);
        }} 
      />
    );
  }

  if (showVehicles) {
    return (
      <HSVehicles onBack={onBack} />
    );
  }

  if (showEquipment) {
    return (
      <HSEquipment 
        onBack={() => {
          setShowEquipment(false);
          setActiveSection('health');
          setShowHealthSafety(true);
        }} 
      />
    );
  }

  if (showOrganisationChart) {
    return (
      <HSOrganisationChart 
        onBack={() => {
          setShowOrganisationChart(false);
          setActiveSection('health');
          setShowHealthSafety(true);
        }} 
      />
    );
  }

  if (showRiskAssessmentsubpage) {
    return (
      <RiskAssessmentsubpage 
        onBack={() => {
          setShowRiskAssessmentsubpage(false);
          setActiveSection('health');
          setShowHealthSafety(true);
        }} 
        setShowRiskAssessmentsubpage={setShowRiskAssessmentsubpage}
        setActiveSection={setActiveSection}
      />
    );
  }

  if (showRAMSsubpage) {
    return (
      <RAMSsubpage 
        onBack={() => {
          setShowRAMSsubpage(false);
          setActiveSection('health');
          setShowHealthSafety(true);
        }} 
      />
    );
  }

  if (showCPP) {
    return (
      <CPPsubpage 
        onBack={() => {
          setShowCPP(false);
          setActiveSection('health');
          setShowHealthSafety(true);
        }} 
        setShowCPP={setShowCPP}
      />
    );
  }

  if (showCDM) {
    return (
      <CDM 
        onBack={() => {
          setShowCDM(false);
          setActiveSection('health');
          setShowHealthSafety(true);
        }} 
      />
    );
  }

  if (showCOSHH) {
    return (
      <HSCoshh 
        onBack={() => {
          setShowCOSHH(false);
          setActiveSection('health');
          setShowHealthSafety(true);
        }} 
      />
    );
  }

  if (showFire) {
    return (
      <HSFire 
        onBack={() => {
          setShowFire(false);
          setActiveSection('health');
          setShowHealthSafety(true);
        }} 
      />
    );
  }

  if (showFirstAid) {
    return (
      <HSFirstAid 
        onBack={() => {
          setShowFirstAid(false);
          setActiveSection('health');
          setShowHealthSafety(true);
        }} 
      />
    );
  }

  if (showDSE) {
    return (
      <DisplayScreenAssessment 
        onBack={() => {
          setShowDSE(false);
          setActiveSection('training');
          setShowTrainingDashboard(true);
        }} 
      />
    );
  }

  if (showTrainingMatrix) {
    return (
      <TrainingMatrix 
        onBack={() => {
          setShowTrainingMatrix(false);
          setActiveSection('training');
          setShowTrainingDashboard(true);
        }} 
      />
    );
  }

  if (showActionPlan) {
    return (
      <ActionPlan 
        setShowActionPlan={setShowActionPlan}
        setActiveSection={setActiveSection}
        onShowReportingDashboard={() => {
          setShowActionPlan(false);
          setActiveSection('reporting');
          setShowReportingDashboard(true);
        }}
      />
    );
  }

  if (showGuidance) {
    return (
      <HSGuidance 
        onBack={() => {
          setShowGuidance(false);
          setActiveSection('health');
          setShowHealthSafety(true);
        }} 
      />
    );
  }

  if (showPPE) {
    return (
      <HSPPE
        onBack={() => {
          setShowPPE(false);
          setActiveSection('health');
          setShowHealthSafety(true);
        }}
      />
    );
  }

  if (showSiteInspections) {
    return (
      <HSSiteInspections
        onBack={() => {
          setShowSiteInspections(false);
          setActiveSection('health');
          setShowHealthSafety(true);
        }}
      />
    );
  }

  if (showWorkshop) {
    return (
      <HSWorkshop
        onBack={() => {
          setShowWorkshop(false);
          setActiveSection('health');
          setShowHealthSafety(true);
        }}
      />
    );
  }

  // Dashboard sections based on activeSection
  if (activeSection === 'admin') {
    return (
      <AdminDashboard
        onBack={() => setActiveSection(null)}
        setShowStaff={setShowStaff}
        setShowTasks={setShowTasks}
        setShowCalendar={setShowCalendar}
        setShowSubcontractors={setShowSubcontractors}
        setShowFiles={setShowFiles}
        setShowHolidays={setShowHolidays}
        setShowToDo={setShowToDo}
        totalStaff={overdueCounts.totalStaff}
        totalTasks={overdueCounts.totalTasks}
        totalSubcontractors={overdueCounts.totalSubcontractors}
      />
    );
  }

  if (activeSection === 'health' && showHealthSafety) {
    return (
      <HealthSafetyDashboard 
        onBack={() => {
          setShowHealthSafety(false);
          setActiveSection(null);
        }}
        setShowActionPlan={setShowActionPlan}
        setShowRiskAssessmentsubpage={setShowRiskAssessmentsubpage}
        setShowDriversList={() => {}} // Add proper handler
        setShowVehicles={setShowVehicles}
        setShowVehicleChecklist={() => {}} // Add proper handler
        setShowEquipmentChecklist={() => {}} // Add proper handler
        setShowDSE={setShowDSE}
        setShowPolicies={setShowPolicies}
        setShowRAMSsubpage={setShowRAMSsubpage}
        setShowCPP={setShowCPP}
        setShowCDM={setShowCDM}
        setShowCOSHH={setShowCOSHH}
        setShowFire={setShowFire}
        setShowFirstAid={setShowFirstAid}
        setShowToolboxTalks={setShowToolboxTalks}
        setShowSignage={setShowSignage}
        setShowAccidents={setShowAccidents}
        setShowEquipment={setShowEquipment}
        setShowOrganisationChart={setShowOrganisationChart}
        setShowTrainingMatrix={setShowTrainingMatrix}
        setShowGuidance={setShowGuidance}
        setShowSiteInspections={setShowSiteInspections}
        setShowWorkshop={setShowWorkshop}
        overdueCounts={{
          riskAssessments: overdueCounts.overdueRiskAssessmentsCount || 0,
          drivers: overdueCounts.overdueDriversCount || 0,
          vehicles: overdueCounts.overdueVehiclesCount || 0,
          vehicleChecklists: overdueCounts.overdueVehicleChecklistsCount || 0,
          equipmentChecklists: overdueCounts.overdueEquipmentChecklistsCount || 0,
          dse: overdueCounts.dseStatus || 0,
          actionPlan30Days: 0,
          actionPlan60Days: 0,
          actionPlanOverdue: 0
        }}
      />
    );
  }

  if (showReportingDashboard) {
    return (
      <ReportingDashboard
        onBack={() => {
          setShowReportingDashboard(false);
          setActiveSection(null);
        }}
        onShowAccidents={() => {
          setShowAccidents(true);
          setShowReportingDashboard(false);
        }}
        onShowActionPlan={() => {
          setShowActionPlan(true);
          setShowReportingDashboard(false);
        }}
        totalAccidents={0}
        totalActionPlans={0}
      />
    );
  }

  if (showTrainingDashboard) {
    return (
      <TrainingDashboard
        onBack={() => {
          setShowTrainingDashboard(false);
          setActiveSection(null);
        }}
        onShowDSEAssessment={() => {
          setShowDSE(true);
          setShowTrainingDashboard(false);
        }}
        onShowTrainingMatrix={() => {
          setShowTrainingMatrix(true);
          setShowTrainingDashboard(false);
        }}
        totalDSEAssessments={0}
        totalTrainingRecords={0}
      />
    );
  }

  // Default: show WidgetsTop (main dashboard)
  return null;
}