import { useState } from 'react';
import type { ModulesConfig, ExpandedSections, ActiveSection, ConnectionStatus } from '../types/dashboardTypes';

export function useUIStates() {
  // Menu and navigation states
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNewMenuOpen, setIsNewMenuOpen] = useState(false);
  const [showSidebarNav, setShowSidebarNav] = useState(false);
  const [activeSection, setActiveSection] = useState<ActiveSection>(null);
  
  // Loading and connection states
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('checking');
  const [componentTransition, setComponentTransition] = useState(false);
  
  // Modules configuration
  const [modules, setModules] = useState<ModulesConfig>({
    admin: true,
    customersAndProjects: true,
    purchaseOrders: true,
    quotes: true,
    healthAndSafety: true,
    training: true,
    reporting: true,
  });
  
  // Expanded sections in sidebar
  const [expandedSections, setExpandedSections] = useState<ExpandedSections>({
    quickActions: true,
    admin: false,
    customersAndProjects: false,
    purchaseOrders: false,
    quotes: false,
    healthAndSafety: false,
    training: false,
    reporting: false,
  });

  // Current time for dashboard
  const [currentTime, setCurrentTime] = useState(new Date());

  // Upcoming events navigation
  const [upcomingEventIndex, setUpcomingEventIndex] = useState(0);

  return {
    // Menu and navigation states
    isMenuOpen,
    setIsMenuOpen,
    isNewMenuOpen,
    setIsNewMenuOpen,
    showSidebarNav,
    setShowSidebarNav,
    activeSection,
    setActiveSection,
    
    // Loading and connection states
    loading,
    setLoading,
    connectionStatus,
    setConnectionStatus,
    componentTransition,
    setComponentTransition,
    
    // Modules configuration
    modules,
    setModules,
    
    // Expanded sections
    expandedSections,
    setExpandedSections,
    
    // Time and events
    currentTime,
    setCurrentTime,
    upcomingEventIndex,
    setUpcomingEventIndex,
  };
}