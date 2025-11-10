import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, Plus, AlertTriangle, Search } from 'lucide-react';
import { useEquipment } from './hooks/useEquipment';
import { EquipmentForm } from './EquipmentForm';
import { EquipmentTable } from './components/EquipmentTable';
import { EquipmentCard } from './components/EquipmentCard';
import type { EquipmentListProps, Equipment } from './types';

export function EquipmentList({ onBack }: EquipmentListProps) {
  const { equipment, loading, error, deleteEquipment, fetchEquipment } = useEquipment();
  const [showEquipmentModal, setShowEquipmentModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [equipmentToDelete, setEquipmentToDelete] = useState<string | null>(null);
  const [equipmentToEdit, setEquipmentToEdit] = useState<Equipment | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleting, setDeleting] = useState(false);

  const handleDeleteEquipment = async (equipmentId: string) => {
    setEquipmentToDelete(equipmentId);
    setShowDeleteModal(true);
  };

  const handleEditEquipment = (equipment: Equipment) => {
    setEquipmentToEdit(equipment);
    setShowEquipmentModal(true);
  };

  const confirmDelete = async () => {
    if (!equipmentToDelete) return;

    setDeleting(true);
    const success = await deleteEquipment(equipmentToDelete);
    
    if (success) {
      setShowDeleteModal(false);
      setEquipmentToDelete(null);
    }
    setDeleting(false);
  };

  // Filter equipment based on search query
  const filteredEquipment = equipment.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.serial_number.toLowerCase().includes(searchQuery.toLowerCase())
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
          Back to Equipment Management
        </button>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Equipment List</h2>
      </div>

      {error && (
        <div className="mb-4 flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-4 rounded-md">
          <AlertTriangle className="h-5 w-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Search Bar with Add Button */}
      <div className="flex flex-col sm:flex-row gap-4 items-center mb-4">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            placeholder="Search by name or serial number..."
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
            setEquipmentToEdit(null);
            setShowEquipmentModal(true);
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600 w-full sm:w-auto"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Equipment
        </button>
      </div>

      {/* Main Content */}
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
          </div>
        ) : equipment.length === 0 ? (
          <div className="flex items-center justify-center h-48">
            <p className="text-gray-500 dark:text-gray-400">No equipment available</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <EquipmentTable
              equipment={filteredEquipment}
              onEdit={handleEditEquipment}
              onDelete={handleDeleteEquipment}
            />

            {/* Mobile/Tablet Cards */}
            <div className="lg:hidden">
              <div className="p-4 space-y-4">
                {filteredEquipment.map((item) => (
                  <EquipmentCard
                    key={item.id}
                    equipment={item}
                    onEdit={handleEditEquipment}
                    onDelete={handleDeleteEquipment}
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Equipment Form Modal */}
      {showEquipmentModal && (
        createPortal(
          <EquipmentForm
            onClose={() => {
              setShowEquipmentModal(false);
              setEquipmentToEdit(null);
            }}
            onSuccess={() => {
              fetchEquipment();
              setShowEquipmentModal(false);
              setEquipmentToEdit(null);
            }}
            equipmentToEdit={equipmentToEdit}
          />,
          document.body
        )
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        createPortal(
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 dark:bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
            <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-sm w-full m-4">
              <div className="flex items-center justify-center mb-4">
                <AlertTriangle className="h-12 w-12 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white text-center mb-2">
                Confirm Deletion
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
                Are you sure you want to delete this equipment? This action cannot be undone.
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setEquipmentToDelete(null);
                  }}
                  disabled={deleting}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={deleting}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 dark:hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                >
                  {deleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )
      )}
    </div>
  );
}
