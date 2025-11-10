import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../../../lib/supabase';
import { Site, SiteLog, Project, NewSiteFormData, W3WValidation, Coordinates } from '../types';

export function useSiteLists() {
  const [sites, setSites] = useState<Site[]>([]);
  const [selectedSiteId, setSelectedSiteId] = useState<string | null>(null);
  const [siteLogs, setSiteLogs] = useState<SiteLog[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [siteToEdit, setSiteToEdit] = useState<Site | null>(null);
  const [siteToDelete, setSiteToDelete] = useState<Site | null>(null);
  const [showSiteLogs, setShowSiteLogs] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [newSite, setNewSite] = useState<NewSiteFormData>({
    name: '',
    address: '',
    town: '',
    county: '',
    postcode: '',
    site_manager: '',
    phone: '',
    what3words: '',
    project_id: '',
  });
  const [w3wValidation, setW3wValidation] = useState<W3WValidation>({
    isValid: false,
    message: '',
    isChecking: false,
  });
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const [currentView, setCurrentView] = useState<'list' | 'logs'>('list');
  const [currentStep, setCurrentStep] = useState(1);
  const [showW3WModal, setShowW3WModal] = useState(false);

  useEffect(() => {
    fetchSites();
    fetchProjects();
  }, []);

  useEffect(() => {
    if (selectedSiteId) {
      fetchSiteLogs(selectedSiteId);
    }
  }, [selectedSiteId]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    const isModalOpen = showAddModal || showEditModal || showDeleteModal;
    
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to restore scroll when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showAddModal, showEditModal, showDeleteModal]);

  const fetchSites = async () => {
    try {
      const { data, error } = await supabase
        .from('sites')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSites(data || []);
    } catch (error) {
      console.error('Error fetching sites:', error);
    }
  };

  const fetchSiteLogs = async (siteId: string) => {
    try {
      const { data, error } = await supabase
        .from('site_logs')
        .select('*')
        .eq('site_id', siteId)
        .order('logged_in_at', { ascending: false });

      if (error) throw error;
      setSiteLogs(data || []);
    } catch (error) {
      console.error('Error fetching site logs:', error);
    }
  };

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleAddSite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep !== 3) {
      nextStep();
      return;
    }

    try {
      const { error } = await supabase.from('sites').insert([newSite]);

      if (error) throw error;

      setShowAddModal(false);
      setNewSite({
        name: '',
        address: '',
        town: '',
        county: '',
        postcode: '',
        site_manager: '',
        phone: '',
        what3words: '',
        project_id: '',
      });
      setCurrentStep(1);
      fetchSites();
    } catch (error) {
      console.error('Error adding site:', error);
    }
  };

  const handleEditSite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep !== 3) {
      nextStep();
      return;
    }

    if (!siteToEdit) return;

    try {
      const { error } = await supabase
        .from('sites')
        .update({
          name: newSite.name,
          address: newSite.address,
          town: newSite.town,
          county: newSite.county,
          postcode: newSite.postcode,
          site_manager: newSite.site_manager,
          phone: newSite.phone,
          what3words: newSite.what3words,
          project_id: newSite.project_id,
        })
        .eq('id', siteToEdit.id);

      if (error) throw error;

      setShowEditModal(false);
      setSiteToEdit(null);
      setCurrentStep(1);
      fetchSites();
    } catch (error) {
      console.error('Error updating site:', error);
    }
  };

  const handleDeleteSite = async () => {
    if (!siteToDelete) return;

    try {
      const { error } = await supabase
        .from('sites')
        .delete()
        .eq('id', siteToDelete.id);

      if (error) throw error;

      setShowDeleteModal(false);
      setSiteToDelete(null);
      if (selectedSiteId === siteToDelete.id) {
        setSelectedSiteId(null);
        setShowSiteLogs(false);
      }
      fetchSites();
    } catch (error) {
      console.error('Error deleting site:', error);
    }
  };

  const openEditModal = (site: Site) => {
    setSiteToEdit(site);
    setNewSite({
      name: site.name,
      address: site.address,
      town: site.town,
      county: site.county,
      postcode: site.postcode,
      site_manager: site.site_manager,
      phone: site.phone,
      what3words: site.what3words || '',
      project_id: site.project_id || '',
    });
    setShowEditModal(true);
    
    // Scroll to top on mobile when modal opens
    if (window.innerWidth < 640) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const openDeleteModal = (site: Site) => {
    setSiteToDelete(site);
    setShowDeleteModal(true);
    
    // Scroll to top on mobile when modal opens
    if (window.innerWidth < 640) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSiteClick = (site: Site) => {
    setSelectedSiteId(site.id);
    setCurrentView('logs');
    
    // Scroll to top on mobile when modal opens
    if (window.innerWidth < 640) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedSiteId(null);
  };

  const filteredSites = sites.filter((site) => {
    const query = searchQuery.toLowerCase();
    return (
      site.name?.toLowerCase().includes(query) ||
      site.address?.toLowerCase().includes(query) ||
      site.town?.toLowerCase().includes(query) ||
      site.county?.toLowerCase().includes(query) ||
      site.postcode?.toLowerCase().includes(query) ||
      site.site_manager?.toLowerCase().includes(query) ||
      site.phone?.toLowerCase().includes(query)
    );
  });

  const openW3WModal = () => {
    setShowW3WModal(true);
    
    // Scroll to top on mobile when modal opens
    if (window.innerWidth < 640) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const closeW3WModal = () => {
    setShowW3WModal(false);
  };

  const handleSiteChange = (changes: Partial<NewSiteFormData>) => {
    setNewSite(prev => ({ ...prev, ...changes }));
  };

  const closeAddModal = () => {
    setShowAddModal(false);
    setCurrentStep(1);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setSiteToEdit(null);
    setCurrentStep(1);
  };

  return {
    // State
    sites,
    selectedSiteId,
    siteLogs,
    showAddModal,
    showEditModal,
    showDeleteModal,
    siteToEdit,
    siteToDelete,
    showSiteLogs,
    searchQuery,
    projects,
    newSite,
    w3wValidation,
    suggestions,
    showSuggestions,
    coordinates,
    suggestionsRef,
    currentView,
    currentStep,
    showW3WModal,
    filteredSites,
    
    // Setters
    setSelectedSiteId,
    setSiteLogs,
    setShowAddModal,
    setShowEditModal,
    setShowDeleteModal,
    setSiteToEdit,
    setSiteToDelete,
    setShowSiteLogs,
    setSearchQuery,
    setNewSite,
    setW3wValidation,
    setSuggestions,
    setShowSuggestions,
    setCoordinates,
    setCurrentView,
    setCurrentStep,
    setShowW3WModal,
    
    // Handlers
    handleAddSite,
    handleEditSite,
    handleDeleteSite,
    openEditModal,
    openDeleteModal,
    handleSiteClick,
    handleBackToList,
    nextStep,
    prevStep,
    openW3WModal,
    closeW3WModal,
    handleSiteChange,
    closeAddModal,
    closeEditModal,
    fetchSites,
    fetchSiteLogs,
    fetchProjects,
  };
}
