import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  ChevronLeft,
  Plus,
  AlertTriangle,
  Search,
} from 'lucide-react';
import { VehicleForm } from '../../VehicleForm';
import { DriversList } from '../../Drivers/components/DriversList';
import { HSVehicleChecklists } from '../../Checklist/components/HSVehicleChecklists';
import { HSVehicleInventory } from '../../Inventory/components/HSVehicleInventory';
import { VehicleWidgets } from './VehicleWidgets';
import { RemindersSection } from './RemindersSection';
import { VehicleDesktopTable } from './VehicleDesktopTable';
import { VehicleMobileCards } from './VehicleMobileCards';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';
import { useVehiclesData } from '../hooks/useVehiclesData';
import type { HSVehiclesProps } from '../types';
import { HSMotorVehicleInspections } from '../../Inspections/HSMotorVehicleInspections';

export function HSVehicles({
  onBack,
  onOverdueDriversChange,
  onOverdueVehiclesChange,
}: HSVehiclesProps) {
  const {
    vehicles,
    drivers,
    reminders,
    loading,
    error,
    fetchData,
    deleteVehicle
  } = useVehiclesData(onOverdueDriversChange, onOverdueVehiclesChange);

  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [vehicleToEdit, setVehicleToEdit] = useState<any | null>(null);
  const [vehicleToDelete, setVehicleToDelete] = useState<string | null>(null);
  const [showVehicleList, setShowVehicleList] = useState(false);
  const [showDriversList, setShowDriversList] = useState(false);
  const [showChecklists, setShowChecklists] = useState(false);
  const [showInventory, setShowInventory] = useState(false);
  const [showMotorInspections, setShowMotorInspections] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isRemindersExpanded, setIsRemindersExpanded] = useState(true);

  // Detect dark mode from document class
  const isDarkMode = document.documentElement.classList.contains('dark');

  const handleDeleteVehicle = async (vehicleId: string) => {
    setVehicleToDelete(vehicleId);
    setShowDeleteModal(true);
  };

  const handleEditVehicle = (vehicle: any) => {
    setVehicleToEdit(vehicle);
    setShowVehicleModal(true);
  };

  const confirmDelete = async () => {
    if (!vehicleToDelete) return;
    
    try {
      await deleteVehicle(vehicleToDelete);
      setShowDeleteModal(false);
      setVehicleToDelete(null);
    } catch (err) {
      // Error is already handled in the hook
    }
  };

  // Add filtered vehicles
  const filteredVehicles = vehicles.filter((vehicle) =>
    vehicle.registration.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (showDriversList) {
    return (
      <DriversList
        onBack={() => {
          setShowDriversList(false);
          fetchData();
        }}
        onDriverUpdate={fetchData}
      />
    );
  }

  if (showChecklists) {
    return (
      <HSVehicleChecklists
        onBack={() => {
          setShowChecklists(false);
          fetchData();
        }}
      />
    );
  }

  if (showInventory) {
    return (
      <HSVehicleInventory
        onBack={() => {
          setShowInventory(false);
          fetchData();
        }}
      />
    );
  }

  if (showMotorInspections) {
    return (
      <HSMotorVehicleInspections
        onBack={() => {
          setShowMotorInspections(false);
          fetchData();
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-white mb-6">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900 dark:text-white dark:hover:text-gray-200"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Health & Safety
        </button>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Vehicle Management
        </h2>
      </div>

      {error && (
        <div className="mb-4 flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-4 rounded-md">
          <AlertTriangle className="h-5 w-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Quick Actions */}
      <VehicleWidgets
        isDarkMode={isDarkMode}
        drivers={drivers}
        vehicles={vehicles}
        reminders={reminders}
        onDriversClick={() => setShowDriversList(true)}
        onChecklistsClick={() => setShowChecklists(true)}
        onInventoryClick={() => setShowInventory(true)}
        onRemindersClick={() => setIsRemindersExpanded(!isRemindersExpanded)}
        onInspectionsClick={() => setShowMotorInspections(true)}
      />

      {/* Reminders Section */}
      <RemindersSection
        reminders={reminders}
        isExpanded={isRemindersExpanded}
        onToggle={() => setIsRemindersExpanded(!isRemindersExpanded)}
      />

      {/* Search Bar with Add Button */}
      <div className="flex flex-col sm:flex-row gap-4 items-center mb-4">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            placeholder="Search by registration..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 pl-10 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
        </div>
        <button
          onClick={() => {
            setVehicleToEdit(null);
            setShowVehicleModal(true);
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600 w-full sm:w-auto"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Vehicle
        </button>
      </div>

      {/* Main Content */}
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
          </div>
        ) : vehicles.length === 0 ? (
          <div className="flex items-center justify-center h-48">
            <p className="text-gray-500 dark:text-gray-400">
              No vehicles available
            </p>
          </div>
        ) : filteredVehicles.length === 0 ? (
          <div className="flex items-center justify-center h-48">
            <p className="text-gray-500 dark:text-gray-400">
              No vehicles match your search
            </p>
          </div>
        ) : (
          <>
            <VehicleDesktopTable
              vehicles={filteredVehicles}
              onEditVehicle={handleEditVehicle}
              onDeleteVehicle={handleDeleteVehicle}
            />

            <VehicleMobileCards
              vehicles={filteredVehicles}
              onEditVehicle={handleEditVehicle}
              onDeleteVehicle={handleDeleteVehicle}
            />
          </>
        )}
      </div>

      {/* Vehicle Form Modal */}
      {showVehicleModal && (
        createPortal(
          <VehicleForm
            onClose={() => {
              setShowVehicleModal(false);
              setVehicleToEdit(null);
            }}
            onSuccess={() => {
              fetchData();
              setShowVehicleModal(false);
              setVehicleToEdit(null);
            }}
            vehicleToEdit={vehicleToEdit}
          />,
          document.body
        )
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setVehicleToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Confirm Deletion"
        message="Are you sure you want to delete this vehicle? This action cannot be undone."
        isLoading={loading}
      />
    </div>
  );
}
