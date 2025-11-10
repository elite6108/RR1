import { useState, useEffect } from 'react';
import { supabase } from '../../../../lib/supabase';
import type { Project, PurchaseOrder, Quote, Site } from '../types';

export function useProjectData() {
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projectOrders, setProjectOrders] = useState<PurchaseOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'quotes' | 'orders' | 'gantt' | 'sites' | 'rams' | 'cpp' | 'contracts' | 'site_survey' | 'files' | 'additional_work' | 'signoff' | 'todo'>('files');
  const [projectQuotes, setProjectQuotes] = useState<Quote[]>([]);
  const [loadingQuotes, setLoadingQuotes] = useState(false);
  const [projectSites, setProjectSites] = useState<Site[]>([]);
  const [loadingSites, setLoadingSites] = useState(false);
  const [projectRams, setProjectRams] = useState<any[]>([]);
  const [loadingRams, setLoadingRams] = useState(false);
  const [projectCpp, setProjectCpp] = useState<any[]>([]);
  const [loadingCpp, setLoadingCpp] = useState(false);
  const [projectContracts, setProjectContracts] = useState<any[]>([]);
  const [loadingContracts, setLoadingContracts] = useState(false);
  const [projectSiteSurveys, setProjectSiteSurveys] = useState<any[]>([]);
  const [loadingSiteSurveys, setLoadingSiteSurveys] = useState(false);
  const [projectFiles, setProjectFiles] = useState<any[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [projectAdditionalWorks, setProjectAdditionalWorks] = useState<any[]>([]);
  const [loadingAdditionalWorks, setLoadingAdditionalWorks] = useState(false);

  // Prevent body scroll when modal is open
  useEffect(() => {
    const isModalOpen = showProjectModal || showDeleteModal;
    
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to restore scroll when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showProjectModal, showDeleteModal]);

  const handleDeleteProject = async (projectId: string) => {
    setProjectToDelete(projectId);
    setShowDeleteModal(true);
  };

  const handleEditProject = (project: Project) => {
    setProjectToEdit(project);
    setShowProjectModal(true);
  };

  const confirmDelete = async () => {
    if (!projectToDelete) return;

    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectToDelete);

      if (error) throw error;
      setShowDeleteModal(false);
      setProjectToDelete(null);
      return true; // Indicate successful deletion
    } catch (err) {
      console.error('Error deleting project:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'An error occurred while deleting the project'
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch sites for a specific project
  const fetchSites = async (projectId: string) => {
    try {
      setLoadingSites(true);
      const { data: sitesData, error: sitesError } = await supabase
        .from('sites')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (sitesError) throw sitesError;
      setProjectSites(sitesData || []);
    } catch (err) {
      console.error('Error fetching sites:', err);
    } finally {
      setLoadingSites(false);
    }
  };

  // Function to fetch RAMS for a specific project
  const fetchRams = async (projectId: string) => {
    try {
      setLoadingRams(true);
      const { data: ramsData, error: ramsError } = await supabase
        .from('rams')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (ramsError) throw ramsError;
      setProjectRams(ramsData || []);
    } catch (err) {
      console.error('Error fetching RAMS:', err);
    } finally {
      setLoadingRams(false);
    }
  };

  // Function to fetch CPP for a specific project
  const fetchCpp = async (projectId: string) => {
    try {
      setLoadingCpp(true);
      console.log('=== FETCHING CPPs for Project ID ===', projectId);
      
      // Just fetch all CPPs without filtering
      const { data: cppData, error: cppError } = await supabase
        .from('cpps')
        .select('*')
        .order('created_at', { ascending: false });

      if (cppError) {
        console.error('Supabase CPP fetch error:', cppError);
        throw cppError;
      }
      
      console.log('=== ALL CPPs FETCHED ===', cppData);
      
      // Debug: Log data structure of all CPPs
      if (cppData && cppData.length > 0) {
        cppData.forEach((cpp, index) => {
          console.log(`=== CPP #${index + 1} ===`);
          console.log('ID:', cpp.id);
          console.log('front_cover:', cpp.front_cover);
          
          // Try to find any potential project ID
          let frontCover = cpp.front_cover;
          if (typeof frontCover === 'string') {
            try {
              frontCover = JSON.parse(frontCover);
              console.log('Parsed front_cover:', frontCover);
            } catch (e) {
              console.log('Failed to parse front_cover as JSON');
            }
          }
          
          // List all properties that might contain project ID
          console.log('Potential project ID matches:');
          console.log('- cpp.project_id:', cpp.project_id);
          console.log('- frontCover?.projectId:', frontCover?.projectId);
          console.log('- frontCover?.project_id:', frontCover?.project_id);
          
          // Check for partial string matches
          if (typeof frontCover?.projectId === 'string') {
            console.log(`projectId string match: ${frontCover.projectId.includes(projectId)}`);
          }
        });
      } else {
        console.log('No CPPs found in the database');
      }
      
      // TEMP: Send all CPPs to component regardless of project match
      // This will help us see if there are any CPPs at all
      setProjectCpp(cppData || []);
      
      // Comment out the filtering for now
      /*
      // Filter CPPs here instead of in the database query
      const filteredCppData = cppData ? cppData.filter(cpp => {
        // Handle different ways the project ID might be stored
        let frontCover = cpp.front_cover;
        
        // Parse front_cover if it's a string
        if (typeof frontCover === 'string') {
          try {
            frontCover = JSON.parse(frontCover);
          } catch (e) {
            console.log('Failed to parse front_cover string:', e);
            return false;
          }
        }
        
        // Check if this CPP belongs to the current project
        return frontCover?.projectId === projectId;
      }) : [];
      
      setProjectCpp(filteredCppData);
      */
    } catch (err) {
      console.error('Error fetching CPP:', err);
    } finally {
      setLoadingCpp(false);
    }
  };

  // Function to fetch Contracts for a specific project
  const fetchContracts = async (projectId: string) => {
    try {
      setLoadingContracts(true);
      const { data: contractsData, error: contractsError } = await supabase
        .from('contracts')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (contractsError) throw contractsError;
      setProjectContracts(contractsData || []);
    } catch (err) {
      console.error('Error fetching contracts:', err);
    } finally {
      setLoadingContracts(false);
    }
  };

  // Function to fetch Site Surveys for a specific project
  const fetchSiteSurveys = async (projectId: string) => {
    try {
      setLoadingSiteSurveys(true);
      const { data: siteSurveysData, error: siteSurveysError } = await supabase
        .from('site_survey')
        .select(`
          *,
          projects:project_id(name),
          customers:customer_id(customer_name, company_name)
        `)
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (siteSurveysError) throw siteSurveysError;
      
      // Transform the data to include customer and project names
      const enhancedSurveys = siteSurveysData?.map(survey => ({
        ...survey,
        project_name: survey.projects?.name || 'Unknown Project',
        customer_name: survey.customers ? 
          (survey.customers.company_name || survey.customers.customer_name || 'Unknown Customer') 
          : 'Unknown Customer'
      })) || [];
      
      setProjectSiteSurveys(enhancedSurveys);
    } catch (err) {
      console.error('Error fetching site surveys:', err);
    } finally {
      setLoadingSiteSurveys(false);
    }
  };

  // Function to fetch Files for a specific project
  const fetchFiles = async (projectId: string) => {
    try {
      setLoadingFiles(true);
      // Placeholder for files fetching logic
      // You can implement this based on your file storage structure
      setProjectFiles([]);
    } catch (err) {
      console.error('Error fetching files:', err);
    } finally {
      setLoadingFiles(false);
    }
  };

  const fetchAdditionalWorks = async (projectId: string) => {
    try {
      setLoadingAdditionalWorks(true);
      const { data, error } = await supabase
        .from('additional_work')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjectAdditionalWorks(data || []);
    } catch (err) {
      console.error('Error fetching additional works:', err);
    } finally {
      setLoadingAdditionalWorks(false);
    }
  };

  const handleProjectClick = async (project: Project) => {
    setSelectedProject(project);
    setLoadingOrders(true);
    setLoadingQuotes(true);
    setLoadingSites(true);
    setLoadingRams(true);
    setLoadingCpp(true);
    setLoadingContracts(true);
    setLoadingSiteSurveys(true);
    setLoadingFiles(true);
    setError(null);

    try {
      // Fetch purchase orders
      const { data: ordersData, error: ordersError } = await supabase
        .from('purchase_orders')
        .select(
          `
          *,
          project:projects(name),
          supplier:suppliers(name)
        `
        )
        .eq('project_id', project.id)
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;
      setProjectOrders(ordersData || []);

      // Fetch quotes
      const { data: quotesData, error: quotesError } = await supabase
        .from('quotes')
        .select(
          `
          *,
          project:projects(name),
          customer:customers(id, customer_name, company_name)
        `
        )
        .eq('project_id', project.id)
        .order('created_at', { ascending: false });

      if (quotesError) throw quotesError;
      setProjectQuotes(quotesData || []);

      // Fetch sites
      await fetchSites(project.id);

      // Fetch RAMS
      await fetchRams(project.id);

      // Fetch CPP
      await fetchCpp(project.id);

      // Fetch Contracts
      await fetchContracts(project.id);
      
      // Fetch Site Surveys
      await fetchSiteSurveys(project.id);
      
      // Fetch Files
      await fetchFiles(project.id);

      // Fetch Additional Works
      await fetchAdditionalWorks(project.id);
    } catch (err) {
      console.error('Error fetching project data:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'An error occurred while fetching project data'
      );
    } finally {
      setLoadingOrders(false);
      setLoadingQuotes(false);
      setLoadingSites(false);
      setLoadingRams(false);
      setLoadingCpp(false);
      setLoadingContracts(false);
      setLoadingSiteSurveys(false);
      setLoadingFiles(false);
      setLoadingAdditionalWorks(false);
    }
  };

  return {
    // State
    showProjectModal,
    setShowProjectModal,
    showDeleteModal,
    setShowDeleteModal,
    projectToDelete,
    setProjectToDelete,
    projectToEdit,
    setProjectToEdit,
    loading,
    setLoading,
    error,
    setError,
    selectedProject,
    setSelectedProject,
    projectOrders,
    setProjectOrders,
    loadingOrders,
    setLoadingOrders,
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    projectQuotes,
    setProjectQuotes,
    loadingQuotes,
    setLoadingQuotes,
    projectSites,
    setProjectSites,
    loadingSites,
    setLoadingSites,
    projectRams,
    setProjectRams,
    loadingRams,
    setLoadingRams,
    projectCpp,
    setProjectCpp,
    loadingCpp,
    setLoadingCpp,
    projectContracts,
    setProjectContracts,
    loadingContracts,
    setLoadingContracts,
    projectSiteSurveys,
    setProjectSiteSurveys,
    loadingSiteSurveys,
    setLoadingSiteSurveys,
    projectFiles,
    setProjectFiles,
    loadingFiles,
    setLoadingFiles,
    projectAdditionalWorks,
    setProjectAdditionalWorks,
    loadingAdditionalWorks,
    setLoadingAdditionalWorks,
    
    // Functions
    handleDeleteProject,
    handleEditProject,
    confirmDelete,
    fetchSites,
    fetchRams,
    fetchCpp,
    fetchContracts,
    fetchSiteSurveys,
    fetchFiles,
    fetchAdditionalWorks,
    handleProjectClick,
  };
}
