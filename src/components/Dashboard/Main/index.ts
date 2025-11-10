// Main Dashboard component
export { Dashboard } from './Dashboard';

// Components
export { Navbar } from './components/Navbar';
export { Footer } from './components/Footer';
export { Sidebar } from './components/Sidebar';
export { WidgetsTop } from './components/WidgetsTop';
export { DashboardWidgets } from './components/DashboardWidgets';
export { Widgets } from './components/Widgets';
export { NotificationModal } from './components/NotificationModal';
export { PasswordModal } from './components/PasswordModal';
export { LicensesModal } from './components/LicensesModal';
export { DashboardModals } from './components/DashboardModals';
export { DashboardSections } from './components/DashboardSections';
export { GlobalBreadcrumbs, createSubDashboardBreadcrumb, BreadcrumbCreators } from './components/GlobalBreadcrumbs';

// Hooks
export { useModalStates } from './hooks/useModalStates';
export { useUIStates } from './hooks/useUIStates';
export { useDataStates } from './hooks/useDataStates';
export { usePasswordManagement } from './hooks/usePasswordManagement';
export { useDataFetching } from './hooks/useDataFetching';

// Types
export type {
  DashboardProps,
  CalendarEvent,
  CalendarCategory,
  ModulesConfig,
  ExpandedSections,
  ActionPlanCounts,
  OverdueCounts,
  ConnectionStatus,
  ActiveSection,
} from './types/dashboardTypes';

// Utils
export * from './utils/notifications';