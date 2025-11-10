import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { verifyAdminPassword } from '../../../../../utils/adminPassword';
import {
  ChevronLeft,
  Plus,
  AlertTriangle,
  Search,
  Shield,
} from 'lucide-react';
import { DriverForm } from './DriverForm';
import { DriversDesktopTable } from './DriversDesktopTable';
import { DriversMobileCards } from './DriversMobileCards';
import { AdminModal } from '../../shared/components/AdminModal';
import { DeleteConfirmationModal } from '../../shared/components/DeleteConfirmationModal';
import { useDriversData } from '../hooks/useDriversData';
import type { DriversListProps, Driver, StaffMember } from '../../shared/types';

export function DriversList({ onBack, onDriverUpdate }: DriversListProps) {
  const {
    drivers,
    staff,
    availableStaff,
    hasAvailablePeople,
    loading,
    error,
    fetchData,
    deleteDriver
  } = useDriversData();

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [driverToDelete, setDriverToDelete] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [driverToEdit, setDriverToEdit] = useState<Driver | null>(null);
  const [isAdminView, setIsAdminView] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminError, setAdminError] = useState('');

  const handleAdminPasswordSubmit = async (password: string) => {
    setAdminLoading(true);
    setAdminError('');
    
    try {
      const isValid = await verifyAdminPassword(password);
      if (isValid) {
        setIsAdminView(true);
        setShowAdminModal(false);
      } else {
        setAdminError('Incorrect password.');
      }
    } catch (error) {
      setAdminError('An error occurred. Please try again.');
    } finally {
      setAdminLoading(false);
    }
  };

  const handleDeleteDriver = async (driverId: string) => {
    setDriverToDelete(driverId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!driverToDelete) return;
    await deleteDriver(driverToDelete);
    setShowDeleteModal(false);
    setDriverToDelete(null);
  };

  const handleEditDriver = (driver: Driver, staffMember: StaffMember | null) => {
    setSelectedStaff(staffMember);
    setDriverToEdit(driver);
    setShowAddModal(true);
  };

  // Add filtered drivers
  const filteredDrivers = drivers.filter((driver) => {
    const staffMember = staff.find(s => s.id === driver.staff_id);
    const driverName = driver.full_name || staffMember?.name || '';
    
    return driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
           driver.licence_number?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleSuccess = () => {
    fetchData();
    setShowAddModal(false);
    setSelectedStaff(null);
    setDriverToEdit(null);
    if (onDriverUpdate) {
      onDriverUpdate();
    }
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-white mb-6">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900 dark:text-white dark:hover:text-gray-200"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Vehicle Management
        </button>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Drivers Management</h2>
      </div>

      <p>To add, edit drivers and view licence information, please click the Admin View button.</p>

      {/* Search Bar with Add Button */}
      <div className="flex flex-col sm:flex-row gap-4 items-center mb-4">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            placeholder="Search by name or licence number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 pl-10 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
        </div>
        {isAdminView && hasAvailablePeople && (
          <button
            onClick={() => {
              setSelectedStaff(null);
              setShowAddModal(true);
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600 w-full sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Licence Info
          </button>
        )}
        <button
          onClick={() => {
            if (isAdminView) {
              setIsAdminView(false);
            } else {
              setShowAdminModal(true);
              setAdminError('');
            }
          }}
          className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white ${
            isAdminView 
              ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500' 
              : 'bg-gray-600 hover:bg-gray-700 focus:ring-gray-500'
          } focus:outline-none focus:ring-2 focus:ring-offset-2`}
        >
          <Shield className="h-4 w-4 mr-2" />
          {isAdminView ? 'Exit Admin View' : 'Admin View'}
        </button>
      </div>

      {error && (
        <div className="mb-4 flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-4 rounded-md">
          <AlertTriangle className="h-5 w-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Main Content */}
      <div className="bg-white dark:bg-gray-800 shadow-lg overflow-hidden sm:rounded-lg">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
          </div>
        ) : drivers.length === 0 ? (
          <div className="flex items-center justify-center h-48 bg-gray-50 dark:bg-gray-700">
            <p className="text-gray-500 dark:text-gray-400">No drivers yet</p>
          </div>
        ) : (
          <>
            <DriversDesktopTable
              drivers={filteredDrivers}
              staff={staff}
              isAdminView={isAdminView}
              onEditDriver={handleEditDriver}
              onDeleteDriver={handleDeleteDriver}
            />

            <DriversMobileCards
              drivers={filteredDrivers}
              staff={staff}
              isAdminView={isAdminView}
              onEditDriver={handleEditDriver}
              onDeleteDriver={handleDeleteDriver}
            />
          </>
        )}
      </div>

      {/* Driver Form Modal */}
      {showAddModal && (
        createPortal(
          <DriverForm
            availableStaff={availableStaff}
            selectedStaff={selectedStaff}
            driverToEdit={driverToEdit}
            onClose={() => {
              setShowAddModal(false);
              setSelectedStaff(null);
              setDriverToEdit(null);
            }}
            onSuccess={handleSuccess}
          />,
          document.body
        )
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDriverToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Confirm Deletion"
        message="Are you sure you want to delete this driver? This action cannot be undone."
        isLoading={loading}
      />
      
      {/* Admin Modal */}
      <AdminModal
        isOpen={showAdminModal}
        onClose={() => {
          setShowAdminModal(false);
          setAdminError('');
        }}
        onSubmit={handleAdminPasswordSubmit}
        loading={adminLoading}
        error={adminError}
      />
    </div>
  );
}
