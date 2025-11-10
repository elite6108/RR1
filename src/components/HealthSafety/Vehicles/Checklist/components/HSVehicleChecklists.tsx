import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  ChevronLeft,
  AlertTriangle,
  Search
} from 'lucide-react';
import VehicleChecklistForm from './VehicleChecklistForm';
import { VehicleCard } from './VehicleCard';
import { DeleteConfirmationModal } from '../../shared/components/DeleteConfirmationModal';
import { useChecklistData } from '../hooks/useChecklistData';
import { handleViewPDF } from '../utils/pdfGeneration';
import type { HSVehicleChecklistsProps, VehicleChecklist } from '../../shared/types';

export const HSVehicleChecklists: React.FC<HSVehicleChecklistsProps> = ({
  onBack,
}) => {
  const {
    vehicles,
    checklists,
    loading,
    error,
    fetchData,
    deleteChecklist,
    setError
  } = useChecklistData();

  const [showChecklistModal, setShowChecklistModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<any | null>(null);
  const [selectedChecklist, setSelectedChecklist] = useState<VehicleChecklist | null>(null);
  const [generatingPdfId, setGeneratingPdfId] = useState<string | null>(null);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [checklistToDelete, setChecklistToDelete] = useState<VehicleChecklist | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleNewChecklist = (vehicle: any) => {
    setSelectedVehicle(vehicle);
    setSelectedChecklist(null);
    setShowChecklistModal(true);
  };

  const handleEditChecklist = (
    vehicle: any,
    checklist: VehicleChecklist
  ) => {
    setSelectedVehicle(vehicle);
    setSelectedChecklist(checklist);
    setShowChecklistModal(true);
  };

  const handleViewPDFWrapper = async (checklist: VehicleChecklist) => {
    await handleViewPDF(checklist, setGeneratingPdfId, setPdfError);
  };

  const handleDeleteChecklist = (checklist: VehicleChecklist) => {
    setChecklistToDelete(checklist);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!checklistToDelete) return;
    
    setDeleting(true);
    try {
      await deleteChecklist(checklistToDelete.id);
      setShowDeleteModal(false);
      setChecklistToDelete(null);
    } catch (err) {
      // Error is already handled in the hook
    } finally {
      setDeleting(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setChecklistToDelete(null);
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
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Vehicle Checklists</h2>
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

      {pdfError && (
        <div className="mb-4 flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-4 rounded-md">
          <AlertTriangle className="h-5 w-5 flex-shrink-0" />
          <div>
            <p className="font-medium">Error generating PDF</p>
            <p>{pdfError}</p>
          </div>
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
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                checklists={checklists}
                generatingPdfId={generatingPdfId}
                onNewChecklist={handleNewChecklist}
                onEditChecklist={handleEditChecklist}
                onViewPDF={handleViewPDFWrapper}
                onDeleteChecklist={handleDeleteChecklist}
              />
            ))}
          </div>
        )}
      </div>

      {/* Checklist Form Modal */}
      {showChecklistModal && (
        createPortal(
          <VehicleChecklistForm
            vehicle={selectedVehicle!}
            checklistToEdit={selectedChecklist}
            onClose={() => {
              setShowChecklistModal(false);
              setSelectedVehicle(null);
              setSelectedChecklist(null);
            }}
            onSuccess={() => {
              fetchData();
              setShowChecklistModal(false);
              setSelectedVehicle(null);
              setSelectedChecklist(null);
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
        title="Delete Checklist"
        message="Are you sure you want to delete this checklist? This action cannot be undone."
        isLoading={deleting}
      />
    </div>
  );
};
