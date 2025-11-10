import React, { useRef, useEffect, useState } from 'react';
import {
  Plus,
  Menu,
  Moon,
  Sun,
  ChevronDown,
  User,
  Settings,
  LogOut,
  Bell,
} from 'lucide-react';
import { NotificationModal } from './NotificationModal';
import { fetchAllNotifications } from '../utils/notifications';

interface NavbarProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  handleSignOut: () => void;
  setShowPasswordModal: (show: boolean) => void;
  setShowCompanySettingsModal: (show: boolean) => void;
  setShowProjectModal: (show: boolean) => void;
  setShowPurchaseOrderModal: (show: boolean) => void;
  setShowQuoteModal: (show: boolean) => void;
  setShowSidebarNav: (show: boolean) => void;
  resetView: () => void;
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  isNewMenuOpen: boolean;
  setIsNewMenuOpen: (open: boolean) => void;
  userDisplayName: string;
}

export function Navbar({
  isDarkMode,
  toggleDarkMode,
  handleSignOut,
  setShowPasswordModal,
  setShowCompanySettingsModal,
  setShowProjectModal,
  setShowPurchaseOrderModal,
  setShowQuoteModal,
  setShowSidebarNav,
  resetView,
  isMenuOpen,
  setIsMenuOpen,
  isNewMenuOpen,
  setIsNewMenuOpen,
  userDisplayName,
}: NavbarProps) {
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    const getNotificationCount = async () => {
        const notifications = await fetchAllNotifications();
        setNotificationCount(notifications.length);
    };
    getNotificationCount();
  }, []);

  // Add ref for Plus menu
  const plusMenuRef = useRef<HTMLDivElement>(null);
  const plusMenuTimeoutRef = useRef<number | null>(null);
  
  // Add profile dropdown state and ref
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  // Handle outside click for Plus menu
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (plusMenuRef.current && !plusMenuRef.current.contains(event.target as Node)) {
        setIsNewMenuOpen(false);
      }
    }

    if (isNewMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isNewMenuOpen, setIsNewMenuOpen]);

  // Handle outside click for Profile dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    }

    if (isProfileDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileDropdownOpen]);

  // Cleanup Plus menu timeout on unmount
  useEffect(() => {
    return () => {
      if (plusMenuTimeoutRef.current) {
        clearTimeout(plusMenuTimeoutRef.current);
      }
    };
  }, []);

  // Function to get user initials
  const getUserInitials = (name: string) => {
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 shadow-sm">
        {/* Custom styles for navbar responsive behavior */}
        <style dangerouslySetInnerHTML={{
          __html: `
            @media (min-width: 1698px) {
              .navbar-mobile-1697 {
                display: none !important;
              }
              .navbar-desktop-1698 {
                display: flex !important;
              }
            }
            @media (max-width: 1697px) {
              .navbar-mobile-1697 {
                display: flex !important;
              }
              .navbar-desktop-1698 {
                display: none !important;
              }
            }
            @media (min-width: 1700px) {
              nav.fixed div.navbar-container-1700 {
                padding-right: 0 !important;
                padding-inline-end: 0 !important;
              }
            }
          `
        }} />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 navbar-container-1700">
          <div className="flex justify-between items-center h-12">
            {/* Logo Section - Left */}
            <div className="flex items-center space-x-2">
              {/* Mobile/Tablet hamburger menu - Left side */}
              <button
                onClick={() => setShowSidebarNav(true)}
                className="p-2 text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 navbar-mobile-1697"
              >
                <Menu className="h-5 w-5" />
              </button>
              
              <button
                onClick={() => {
                  resetView();
                  setShowSidebarNav(false);
                }}
                className="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-md"
              >
                              <img 
                src={isDarkMode ? "/images/stonepad-logo-w.png" : "/images/stonepad-logo-b.png"}
                alt="StonePad Logo" 
                className="h-6 w-auto"
              />
              </button>
            </div>

            {/* Mobile/Tablet Icons - Right */}
            <div className="flex items-center space-x-4 navbar-mobile-1697">
              <button
                onClick={toggleDarkMode}
                className="p-2 text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
              >
                {isDarkMode ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </button>
            </div>

            {/* Desktop Menu */}
            <div className="hidden navbar-desktop-1698 lg:items-center lg:space-x-4">
              <button
                onClick={toggleDarkMode}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {isDarkMode ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </button>
              
              {/* Notification Bell */}
              <button
                onClick={() => setShowNotificationModal(true)}
                className="relative inline-flex items-center p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Bell className="h-5 w-5" />
                {notificationCount > 0 && (
                    <span className="absolute top-1/2 -translate-y-1/2 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                        {notificationCount}
                    </span>
                )}
              </button>

              <div 
                ref={plusMenuRef}
                className="relative"
                onMouseEnter={() => {
                  // Clear any existing timeout
                  if (plusMenuTimeoutRef.current) {
                    clearTimeout(plusMenuTimeoutRef.current);
                    plusMenuTimeoutRef.current = null;
                  }
                  // Only use hover on desktop (screen width >= 1024px)
                  if (window.innerWidth >= 1024) {
                    setIsNewMenuOpen(true);
                  }
                }}
                onMouseLeave={() => {
                  // Only use hover on desktop (screen width >= 1024px)
                  if (window.innerWidth >= 1024) {
                    // Add a small delay before closing to allow for quick mouse movements
                    plusMenuTimeoutRef.current = setTimeout(() => {
                      setIsNewMenuOpen(false);
                    }, 150); // 150ms delay
                  }
                }}
              >
                <button
                  onClick={() => {
                    // On mobile/tablet (screen width < 1024px), use click to toggle
                    if (window.innerWidth < 1024) {
                      setIsNewMenuOpen(!isNewMenuOpen);
                    }
                  }}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <Plus className="h-4 w-4" />
                </button>
                {isNewMenuOpen && (
                  <div className="absolute right-0 mt-1 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-50">
                    <div className="py-1" role="menu" aria-orientation="vertical">
                      <button
                        onClick={() => {
                          setShowProjectModal(true);
                          setIsNewMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        role="menuitem"
                      >
                        <Plus className="h-4 w-4 inline mr-2" />
                        New Project
                      </button>
                      <button
                        onClick={() => {
                          setShowPurchaseOrderModal(true);
                          setIsNewMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        role="menuitem"
                      >
                        <Plus className="h-4 w-4 inline mr-2" />
                        New Purchase Order
                      </button>
                      <button
                        onClick={() => {
                          setShowQuoteModal(true);
                          setIsNewMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        role="menuitem"
                      >
                        <Plus className="h-4 w-4 inline mr-2" />
                        New Quote
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Dropdown */}
              <div ref={profileDropdownRef} className="relative">
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center space-x-3 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-md"
                >
                  {/* Profile Circle with Initials */}
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white text-sm font-medium rounded-full">
                    {getUserInitials(userDisplayName)}
                  </div>
                  {/* User Display Name */}
                  <span className="hidden lg:block">{userDisplayName}</span>
                  {/* Dropdown Arrow */}
                  <ChevronDown className="h-4 w-4" />
                </button>

                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-1 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-50">
                    <div className="py-1" role="menu" aria-orientation="vertical">
                      <button
                        onClick={() => {
                          setShowPasswordModal(true);
                          setIsProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                        role="menuitem"
                      >
                        <User className="h-4 w-4 mr-2" />
                        My Profile
                      </button>
                      <button
                        onClick={() => {
                          setShowCompanySettingsModal(true);
                          setIsProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                        role="menuitem"
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </button>
                      <div className="border-t border-gray-100 dark:border-gray-700"></div>
                      <button
                        onClick={() => {
                          handleSignOut();
                          setIsProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                        role="menuitem"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile/Tablet Menu Dropdown */}
          {isMenuOpen && (
            <div className="lg:hidden border-t border-gray-200 py-2">
              <div className="space-y-2 py-2">
                {/* Profile Section */}
                <div className="flex items-center space-x-3 px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-center w-10 h-10 bg-blue-600 text-white text-sm font-medium rounded-full">
                    {getUserInitials(userDisplayName)}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{userDisplayName}</div>
                  </div>
                </div>
                
                <button
                  onClick={() => {
                    setShowPasswordModal(true);
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center py-2 px-4 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <User className="h-4 w-4 mr-2" />
                  My Profile
                </button>

                <button
                  onClick={() => {
                    setShowCompanySettingsModal(true);
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center py-2 px-4 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </button>

                <button
                  onClick={() => {
                    setShowProjectModal(true);
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center py-2 px-4 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Project
                </button>

                <button
                  onClick={() => {
                    setShowPurchaseOrderModal(true);
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Purchase Order
                </button>

                <button
                  onClick={() => {
                    setShowQuoteModal(true);
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Quote
                </button>

                <div className="border-t border-gray-200 dark:border-gray-700 mt-2 pt-2">
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center px-4 py-2 text-sm font-medium text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
      {showNotificationModal && <NotificationModal onClose={() => setShowNotificationModal(false)} setNotificationCount={setNotificationCount} />}
    </>
  );
}