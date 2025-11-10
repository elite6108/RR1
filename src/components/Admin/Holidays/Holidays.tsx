import React, { useState } from 'react';
import { ChevronLeft, Plus, Search, Shield, User, Users, Calendar, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import type { HolidaysProps, LeaveRequest, LeaveEntitlement, ViewMode } from './types';
import { useHolidaysData, useHolidayActions } from './hooks';
import { getStatusColor } from './utils';
import {
  NewRequestModal,
  ApprovalModal,
  AdminPasswordModal,
  EditEntitlementModal,
  RequestsView,
  EntitlementsView,
  HolidayTableView
} from './components';
import type { DateRange } from 'react-day-picker';

export function Holidays({ setShowHolidays, setShowAdminDashboard }: HolidaysProps) {
  const {
    requests,
    entitlements,
    loading,
    error,
    success,
    currentUser,
    isAdmin,
    isAdminAuthenticated,
    viewMode,
    setError,
    setSuccess,
    setIsAdminAuthenticated,
    setViewMode,
    fetchData
  } = useHolidaysData();

  const { loading: actionLoading, handleSubmitRequest, handleApprovalAction, handleAdminPasswordSubmit, handleUpdateEntitlement } = useHolidayActions(currentUser, fetchData);

  // Modal states
  const [showNewRequestModal, setShowNewRequestModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showAdminPasswordModal, setShowAdminPasswordModal] = useState(false);
  const [showEditEntitlementModal, setShowEditEntitlementModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [selectedEntitlement, setSelectedEntitlement] = useState<LeaveEntitlement | null>(null);

  // Form states
  const [searchQuery, setSearchQuery] = useState('');
  const [userFilter, setUserFilter] = useState('all');

  // Helper function for status icons
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'denied': return <XCircle className="h-5 w-5 text-red-500" />;
      default: return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    }
  };

  const handleNewRequestSubmit = (
    dateRange: DateRange | undefined,
    leaveType: 'full_day' | 'half_day_morning' | 'half_day_afternoon',
    reason: string
  ) => {
    handleSubmitRequest(
      dateRange,
      leaveType,
      reason,
      setSuccess,
      setError,
      () => setShowNewRequestModal(false)
    );
  };

  const handleApprovalSubmit = (action: 'approved' | 'denied', adminNotes: string) => {
    if (selectedRequest) {
      handleApprovalAction(
        selectedRequest,
        action,
        adminNotes,
        setSuccess,
        setError,
        () => {
          setShowApprovalModal(false);
          setSelectedRequest(null);
        }
      );
    }
  };

  const handlePasswordSubmit = (password: string) => {
    handleAdminPasswordSubmit(
      password,
      setIsAdminAuthenticated,
      setSuccess,
      setError,
      () => setShowAdminPasswordModal(false)
    );
  };

  const handleEntitlementUpdate = (newEntitlement: number) => {
    if (selectedEntitlement) {
      handleUpdateEntitlement(
        selectedEntitlement,
        newEntitlement,
        setSuccess,
        setError,
        () => {
          setShowEditEntitlementModal(false);
          setSelectedEntitlement(null);
        }
      );
    }
  };

  const handleEditEntitlement = (entitlement: LeaveEntitlement) => {
    setSelectedEntitlement(entitlement);
    setShowEditEntitlementModal(true);
  };

  const handleApproveRequest = (request: LeaveRequest) => {
    setSelectedRequest(request);
    setShowApprovalModal(true);
  };

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.user_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.user_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.reason?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesUserFilter = userFilter === 'all' || request.user_type === userFilter;
    
    return matchesSearch && matchesUserFilter;
  });

  const filteredEntitlements = entitlements.filter(entitlement =>
    entitlement.user_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entitlement.user_email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-white mb-6">
        <button
          onClick={() => {
            setShowHolidays(false);
            setShowAdminDashboard(true);
          }}
          className="flex items-center text-gray-600 hover:text-gray-900 dark:text-white dark:hover:text-gray-200"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Company Section
        </button>
      </div>

      {/* Header */}
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Annual Leave Management
        </h1>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 sm:justify-end">
          {!isAdminAuthenticated ? (
            <button
              onClick={() => setShowAdminPasswordModal(true)}
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 w-full sm:w-auto"
            >
              <Shield className="h-4 w-4 mr-2" />
              Admin View
            </button>
          ) : (
            <button
              onClick={() => {
                setIsAdminAuthenticated(false);
                setViewMode('my_requests');
              }}
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 w-full sm:w-auto"
            >
              <Shield className="h-4 w-4 mr-2" />
              Exit Admin View
            </button>
          )}
          <button
            onClick={() => setShowNewRequestModal(true)}
            className="flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm font-semibold w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Request
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 sm:gap-4 mt-4 border-b overflow-x-auto">
        <button
          onClick={() => setViewMode('my_requests')}
          className={`pb-2 px-3 border-b-2 font-medium text-sm whitespace-nowrap ${
            viewMode === 'my_requests'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <User className="h-4 w-4 inline mr-1" />
          My Requests
        </button>
        {isAdminAuthenticated && (
          <>
            <button
              onClick={() => setViewMode('all_requests')}
              className={`pb-2 px-3 border-b-2 font-medium text-sm whitespace-nowrap ${
                viewMode === 'all_requests'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Users className="h-4 w-4 inline mr-1" />
              All Requests
            </button>
            <button
              onClick={() => setViewMode('entitlements')}
              className={`pb-2 px-3 border-b-2 font-medium text-sm whitespace-nowrap ${
                viewMode === 'entitlements'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Calendar className="h-4 w-4 inline mr-1" />
              Entitlements
            </button>
            <button
              onClick={() => setViewMode('holiday_table')}
              className={`pb-2 px-3 border-b-2 font-medium text-sm whitespace-nowrap ${
                viewMode === 'holiday_table'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Users className="h-4 w-4 inline mr-1" />
              Holiday Table
            </button>
          </>
        )}
      </div>

      {/* Content */}
      <div className="">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
            <p className="text-green-800">{success}</p>
          </div>
        )}

        {/* Search and Filters */}
        {isAdminAuthenticated && (viewMode === 'all_requests' || viewMode === 'entitlements' || viewMode === 'holiday_table') && (
          <div className="mb-6 space-y-4">
            <div className="relative">
              <Search className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, or reason..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            
            {viewMode === 'all_requests' && (
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 sm:items-center">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Filter by User Type:
                </label>
                <select
                  value={userFilter}
                  onChange={(e) => setUserFilter(e.target.value)}
                  className="px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 text-sm w-full sm:w-auto"
                >
                  <option value="all">All Users</option>
                  <option value="worker">Workers Only</option>
                  <option value="staff">Staff Only</option>
                </select>
              </div>
            )}
          </div>
        )}

        {/* Content based on view mode */}
        {viewMode === 'entitlements' && isAdminAuthenticated ? (
          <EntitlementsView 
            entitlements={filteredEntitlements} 
            loading={loading}
            onEditEntitlement={handleEditEntitlement}
          />
        ) : viewMode === 'holiday_table' && isAdminAuthenticated ? (
          <HolidayTableView 
            entitlements={filteredEntitlements}
            requests={requests}
            loading={loading}
          />
        ) : (
          <RequestsView
            requests={filteredRequests}
            loading={loading}
            isAdmin={isAdminAuthenticated}
            viewMode={viewMode}
            onApprove={handleApproveRequest}
            getStatusIcon={getStatusIcon}
            getStatusColor={getStatusColor}
          />
        )}
      </div>

      {/* Modals */}
      <NewRequestModal
        showModal={showNewRequestModal}
        onClose={() => setShowNewRequestModal(false)}
        onSubmit={handleNewRequestSubmit}
        loading={actionLoading}
      />

      <ApprovalModal
        showModal={showApprovalModal}
        selectedRequest={selectedRequest}
        onClose={() => {
          setShowApprovalModal(false);
          setSelectedRequest(null);
        }}
        onApprove={handleApprovalSubmit}
        loading={actionLoading}
      />

      <AdminPasswordModal
        showModal={showAdminPasswordModal}
        onClose={() => setShowAdminPasswordModal(false)}
        onSubmit={handlePasswordSubmit}
        loading={actionLoading}
      />

      <EditEntitlementModal
        showModal={showEditEntitlementModal}
        selectedEntitlement={selectedEntitlement}
        onClose={() => {
          setShowEditEntitlementModal(false);
          setSelectedEntitlement(null);
        }}
        onSubmit={handleEntitlementUpdate}
        loading={actionLoading}
      />
    </div>
  );
}
