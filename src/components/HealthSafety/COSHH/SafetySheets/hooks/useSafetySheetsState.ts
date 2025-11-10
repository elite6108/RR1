import { useState, useEffect } from 'react';
import { supabase } from '../../../../../lib/supabase';
import { 
  CoshhMSDS, 
  CoshhRegisterItem, 
  SafetySheetsFormData, 
  SafetySheetsModalState, 
  SafetySheetsSearchState 
} from '../types';

export const useSafetySheetsState = () => {
  const [msdsSheets, setMsdsSheets] = useState<CoshhMSDS[]>([]);
  const [coshhRegister, setCoshhRegister] = useState<CoshhRegisterItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [modalState, setModalState] = useState<SafetySheetsModalState>({
    showUploadModal: false,
    showDeleteModal: false,
    selectedSheetForDelete: null,
    deleting: false,
    uploading: false,
    selectedFile: null,
    dragOver: false
  });

  // Search state
  const [searchState, setSearchState] = useState<SafetySheetsSearchState>({
    searchTerm: '',
    filteredSheets: []
  });

  // Form data state
  const [formData, setFormData] = useState<SafetySheetsFormData>({
    substance_name: '',
    manufacturer: '',
    coshh_register_id: ''
  });

  // Fetch MSDS sheets from database
  const fetchMSDSSheets = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('coshh_msds')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMsdsSheets(data || []);
    } catch (error) {
      console.error('Error fetching MSDS sheets:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch COSHH register items
  const fetchCoshhRegister = async () => {
    try {
      const { data, error } = await supabase
        .from('coshh_register')
        .select('id, substance_name, manufacturer')
        .order('substance_name', { ascending: true });

      if (error) throw error;
      setCoshhRegister(data || []);
    } catch (error) {
      console.error('Error fetching COSHH register:', error);
    }
  };

  // Filter sheets based on search term
  useEffect(() => {
    const filtered = msdsSheets.filter(sheet =>
      sheet.substance_name.toLowerCase().includes(searchState.searchTerm.toLowerCase()) ||
      sheet.manufacturer.toLowerCase().includes(searchState.searchTerm.toLowerCase()) ||
      sheet.file_name.toLowerCase().includes(searchState.searchTerm.toLowerCase())
    );

    setSearchState(prev => ({ ...prev, filteredSheets: filtered }));
  }, [msdsSheets, searchState.searchTerm]);

  // Initialize data on mount
  useEffect(() => {
    fetchMSDSSheets();
    fetchCoshhRegister();
  }, []);

  // File handling
  const handleFileSelect = (file: File): boolean => {
    if (file.type !== 'application/pdf') {
      alert('Please select a PDF file only.');
      return false;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      alert('File size must be less than 10MB.');
      return false;
    }

    setModalState(prev => ({ ...prev, selectedFile: file }));
    return true;
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setModalState(prev => ({ ...prev, dragOver: true }));
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setModalState(prev => ({ ...prev, dragOver: false }));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setModalState(prev => ({ ...prev, dragOver: false }));
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0] as File);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  // Register selection handling
  const handleRegisterSelection = (registerId: string) => {
    const selected = coshhRegister.find(item => item.id === registerId);
    if (selected) {
      setFormData({
        ...formData,
        coshh_register_id: registerId,
        substance_name: selected.substance_name,
        manufacturer: selected.manufacturer
      });
    }
  };

  // Modal control functions
  const openUploadModal = () => {
    setFormData({ substance_name: '', manufacturer: '', coshh_register_id: '' });
    setModalState(prev => ({ 
      ...prev, 
      showUploadModal: true,
      selectedFile: null
    }));
  };

  const openDeleteModal = (sheet: CoshhMSDS) => {
    setModalState(prev => ({ 
      ...prev, 
      showDeleteModal: true, 
      selectedSheetForDelete: sheet 
    }));
  };

  const closeAllModals = () => {
    setModalState({
      showUploadModal: false,
      showDeleteModal: false,
      selectedSheetForDelete: null,
      deleting: false,
      uploading: false,
      selectedFile: null,
      dragOver: false
    });
    setFormData({ substance_name: '', manufacturer: '', coshh_register_id: '' });
  };

  // Search functionality
  const updateSearchTerm = (term: string) => {
    setSearchState(prev => ({ ...prev, searchTerm: term }));
  };

  // Utility functions
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return {
    // State
    msdsSheets,
    coshhRegister,
    loading,
    modalState,
    searchState,
    formData,
    
    // Functions
    setModalState,
    setFormData,
    fetchMSDSSheets,
    fetchCoshhRegister,
    
    // File handling
    handleFileSelect,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileInputChange,
    
    // Register selection
    handleRegisterSelection,
    
    // Modal controls
    openUploadModal,
    openDeleteModal,
    closeAllModals,
    
    // Search
    updateSearchTerm,
    
    // Utilities
    formatFileSize
  };
};
