import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import type { FormData, Customer, Project, SiteSurvey, FileUploadField } from '../types';
import { STORAGE_CONFIG, generateUniqueFileName, getFilePathFromUrl } from '../utils/constants';

interface UseSiteSurveyFormProps {
  onClose: () => void;
  onSuccess: () => void;
  surveyToEdit?: SiteSurvey | null;
  isProjectContext?: boolean;
}

export function useSiteSurveyForm({ onClose, onSuccess, surveyToEdit, isProjectContext = false }: UseSiteSurveyFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [showW3WModal, setShowW3WModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Form state
  const [formData, setFormData] = useState<FormData>({
    // Step 1: Details
    customer_id: '',
    project_id: '',
    location_what3words: '',
    full_address: '',
    site_contact: '',

    // Step 2: Site Access
    site_access_description: '',
    suitable_for_lorry: false,
    site_access_images: [],
    site_access_videos: [],

    // Step 3: Land
    water_handling: '',
    manholes_description: '',
    services_present: false,
    services_description: '',
    services_images: [],

    // Step 4: Work Required
    number_of_courts: 1,
    shuttering_required: false,
    tarmac_required: false,
    tarmac_location: '',
    tarmac_wagon_space: false,
    muckaway_required: false,
    surface_type: '',
    lighting_required: false,
    lighting_description: '',
    canopies_required: false,
    number_of_canopies: 0,

    // Step 5: Court Features
    court_dimensions: '',
    court_height: 0,
    court_enclosure_type: 'option1',
    court_floor_material: '',
    court_features: [],

    // Step 6: Drawings & Plans
    drawings_images: [],
    drawings_videos: [],
    notes_comments: '',
  });

  useEffect(() => {
    fetchCustomers();
    getCurrentUser();
    if (surveyToEdit) {
      processExistingSurvey();
    }
  }, [surveyToEdit]);
  
  // Add a separate effect to handle isProjectContext
  useEffect(() => {
    if (isProjectContext && formData.customer_id) {
      fetchProjects(formData.customer_id);
    }
  }, [isProjectContext, formData.customer_id]);

  // Helper function to regenerate signed URLs for all images in an array
  const regenerateSignedUrls = async (urls: string[], prefix: string) => {
    if (!urls || !Array.isArray(urls) || urls.length === 0) return [];
    
    const newUrls: string[] = [];
    
    for (const url of urls) {
      try {
        // Skip if not a string
        if (typeof url !== 'string') {
          console.warn('Non-string URL found in array:', url);
          continue;
        }
        
        const filePath = getFilePathFromUrl(url);
        if (filePath) {
          // Create a new signed URL
          const { data, error } = await supabase.storage
            .from(STORAGE_CONFIG.BUCKET_NAME)
            .createSignedUrl(filePath, STORAGE_CONFIG.SIGNED_URL_EXPIRY);
            
          if (!error && data?.signedUrl) {
            newUrls.push(data.signedUrl);
            continue;
          }
        }
        
        // If we can't extract the path or regenerate the URL, just keep the original
        newUrls.push(url);
      } catch (err) {
        console.error(`Error processing URL ${url}:`, err);
        newUrls.push(url);
      }
    }
    
    return newUrls;
  };
  
  // Process existing survey data
  const processExistingSurvey = async () => {
    if (!surveyToEdit) return;
    
    try {
      // Regenerate signed URLs for all images/videos
      const site_access_images = await regenerateSignedUrls(surveyToEdit.site_access_images || [], 'site_access_images');
      const site_access_videos = await regenerateSignedUrls(surveyToEdit.site_access_videos || [], 'site_access_videos');
      const services_images = await regenerateSignedUrls(surveyToEdit.services_images || [], 'services_images');
      const drawings_images = await regenerateSignedUrls(surveyToEdit.drawings_images || [], 'drawings_images');
      const drawings_videos = await regenerateSignedUrls(surveyToEdit.drawings_videos || [], 'drawings_videos');
      
      // Update the form with the regenerated URLs
      setFormData({
        customer_id: surveyToEdit.customer_id || '',
        project_id: surveyToEdit.project_id || '',
        location_what3words: surveyToEdit.location_what3words || '',
        full_address: surveyToEdit.full_address || '',
        site_contact: surveyToEdit.site_contact || '',
        site_access_description: surveyToEdit.site_access_description || '',
        suitable_for_lorry: surveyToEdit.suitable_for_lorry || false,
        site_access_images,
        site_access_videos,
        water_handling: surveyToEdit.water_handling || '',
        manholes_description: surveyToEdit.manholes_description || '',
        services_present: surveyToEdit.services_present || false,
        services_description: surveyToEdit.services_description || '',
        services_images,
        number_of_courts: surveyToEdit.number_of_courts || 1,
        shuttering_required: surveyToEdit.shuttering_required || false,
        tarmac_required: surveyToEdit.tarmac_required || false,
        tarmac_location: surveyToEdit.tarmac_location || '',
        tarmac_wagon_space: surveyToEdit.tarmac_wagon_space || false,
        muckaway_required: surveyToEdit.muckaway_required || false,
        surface_type: surveyToEdit.surface_type || '',
        lighting_required: surveyToEdit.lighting_required || false,
        lighting_description: surveyToEdit.lighting_description || '',
        canopies_required: surveyToEdit.canopies_required || false,
        number_of_canopies: surveyToEdit.number_of_canopies || 0,
        court_dimensions: surveyToEdit.court_dimensions || '',
        court_height: surveyToEdit.court_height || 0,
        court_enclosure_type: surveyToEdit.court_enclosure_type || 'option1',
        court_floor_material: surveyToEdit.court_floor_material || '',
        court_features: surveyToEdit.court_features || [],
        drawings_images,
        drawings_videos,
        notes_comments: surveyToEdit.notes_comments || '',
      });
      
      if (surveyToEdit.customer_id) {
        fetchProjects(surveyToEdit.customer_id);
      }
    } catch (err) {
      console.error('Error processing existing survey:', err);
      setError('Failed to load the survey data. Please try again.');
    }
  };

  const fetchCustomers = async () => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('id, company_name, customer_name')
        .order('customer_name');

      if (error) throw error;
      setCustomers(data || []);
    } catch (err) {
      console.error('Error fetching customers:', err);
      setError('Failed to load customers');
    }
  };

  const getCurrentUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
    } catch (err) {
      console.error('Error fetching current user:', err);
    }
  };

  const fetchProjects = async (customerId: string) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('id, name, customer_id')
        .eq('customer_id', customerId)
        .order('name');

      if (error) throw error;
      setProjects(data || []);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Failed to load projects');
    }
  };

  const handleCustomerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const customerId = e.target.value;
    setFormData(prev => ({
      ...prev,
      customer_id: customerId,
      // Only reset project_id if not in project context
      project_id: isProjectContext ? prev.project_id : ''
    }));
    if (customerId) {
      fetchProjects(customerId);
    } else {
      setProjects([]);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const handleBooleanChange = (name: string, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMultiSelectChange = (name: string, value: string) => {
    setFormData(prev => {
      const currentValue = prev[name as keyof FormData];
      
      // Only proceed if the current value is an array
      if (Array.isArray(currentValue)) {
        return {
          ...prev,
          [name]: currentValue.includes(value)
            ? currentValue.filter(v => v !== value)
            : [...currentValue, value]
        };
      }
      
      // If it's not an array, just return the previous state
      return prev;
    });
  };

  // Add file upload handler functions
  const handleFileUpload = async (files: FileList, fieldName: FileUploadField) => {
    if (!files || files.length === 0) return;
    
    try {
      setUploadingFiles(true);
      setError(null);
      
      const uploadedUrls: string[] = [];
      
      // Create an array from FileList for easier handling
      const fileArray = Array.from(files);
      
      for (const file of fileArray) {
        // Create a unique file name to avoid collisions
        const fileName = generateUniqueFileName(file.name);
        const filePath = `${fieldName}/${fileName}`;
        
        // Upload the file to Supabase Storage
        const { data, error } = await supabase.storage
          .from(STORAGE_CONFIG.BUCKET_NAME)
          .upload(filePath, file);
          
        if (error) throw error;
        
        // For private buckets, we need to use createSignedUrl instead of getPublicUrl
        const { data: signedUrlData, error: signedUrlError } = await supabase.storage
          .from(STORAGE_CONFIG.BUCKET_NAME)
          .createSignedUrl(filePath, STORAGE_CONFIG.SIGNED_URL_EXPIRY);
        
        if (signedUrlError) {
          console.error('Error creating signed URL:', signedUrlError);
          throw signedUrlError;
        }
        
        // Add the signed URL to our array if it exists
        if (signedUrlData?.signedUrl) {
          console.log('Successfully uploaded file with signed URL:', signedUrlData.signedUrl);
          uploadedUrls.push(signedUrlData.signedUrl);
        }
      }
      
      // Update the form data with the new URLs
      setFormData(prev => ({
        ...prev,
        [fieldName]: [...prev[fieldName] as string[], ...uploadedUrls]
      }));
      
    } catch (err) {
      console.error(`Error uploading ${fieldName}:`, err);
      setError(`Failed to upload files. Please try again.`);
    } finally {
      setUploadingFiles(false);
    }
  };

  const removeFile = (fieldName: FileUploadField, index: number) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: (prev[fieldName] as string[]).filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      // Basic validation
      if (!formData.customer_id) {
        setError('Please select a customer');
        return;
      }
      
      if (!formData.project_id) {
        setError('Please select a project');
        return;
      }
      
      // Check if user is authenticated
      if (!currentUser) {
        setError('You must be logged in to save a site survey');
        return;
      }
      
      // Regenerate signed URLs for all image/video arrays
      const site_access_images = await regenerateSignedUrls(formData.site_access_images, 'site_access_images');
      const site_access_videos = await regenerateSignedUrls(formData.site_access_videos, 'site_access_videos');
      const services_images = await regenerateSignedUrls(formData.services_images, 'services_images');
      const drawings_images = await regenerateSignedUrls(formData.drawings_images, 'drawings_images');
      const drawings_videos = await regenerateSignedUrls(formData.drawings_videos, 'drawings_videos');
      
      // Prepare the data for submission with regenerated URLs
      // Remove location_coordinates as it doesn't exist in the database schema
      const { location_coordinates, ...formDataWithoutCoords } = formData;
      const surveyData = {
        ...formDataWithoutCoords,
        site_access_images,
        site_access_videos,
        services_images,
        drawings_images,
        drawings_videos,
        created_by: currentUser.id,
        created_at: surveyToEdit ? undefined : new Date().toISOString(),
      };
      
      // Save the survey data
      const { data, error: insertError } = await supabase
        .from('site_survey')
        .upsert(
          {
            id: surveyToEdit?.id,
            ...surveyData,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'id' }
        );
      
      if (insertError) throw insertError;
      
      // Call the success callback
      onSuccess();
      
    } catch (err) {
      console.error('Error saving site survey:', err);
      setError('Failed to save the site survey. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return {
    // State
    currentStep,
    loading,
    error,
    customers,
    projects,
    uploadingFiles,
    showW3WModal,
    currentUser,
    formData,

    // Actions
    setCurrentStep,
    setError,
    setShowW3WModal,
    setFormData,
    handleCustomerChange,
    handleInputChange,
    handleBooleanChange,
    handleMultiSelectChange,
    handleFileUpload,
    removeFile,
    handleSubmit
  };
}