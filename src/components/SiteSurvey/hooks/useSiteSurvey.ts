import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import type { SiteSurvey, Customer, Project } from '../types';
import { formatDate } from '../utils/constants';

export function useSiteSurvey() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [surveyToDelete, setSurveyToDelete] = useState<SiteSurvey | null>(null);
  const [siteSurveys, setSiteSurveys] = useState<SiteSurvey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [customers, setCustomers] = useState<Record<string, Customer>>({});
  const [projects, setProjects] = useState<Record<string, Project>>({});
  const [selectedSurvey, setSelectedSurvey] = useState<SiteSurvey | null>(null);
  const [generatingPdfId, setGeneratingPdfId] = useState<string | null>(null);

  useEffect(() => {
    fetchSiteSurveys();
    fetchCustomers();
    fetchProjects();
  }, []);

  // Prevent body scroll when modal is open
  useEffect(() => {
    const isModalOpen = showForm || showViewModal || showDeleteModal;
    
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to restore scroll when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showForm, showViewModal, showDeleteModal]);

  const fetchCustomers = async () => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('id, company_name, customer_name')
        .order('customer_name');

      if (error) throw error;
      
      // Convert array to record/map for easy lookup
      const customerMap: Record<string, Customer> = {};
      data?.forEach((customer: Customer) => {
        customerMap[customer.id] = customer;
      });
      
      setCustomers(customerMap);
    } catch (err) {
      console.error('Error fetching customers:', err);
    }
  };

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('id, name, customer_id')
        .order('name');

      if (error) throw error;
      
      // Convert array to record/map for easy lookup
      const projectMap: Record<string, Project> = {};
      data?.forEach((project: Project) => {
        projectMap[project.id] = project;
      });
      
      setProjects(projectMap);
    } catch (err) {
      console.error('Error fetching projects:', err);
    }
  };

  const fetchSiteSurveys = async () => {
    try {
      setLoading(true);
      console.log('Fetching site surveys from Supabase...');
      
      // Only try site_survey table since site_surveys doesn't exist
      const { data, error } = await supabase
        .from('site_survey')
        .select('*');
      
      if (error) {
        console.error('Supabase error with site_survey table:', error);
        throw error;
      }
      
      console.log('Site surveys data received:', data);
      
      if (data) {
        // Process data to ensure each record has a survey_id
        const processedData = data.map((survey: SiteSurvey, index: number) => {
          // If survey_id exists, use it; otherwise format as SU-00001, SU-00002, etc.
          if (!survey.survey_id) {
            const paddedId = String(index + 1).padStart(5, '0');
            survey.survey_id = `SU-${paddedId}`;
          }
          return survey;
        });
        
        setSiteSurveys(processedData);
      } else {
        setSiteSurveys([]);
      }
    } catch (error) {
      console.error('Error fetching site surveys:', error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unknown error occurred');
      }
      
      // Don't use fallback data when there's an error
      setSiteSurveys([]);
    } finally {
      setLoading(false);
    }
  };

  // Get customer name from ID
  const getCustomerName = (customerId: string): string => {
    const customer = customers[customerId];
    if (!customer) return 'Unknown Customer';
    return customer.company_name || customer.customer_name || 'Unnamed Customer';
  };

  // Get project name from ID
  const getProjectName = (projectId: string): string => {
    const project = projects[projectId];
    if (!project) return 'Unknown Project';
    return project.name || 'Unnamed Project';
  };

  // Filter surveys based on search query
  const filteredSurveys = siteSurveys.filter((survey) => {
    const searchString = searchQuery.toLowerCase();
    const customerName = getCustomerName(survey.customer_id).toLowerCase();
    const projectName = getProjectName(survey.project_id).toLowerCase();
    
    return (
      (survey.survey_id && survey.survey_id.toLowerCase().includes(searchString)) ||
      customerName.includes(searchString) ||
      projectName.includes(searchString) ||
      (survey.created_at && survey.created_at.includes(searchString))
    );
  });

  const handleFormSuccess = () => {
    setShowForm(false);
    setSelectedSurvey(null);
    fetchSiteSurveys();
  };
  
  const openViewModal = (survey: SiteSurvey) => {
    setSelectedSurvey(survey);
    setShowViewModal(true);
    
    // Scroll to top on mobile when modal opens
    if (window.innerWidth < 640) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  const openEditModal = (survey: SiteSurvey) => {
    setSelectedSurvey(survey);
    setShowForm(true);
    
    // Scroll to top on mobile when modal opens
    if (window.innerWidth < 640) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  const openDeleteModal = (survey: SiteSurvey) => {
    setSurveyToDelete(survey);
    setShowDeleteModal(true);
    
    // Scroll to top on mobile when modal opens
    if (window.innerWidth < 640) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  const handleDeleteSurvey = async () => {
    if (!surveyToDelete) return;

    try {
      const { error } = await supabase
        .from('site_survey')
        .delete()
        .eq('id', surveyToDelete.id);
        
      if (error) throw error;
      
      setShowDeleteModal(false);
      setSurveyToDelete(null);
      // Refresh the list
      fetchSiteSurveys();
    } catch (err) {
      console.error('Error deleting survey:', err);
      setError('Failed to delete the survey');
    }
  };

  const handleAddSurvey = () => {
    setSelectedSurvey(null);
    setShowForm(true);
    
    // Scroll to top on mobile when modal opens
    if (window.innerWidth < 640) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const closeViewModal = () => {
    setShowViewModal(false);
    setSelectedSurvey(null);
  };

  const closeForm = () => {
    setShowForm(false);
    setSelectedSurvey(null);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setSurveyToDelete(null);
  };

  return {
    // State
    searchQuery,
    showForm,
    showViewModal,
    showDeleteModal,
    surveyToDelete,
    siteSurveys,
    loading,
    error,
    selectedSurvey,
    generatingPdfId,
    filteredSurveys,

    // Actions
    setSearchQuery,
    setGeneratingPdfId,
    setError,
    fetchSiteSurveys,
    getCustomerName,
    getProjectName,
    formatDate,
    handleFormSuccess,
    openViewModal,
    openEditModal,
    openDeleteModal,
    handleDeleteSurvey,
    handleAddSurvey,
    closeViewModal,
    closeForm,
    cancelDelete
  };
}