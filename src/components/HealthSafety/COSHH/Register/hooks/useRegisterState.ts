import { useState, useEffect } from 'react';
import { supabase } from '../../../../../lib/supabase';
import { CoshhSubstance, RegisterFormData, RegisterModalState, RegisterSearchState, RegisterPDFState, COSHH_CATEGORIES } from '../types';

export const useRegisterState = () => {
  const [substances, setSubstances] = useState<CoshhSubstance[]>([]);
  const [loading, setLoading] = useState(true);
  const [auditorName, setAuditorName] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [showCustomCategory, setShowCustomCategory] = useState(false);

  // Modal state
  const [modalState, setModalState] = useState<RegisterModalState>({
    showAddModal: false,
    showEditModal: false,
    showReviewModal: false,
    showDeleteModal: false,
    selectedSubstance: null,
    currentStep: 1
  });

  // Search state
  const [searchState, setSearchState] = useState<RegisterSearchState>({
    searchTerm: '',
    filteredSubstances: []
  });

  // PDF state
  const [pdfState, setPdfState] = useState<RegisterPDFState>({
    downloadingPDF: false
  });

  // Helper function to get date 365 days from now
  const getDefaultReviewDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 365);
    return date.toISOString().split('T')[0];
  };

  // Form data state
  const [formData, setFormData] = useState<RegisterFormData>({
    substance_name: '',
    manufacturer: '',
    category: [],
    storage_location: '',
    hazard_sheet_location: 'Stonepad > H&S > Coshh > MSDS',
    review_date: getDefaultReviewDate()
  });

  // Helper function to normalize category data (handle both string and array formats)
  const normalizeCategories = (category: string | string[]): string[] => {
    if (Array.isArray(category)) {
      return category;
    }
    return category ? [category] : [];
  };

  // Fetch user profile
  const fetchUserProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.user_metadata?.display_name) {
        setAuditorName(user.user_metadata.display_name);
      } else {
        setAuditorName('Unknown User');
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setAuditorName('Unknown User');
    }
  };

  // Fetch substances from database
  const fetchSubstances = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('coshh_register')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSubstances(data || []);
    } catch (error) {
      console.error('Error fetching COSHH substances:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter substances based on search term
  useEffect(() => {
    const filtered = substances.filter(substance => {
      const searchLower = searchState.searchTerm.toLowerCase();
      const categories = normalizeCategories(substance.category);
      
      return substance.substance_name.toLowerCase().includes(searchLower) ||
             substance.manufacturer.toLowerCase().includes(searchLower) ||
             categories.some(cat => cat.toLowerCase().includes(searchLower));
    });

    setSearchState(prev => ({ ...prev, filteredSubstances: filtered }));
  }, [substances, searchState.searchTerm]);

  // Initialize data on mount
  useEffect(() => {
    fetchSubstances();
    fetchUserProfile();
  }, []);

  // Reset form data
  const resetForm = () => {
    setFormData({
      substance_name: '',
      manufacturer: '',
      category: [],
      storage_location: '',
      hazard_sheet_location: 'Stonepad > H&S > Coshh > MSDS',
      review_date: getDefaultReviewDate()
    });
    setCustomCategory('');
    setShowCustomCategory(false);
    setModalState(prev => ({ ...prev, currentStep: 1 }));
  };

  // Modal control functions
  const openAddModal = () => {
    resetForm();
    setModalState(prev => ({ ...prev, showAddModal: true }));
  };

  const openEditModal = (substance: CoshhSubstance) => {
    const normalizedCategories = normalizeCategories(substance.category);
    
    setFormData({
      substance_name: substance.substance_name,
      manufacturer: substance.manufacturer,
      category: normalizedCategories,
      storage_location: substance.storage_location,
      hazard_sheet_location: substance.hazard_sheet_location,
      review_date: substance.review_date
    });
    
    // Check if there are any custom categories (not in predefined list)
    const hasCustomCategories = normalizedCategories.some(cat => !COSHH_CATEGORIES.includes(cat));
    setShowCustomCategory(hasCustomCategories);
    setCustomCategory('');
    
    setModalState(prev => ({ 
      ...prev, 
      showEditModal: true, 
      selectedSubstance: substance,
      currentStep: 1 
    }));
  };

  const openReviewModal = (substance: CoshhSubstance) => {
    const normalizedCategories = normalizeCategories(substance.category);
    
    setFormData({
      substance_name: substance.substance_name,
      manufacturer: substance.manufacturer,
      category: normalizedCategories,
      storage_location: substance.storage_location,
      hazard_sheet_location: substance.hazard_sheet_location,
      review_date: substance.review_date
    });
    
    // Check if there are any custom categories (not in predefined list)
    const hasCustomCategories = normalizedCategories.some(cat => !COSHH_CATEGORIES.includes(cat));
    setShowCustomCategory(hasCustomCategories);
    setCustomCategory('');
    
    setModalState(prev => ({ 
      ...prev, 
      showReviewModal: true, 
      selectedSubstance: substance,
      currentStep: 1 
    }));
  };

  const openDeleteModal = (substance: CoshhSubstance) => {
    setModalState(prev => ({ 
      ...prev, 
      showDeleteModal: true, 
      selectedSubstance: substance 
    }));
  };

  const closeAllModals = () => {
    setModalState({
      showAddModal: false,
      showEditModal: false,
      showReviewModal: false,
      showDeleteModal: false,
      selectedSubstance: null,
      currentStep: 1
    });
    resetForm();
  };

  // Step navigation
  const nextStep = () => {
    setModalState(prev => ({ ...prev, currentStep: Math.min(prev.currentStep + 1, 3) }));
  };

  const prevStep = () => {
    setModalState(prev => ({ ...prev, currentStep: Math.max(prev.currentStep - 1, 1) }));
  };

  // Search functionality
  const updateSearchTerm = (term: string) => {
    setSearchState(prev => ({ ...prev, searchTerm: term }));
  };

  // Custom category handling
  const handleOtherToggle = (checked: boolean) => {
    setShowCustomCategory(checked);
    if (!checked) {
      setCustomCategory('');
      // Only remove custom categories if we're in add mode, not edit mode
      if (modalState.showAddModal) {
        setFormData(prev => ({
          ...prev,
          category: prev.category.filter(cat => COSHH_CATEGORIES.includes(cat))
        }));
      }
    }
  };

  const handleAddCustomCategory = () => {
    const trimmedCategory = customCategory.trim();
    
    if (trimmedCategory && !formData.category.includes(trimmedCategory)) {
      const newCategories = [...formData.category, trimmedCategory];
      
      setFormData(prev => ({
        ...prev,
        category: newCategories
      }));
      setCustomCategory('');
    }
  };

  return {
    // State
    substances,
    loading,
    auditorName,
    formData,
    modalState,
    searchState,
    pdfState,
    customCategory,
    showCustomCategory,
    
    // Functions
    setFormData,
    setCustomCategory,
    setPdfState,
    fetchSubstances,
    resetForm,
    normalizeCategories,
    getDefaultReviewDate,
    
    // Modal controls
    openAddModal,
    openEditModal,
    openReviewModal,
    openDeleteModal,
    closeAllModals,
    
    // Step navigation
    nextStep,
    prevStep,
    
    // Search
    updateSearchTerm,
    
    // Custom categories
    handleOtherToggle,
    handleAddCustomCategory
  };
};
