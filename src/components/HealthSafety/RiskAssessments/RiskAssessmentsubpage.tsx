import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { supabase } from '../../../lib/supabase';
import { ChevronLeft, Plus, AlertTriangle, FileText, Search } from 'lucide-react';
import { RiskAssessmentForm } from './RiskAssessmentForm';
import type { RiskAssessment } from '../../../types/database';
import type { RiskAssessmentSubpageProps, SortConfig } from './types';
import { handleViewPDF } from './utils/pdfHandler';
import { handleExport, handleImport } from './utils/importExportUtils';
import { sortAndFilterAssessments } from './utils/sortingUtils';
import { DeleteConfirmationModal } from './components/DeleteConfirmationModal';
import { ImportExportModal } from './components/ImportExportModal';
import { RiskAssessmentsTable } from './components/RiskAssessmentsTable';

export function RiskAssessmentsubpage({ onBack }: RiskAssessmentSubpageProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [riskAssessments, setRiskAssessments] = useState<RiskAssessment[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showImportExportModal, setShowImportExportModal] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState<RiskAssessment | null>(null);
  const [generatingPdfId, setGeneratingPdfId] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [importExportMode, setImportExportMode] = useState<'export' | 'import'>('export');
  const [selectedForExport, setSelectedForExport] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  // Prevent body scroll when any modal is open
  useEffect(() => {
    const isModalOpen = showModal || showDeleteModal || showImportExportModal;
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    // Cleanup function to restore scroll when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showModal, showDeleteModal, showImportExportModal]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('risk_assessments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRiskAssessments(data || []);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while fetching data');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (assessment: RiskAssessment) => {
    setSelectedAssessment(assessment);
    setShowModal(true);
  };

  const onViewPDF = async (assessment: RiskAssessment) => {
    await handleViewPDF(assessment, setGeneratingPdfId, setError);
  };

  const handleDelete = (assessment: RiskAssessment) => {
    setSelectedAssessment(assessment);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedAssessment) return;
    
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('risk_assessments')
        .delete()
        .eq('id', selectedAssessment.id);

      if (error) throw error;
      
      await fetchData();
      setShowDeleteModal(false);
      setSelectedAssessment(null);
    } catch (err) {
      console.error('Error deleting risk assessment:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while deleting the risk assessment');
    } finally {
      setLoading(false);
    }
  };

  const onExport = () => {
    handleExport(selectedForExport, riskAssessments);
    setShowImportExportModal(false);
    setSelectedForExport(null);
  };

  const onImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    await handleImport(event, fetchData, setError);
    setShowImportExportModal(false);
  };

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedAndFilteredAssessments = useMemo(() => {
    return sortAndFilterAssessments(riskAssessments, searchQuery, sortConfig);
  }, [riskAssessments, searchQuery, sortConfig]);

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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Risk Assessments</h2>
      </div>

      {error && (
        <div className="mb-4 flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-4 rounded-md">
          <AlertTriangle className="h-5 w-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Search Bar with Add Button and Import-Export Button */}
      <div className="flex flex-col sm:flex-row gap-4 items-center mb-4">
        <div className="relative flex-1 w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            placeholder="Search risk assessments..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 dark:focus:placeholder-gray-300 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 dark:border-gray-600 dark:text-white sm:text-sm"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
                    <button
            onClick={() => {
              setImportExportMode('export');
              setSelectedForExport(null);
              setShowImportExportModal(true);
            }}
            className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <FileText className="h-4 w-4 mr-2" />
            Import - Export
          </button>
          <button
            onClick={() => {
              setSelectedAssessment(null);
              setShowModal(true);
            }}
            className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Risk Assessment
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
          </div>
        ) : sortedAndFilteredAssessments.length === 0 ? (
          <div className="flex items-center justify-center h-48 bg-gray-50 dark:bg-gray-700/50">
            <p className="text-gray-500 dark:text-gray-400">
              {searchQuery ? 'No matching risk assessments found' : 'No risk assessments yet'}
            </p>
          </div>
        ) : (
          <RiskAssessmentsTable
            assessments={sortedAndFilteredAssessments}
            sortConfig={sortConfig}
            onSort={handleSort}
            onEdit={handleEdit}
            onViewPDF={onViewPDF}
            onDelete={handleDelete}
            generatingPdfId={generatingPdfId}
          />
        )}
      </div>

      {/* Risk Assessment Form Modal */}
      {showModal && createPortal(
        <RiskAssessmentForm
          onClose={() => {
            setShowModal(false);
            setSelectedAssessment(null);
          }}
          onSuccess={fetchData}
          assessmentToEdit={selectedAssessment}
        />,
        document.body
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        show={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedAssessment(null);
        }}
        onConfirm={confirmDelete}
      />

      {/* Import-Export Modal */}
      <ImportExportModal
        show={showImportExportModal}
        onClose={() => {
          setShowImportExportModal(false);
          setSelectedForExport(null);
        }}
        mode={importExportMode}
        onModeChange={setImportExportMode}
        riskAssessments={riskAssessments}
        selectedForExport={selectedForExport}
        onExportSelectionChange={setSelectedForExport}
        onExport={onExport}
        onImport={onImport}
      />
    </div>
  );
}