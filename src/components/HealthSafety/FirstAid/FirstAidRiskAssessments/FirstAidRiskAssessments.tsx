import React, { useState, useEffect } from 'react';
import { ChevronLeft, Plus, Search, Pencil, FileText, Trash2, AlertTriangle, X } from 'lucide-react';
import { supabase } from '../../../../lib/supabase';
import { useFirstAidRiskAssessments } from './hooks';
import { FirstAidNeedsAssessmentModal } from './components';
import { generateFirstAidPDF } from '../../../../utils/pdf/firstaid';
import type { FirstAidRiskAssessmentsProps } from './types';
import type { FirstAidNeedsAssessment } from './types/FirstAidNeedsAssessment';

export function FirstAidRiskAssessments({ onBack, onOverdueAssessmentsChange }: FirstAidRiskAssessmentsProps) {
  const { assessments, loading, addAssessment, updateAssessment, deleteAssessment, getAssessmentById } = useFirstAidRiskAssessments();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAssessment, setEditingAssessment] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<FirstAidNeedsAssessment | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<string | null>(null);
  const [generatingPDF, setGeneratingPDF] = useState<string | null>(null);
  const [pdfError, setPdfError] = useState<string | null>(null);

  // Calculate overdue assessments
  const overdueAssessments = assessments.filter(assessment => {
    return new Date(assessment.reviewDate) < new Date();
  }).length;

  // Notify parent of overdue count changes
  useEffect(() => {
    if (onOverdueAssessmentsChange) {
      onOverdueAssessmentsChange(overdueAssessments);
    }
  }, [overdueAssessments, onOverdueAssessmentsChange]);

  const filteredAssessments = assessments.filter(assessment =>
    assessment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assessment.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assessment.assessor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAssessmentSubmit = async (data: any) => {
    try {
      if (editingAssessment) {
        await updateAssessment(editingAssessment, data);
        setEditingAssessment(null);
        setEditingData(null);
      } else {
        await addAssessment(data);
      }
      setShowAddForm(false);
      // Optionally show success message
    } catch (error) {
      console.error('Error submitting assessment:', error);
      // Optionally show error message to user
    }
  };

  const handleEdit = async (assessmentId: string) => {
    try {
      const data = await getAssessmentById(assessmentId);
      if (data) {
        setEditingData(data);
        setEditingAssessment(assessmentId);
        setShowAddForm(true);
      }
    } catch (error) {
      console.error('Error fetching assessment for edit:', error);
    }
  };

  const handleDelete = async (assessmentId: string) => {
    try {
      await deleteAssessment(assessmentId);
      setDeleteConfirmation(null);
      // Optionally show success message
    } catch (error) {
      console.error('Error deleting assessment:', error);
      // Optionally show error message to user
    }
  };

  const handleCloseModal = () => {
    setShowAddForm(false);
    setEditingAssessment(null);
    setEditingData(null);
  };

  const handleGeneratePDF = async (assessmentId: string) => {
    setGeneratingPDF(assessmentId);
    setPdfError(null);

    try {
      // Get the full assessment data
      const assessmentData = await getAssessmentById(assessmentId);
      if (!assessmentData) {
        throw new Error('Assessment data not found');
      }

      // Fetch company settings
      const { data: companySettings, error: companyError } = await supabase
        .from('company_settings')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (companyError) {
        throw new Error(`Failed to load company settings: ${companyError.message}`);
      }
      if (!companySettings) {
        throw new Error('Company settings not found. Please set up your company details first.');
      }

      // Generate PDF
      const pdfDataUrl = await generateFirstAidPDF({
        assessmentData,
        companySettings
      });

      // Convert data URL to blob and open in new window
      const response = await fetch(pdfDataUrl);
      const blob = await response.blob();
      const pdfUrl = URL.createObjectURL(blob);
      
      // Open PDF in new window
      const newWindow = window.open(pdfUrl, '_blank');
      if (!newWindow) {
        throw new Error('Unable to open PDF. Please check your popup blocker settings.');
      }

      // Clean up the URL after a delay to prevent memory leaks
      setTimeout(() => {
        URL.revokeObjectURL(pdfUrl);
      }, 1000);

    } catch (error) {
      console.error('Error generating PDF:', error);
      setPdfError(error instanceof Error ? error.message : 'Failed to generate PDF');
    } finally {
      setGeneratingPDF(null);
    }
  };

  return (
    <>
      <FirstAidNeedsAssessmentModal
        isOpen={showAddForm}
        onClose={handleCloseModal}
        onSubmit={handleAssessmentSubmit}
        initialData={editingData || undefined}
      />
      <div className="space-y-6">
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
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">First Aid Needs Assessments</h2>
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
            placeholder="Search assessments..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 dark:focus:placeholder-gray-300 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 dark:border-gray-600 dark:text-white sm:text-sm"
          />
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Assessment
        </button>
      </div>

      {/* PDF Error Display */}
      {pdfError && (
        <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                PDF Generation Error
              </h3>
              <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                {pdfError}
              </div>
            </div>
            <div className="ml-auto pl-3">
              <div className="-mx-1.5 -my-1.5">
                <button
                  onClick={() => setPdfError(null)}
                  className="inline-flex rounded-md bg-red-50 dark:bg-red-900/20 p-1.5 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-red-50"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Assessments Table */}
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
          </div>
        ) : filteredAssessments.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 bg-gray-50 dark:bg-gray-700/50">
            <FileText className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-center">
              {searchTerm ? 'No matching assessments found' : 'No First Aid Needs Assessments found'}
            </p>
            {!searchTerm && (
              <p className="text-gray-400 dark:text-gray-500 text-sm mt-2 text-center">
                Click "Add Assessment" to create your first First Aid Needs Assessment
              </p>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Assessment Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Risk Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Review
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredAssessments.map((assessment) => (
                  <tr key={assessment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {assessment.assessmentDate ? new Date(assessment.assessmentDate).toLocaleDateString('en-GB') : 'Date not set'}
                      </div>
                                      </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {assessment.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {assessment.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          assessment.riskLevel === 'low'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : assessment.riskLevel === 'medium'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                            : assessment.riskLevel === 'high'
                            ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}
                      >
                        {assessment.riskLevel.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          assessment.status === 'active'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : assessment.status === 'draft'
                            ? 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                            : assessment.status === 'under_review'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}
                      >
                        {assessment.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {assessment.reviewDate ? new Date(assessment.reviewDate).toLocaleDateString('en-GB') : 'Not set'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-4">
                        <button 
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300" 
                          title="Edit"
                          onClick={() => handleEdit(assessment.id)}
                        >
                          <Pencil className="h-5 w-5" />
                        </button>
                        <button 
                          className={`${
                            generatingPDF === assessment.id 
                              ? 'text-gray-400 cursor-not-allowed' 
                              : 'text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300'
                          }`}
                          title={generatingPDF === assessment.id ? "Generating PDF..." : "Generate PDF"}
                          onClick={() => handleGeneratePDF(assessment.id)}
                          disabled={generatingPDF === assessment.id}
                        >
                          {generatingPDF === assessment.id ? (
                            <div className="animate-spin h-5 w-5 border-2 border-gray-300 border-t-gray-600 rounded-full"></div>
                          ) : (
                            <FileText className="h-5 w-5" />
                          )}
                        </button>
                        <button 
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300" 
                          title="Delete"
                          onClick={() => setDeleteConfirmation(assessment.id)}
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      {deleteConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-8 w-8 text-red-500" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Delete Assessment
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    Are you sure you want to delete this First Aid Needs Assessment? This action cannot be undone.
                  </p>
                </div>
                <button
                  onClick={() => setDeleteConfirmation(null)}
                  className="ml-auto flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setDeleteConfirmation(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirmation)}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Delete Assessment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}