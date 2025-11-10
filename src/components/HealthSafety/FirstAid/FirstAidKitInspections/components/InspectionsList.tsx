import React, { useState, useMemo, useEffect } from 'react';
import { Search, ChevronLeft } from 'lucide-react';
import { supabase } from '../../../../../lib/supabase';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';
import { ViewInspectionModal } from './ViewInspectionModal';
import { InspectionForm } from './InspectionForm';

interface InspectionRecord {
  id: string;
  inspector_name: string;
  inspection_date: string;
  kit_id: string;
  kit_name: string;
  kit_location: string;
  overall_status: 'passed' | 'failed' | 'needs_attention';
  items_inspected: number;
  items_passed: number;
  items_failed: number;
  general_notes?: string;
}

interface InspectionsListProps {
  onBack: () => void;
}

// Hook to fetch inspections data
function useInspections() {
  const [inspections, setInspections] = useState<InspectionRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInspections = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('first_aid_kit_inspections')
        .select(`
          id,
          inspector_name,
          inspection_date,
          first_aid_kit_id,
          overall_status,
          items_inspected,
          items_passed,
          items_failed,
          general_notes,
          first_aid_kits (
            id,
            name,
            location
          )
        `)
        .order('inspection_date', { ascending: false });

      if (error) throw error;

      const formattedInspections: InspectionRecord[] = (data || []).map((inspection: any) => ({
        id: inspection.id,
        inspector_name: inspection.inspector_name,
        inspection_date: inspection.inspection_date,
        kit_id: inspection.first_aid_kit_id || inspection.first_aid_kits?.id || '',
        kit_name: inspection.first_aid_kits?.name || 'Unknown Kit',
        kit_location: inspection.first_aid_kits?.location || 'Unknown Location',
        overall_status: inspection.overall_status,
        items_inspected: inspection.items_inspected || 0,
        items_passed: inspection.items_passed || 0,
        items_failed: inspection.items_failed || 0,
        general_notes: inspection.general_notes
      }));

      setInspections(formattedInspections);
    } catch (error) {
      console.error('Error fetching inspections:', error);
      setInspections([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInspections();
  }, []);

  return { inspections, loading, refetch: fetchInspections };
}

export function InspectionsList({ onBack }: InspectionsListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'passed' | 'failed' | 'needs_attention'>('all');
  const { inspections, loading, refetch } = useInspections();
  
  // Modal states
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedInspection, setSelectedInspection] = useState<InspectionRecord | null>(null);

  const filteredInspections = useMemo(() => {
    return inspections.filter(inspection => {
      const matchesSearch = 
        inspection.inspector_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inspection.kit_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inspection.kit_location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inspection.general_notes?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || inspection.overall_status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [inspections, searchTerm, statusFilter]);

  const getStatusBadge = (status: 'passed' | 'failed' | 'needs_attention') => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    switch (status) {
      case 'passed':
        return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400`;
      case 'failed':
        return `${baseClasses} bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400`;
      case 'needs_attention':
        return `${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400`;
      default:
        return baseClasses;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Modal handlers
  const handleViewInspection = (inspectionId: string) => {
    const inspection = inspections.find(i => i.id === inspectionId);
    if (inspection) {
      setSelectedInspection(inspection);
      setIsViewModalOpen(true);
    }
  };

  const handleEditInspection = (inspection: InspectionRecord) => {
    setSelectedInspection(inspection);
    setIsEditModalOpen(true);
  };

  const handleDeleteInspection = (inspection: InspectionRecord) => {
    setSelectedInspection(inspection);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedInspection) return;

    try {
      // Delete inspection items first
      await supabase
        .from('first_aid_kit_inspection_items')
        .delete()
        .eq('inspection_id', selectedInspection.id);

      // Delete the inspection record
      const { error } = await supabase
        .from('first_aid_kit_inspections')
        .delete()
        .eq('id', selectedInspection.id);

      if (error) throw error;

      console.log('Inspection deleted successfully');
      // Refresh the inspections list
      refetch();
    } catch (error) {
      console.error('Error deleting inspection:', error);
      alert('Error deleting inspection. Please try again.');
    }
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
          Back to First Aid Kit Inspections
        </button>
      </div>

      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
        First Aid Kit Inspections
      </h2>

        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search inspections..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStatusFilter(e.target.value as 'all' | 'passed' | 'failed' | 'needs_attention')}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="all">All Status</option>
            <option value="passed">Passed</option>
            <option value="failed">Failed</option>
            <option value="needs_attention">Needs Attention</option>
          </select>
        </div>

        {/* Results Summary */}
        <div className="mb-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {loading ? 'Loading inspections...' : `Showing ${filteredInspections.length} of ${inspections.length} inspections`}
          </p>
        </div>

        {/* Inspections Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Kit Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Results
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="text-gray-500 dark:text-gray-400">Loading inspections...</div>
                  </td>
                </tr>
              ) : (
                filteredInspections.map((inspection: InspectionRecord) => (
                  <tr key={inspection.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900 dark:text-white">
                        {formatDate(inspection.inspection_date)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {inspection.kit_name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {inspection.kit_location}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={getStatusBadge(inspection.overall_status)}>
                        {inspection.overall_status.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      <div>
                        <div className="text-green-600 dark:text-green-400">
                          {inspection.items_passed} passed
                        </div>
                        {inspection.items_failed > 0 && (
                          <div className="text-red-600 dark:text-red-400">
                            {inspection.items_failed} failed
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewInspection(inspection.id)}
                          className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                          title="View"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye h-5 w-5" aria-hidden="true"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg>
                        </button>
                        <button
                          onClick={() => handleEditInspection(inspection)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          title="Edit"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pencil h-5 w-5" aria-hidden="true"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"></path><path d="m15 5 4 4"></path></svg>
                        </button>
                        <button
                          onClick={() => handleDeleteInspection(inspection)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          title="Delete"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash2 lucide-trash-2 h-5 w-5" aria-hidden="true"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" x2="10" y1="11" y2="17"></line><line x1="14" x2="14" y1="11" y2="17"></line></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {!loading && filteredInspections.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-500 mb-4">
              <Search className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No inspections found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {searchTerm ? 'Try adjusting your search terms' : 'No inspections have been completed yet'}
            </p>
          </div>
        )}

        {/* Modals */}
        {selectedInspection && (
          <>
            <InspectionForm
              isOpen={isEditModalOpen}
              onClose={() => {
                setIsEditModalOpen(false);
                setSelectedInspection(null);
              }}
              firstAidKitId={selectedInspection.kit_id}
              kitName={selectedInspection.kit_name}
              existingInspectionId={selectedInspection.id}
            />

            <ViewInspectionModal
              isOpen={isViewModalOpen}
              onClose={() => {
                setIsViewModalOpen(false);
                setSelectedInspection(null);
              }}
              inspectionId={selectedInspection.id}
              kitName={selectedInspection.kit_name}
              inspectionDate={selectedInspection.inspection_date}
              inspectorName={selectedInspection.inspector_name}
              overallStatus={selectedInspection.overall_status}
              itemsPassed={selectedInspection.items_passed}
              itemsFailed={selectedInspection.items_failed}
              generalNotes={selectedInspection.general_notes}
            />

            <DeleteConfirmationModal
              isOpen={isDeleteModalOpen}
              onClose={() => {
                setIsDeleteModalOpen(false);
                setSelectedInspection(null);
              }}
              onConfirm={handleConfirmDelete}
              kitName={`Inspection of ${selectedInspection.kit_name}`}
            />
          </>
        )}

    </div>
  );
}
