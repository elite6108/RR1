import { useState, useEffect } from 'react';
import { supabase } from '../../../../lib/supabase';

interface Attendee {
  id: string;
  name: string;
  signature: string | null;
}

interface PDFFile {
  id: string;
  name: string;
  displayName: string;
  url: string;
  signed_url?: string;
}

interface FormData {
  title: string;
  siteReference: string;
  projectId: string;
  presenter: string;
  selectedPDF: string;
  attendees: Attendee[];
}

interface UseToolboxTalkFormProps {
  talk: {
    id: string;
    title: string;
  };
  onClose: () => void;
  onNavigateToCompletedTalks: () => void;
}

export function useToolboxTalkForm({ talk, onClose, onNavigateToCompletedTalks }: UseToolboxTalkFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [sites, setSites] = useState<any[]>([]);
  const [allSites, setAllSites] = useState<any[]>([]);
  const [pdfFiles, setPdfFiles] = useState<PDFFile[]>([]);
  const [allPDFs, setAllPDFs] = useState<PDFFile[]>([]);
  const [selectedNewPDF, setSelectedNewPDF] = useState('');
  const [formData, setFormData] = useState<FormData>({
    title: talk.title,
    siteReference: '',
    projectId: '',
    presenter: '',
    selectedPDF: '',
    attendees: []
  });

  useEffect(() => {
    fetchProjects();
    fetchPDFFiles();
    fetchAllSites();
    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (formData.projectId) {
      const projectSites = allSites.filter(site => site.project_id === formData.projectId);
      setSites(projectSites);
      
      if (formData.siteReference) {
        const isValidSite = projectSites.some(site => site.name === formData.siteReference);
        if (!isValidSite) {
          setFormData(prev => ({ ...prev, siteReference: '' }));
        }
      }
    } else {
      setSites([]);
      setFormData(prev => ({ ...prev, siteReference: '' }));
    }
  }, [formData.projectId, allSites]);

  const generateSignedUrl = async (fileName: string) => {
    try {
      const { data } = await supabase.storage
        .from('toolbox-talks')
        .createSignedUrl(fileName, 60 * 60); // 1 hour expiry
      
      return data?.signedUrl || '';
    } catch (error) {
      console.error('Error generating signed URL:', error);
      return '';
    }
  };

  const fetchAllSites = async () => {
    try {
      const { data, error } = await supabase
        .from('sites')
        .select('id, name, project_id')
        .order('name', { ascending: true });

      if (error) throw error;
      setAllSites(data || []);
    } catch (err) {
      console.error('Error fetching sites:', err);
      setError('Failed to load sites. Please try again later.');
    }
  };

  const fetchPDFFiles = async () => {
    try {
      // Get PDFs associated with this talk ID
      const { data: pdfData, error: pdfError } = await supabase
        .from('toolbox_talk_pdfs')
        .select('*')
        .eq('talk_id', talk.id);

      if (pdfError) throw pdfError;

      if (pdfData && pdfData.length > 0) {
        const pdfFiles = await Promise.all(
          pdfData.map(async (pdf: any) => {
            const signedUrl = await generateSignedUrl(pdf.file_name);
            return {
              id: pdf.file_name,
              name: pdf.file_name,
              displayName: pdf.display_name,
              url: signedUrl,
              signed_url: signedUrl
            };
          })
        );

        setPdfFiles(pdfFiles);
        
        // Auto-select the PDF if one exists
        if (pdfFiles.length > 0) {
          setFormData(prev => ({
            ...prev,
            selectedPDF: pdfFiles[0].name
          }));
        }
        return;
      }

      // If no PDF found, set empty state
      setPdfFiles([]);
      setFormData(prev => ({
        ...prev,
        selectedPDF: ''
      }));
    } catch (err) {
      console.error('Error fetching PDF files:', err);
      setError('Failed to load PDF files. Please try again later.');
    }
  };

  const refreshSignedUrls = async () => {
    const updatedFiles = await Promise.all(
      pdfFiles.map(async (file) => {
        const signedUrl = await generateSignedUrl(file.name);
        return {
          ...file,
          url: signedUrl,
          signed_url: signedUrl,
        };
      })
    );
    setPdfFiles(updatedFiles);
  };

  // Refresh signed URLs every 45 minutes
  useEffect(() => {
    const interval = setInterval(refreshSignedUrls, 45 * 60 * 1000);
    return () => clearInterval(interval);
  }, [pdfFiles]);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      setProjects(data || []);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Failed to load projects. Please try again later.');
    }
  };

  const fetchUserProfile = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      if (user?.user_metadata?.display_name) {
        setFormData(prev => ({
          ...prev,
          presenter: user.user_metadata.display_name
        }));
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setError('Failed to load user profile. Please enter your name manually.');
    }
  };

  const fetchAllPDFs = async () => {
    try {
      const { data: pdfData, error: pdfError } = await supabase
        .from('toolbox_talk_pdfs')
        .select('*')
        .order('display_name', { ascending: true });

      if (pdfError) throw pdfError;

      if (pdfData) {
        const pdfFiles = await Promise.all(
          pdfData.map(async (pdf) => {
            const signedUrl = await generateSignedUrl(pdf.file_name);
            return {
              id: pdf.file_name,
              name: pdf.file_name,
              displayName: pdf.display_name,
              url: signedUrl,
              signed_url: signedUrl
            };
          })
        );
        setAllPDFs(pdfFiles);
      }
    } catch (err) {
      console.error('Error fetching all PDFs:', err);
      setError('Failed to load PDFs. Please try again later.');
    }
  };

  const handlePDFUpdate = async () => {
    if (!selectedNewPDF) return;
    
    setLoading(true);
    try {
      // First, remove any existing association for this talk
      const { error: deleteError } = await supabase
        .from('toolbox_talk_pdfs')
        .update({ talk_id: null })
        .eq('talk_id', talk.id);

      if (deleteError) throw deleteError;

      // Then, update the new PDF with this talk's ID
      const { error: updateError } = await supabase
        .from('toolbox_talk_pdfs')
        .update({ talk_id: talk.id })
        .eq('file_name', selectedNewPDF);

      if (updateError) throw updateError;

      // Get the selected PDF details
      const selectedPDF = allPDFs.find(pdf => pdf.name === selectedNewPDF);
      if (!selectedPDF) throw new Error('Selected PDF not found');

      // Update both states
      setPdfFiles([selectedPDF]);
      setFormData(prev => ({
        ...prev,
        selectedPDF: selectedNewPDF
      }));

      setSelectedNewPDF('');
    } catch (err) {
      console.error('Error updating PDF:', err);
      setError('Failed to update PDF. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('You must be logged in to create a toolbox talk.');

      // Validate form
      if (!formData.projectId) {
        throw new Error('Please select a project.');
      }
      if (!formData.siteReference) {
        throw new Error('Please enter a site reference.');
      }
      if (!formData.presenter) {
        throw new Error('Please enter the presenter\'s name.');
      }
      if (formData.attendees.length === 0) {
        throw new Error('Please add at least one attendee.');
      }
      if (formData.attendees.some(a => !a.name)) {
        throw new Error('All attendees must have a name.');
      }
      if (formData.attendees.some(a => !a.signature)) {
        throw new Error('All attendees must sign the toolbox talk.');
      }

      const { error } = await supabase
        .from('toolbox_talks')
        .insert([{
          talk_number: talk.id,
          title: formData.title,
          site_reference: formData.siteReference,
          project_id: formData.projectId,
          presenter: formData.presenter,
          attendees: formData.attendees,
          completed_by: user.user_metadata?.display_name || 'Unknown',
          user_id: user.id,
          status: 'completed'
        }]);

      if (error) {
        if (error.code === '23505') {
          throw new Error('A toolbox talk with this number already exists.');
        }
        throw new Error(`Failed to save toolbox talk: ${error.message}`);
      }
      
      onClose();
      onNavigateToCompletedTalks();
    } catch (err) {
      console.error('Error saving toolbox talk:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred while saving the toolbox talk.');
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    setError,
    projects,
    sites,
    pdfFiles,
    allPDFs,
    selectedNewPDF,
    setSelectedNewPDF,
    formData,
    setFormData,
    handleSubmit,
    handlePDFUpdate,
    fetchAllPDFs
  };
}
