import React from 'react';
import { Home, ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
  isActive?: boolean;
}

interface GlobalBreadcrumbsProps {
  items?: BreadcrumbItem[];
  onHomeClick: () => void;
  className?: string;
}

export function GlobalBreadcrumbs({ 
  items = [], 
  onHomeClick, 
  className = '' 
}: GlobalBreadcrumbsProps) {
  return (
    <nav className={`flex items-center space-x-2 text-sm mb-6 ${className}`}>
      {/* Home Button */}
      <button
        onClick={onHomeClick}
        className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
      >
        <Home className="w-4 h-4" />
        <span>Home</span>
      </button>

      {/* Render breadcrumb items */}
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500" />
          
          {item.onClick && !item.isActive ? (
            <button
              onClick={item.onClick}
              className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
            >
              {item.label}
            </button>
          ) : (
            <span 
              className={`${
                item.isActive 
                  ? 'text-blue-600 dark:text-blue-400 font-medium' 
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}

// Helper function to create common breadcrumb patterns
export const createSubDashboardBreadcrumb = (
  subDashboardName: string,
  onHomeClick: () => void,
  onSubDashboardClick?: () => void
): GlobalBreadcrumbsProps => ({
  items: [
    {
      label: subDashboardName,
      onClick: onSubDashboardClick,
      isActive: !onSubDashboardClick // If no click handler, it's the active page
    }
  ],
  onHomeClick
});

// Pre-configured breadcrumb creators for common dashboards
export const BreadcrumbCreators = {
  admin: (onHomeClick: () => void, onAdminClick?: () => void) => 
    createSubDashboardBreadcrumb('Company', onHomeClick, onAdminClick),
  
  healthSafety: (onHomeClick: () => void, onHealthSafetyClick?: () => void) => 
    createSubDashboardBreadcrumb('Health & Safety', onHomeClick, onHealthSafetyClick),
  
  customerProjects: (onHomeClick: () => void, onCustomerProjectsClick?: () => void) => 
    createSubDashboardBreadcrumb('Customer Projects', onHomeClick, onCustomerProjectsClick),
  
  quotes: (onHomeClick: () => void, onQuotesClick?: () => void) => 
    createSubDashboardBreadcrumb('Quotes', onHomeClick, onQuotesClick),
  
  purchaseOrders: (onHomeClick: () => void, onPurchaseOrdersClick?: () => void) => 
    createSubDashboardBreadcrumb('Purchase Orders', onHomeClick, onPurchaseOrdersClick),
  
  training: (onHomeClick: () => void, onTrainingClick?: () => void) => 
    createSubDashboardBreadcrumb('Training', onHomeClick, onTrainingClick),
  
  reporting: (onHomeClick: () => void, onReportingClick?: () => void) => 
    createSubDashboardBreadcrumb('Reporting', onHomeClick, onReportingClick)
};