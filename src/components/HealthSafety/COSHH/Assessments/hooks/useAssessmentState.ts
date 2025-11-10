import { useState, useEffect } from 'react';
import { supabase } from '../../../../../lib/supabase';
import { 
  CoshhAssessment, 
  AssessmentFormData, 
  AssessmentModalState, 
  AssessmentSearchState, 
  AssessmentPDFState,
  AssessmentIconState,
  DynamicControlItem,
  DynamicIngredientItem,
  PPE_FILENAMES,
  HAZARD_FILENAMES
} from '../types';
import { getSignedImageUrl, getSignedHazardImageUrl } from '../utils/iconHelpers';

export const useAssessmentState = () => {
  const [assessments, setAssessments] = useState<CoshhAssessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);

  // Helper function to get date 365 days from now
  const getDefaultReviewDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 365);
    return date.toISOString().split('T')[0];
  };

  // Modal state
  const [modalState, setModalState] = useState<AssessmentModalState>({
    showAddModal: false,
    showEditModal: false,
    showDeleteModal: false,
    showImportExportModal: false,
    selectedAssessment: null,
    currentStep: 1,
    importExportMode: 'export',
    selectedForExport: null
  });

  // Search state
  const [searchState, setSearchState] = useState<AssessmentSearchState>({
    searchTerm: '',
    filteredAssessments: [],
    ppeSearchQuery: '',
    hazardSearchQuery: ''
  });

  // PDF state
  const [pdfState, setPdfState] = useState<AssessmentPDFState>({
    downloadingPDF: false
  });

  // Icon state
  const [iconState, setIconState] = useState<AssessmentIconState>({
    loadingIcons: true,
    iconUrls: {},
    loadingHazardIcons: true,
    hazardIconUrls: {}
  });

  // Dynamic items state
  const [controlItems, setControlItems] = useState<DynamicControlItem[]>([]);
  const [ingredientItems, setIngredientItems] = useState<DynamicIngredientItem[]>([]);

  // Form data state
  const [formData, setFormData] = useState<AssessmentFormData>({
    id: '',
    substance_name: '',
    coshh_reference: '',
    supplied_by: '',
    description_of_substance: '',
    form: '',
    odour: '',
    method_of_use: '',
    site_and_location: '',
    assessment_date: new Date().toISOString().split('T')[0],
    review_date: getDefaultReviewDate(),
    persons_at_risk: [],
    routes_of_entry: [],
    selected_ppe: [],
    selected_hazards: [],
    ppe_location: '',
    hazards_precautions: '',
    carcinogen: false,
    sk: false,
    sen: false,
    ingredient_items: [],
    occupational_exposure: '',
    maximum_exposure: '',
    workplace_exposure: '',
    stel: '',
    stability_reactivity: '',
    ecological_information: '',
    amount_used: '',
    times_per_day: '',
    duration: '',
    how_often_process: '',
    how_long_process: '',
    general_precautions: '',
    first_aid_measures: '',
    accidental_release_measures: '',
    ventilation: '',
    handling: '',
    storage: '',
    further_controls: '',
    respiratory_protection: '',
    ppe_details: '',
    monitoring: '',
    health_surveillance: '',
    responsibility: '',
    by_when: '',
    spillage_procedure: '',
    fire_explosion: '',
    handling_storage: '',
    disposal_considerations: '',
    assessment_comments: '',
    additional_control_items: [],
    q1_answer: true,
    q1_action: '',
    q2_answer: true,
    q2_action: '',
    q3_answer: true,
    q3_action: '',
    q4_answer: true,
    q4_action: '',
    q5_answer: true,
    q5_action: '',
    assessment_conclusion: '',
    hazard_level: '',
    assessor_name: ''
  });

  // Fetch user profile
  const fetchUserProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.user_metadata?.display_name) {
        setUserProfile({ full_name: user.user_metadata.display_name });
      } else {
        setUserProfile({ full_name: 'Unknown User' });
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setUserProfile({ full_name: 'Unknown User' });
    }
  };

  // Fetch assessments from database
  const fetchAssessments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('coshh_assessments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAssessments(data || []);
    } catch (error) {
      console.error('Error fetching COSHH assessments:', error);
      setError('Failed to fetch assessments');
    } finally {
      setLoading(false);
    }
  };

  // Load signed URLs for all PPE icons in parallel
  const loadIconUrls = async () => {
    setIconState(prev => ({ ...prev, loadingIcons: true }));
    try {
      const urlPromises = Object.entries(PPE_FILENAMES).map(async ([ppe, filename]) => {
        const url = await getSignedImageUrl(filename);
        return [ppe, url] as [string, string | null];
      });

      const results = await Promise.all(urlPromises);
      const urls: Record<string, string> = {};
      results.forEach(([ppe, url]) => {
        if (url) {
          urls[ppe] = url;
        }
      });
      setIconState(prev => ({ ...prev, iconUrls: urls }));
    } catch (error) {
      console.error('Error loading PPE icons:', error);
    } finally {
      setIconState(prev => ({ ...prev, loadingIcons: false }));
    }
  };

  // Load signed URLs for all hazard icons in parallel
  const loadHazardIconUrls = async () => {
    setIconState(prev => ({ ...prev, loadingHazardIcons: true }));
    try {
      const urlPromises = Object.entries(HAZARD_FILENAMES).map(async ([hazard, filename]) => {
        const url = await getSignedHazardImageUrl(filename);
        return [hazard, url] as [string, string | null];
      });

      const results = await Promise.all(urlPromises);
      const urls: Record<string, string> = {};
      results.forEach(([hazard, url]) => {
        if (url) {
          urls[hazard] = url;
        }
      });
      setIconState(prev => ({ ...prev, hazardIconUrls: urls }));
    } catch (error) {
      console.error('Error loading hazard icons:', error);
    } finally {
      setIconState(prev => ({ ...prev, loadingHazardIcons: false }));
    }
  };

  // Filter assessments based on search term
  useEffect(() => {
    const filtered = assessments.filter(assessment =>
      assessment.substance_name.toLowerCase().includes(searchState.searchTerm.toLowerCase()) ||
      assessment.coshh_reference.toLowerCase().includes(searchState.searchTerm.toLowerCase()) ||
      assessment.supplied_by.toLowerCase().includes(searchState.searchTerm.toLowerCase())
    );

    setSearchState(prev => ({ ...prev, filteredAssessments: filtered }));
  }, [assessments, searchState.searchTerm]);

  // Initialize data on mount
  useEffect(() => {
    fetchAssessments();
    fetchUserProfile();
    loadIconUrls();
    loadHazardIconUrls();
  }, []);

  // Refresh signed URLs every 45 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      loadIconUrls();
      loadHazardIconUrls();
    }, 45 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  // Update assessor name when user profile changes
  useEffect(() => {
    if (userProfile?.full_name) {
      setFormData(prev => ({ ...prev, assessor_name: userProfile.full_name }));
    }
  }, [userProfile]);

  // Reset form data
  const resetForm = () => {
    setFormData({
      id: '',
      substance_name: '',
      coshh_reference: '',
      supplied_by: '',
      description_of_substance: '',
      form: '',
      odour: '',
      method_of_use: '',
      site_and_location: '',
      assessment_date: new Date().toISOString().split('T')[0],
      review_date: getDefaultReviewDate(),
      persons_at_risk: [],
      routes_of_entry: [],
      selected_ppe: [],
      selected_hazards: [],
      ppe_location: '',
      hazards_precautions: '',
      carcinogen: false,
      sk: false,
      sen: false,
      ingredient_items: [],
      occupational_exposure: '',
      maximum_exposure: '',
      workplace_exposure: '',
      stel: '',
      stability_reactivity: '',
      ecological_information: '',
      amount_used: '',
      times_per_day: '',
      duration: '',
      how_often_process: '',
      how_long_process: '',
      general_precautions: '',
      first_aid_measures: '',
      accidental_release_measures: '',
      ventilation: '',
      handling: '',
      storage: '',
      further_controls: '',
      respiratory_protection: '',
      ppe_details: '',
      monitoring: '',
      health_surveillance: '',
      responsibility: '',
      by_when: '',
      spillage_procedure: '',
      fire_explosion: '',
      handling_storage: '',
      disposal_considerations: '',
      assessment_comments: '',
      additional_control_items: [],
      q1_answer: true,
      q1_action: '',
      q2_answer: true,
      q2_action: '',
      q3_answer: true,
      q3_action: '',
      q4_answer: true,
      q4_action: '',
      q5_answer: true,
      q5_action: '',
      assessment_conclusion: '',
      hazard_level: '',
      assessor_name: userProfile?.full_name || ''
    });
    setModalState(prev => ({ ...prev, currentStep: 1 }));
    setControlItems([]);
    setIngredientItems([]);
  };

  // Modal control functions
  const openAddModal = async () => {
    try {
      // Generate next COSHH reference
      const { generateNextCoshhReference } = await import('../utils/referenceGenerator');
      const nextReference = await generateNextCoshhReference();
      
      resetForm();
      setFormData(prev => ({
        ...prev,
        coshh_reference: nextReference,
        assessor_name: userProfile?.full_name || '',
        assessment_date: new Date().toISOString().split('T')[0]
      }));
      setModalState(prev => ({ ...prev, showAddModal: true, currentStep: 1 }));
      
      // Load icon URLs when opening modal
      loadIconUrls();
      loadHazardIconUrls();
    } catch (error) {
      console.error('Error generating COSHH reference:', error);
      resetForm();
      setModalState(prev => ({ ...prev, showAddModal: true, currentStep: 1 }));
    }
  };

  const openEditModal = (assessment: CoshhAssessment) => {
    setFormData({
      ...assessment,
      assessor_name: assessment.assessor_name || userProfile?.full_name || ''
    });
    
    // Set control items from additional_control_items
    const controlItemsFromAssessment = assessment.additional_control_items.map((item, index) => ({
      id: `control-${index}`,
      item
    }));
    setControlItems(controlItemsFromAssessment);
    
    // Set ingredient items
    const ingredientItemsFromAssessment = assessment.ingredient_items.map((item, index) => ({
      id: `ingredient-${index}`,
      ...item
    }));
    setIngredientItems(ingredientItemsFromAssessment);
    
    setModalState(prev => ({ 
      ...prev, 
      showEditModal: true, 
      selectedAssessment: assessment,
      currentStep: 1 
    }));
    
    // Load icon URLs when opening modal
    loadIconUrls();
    loadHazardIconUrls();
  };

  const openDeleteModal = (assessment: CoshhAssessment) => {
    setModalState(prev => ({ 
      ...prev, 
      showDeleteModal: true, 
      selectedAssessment: assessment 
    }));
  };

  const openImportExportModal = (mode: 'import' | 'export' = 'export') => {
    setModalState(prev => ({ 
      ...prev, 
      showImportExportModal: true,
      importExportMode: mode
    }));
  };

  const closeAllModals = () => {
    setModalState({
      showAddModal: false,
      showEditModal: false,
      showDeleteModal: false,
      showImportExportModal: false,
      selectedAssessment: null,
      currentStep: 1,
      importExportMode: 'export',
      selectedForExport: null
    });
    resetForm();
  };

  // Step navigation
  const nextStep = () => {
    setModalState(prev => ({ ...prev, currentStep: Math.min(prev.currentStep + 1, 13) }));
  };

  const prevStep = () => {
    setModalState(prev => ({ ...prev, currentStep: Math.max(prev.currentStep - 1, 1) }));
  };

  const setCurrentStep = (step: number) => {
    setModalState(prev => ({ ...prev, currentStep: Math.max(1, Math.min(step, 13)) }));
  };

  // Search functionality
  const updateSearchTerm = (term: string) => {
    setSearchState(prev => ({ ...prev, searchTerm: term }));
  };

  const updatePpeSearchQuery = (query: string) => {
    setSearchState(prev => ({ ...prev, ppeSearchQuery: query }));
  };

  const updateHazardSearchQuery = (query: string) => {
    setSearchState(prev => ({ ...prev, hazardSearchQuery: query }));
  };

  return {
    // State
    assessments,
    loading,
    error,
    userProfile,
    formData,
    modalState,
    searchState,
    pdfState,
    iconState,
    controlItems,
    ingredientItems,
    
    // Functions
    setFormData,
    setModalState,
    setSearchState,
    setPdfState,
    setControlItems,
    setIngredientItems,
    fetchAssessments,
    resetForm,
    getDefaultReviewDate,
    
    // Modal controls
    openAddModal,
    openEditModal,
    openDeleteModal,
    openImportExportModal,
    closeAllModals,
    
    // Step navigation
    nextStep,
    prevStep,
    setCurrentStep,
    
    // Search
    updateSearchTerm,
    updatePpeSearchQuery,
    updateHazardSearchQuery,
    
    // Icon loading
    loadIconUrls,
    loadHazardIconUrls
  };
};
