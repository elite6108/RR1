import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { supabase } from '../../../lib/supabase';
import { generateContractorPDF } from '../../../utils/pdf/contractor/contractorPDFGenerator';

// Import extracted modules
import { 
  SubcontractorsProps,
  Subcontractor,
  SubcontractorFormData,
  ReviewFormData,
} from './types';
import { 
  useSubcontractors,
  useCompanySettings,
  useReminders,
  useBodyScrollLock 
} from './hooks';
import { 
  generateToken,
  filterContractors 
} from './utils';
import {
  SubcontractorsHeader,
  SearchBar,
  RemindersSection,
  ContractorsTable,
  FormModal,
  ReviewModal
} from './components';

export function Subcontractors({ setShowSubcontractors, setShowAdminDashboard }: SubcontractorsProps) {
  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedContractorId, setSelectedContractorId] = useState<string | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedContractorForReview, setSelectedContractorForReview] = useState<Subcontractor | null>(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingContractor, setEditingContractor] = useState<Subcontractor | null>(null);
  const [showReminders, setShowReminders] = useState(false);
  const [generatingPdfId, setGeneratingPdfId] = useState<string | null>(null);
  const [tokenLoading, setTokenLoading] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Use custom hooks
  const { subcontractors, loading, error, refetch } = useSubcontractors();
  const { companySettings } = useCompanySettings();
  const reminders = useReminders(subcontractors);
  
  // Lock body scroll when modals are open
  const isModalOpen = showFormModal || showReviewModal || showDeleteModal;
  useBodyScrollLock(isModalOpen);

  // Form data state
  const [formData, setFormData] = useState<SubcontractorFormData>({
    company_name: '',
    services_provided: '',
    address: '',
    phone: '',
    email: '',
    nature_of_business: '',
    swms: false,
    insurance_exp_date: '',
    review_date: '',
    employers_liability: {
      insurer: '',
      policy_no: '',
      renewal_date: '',
      limit_of_indemnity: '',
    },
    public_liability: {
      insurer: '',
      policy_no: '',
      renewal_date: '',
      limit_of_indemnity: '',
    },
    professional_negligence: {
      insurer: '',
      policy_no: '',
      renewal_date: '',
      limit_of_indemnity: '',
    },
    contractors_all_risk: {
      insurer: '',
      policy_no: '',
      renewal_date: '',
      limit_of_indemnity: '',
    },
    has_swms: false,
    has_health_safety_policy: false,
    additional_files: [],
    additional_files_urls: [],
  });

  const [customInsuranceTypes, setCustomInsuranceTypes] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [reviewFormData, setReviewFormData] = useState<ReviewFormData>({
    date: new Date().toISOString().split('T')[0],
    requirements_scope: '',
    requirements: '',
    review_date: '',
    agreed_timeframe: '',
    total_time_taken: '',
    actual_timeframe: '',

    // Satisfaction ratings
    quality_rating: { rating: 'totally_satisfied', comments: '' },
    timeliness_rating: { rating: 'totally_satisfied', comments: '' },
    communication_rating: { rating: 'totally_satisfied', comments: '' },
    understanding_rating: { rating: 'totally_satisfied', comments: '' },
    cooperativeness_rating: { rating: 'totally_satisfied', comments: '' },
    overall_satisfaction_rating: { rating: 'totally_satisfied', comments: '' },

    // Yes/No questions
    authority_to_work: true,
    relevant_permits: true,
    risk_assessments: true,
    documents_legible: true,
    time_limit_clear: true,
    control_measures: true,
    work_in_line: true,
    right_people: true,
    emergency_knowledge: true,
    ppe_condition: true,
    tools_condition: true,
    housekeeping_standards: true,
  });

  // Clear success message after 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Filter contractors based on search term
  const filteredContractors = filterContractors(subcontractors, searchTerm);

  // Handler functions
  const handleBack = () => {
    setShowSubcontractors(false);
    setShowAdminDashboard(true);
  };

  const handleAddContractor = () => {
    // Reset form data to initial empty state
    setFormData({
      company_name: '',
      services_provided: '',
      address: '',
      phone: '',
      email: '',
      nature_of_business: '',
      swms: false,
      insurance_exp_date: '',
      review_date: '',
      employers_liability: {
        insurer: '',
        policy_no: '',
        renewal_date: '',
        limit_of_indemnity: '',
      },
      public_liability: {
        insurer: '',
        policy_no: '',
        renewal_date: '',
        limit_of_indemnity: '',
      },
      professional_negligence: {
        insurer: '',
        policy_no: '',
        renewal_date: '',
        limit_of_indemnity: '',
      },
      contractors_all_risk: {
        insurer: '',
        policy_no: '',
        renewal_date: '',
        limit_of_indemnity: '',
      },
      has_swms: false,
      has_health_safety_policy: false,
      additional_files: [],
      additional_files_urls: [],
    });
    setCustomInsuranceTypes([]);
    setEditingContractor(null);
    setCurrentStep(1);
    setShowFormModal(true);
  };

  const handleDelete = (id: string) => {
    setSelectedContractorId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedContractorId) return;

    try {
      const { error } = await supabase
        .from('subcontractors')
        .delete()
        .eq('id', selectedContractorId);

      if (error) throw error;

      await refetch();
      setShowDeleteModal(false);
      setSelectedContractorId(null);
      setSuccessMessage('Contractor deleted successfully');
    } catch (error) {
      console.error('Error deleting contractor:', error);
    }
  };

  const handleEdit = (contractor: Subcontractor) => {
    // Initialize formData with the contractor's values
    setFormData({
      company_name: contractor.company_name,
      services_provided: contractor.services_provided,
      address: contractor.address,
      phone: contractor.phone,
      email: contractor.email,
      nature_of_business: contractor.nature_of_business,
      swms: contractor.swms,
      insurance_exp_date: contractor.insurance_exp_date,
      review_date: contractor.review_date,
      employers_liability: contractor.employers_liability,
      public_liability: contractor.public_liability,
      professional_negligence: contractor.professional_negligence,
      contractors_all_risk: contractor.contractors_all_risk,
      custom_insurance_types: contractor.custom_insurance_types,
      has_swms: !!contractor.swms_url,
      swms_url: contractor.swms_url,
      has_health_safety_policy: !!contractor.health_safety_policy_url,
      health_safety_policy_url: contractor.health_safety_policy_url,
      additional_files: [],
      additional_files_urls: contractor.additional_files_urls || [],
    });

    if (contractor.custom_insurance_types) {
      setCustomInsuranceTypes(Object.keys(contractor.custom_insurance_types));
    }

    setEditingContractor(contractor);
    setCurrentStep(1);
    setShowFormModal(true);
  };

  const handleGenerateToken = async (contractorId: string) => {
    try {
      setTokenLoading(contractorId);
      const newToken = generateToken();

      const { error } = await supabase
        .from('subcontractors')
        .update({ token: newToken })
        .eq('id', contractorId);

      if (error) throw error;

      await refetch();
      setSuccessMessage('Token generated successfully');
    } catch (error) {
      console.error('Error generating token:', error);
    } finally {
      setTokenLoading(null);
    }
  };

  const handleCopyToken = async (token: string) => {
    try {
      await navigator.clipboard.writeText(token);
      setSuccessMessage('Token copied to clipboard');
    } catch (error) {
      console.error('Error copying token:', error);
    }
  };

  const handleReview = (contractor: Subcontractor) => {
    setSelectedContractorForReview(contractor);
    // Initialize review form data with existing review data if it exists
    if (contractor.review) {
      setReviewFormData(contractor.review);
    } else {
      // Reset to default values if no existing review
      const today = new Date().toISOString().split('T')[0];
      setReviewFormData({
        date: today,
        requirements_scope: '',
        requirements: '',
        review_date: today,
        agreed_timeframe: '',
        total_time_taken: '',
        actual_timeframe: '',

        // Default satisfaction ratings
        quality_rating: { rating: 'totally_satisfied', comments: '' },
        timeliness_rating: { rating: 'totally_satisfied', comments: '' },
        communication_rating: { rating: 'totally_satisfied', comments: '' },
        understanding_rating: { rating: 'totally_satisfied', comments: '' },
        cooperativeness_rating: { rating: 'totally_satisfied', comments: '' },
        overall_satisfaction_rating: { rating: 'totally_satisfied', comments: '' },

        // Default Yes/No questions
        authority_to_work: true,
        relevant_permits: true,
        risk_assessments: true,
        documents_legible: true,
        time_limit_clear: true,
        control_measures: true,
        work_in_line: true,
        right_people: true,
        emergency_knowledge: true,
        ppe_condition: true,
        tools_condition: true,
        housekeeping_standards: true,
      });
    }
    setShowReviewModal(true);
  };

  // Form handler functions
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleInsuranceChange = (
    type: keyof SubcontractorFormData,
    field: keyof InsuranceDetails,
    value: string
  ) => {
    setFormData((prev) => {
      // Check if the type exists in prev before spreading
      const currentTypeData = prev[type] as InsuranceDetails || {
        insurer: '',
        policy_no: '',
        renewal_date: '',
        limit_of_indemnity: '',
      };
      
      return {
        ...prev,
        [type]: {
          ...currentTypeData,
          [field]: value,
        },
      };
    });
  };

  const handleFileUpload = async (
    file: File,
    type: 'swms' | 'health_safety' | 'additional'
  ) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${type}_${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('subcontractor-files')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Create a signed URL with 1 hour expiry
      const { data } = await supabase.storage
        .from('subcontractor-files')
        .createSignedUrl(fileName, 60 * 60); // 1 hour expiry

      if (!data?.signedUrl) throw new Error("Failed to generate signed URL");
      
      const signedUrl = data.signedUrl;

      if (type === 'swms') {
        setFormData((prev) => ({ 
          ...prev, 
          swms_url: signedUrl,
          // Store the path/filename to retrieve later
          swms_file_path: fileName 
        }));
      } else if (type === 'health_safety') {
        setFormData((prev) => ({
          ...prev,
          health_safety_policy_url: signedUrl,
          // Store the path/filename to retrieve later
          health_safety_file_path: fileName
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          additional_files_urls: [...prev.additional_files_urls, signedUrl],
          // Store the path/filename to retrieve later
          additional_files_paths: [...(prev.additional_files_paths || []), fileName]
        }));
      }
    } catch (err) {
      console.error('Error uploading file:', err);
    }
  };

  const handleFormSubmit = async (data: SubcontractorFormData) => {
    try {
      const {
        has_swms,
        swms_file,
        swms_file_path,
        has_health_safety_policy,
        health_safety_policy_file,
        health_safety_file_path,
        additional_files,
        additional_files_paths,
        ...contractorData
      } = data;

      // Set SWMS boolean based on whether file was uploaded
      contractorData.swms = has_swms && !!data.swms_url;

      if (editingContractor) {
        const { error } = await supabase
          .from('subcontractors')
          .update(contractorData)
          .eq('id', editingContractor.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('subcontractors')
          .insert([contractorData]);

        if (error) throw error;
      }

      await refetch();
      setShowFormModal(false);
      setEditingContractor(null);
      setSuccessMessage(`Contractor ${editingContractor ? 'updated' : 'added'} successfully`);
    } catch (error) {
      console.error('Error saving contractor:', error);
    }
  };

  // Review handler functions
  const handleReviewChange = (field: keyof ReviewFormData, value: any) => {
    setReviewFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSatisfactionChange = (
    field: keyof ReviewFormData,
    rating: string,
    comments?: string
  ) => {
    setReviewFormData((prev) => ({
      ...prev,
      [field]: {
        rating: rating as any,
        comments: comments || '',
      },
    }));
  };

  const handleRequirementsChange = (value: string) => {
    setReviewFormData((prev) => ({
      ...prev,
      requirements_scope: value,
    }));
  };

  const handleDateChange = (value: string) => {
    setReviewFormData((prev) => ({
      ...prev,
      date: value,
    }));
  };

  const submitReview = async () => {
    if (!selectedContractorForReview) return;

    try {
      setSubmittingReview(true);
      setSubmitError(null);

      const reviewDataToSubmit = {
        contractor_id: selectedContractorForReview.id,
        ...reviewFormData,
      };

      // Use upsert to handle both insert and update cases
      // If reviewFormData has an id, it's an update; otherwise it's an insert
      const { error: reviewError } = await supabase
        .from('contractor_reviews')
        .upsert([reviewDataToSubmit]);

      if (reviewError) throw reviewError;

      // Update the review date in the subcontractors table
      const { error: updateError } = await supabase
        .from('subcontractors')
        .update({ review_date: reviewFormData.date })
        .eq('id', selectedContractorForReview.id);

      if (updateError) throw updateError;

      await refetch();
      setShowReviewModal(false);
      setSelectedContractorForReview(null);
      setSubmittingReview(false);
      setSuccessMessage('Review saved successfully');
    } catch (error: any) {
      console.error('Error saving review:', error);
      setSubmittingReview(false);
      setSubmitError(`Failed to save review: ${error.message}`);
    }
  };

  const handleGeneratePDF = async (contractor: Subcontractor) => {
    try {
      setGeneratingPdfId(contractor.id);
      
      // Open new window immediately to avoid popup blockers
      const newWindow = window.open('', '_blank');
      
      // Check if window was blocked
      if (!newWindow) {
        alert('Please allow popups for this site to view the PDF');
        return;
      }

      // Show loading state in the new window
      newWindow.document.write(`
        <html>
          <head>
            <title>Generating PDF...</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                display: flex; 
                justify-content: center; 
                align-items: center; 
                height: 100vh; 
                margin: 0; 
                background: #f5f5f5;
              }
              .loading { text-align: center; }
              .spinner { 
                border: 4px solid #f3f3f3; 
                border-top: 4px solid #3498db; 
                border-radius: 50%; 
                width: 40px; 
                height: 40px; 
                animation: spin 2s linear infinite; 
                margin: 0 auto 20px;
              }
              @keyframes spin { 
                0% { transform: rotate(0deg); } 
                100% { transform: rotate(360deg); } 
              }
            </style>
          </head>
          <body>
            <div class="loading">
              <div class="spinner"></div>
              <p>Generating PDF...</p>
            </div>
          </body>
        </html>
      `);

      const pdfDataUrl = await generateContractorPDF({
        contractor,
        companySettings,
      });

      const formattedFilename = `Contractor-${contractor.company_name.replace(/\s+/g, '-')}.pdf`;
      
      // Check if window is still open
      if (newWindow.closed) {
        console.log('Window was closed by user');
        return;
      }

      // Desktop handling - convert to blob for better compatibility
      const response = await fetch(pdfDataUrl);
      const blob = await response.blob();
      const pdfUrl = URL.createObjectURL(blob);
      
      const htmlContent = `
        <html>
          <head>
            <title>${formattedFilename}</title>
            <style>
              body { 
                margin: 0; 
                padding: 0; 
                font-family: Arial, sans-serif;
              }
              .download-bar {
                background: #f8f9fa;
                border-bottom: 1px solid #dee2e6;
                padding: 10px 20px;
                text-align: center;
                position: sticky;
                top: 0;
                z-index: 1000;
              }
              .download-button {
                background: #007bff;
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 4px;
                cursor: pointer;
                text-decoration: none;
                font-size: 14px;
              }
              .download-button:hover {
                background: #0056b3;
              }
              .pdf-view {
                height: calc(100vh - 50px);
              }
              iframe {
                width: 100%;
                height: 100%;
                border: none;
              }
            </style>
          </head>
          <body>
            <div class="download-bar">
              <a id="download-btn" class="download-button" href="#">Download ${formattedFilename}</a>
            </div>
            <div class="pdf-view">
              <iframe id="pdf-iframe" src="${pdfUrl}" style="width:100%; height:100%; border:none;"></iframe>
            </div>
            
            <script>
              const fileName = '${formattedFilename}';
              const pdfUrl = '${pdfUrl}';
              
              document.getElementById('download-btn').addEventListener('click', function(e) {
                e.preventDefault();
                
                // Create download link
                const a = document.createElement('a');
                a.href = pdfUrl;
                a.download = fileName;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
              });
              
              // Handle Ctrl+S for save
              document.addEventListener('keydown', function(e) {
                if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                  e.preventDefault();
                  document.getElementById('download-btn').click();
                }
              });
              
              // Cleanup on window close
              window.addEventListener('beforeunload', function() {
                URL.revokeObjectURL(pdfUrl);
              });
            </script>
          </body>
        </html>
      `;
      
      newWindow.document.open();
      newWindow.document.write(htmlContent);
      newWindow.document.close();

    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setGeneratingPdfId(null);
    }
  };

  return (
    <div>
      <SubcontractorsHeader 
        onBack={handleBack}
        onAddContractor={handleAddContractor}
      />
      
      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onAddContractor={handleAddContractor}
      />

      <RemindersSection
        reminders={reminders}
        showReminders={showReminders}
        onToggleReminders={() => setShowReminders(!showReminders)}
      />

      <ContractorsTable
        contractors={filteredContractors}
        loading={loading}
        error={error}
        successMessage={successMessage}
        tokenLoading={tokenLoading}
        generatingPdfId={generatingPdfId}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onReview={handleReview}
        onGeneratePDF={handleGeneratePDF}
        onGenerateToken={handleGenerateToken}
        onCopyToken={handleCopyToken}
      />

      {/* Delete Modal */}
      {showDeleteModal && createPortal(
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Confirm Delete
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Are you sure you want to delete this contractor? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      <FormModal
        showModal={showFormModal}
        editingContractor={editingContractor}
        currentStep={currentStep}
        formData={formData}
        customInsuranceTypes={customInsuranceTypes}
        onClose={() => setShowFormModal(false)}
        onStepChange={setCurrentStep}
        onSubmit={handleFormSubmit}
        onInputChange={handleInputChange}
        onInsuranceChange={handleInsuranceChange}
        onFileUpload={handleFileUpload}
        setFormData={setFormData}
        setCustomInsuranceTypes={setCustomInsuranceTypes}
      />

      <ReviewModal
        showModal={showReviewModal}
        contractor={selectedContractorForReview}
        reviewFormData={reviewFormData}
        submittingReview={submittingReview}
        submitError={submitError}
        onClose={() => {
          setShowReviewModal(false);
          setSubmitError(null);
        }}
        onSubmit={submitReview}
        onReviewChange={handleReviewChange}
        onSatisfactionChange={handleSatisfactionChange}
        onRequirementsChange={handleRequirementsChange}
        onDateChange={handleDateChange}
      />
    </div>
  );
}
