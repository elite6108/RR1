import { useState, useEffect } from 'react';
import { supabase } from '../../../../../lib/supabase';
import { SiteSurvey, Project } from '../types';

interface UseSiteSurveyActionsProps {
  project: Project;
  onSiteSurveysChange?: () => void;
}

export const useSiteSurveyActions = ({ project, onSiteSurveysChange }: UseSiteSurveyActionsProps) => {
  const [siteSurveysList, setSiteSurveysList] = useState<SiteSurvey[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showSiteSurveyForm, setShowSiteSurveyForm] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedSiteSurvey, setSelectedSiteSurvey] = useState<SiteSurvey | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [siteSurveyToDelete, setSiteSurveyToDelete] = useState<SiteSurvey | null>(null);

  // Prevent body scroll when modal is open
  useEffect(() => {
    const isModalOpen = showSiteSurveyForm || showViewModal || showDeleteModal;
    
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
  }, [showSiteSurveyForm, showViewModal, showDeleteModal]);

  useEffect(() => {
    if (project && project.id) {
      fetchSiteSurveys();
    }
  }, [project]);

  const fetchSiteSurveys = async () => {
    try {
      const { data, error } = await supabase
        .from('site_survey')
        .select(`
          *,
          projects:project_id(name),
          customers:customer_id(customer_name, company_name)
        `)
        .eq('project_id', project.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      // Transform the data to include project and customer names
      const enhancedSurveys = data?.map(survey => ({
        ...survey,
        project_name: survey.projects?.name || 'Unknown Project',
        customer_name: survey.customers ? 
          (survey.customers.company_name || survey.customers.customer_name || 'Unknown Customer') 
          : 'Unknown Customer'
      })) || [];

      console.log('Fetched site surveys:', enhancedSurveys);
      setSiteSurveysList(enhancedSurveys);
      
      if (onSiteSurveysChange) {
        onSiteSurveysChange();
      }
    } catch (error) {
      console.error('Error fetching site surveys:', error);
      setError('Failed to fetch site surveys');
    }
  };

  const handleEdit = (survey: SiteSurvey) => {
    setSelectedSiteSurvey(survey);
    setShowSiteSurveyForm(true);
  };

  const handleView = (survey: SiteSurvey) => {
    setSelectedSiteSurvey(survey);
    setShowViewModal(true);
  };

  const handleDelete = (survey: SiteSurvey) => {
    setSiteSurveyToDelete(survey);
    setShowDeleteModal(true);
  };

  const handleAddNew = () => {
    // Create a new survey with the project ID pre-filled
    setSelectedSiteSurvey({
      id: '',
      created_at: new Date().toISOString(),
      project_id: project.id,
      customer_id: project.customer_id || '',
      project_name: project.name
    });
    setShowSiteSurveyForm(true);
  };

  const confirmDelete = async () => {
    if (!siteSurveyToDelete) return;

    try {
      const { error } = await supabase
        .from('site_survey')
        .delete()
        .eq('id', siteSurveyToDelete.id);

      if (error) throw error;

      setSiteSurveysList(prevSurveys => 
        prevSurveys.filter(survey => survey.id !== siteSurveyToDelete.id)
      );
      
      setShowDeleteModal(false);
      setSiteSurveyToDelete(null);

    } catch (err) {
      console.error('Error deleting site survey:', err);
      setError('Failed to delete site survey');
    }
  };

  const handleFormClose = () => {
    setShowSiteSurveyForm(false);
    setSelectedSiteSurvey(null);
  };

  const handleFormSuccess = () => {
    setShowSiteSurveyForm(false);
    setSelectedSiteSurvey(null);
    fetchSiteSurveys();
    if (onSiteSurveysChange) {
      onSiteSurveysChange();
    }
  };

  const handleViewClose = () => {
    setShowViewModal(false);
    setSelectedSiteSurvey(null);
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setSiteSurveyToDelete(null);
  };

  return {
    // State
    siteSurveysList,
    error,
    showSiteSurveyForm,
    showViewModal,
    selectedSiteSurvey,
    showDeleteModal,
    siteSurveyToDelete,
    
    // Actions
    handleEdit,
    handleView,
    handleDelete,
    handleAddNew,
    confirmDelete,
    handleFormClose,
    handleFormSuccess,
    handleViewClose,
    handleDeleteCancel,
    fetchSiteSurveys,
    setError
  };
};
