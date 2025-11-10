import { useState, useEffect } from 'react';
import { supabase } from '../../../../../lib/supabase';
import type { Site, NewSiteData } from '../types';

interface UseSiteActionsProps {
  projectId: string;
  onSitesChange?: () => void;
}

export function useSiteActions({ projectId, onSitesChange }: UseSiteActionsProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [siteToEdit, setSiteToEdit] = useState<Site | null>(null);
  const [siteToDelete, setSiteToDelete] = useState<Site | null>(null);
  const [newSite, setNewSite] = useState<NewSiteData>({
    name: '',
    address: '',
    town: '',
    county: '',
    postcode: '',
    site_manager: '',
    phone: '',
    what3words: '',
    project_id: projectId,
  });
  const [currentStep, setCurrentStep] = useState(1);

  // Prevent body scroll when modal is open
  useEffect(() => {
    const isModalOpen = showAddModal || showEditModal || showDeleteModal;
    
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
      // Scroll to top of viewport when modal opens
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to restore scroll when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showAddModal, showEditModal, showDeleteModal]);

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const resetForm = () => {
    setNewSite({
      name: '',
      address: '',
      town: '',
      county: '',
      postcode: '',
      site_manager: '',
      phone: '',
      what3words: '',
      project_id: projectId,
    });
    setCurrentStep(1);
  };

  const handleAddSite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep !== 3) {
      nextStep();
      return;
    }

    try {
      const { error } = await supabase.from('sites').insert([
        {
          ...newSite,
          project_id: projectId,
        },
      ]);

      if (error) throw error;

      setShowAddModal(false);
      resetForm();
      
      if (onSitesChange) {
        onSitesChange();
      }
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
          project_id: projectId,
        })
        .eq('id', siteToEdit.id);

      if (error) throw error;

      setShowEditModal(false);
      setSiteToEdit(null);
      setCurrentStep(1);
      
      if (onSitesChange) {
        onSitesChange();
      }
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
      
      if (onSitesChange) {
        onSitesChange();
      }
    } catch (error) {
      console.error('Error deleting site:', error);
    }
  };

  const openAddModal = () => {
    setShowAddModal(true);
    resetForm();
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
      project_id: site.project_id,
    });
    setShowEditModal(true);
    setCurrentStep(1);
  };

  const openDeleteModal = (site: Site) => {
    setSiteToDelete(site);
    setShowDeleteModal(true);
  };

  const closeAddModal = () => {
    setShowAddModal(false);
    setCurrentStep(1);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setCurrentStep(1);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
  };

  return {
    // State
    showAddModal,
    showEditModal,
    showDeleteModal,
    siteToEdit,
    siteToDelete,
    newSite,
    currentStep,
    
    // Actions
    setNewSite,
    setSiteToEdit,
    nextStep,
    prevStep,
    handleAddSite,
    handleEditSite,
    handleDeleteSite,
    openAddModal,
    openEditModal,
    openDeleteModal,
    closeAddModal,
    closeEditModal,
    closeDeleteModal,
  };
}
