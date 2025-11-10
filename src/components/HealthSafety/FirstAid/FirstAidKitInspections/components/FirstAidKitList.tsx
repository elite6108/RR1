import React, { useState } from 'react';
import { ChevronLeft, Plus, Search, Pencil, Trash2 } from 'lucide-react';
import { useFirstAidKits } from '../hooks';
import { AddFirstAidKitModal } from './AddFirstAidKitModal';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';
import { InspectionForm } from './InspectionForm';
import type { FirstAidKit } from '../types';

interface FirstAidKitListProps {
  onBack: () => void;
}

export function FirstAidKitList({ onBack }: FirstAidKitListProps) {
  const { firstAidKits, loading, addFirstAidKit, updateFirstAidKit, deleteFirstAidKit } = useFirstAidKits();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showInspectionForm, setShowInspectionForm] = useState(false);
  const [selectedKit, setSelectedKit] = useState<FirstAidKit | null>(null);

  const filteredKits = firstAidKits.filter(kit =>
    kit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    kit.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddFirstAidKit = async (formData: Omit<FirstAidKit, 'id' | 'createdAt' | 'updatedAt'>) => {
    await addFirstAidKit(formData);
    setShowAddForm(false);
  };

  const handleEditClick = (kit: FirstAidKit) => {
    setSelectedKit(kit);
    setShowEditForm(true);
  };

  const handleEditFirstAidKit = async (formData: Omit<FirstAidKit, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (selectedKit) {
      await updateFirstAidKit(selectedKit.id, formData);
      setShowEditForm(false);
      setSelectedKit(null);
    }
  };

  const handleDeleteClick = (kit: FirstAidKit) => {
    setSelectedKit(kit);
    setShowDeleteConfirmation(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedKit) {
      await deleteFirstAidKit(selectedKit.id);
      setSelectedKit(null);
    }
  };

  const handleInspectClick = (kit: FirstAidKit) => {
    setSelectedKit(kit);
    setShowInspectionForm(true);
  };

  return (
    <div>
      {/* Breadcrumb Navigation */}
      <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-white mb-6">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900 dark:text-white dark:hover:text-gray-200"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to First Aid Management
        </button>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">First Aid Kits</h2>
      </div>

      {/* Search Bar with Add Button */}
      <div className="flex flex-col sm:flex-row gap-4 items-center mb-4">
        <div className="relative flex-1 w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            placeholder="Search first aid kits..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 dark:focus:placeholder-gray-300 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 dark:border-gray-600 dark:text-white sm:text-sm"
          />
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add First Aid Kit
        </button>
      </div>

      {/* First Aid Kits Grid */}
      {loading ? (
        <div className="text-center py-8">
          <div className="text-gray-500 dark:text-gray-400">Loading first aid kits...</div>
        </div>
      ) : filteredKits.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-500 dark:text-gray-400">No first aid kits found</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredKits.map((kit) => (
            <div
              key={kit.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {kit.name}
                </h3>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    kit.status === 'active'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : kit.status === 'needs_inspection'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      : kit.status === 'expired'
                      ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                  }`}
                >
                  {kit.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <div><strong>Location:</strong> {kit.location}</div>
                {kit.serial_number && (
                  <div><strong>Serial:</strong> {kit.serial_number}</div>
                )}
                {kit.last_inspection_date && (
                  <div><strong>Last Inspection:</strong> {kit.last_inspection_date}</div>
                )}
                {kit.next_inspection_date && (
                  <div><strong>Next Inspection:</strong> {kit.next_inspection_date}</div>
                )}
              </div>

              <div className="mt-4 flex justify-between items-center">
                <button 
                  onClick={() => handleInspectClick(kit)}
                  className="px-3 py-1 text-sm bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 rounded-md hover:bg-blue-200 dark:hover:bg-blue-800"
                >
                  Inspect
                </button>
                <div className="flex justify-end space-x-4">
                  <button 
                    onClick={() => handleEditClick(kit)}
                    className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300" 
                    title="Edit"
                  >
                    <Pencil className="h-5 w-5" />
                  </button>
                  <button 
                    onClick={() => handleDeleteClick(kit)}
                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300" 
                    title="Delete"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add First Aid Kit Modal */}
      <AddFirstAidKitModal
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        onSubmit={handleAddFirstAidKit}
      />

      {/* Edit First Aid Kit Modal */}
      <AddFirstAidKitModal
        isOpen={showEditForm}
        onClose={() => {
          setShowEditForm(false);
          setSelectedKit(null);
        }}
        onSubmit={handleEditFirstAidKit}
        initialData={selectedKit}
        isEditMode={true}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteConfirmation}
        onClose={() => {
          setShowDeleteConfirmation(false);
          setSelectedKit(null);
        }}
        onConfirm={handleDeleteConfirm}
        kitName={selectedKit?.name || ''}
      />

      {/* Inspection Form Modal */}
      <InspectionForm
        isOpen={showInspectionForm}
        onClose={() => {
          setShowInspectionForm(false);
          setSelectedKit(null);
        }}
        firstAidKitId={selectedKit?.id}
        kitName={selectedKit?.name}
      />
    </div>
  );
}
