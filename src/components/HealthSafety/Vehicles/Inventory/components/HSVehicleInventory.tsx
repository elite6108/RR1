import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  ChevronLeft,
  AlertTriangle,
  Search
} from 'lucide-react';
import { InventoryCard } from './InventoryCard';
import VehicleInventoryForm from './VehicleInventoryForm';
import { DeleteConfirmationModal } from '../../shared/components/DeleteConfirmationModal';
import { useInventoryData } from '../hooks/useInventoryData';
import type { HSVehicleInventoryProps, VehicleInventory } from '../../shared/types';

export const HSVehicleInventory: React.FC<HSVehicleInventoryProps> = ({
  onBack,
}) => {
  const {
    vehicles,
    inventories,
    inventoryItems,
    loading,
    error,
    fetchData,
    deleteInventory,
    setError
  } = useInventoryData();

  const [showInventoryModal, setShowInventoryModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<any | null>(null);
  const [selectedInventory, setSelectedInventory] = useState<VehicleInventory | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [inventoryToDelete, setInventoryToDelete] = useState<VehicleInventory | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleNewInventory = (vehicle: any) => {
    setSelectedVehicle(vehicle);
    setSelectedInventory(null);
    setShowInventoryModal(true);
  };

  const handleEditInventory = (
    vehicle: any,
    inventory: VehicleInventory
  ) => {
    setSelectedVehicle(vehicle);
    setSelectedInventory(inventory);
    setShowInventoryModal(true);
  };

  const handleDeleteInventory = (inventory: VehicleInventory) => {
    setInventoryToDelete(inventory);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!inventoryToDelete) return;
    
    setDeleting(true);
    try {
      await deleteInventory(inventoryToDelete.id);
      setShowDeleteModal(false);
      setInventoryToDelete(null);
    } catch (err) {
      // Error is already handled in the hook
    } finally {
      setDeleting(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setInventoryToDelete(null);
  };

  // Filter vehicles based on search query
  const filteredVehicles = vehicles.filter((vehicle) =>
    vehicle.registration.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vehicle.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vehicle.model.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Vehicle Inventory</h2>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center mb-4">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            placeholder="Search vehicles by registration, make, or model..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 pl-10 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-4 rounded-md">
          <AlertTriangle className="h-5 w-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Main Content */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden sm:rounded-lg">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
          </div>
        ) : vehicles.length === 0 ? (
          <div className="flex items-center justify-center h-48 bg-gray-50 dark:bg-gray-700">
            <p className="text-gray-500 dark:text-gray-400">No vehicles available</p>
          </div>
        ) : filteredVehicles.length === 0 ? (
          <div className="flex items-center justify-center h-48 bg-gray-50 dark:bg-gray-700">
            <p className="text-gray-500 dark:text-gray-400">No vehicles match your search</p>
          </div>
        ) : (
          <div className="space">
            {filteredVehicles.map((vehicle) => (
              <InventoryCard
                key={vehicle.id}
                vehicle={vehicle}
                inventories={inventories}
                onNewInventory={handleNewInventory}
                onEditInventory={handleEditInventory}
                onDeleteInventory={handleDeleteInventory}
              />
            ))}
          </div>
        )}
      </div>

      {/* Inventory Form Modal */}
      {showInventoryModal && (
        createPortal(
          <VehicleInventoryForm
            vehicle={selectedVehicle!}
            inventoryToEdit={selectedInventory}
            onClose={() => {
              setShowInventoryModal(false);
              setSelectedVehicle(null);
              setSelectedInventory(null);
            }}
            onSuccess={() => {
              fetchData();
              setShowInventoryModal(false);
              setSelectedVehicle(null);
              setSelectedInventory(null);
            }}
          />,
          document.body
        )
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title="Delete Inventory Item"
        message="Are you sure you want to delete this inventory item? This action cannot be undone."
        isLoading={deleting}
      />
    </div>
  );
};
