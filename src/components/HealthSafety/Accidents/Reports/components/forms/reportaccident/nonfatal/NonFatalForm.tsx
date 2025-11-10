'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '../../../../../../../../lib/supabase';
import BaseForm, { Step } from '../../BaseForm';
import { Calendar } from '../../../../../../../../utils/calendar/Calendar';
import { Upload } from 'lucide-react';

// Define the form data structure
interface FormData {
  // Form specific fields
  autoId: string;
  reportType: string;
  category: string;

  // Step 1 - Details
  incidentLocation: string;
  incidentDate: string;

  // Step 2 - Description
  incidentDescription: string;

  // Step 3 - Details of Injured Person
  injuredPersonName: string;
  injuredPersonAddress: string;
  injuredPersonPhone: string;
  injuredPersonPosition: string;
  timeLost: boolean;
  timeLostStartDate: string;
  timeLostEndDate: string;
  aeHospitalName: string;
  requiredPpe: string;
  wornPpe: string;

  // Step 4 - Location of Injury
  injuryLocations: string[];

  // Step 5 - Type of Injury
  injuryTypes: string[];

  // Step 6 - First Aid
  advisedMedical: boolean;
  drugAlcoholTest: boolean;
  firstAidDetails: string;

  // Step 7 - Health & Safety
  basicCause: string;

  // Step 8 - Root Causes
  rootCauseWorkEnvironment: string[];
  rootCauseHumanFactors: string[];
  rootCausePpe: string[];
  rootCauseManagement: string[];
  rootCausePlantEquipment: string[];

  // Step 9 - Actions
  actionsTaken: string;
  actions: { title: string; dueDate: string; description: string }[];
  file_urls: string[];
}

interface NonFatalFormProps {
  onClose?: () => void;
  initialData?: any;
  isEditing?: boolean;
}

export default function NonFatalForm({ onClose, initialData, isEditing = false }: NonFatalFormProps) {
  // Generate autoId on load with format NF-XXXXX (where X is a number) or use existing one
  const [autoId, setAutoId] = useState(() => {
    if (isEditing && initialData?.autoId) {
      return initialData.autoId;
    }
    return ''; // Start empty instead of default value
  });
  const [isLoadingId, setIsLoadingId] = useState(!isEditing);

  useEffect(() => {
    if (!isEditing) {
      const getNextId = async () => {
        setIsLoadingId(true);
        try {
        // Get the next sequential number from Supabase
        const { data, error } = await supabase
            .from('accidents_nonfatal')
            .select('auto_id')
            .order('auto_id', { ascending: false })
          .limit(1);

        if (error) {
          console.error('Error getting last report number:', error);
            const defaultId = 'NF-00001';
            setAutoId(defaultId);
            setFormData(prev => ({ ...prev, autoId: defaultId }));
          return;
        }

        if (data && data.length > 0) {
            const lastNumber = parseInt(data[0].auto_id.split('-')[1]);
          const nextNumber = (lastNumber + 1).toString().padStart(5, '0');
            const newId = `NF-${nextNumber}`;
            setAutoId(newId);
            setFormData(prev => ({ ...prev, autoId: newId }));
        } else {
            const defaultId = 'NF-00001';
            setAutoId(defaultId);
            setFormData(prev => ({ ...prev, autoId: defaultId }));
          }
        } catch (err) {
          console.error('Error in getNextId:', err);
          const defaultId = 'NF-00001';
          setAutoId(defaultId);
          setFormData(prev => ({ ...prev, autoId: defaultId }));
        } finally {
          setIsLoadingId(false);
        }
      };

      getNextId();
    }
  }, [isEditing]);

  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState(false);

  // For actions modal
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionDraft, setActionDraft] = useState({ title: '', dueDate: '', description: '' });

  // Initialize form state with default values or existing data
  const [formData, setFormData] = useState<FormData>(() => {
    if (isEditing && initialData) {
      return {
        autoId: initialData.autoId || autoId,
        reportType: initialData.reportType || 'Non Fatal',
        category: initialData.category || 'Report An Accident',
        incidentLocation: initialData.incidentLocation || '',
        incidentDate: initialData.incidentDate || '',
        incidentDescription: initialData.incidentDescription || '',
        injuredPersonName: initialData.injuredPersonName || '',
        injuredPersonAddress: initialData.injuredPersonAddress || '',
        injuredPersonPhone: initialData.injuredPersonPhone || '',
        injuredPersonPosition: initialData.injuredPersonPosition || '',
        timeLost: initialData.timeLost || false,
        timeLostStartDate: initialData.timeLostStartDate || '',
        timeLostEndDate: initialData.timeLostEndDate || '',
        aeHospitalName: initialData.aeHospitalName || '',
        requiredPpe: initialData.requiredPpe || '',
        wornPpe: initialData.wornPpe || '',
        injuryLocations: initialData.injuryLocations || [],
        injuryTypes: initialData.injuryTypes || [],
        advisedMedical: initialData.advisedMedical || false,
        drugAlcoholTest: initialData.drugAlcoholTest || false,
        firstAidDetails: initialData.firstAidDetails || '',
        basicCause: initialData.basicCause || '',
        rootCauseWorkEnvironment: initialData.rootCauseWorkEnvironment || [],
        rootCauseHumanFactors: initialData.rootCauseHumanFactors || [],
        rootCausePpe: initialData.rootCausePpe || [],
        rootCauseManagement: initialData.rootCauseManagement || [],
        rootCausePlantEquipment: initialData.rootCausePlantEquipment || [],
        actionsTaken: initialData.actionsTaken || '',
        actions: initialData.actions || [],
        file_urls: initialData.file_urls || initialData.fileUrls || [],
      };
    }
    
    return {
      autoId,
      reportType: 'Non Fatal',
      category: 'Report An Accident',
      incidentLocation: '',
      incidentDate: '',
      incidentDescription: '',
      injuredPersonName: '',
      injuredPersonAddress: '',
      injuredPersonPhone: '',
      injuredPersonPosition: '',
      timeLost: false,
      timeLostStartDate: '',
      timeLostEndDate: '',
      aeHospitalName: '',
      requiredPpe: '',
      wornPpe: '',
      injuryLocations: [],
      injuryTypes: [],
      advisedMedical: false,
      drugAlcoholTest: false,
      firstAidDetails: '',
      basicCause: '',
      rootCauseWorkEnvironment: [],
      rootCauseHumanFactors: [],
      rootCausePpe: [],
      rootCauseManagement: [],
      rootCausePlantEquipment: [],
      actionsTaken: '',
      actions: [],
      file_urls: [],
    };
  });

  // Load and refresh file URLs when editing
  useEffect(() => {
    if (isEditing && initialData) {
      console.log('UseEffect: Component mounted for editing, initialData:', initialData);
      if (initialData.file_urls || initialData.fileUrls) {
        // Get the file URLs, preferring file_urls over fileUrls
        const fileUrls = (initialData.file_urls || initialData.fileUrls || []).filter((url: any) => url && url.trim() !== '');
        console.log('UseEffect: Found file URLs:', fileUrls);
        
        if (fileUrls.length > 0) {
          console.log('UseEffect: Setting file URLs in form data');
          // Set the URLs immediately first
          setFormData(prev => {
            console.log('UseEffect: Updating form data with file URLs:', fileUrls);
            return { ...prev, file_urls: fileUrls };
          });
          
          // Then refresh the signed URLs
          const refreshUrls = async () => {
            console.log('UseEffect: Starting to refresh signed URLs...');
            try {
              const newUrls = await Promise.all(
                fileUrls.map(async (url: any) => {
                  const pathMatch = url.match(/\/object\/sign\/([^?]+)/);
                  if (pathMatch) {
                    let path = pathMatch[1];
                    console.log('UseEffect: Extracted path from URL:', path);
                    
                    // Remove the bucket name if it's at the beginning of the path
                    if (path.startsWith('accidents-nonfatal/')) {
                      path = path.replace('accidents-nonfatal/', '');
                      console.log('UseEffect: Cleaned path (removed bucket name):', path);
                    }
                    
                    console.log('UseEffect: Refreshing URL for path:', path);
                    const { data, error } = await supabase.storage
                      .from('accidents-nonfatal')
                      .createSignedUrl(path, 60 * 60 * 24 * 7);
                    
                    if (data?.signedUrl) {
                      console.log('UseEffect: Successfully refreshed URL');
                      return data.signedUrl;
                    } else {
                      console.error('UseEffect: Error refreshing URL:', error);
                    }
                  }
                  return url;
                })
              );
              
              console.log('UseEffect: All refreshed URLs:', newUrls);
              setFormData(prev => ({ ...prev, file_urls: newUrls }));
            } catch (error) {
              console.error('UseEffect: Error refreshing signed URLs:', error);
            }
          };
          
          // Small delay to ensure component is mounted
          setTimeout(refreshUrls, 100);
        } else {
          console.log('UseEffect: No valid file URLs found after filtering');
        }
      } else {
        console.log('UseEffect: No file URLs field found in initialData');
      }
    }
  }, [isEditing, initialData]);

  const handleFileUpload = async (files: FileList, fieldName: 'file_urls') => {
    if (!files || files.length === 0) return;
    
    try {
      setUploadingFiles(true);
      setError(null);
      
      const uploadedUrls: string[] = [];
      
      // Create an array from FileList for easier handling
      const fileArray = Array.from(files);
      
      for (const file of fileArray) {
        // Create a unique file name to avoid collisions
        const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
        const filePath = `${formData.autoId}/${fileName}`;
        
        // Upload the file to Supabase Storage
        const { data, error: uploadError } = await supabase.storage
          .from('accidents-nonfatal')
          .upload(filePath, file);
            
        if (uploadError) throw uploadError;
        
        // For private buckets, we need to use createSignedUrl instead of getPublicUrl
        const { data: signedUrlData, error: signedUrlError } = await supabase.storage
          .from('accidents-nonfatal')
          .createSignedUrl(filePath, 60 * 60 * 24 * 7); // 7 days expiry
        
        if (signedUrlData?.signedUrl) {
          uploadedUrls.push(signedUrlData.signedUrl);
        }
      }
      
      // Update the form data with the new URLs
      setFormData(prev => ({
          ...prev,
        [fieldName]: [...(prev[fieldName] || []), ...uploadedUrls]
      }));
      
    } catch (err) {
      console.error('Error uploading files:', err);
      setError('Failed to upload files. Please try again.');
    } finally {
      setUploadingFiles(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const uploadFiles = async () => {
    const uploadedUrls: string[] = [];
    
    for (const file of files) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${formData.autoId}/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('accidents-nonfatal')
        .upload(filePath, file);
        
      if (uploadError) {
        throw new Error(`Error uploading file: ${uploadError.message}`);
      }
      
      uploadedUrls.push(filePath);
    }
    
    return uploadedUrls;
  };

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, formSteps.length - 1));
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      // Ensure file_urls is a proper array
      const fileUrlsToSubmit = formData.file_urls;
      console.log('Submitting file URLs:', fileUrlsToSubmit); // Debug log
      
      const dataToSubmit = {
        auto_id: formData.autoId,
        report_type: formData.reportType,
        category: formData.category,
        incident_location: formData.incidentLocation,
        incident_date: formData.incidentDate || null,
        incident_description: formData.incidentDescription,
        injured_person_name: formData.injuredPersonName,
        injured_person_address: formData.injuredPersonAddress,
        injured_person_phone: formData.injuredPersonPhone,
        injured_person_position: formData.injuredPersonPosition,
        time_lost: formData.timeLost,
        time_lost_start_date: formData.timeLostStartDate || null,
        time_lost_end_date: formData.timeLostEndDate || null,
        ae_hospital_name: formData.aeHospitalName,
        required_ppe: formData.requiredPpe,
        worn_ppe: formData.wornPpe,
        injury_locations: formData.injuryLocations,
        injury_types: formData.injuryTypes,
        advised_medical: formData.advisedMedical,
        drug_alcohol_test: formData.drugAlcoholTest,
        first_aid_details: formData.firstAidDetails,
        basic_cause: formData.basicCause,
        root_cause_work_environment: formData.rootCauseWorkEnvironment,
        root_cause_human_factors: formData.rootCauseHumanFactors,
        root_cause_ppe: formData.rootCausePpe,
        root_cause_management: formData.rootCauseManagement,
        root_cause_plant_equipment: formData.rootCausePlantEquipment,
        actions_taken: formData.actionsTaken,
        actions: formData.actions,
        file_urls: fileUrlsToSubmit // Use the array directly without stringifying
      };

      console.log('Submitting data:', dataToSubmit); // Debug log

      if (isEditing && initialData?.id) {
        const { error: submitError } = await supabase
          .from('accidents_nonfatal')
          .update(dataToSubmit)
          .eq('id', initialData.id);

        if (submitError) throw submitError;
      } else {
        const { error: submitError } = await supabase
          .from('accidents_nonfatal')
          .insert([dataToSubmit]);

        if (submitError) throw submitError;
      }
      
      setIsSubmitting(false);
      setSubmitted(true);
      
      if (onClose) {
        setTimeout(() => {
          onClose();
        }, 1000);
      }
    } catch (err: any) {
      console.error('Submission error:', err); // Debug log
      setIsSubmitting(false);
      setError(err?.message || 'An unknown error occurred.');
      setSubmitted(false);
    }
  };

  // Define the form steps with IDs
  const formSteps: Step[] = [
    { id: 'details', title: 'Report Details' },
    { id: 'description', title: 'Description of Incident' },
    { id: 'injured-person', title: 'Details of Injured Person' },
    { id: 'injury-location', title: 'Location of Injury' },
    { id: 'injury-type', title: 'Type of Injury' },
    { id: 'first-aid', title: 'First Aid' },
    { id: 'health-safety', title: 'Health & Safety' },
    { id: 'root-causes', title: 'Root Causes' },
    { id: 'actions', title: 'Actions' },
    { id: 'documentation', title: 'Documentation' },
  ];

  // Content for each step
  const stepContent = [
    // Step 1: Details
    <div key="details" className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">ID</label>
        <input type="text" value={formData.autoId} readOnly disabled className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Report Type</label>
        <input type="text" value={formData.reportType} readOnly disabled className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
        <input type="text" value={formData.category} readOnly disabled className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white" />
      </div>
    </div>,

    // Step 2: Description of Incident
    <div key="description" className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Where did the incident occur? *</label>
        <input type="text" value={formData.incidentLocation} onChange={e => setFormData({ ...formData, incidentLocation: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Incident Date *</label>
        <Calendar
          selectedDate={formData.incidentDate}
          onDateSelect={(date: string) => setFormData({ ...formData, incidentDate: date })}
          placeholder="Select incident date"
          className=""
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Describe what happened and how *</label>
        <textarea value={formData.incidentDescription} onChange={e => setFormData({ ...formData, incidentDescription: e.target.value })} rows={4} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white" required />
      </div>
    </div>,

    // Step 3: Details of Injured Person
    <div key="injured-person" className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name *</label>
        <input type="text" value={formData.injuredPersonName} onChange={e => setFormData({ ...formData, injuredPersonName: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Address *</label>
        <input type="text" value={formData.injuredPersonAddress} onChange={e => setFormData({ ...formData, injuredPersonAddress: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone *</label>
        <input type="tel" value={formData.injuredPersonPhone} onChange={e => setFormData({ ...formData, injuredPersonPhone: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Position *</label>
        <input type="text" value={formData.injuredPersonPosition} onChange={e => setFormData({ ...formData, injuredPersonPosition: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Was any time lost? *</label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setFormData({ ...formData, timeLost: true })}
            className={`flex-1 px-4 py-2 rounded-md border ${
              formData.timeLost
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600'
            }`}
          >
            Yes
          </button>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, timeLost: false })}
            className={`flex-1 px-4 py-2 rounded-md border ${
              !formData.timeLost
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600'
            }`}
          >
            No
          </button>
        </div>
      </div>
      {formData.timeLost && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Start Date <span className="text-gray-400 text-xs">(optional)</span></label>
            <Calendar
              selectedDate={formData.timeLostStartDate}
              onDateSelect={(date: string) => setFormData({ ...formData, timeLostStartDate: date })}
              placeholder="Select start date"
              className=""
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">End Date <span className="text-gray-400 text-xs">(optional)</span></label>
            <Calendar
              selectedDate={formData.timeLostEndDate}
              onDateSelect={(date: string) => setFormData({ ...formData, timeLostEndDate: date })}
              placeholder="Select end date"
              className=""
            />
          </div>
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name of A&E visited *</label>
        <input type="text" value={formData.aeHospitalName} onChange={e => setFormData({ ...formData, aeHospitalName: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Detail all PPE required for the activity *</label>
        <textarea value={formData.requiredPpe} onChange={e => setFormData({ ...formData, requiredPpe: e.target.value })} rows={3} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Detail all PPE worn at the time of incident *</label>
        <textarea value={formData.wornPpe} onChange={e => setFormData({ ...formData, wornPpe: e.target.value })} rows={3} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white" required />
      </div>
    </div>,

    // Step 4: Location of Injury
    <div key="injury-location" className="space-y-4">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Select location(s) of injury *</label>
      <div className="flex flex-wrap gap-2">
        {[
          'Abdomen', 'Ankle', 'Arm/Shoulder', 'Back', 'Chest', 'Digestive System',
          'Eye', 'Face/neck', 'Finger', 'Foot', 'Hand', 'Head', 'Leg/Hip',
          'Respiratory system', 'Wrist', 'Other'
        ].map(option => (
          <button
            type="button"
            key={option}
            onClick={() => setFormData(fd => ({
              ...fd,
              injuryLocations: fd.injuryLocations.includes(option)
                ? fd.injuryLocations.filter(o => o !== option)
                : [...fd.injuryLocations, option]
            }))}
            className={`px-3 py-1 rounded-full border ${
              formData.injuryLocations.includes(option)
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>,

    // Step 5: Type of Injury
    <div key="injury-type" className="space-y-4">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Select type(s) of injury *</label>
      <div className="flex flex-wrap gap-2">
        {[
          'Amputation', 'Asphyxiation/gassing', 'Bruising/swelling', 'Burn/scald',
          'Crushing', 'Cut/laceration/abrasion', 'Dislocation', 'Electric shock',
          'Foreign body', 'Fracture', 'Ill heath', 'Ingestion', 'Internal',
          'Loss of consciousness', 'Multiple', 'Puncture', 'Shock/concussion',
          'Strain/sprain', 'Whiplash', 'Other'
        ].map(option => (
          <button
            type="button"
            key={option}
            onClick={() => setFormData(fd => ({
              ...fd,
              injuryTypes: fd.injuryTypes.includes(option)
                ? fd.injuryTypes.filter(o => o !== option)
                : [...fd.injuryTypes, option]
            }))}
            className={`px-3 py-1 rounded-full border ${
              formData.injuryTypes.includes(option)
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>,

    // Step 6: First Aid
    <div key="first-aid" className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Was the injured person advised to see their doctor or visit hospital? *</label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setFormData({ ...formData, advisedMedical: true })}
            className={`flex-1 px-4 py-2 rounded-md border ${
              formData.advisedMedical
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600'
            }`}
          >
            Yes
          </button>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, advisedMedical: false })}
            className={`flex-1 px-4 py-2 rounded-md border ${
              !formData.advisedMedical
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600'
            }`}
          >
            No
          </button>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Was drug or alcohol testing required? *</label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setFormData({ ...formData, drugAlcoholTest: true })}
            className={`flex-1 px-4 py-2 rounded-md border ${
              formData.drugAlcoholTest
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600'
            }`}
          >
            Yes
          </button>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, drugAlcoholTest: false })}
            className={`flex-1 px-4 py-2 rounded-md border ${
              !formData.drugAlcoholTest
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600'
            }`}
          >
            No
          </button>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Include details of any first aid administered *</label>
        <textarea value={formData.firstAidDetails} onChange={e => setFormData({ ...formData, firstAidDetails: e.target.value })} rows={4} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white" required />
      </div>
    </div>,

    // Step 7: Health & Safety
    <div key="health-safety" className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Basic cause *</label>
        <select value={formData.basicCause} onChange={e => setFormData({ ...formData, basicCause: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white" required>
          <option value="">Select basic cause</option>
          <option value="Asphyxiation">Asphyxiation</option>
          <option value="Collision">Collision</option>
          <option value="Contact with electricity">Contact with electricity</option>
          <option value="Contact with flying particles">Contact with flying particles</option>
          <option value="Contact with tool/equipment/machinery">Contact with tool/equipment/machinery</option>
          <option value="Contact with/exposed to air/water pressure">Contact with/exposed to air/water pressure</option>
          <option value="Contact with/exposed to hazardous substance">Contact with/exposed to hazardous substance</option>
          <option value="Contact with/exposed to heat/acid">Contact with/exposed to heat/acid</option>
          <option value="Drowning">Drowning</option>
          <option value="Explosion">Explosion</option>
          <option value="Exposure to noise/vibration">Exposure to noise/vibration</option>
          <option value="Fall down stairs/steps">Fall down stairs/steps</option>
          <option value="Fall from height">Fall from height</option>
          <option value="Fall on the same level">Fall on the same level</option>
          <option value="Fire">Fire</option>
          <option value="Loss of containment/unintentional release">Loss of containment/unintentional release</option>
          <option value="Manual Handling">Manual Handling</option>
          <option value="Repetitive motion/action">Repetitive motion/action</option>
          <option value="Step on/struck against stationary object">Step on/struck against stationary object</option>
          <option value="Struck by falling object">Struck by falling object</option>
          <option value="Struck by moving object">Struck by moving object</option>
          <option value="Struck or trapped by something collapsing/overturning">Struck or trapped by something collapsing/overturning</option>
          <option value="Trapped between objects">Trapped between objects</option>
          <option value="Other">Other</option>
        </select>
      </div>
    </div>,

    // Step 8: Root Causes
    <div key="root-causes" className="space-y-6">
      {/* Work Environment */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Work Environment *</label>
        <div className="flex flex-wrap gap-2">
          {['Access/Egress','Defective workplace','Design/Layout','Housekeeping','Lack of room','Lighting','Noise/distraction','Weather','Other'].map(option => (
            <button type="button" key={option} onClick={() => setFormData(fd => ({ ...fd, rootCauseWorkEnvironment: fd.rootCauseWorkEnvironment.includes(option) ? fd.rootCauseWorkEnvironment.filter(o => o !== option) : [...fd.rootCauseWorkEnvironment, option] }))} className={`px-3 py-1 rounded-full border ${formData.rootCauseWorkEnvironment.includes(option) ? 'bg-indigo-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>{option}</button>
          ))}
        </div>
      </div>
      {/* Human Factors */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Human Factors *</label>
        <div className="flex flex-wrap gap-2">
          {['Error of judgement','Failure to adhere to the RAs','Failure to follow rules','Fatigue','Horseplay','Instructions misunderstood','Lack of experience','Lapse in concentration','Undue haste','Unsafe attitude','Working without authorisation','Other'].map(option => (
            <button type="button" key={option} onClick={() => setFormData(fd => ({ ...fd, rootCauseHumanFactors: fd.rootCauseHumanFactors.includes(option) ? fd.rootCauseHumanFactors.filter(o => o !== option) : [...fd.rootCauseHumanFactors, option] }))} className={`px-3 py-1 rounded-full border ${formData.rootCauseHumanFactors.includes(option) ? 'bg-indigo-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>{option}</button>
          ))}
        </div>
      </div>
      {/* PPE */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">PPE *</label>
        <div className="flex flex-wrap gap-2">
          {['Design','Maintenance/defective','Not provided/unavailable','Not used','Work type','Other'].map(option => (
            <button type="button" key={option} onClick={() => setFormData(fd => ({ ...fd, rootCausePpe: fd.rootCausePpe.includes(option) ? fd.rootCausePpe.filter(o => o !== option) : [...fd.rootCausePpe, option] }))} className={`px-3 py-1 rounded-full border ${formData.rootCausePpe.includes(option) ? 'bg-indigo-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>{option}</button>
          ))}
        </div>
      </div>
      {/* Management */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Management *</label>
        <div className="flex flex-wrap gap-2">
          {['RAMS not communicated','Supervision','System Failure','Training','Other'].map(option => (
            <button type="button" key={option} onClick={() => setFormData(fd => ({ ...fd, rootCauseManagement: fd.rootCauseManagement.includes(option) ? fd.rootCauseManagement.filter(o => o !== option) : [...fd.rootCauseManagement, option] }))} className={`px-3 py-1 rounded-full border ${formData.rootCauseManagement.includes(option) ? 'bg-indigo-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>{option}</button>
          ))}
        </div>
      </div>
      {/* Plant / Equipment */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Plant / Equipment *</label>
        <div className="flex flex-wrap gap-2">
          {['Construction/design','Installation','Maintenance','Mechanical failure','Operation/use','Safety device','Other'].map(option => (
            <button type="button" key={option} onClick={() => setFormData(fd => ({ ...fd, rootCausePlantEquipment: fd.rootCausePlantEquipment.includes(option) ? fd.rootCausePlantEquipment.filter(o => o !== option) : [...fd.rootCausePlantEquipment, option] }))} className={`px-3 py-1 rounded-full border ${formData.rootCausePlantEquipment.includes(option) ? 'bg-indigo-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>{option}</button>
          ))}
        </div>
      </div>
    </div>,

    // Step 9: Actions
    <div key="actions" className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">What actions have been taken to prevent a similar incident? *</label>
        <textarea value={formData.actionsTaken} onChange={e => setFormData({ ...formData, actionsTaken: e.target.value })} rows={4} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white" required />
      </div>
      <div>
        <button type="button" onClick={() => setShowActionModal(true)} className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed">Add Action</button>
      </div>
      <div className="space-y-2">
        {formData.actions.map((action, idx) => (
          <div key={idx} className="flex items-center gap-2 border p-2 rounded">
            <div className="flex-1">
              <div className="font-semibold">{action.title}</div>
              <div className="text-xs text-gray-500">Due: {action.dueDate}</div>
              <div className="text-sm">{action.description}</div>
            </div>
            <button type="button" onClick={() => setFormData(fd => ({ ...fd, actions: fd.actions.filter((_, i) => i !== idx) }))} className="text-red-600 hover:underline">Remove</button>
          </div>
        ))}
      </div>
      {/* Modal for adding action */}
      {showActionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg w-full max-w-md relative">
            <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-100 focus:outline-none" onClick={() => setShowActionModal(false)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x h-6 w-6"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
            </button>
            <h2 className="text-lg font-bold mb-4">Add Action</h2>
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Action Title *</label>
              <input type="text" value={actionDraft.title} onChange={e => setActionDraft({ ...actionDraft, title: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white" required />
            </div>
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Action Due Date *</label>
              <Calendar
                selectedDate={actionDraft.dueDate}
                onDateSelect={(date: string) => setActionDraft({ ...actionDraft, dueDate: date })}
                placeholder="Select due date"
                className=""
              />
            </div>
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Action Description *</label>
              <textarea value={actionDraft.description} onChange={e => setActionDraft({ ...actionDraft, description: e.target.value })} rows={3} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white" required />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button type="button" onClick={() => setShowActionModal(false)} className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded">Cancel</button>
              <button type="button" onClick={() => {
                setFormData(fd => ({ ...fd, actions: [...fd.actions, actionDraft] }));
                setActionDraft({ title: '', dueDate: '', description: '' });
                setShowActionModal(false);
              }} className="px-4 py-2 bg-indigo-600 text-white rounded">Add</button>
            </div>
          </div>
        </div>
      )}
    </div>,

    // Step 10: Documentation
    <div key="documentation" className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Documentation</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Supporting Documents/Images <span className="text-gray-400 text-xs">(optional)</span>
        </label>
        <div className="flex flex-col gap-2">
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md p-6 text-center">
                <input
                  type="file"
                  multiple
                  accept="image/*,.pdf,.doc,.docx"
                  className="hidden"
                  id="documentation-files"
                  onChange={(e) => {
                    if (e.target.files) {
                      handleFileUpload(e.target.files, 'file_urls');
                    }
                  }}
                />
            <label
              htmlFor="documentation-files"
              className="cursor-pointer flex flex-col items-center justify-center"
            >
              {uploadingFiles ? (
                <div className="flex flex-col items-center">
                  <svg className="animate-spin h-6 w-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="mt-2 text-sm text-gray-500">Uploading...</span>
                </div>
              ) : (
                <>
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="mt-2 block text-sm font-medium text-gray-900 dark:text-gray-300">
                    Click to upload files
                  </span>
                  <span className="mt-1 block text-sm text-gray-500 dark:text-gray-400">
                    PNG, JPG, PDF, DOC up to 10MB
                  </span>
                </>
              )}
              </label>
            </div>

          {formData.file_urls.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
              {formData.file_urls.map((fileUrl, index) => {
                const fileName = fileUrl.split('/').pop()?.split('?')[0] || `File ${index + 1}`;
                const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(fileName.toLowerCase());
                
                return (
                  <div key={index} className="relative group">
                    <div className="w-full h-32 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-700 border">
                      {isImage ? (
                        <div className="relative w-full h-full">
                          <img
                            src={fileUrl}
                            alt={`Document ${index + 1}`}
                            className="w-full h-full object-cover cursor-pointer"
                            onClick={() => window.open(fileUrl, '_blank')}
                            onError={() => {
                              const imgElement = document.getElementById(`file-preview-${index}`);
                              if (imgElement) {
                                imgElement.style.display = 'none';
                                const fallbackElement = document.getElementById(`file-preview-fallback-${index}`);
                                if (fallbackElement) {
                                  fallbackElement.style.display = 'flex';
                                }
                              }
                            }}
                            id={`file-preview-${index}`}
                          />
                          <div 
                            id={`file-preview-fallback-${index}`}
                            className="hidden absolute inset-0 w-full h-full items-center justify-center bg-gray-200 dark:bg-gray-600 cursor-pointer"
                            onClick={() => window.open(fileUrl, '_blank')}
                          >
                            <div className="text-center p-2">
                              <div className="text-gray-500 text-xs font-medium">
                                {fileName.split('.').pop()?.toUpperCase() || 'IMAGE'}
          </div>
                              <div className="text-gray-400 text-xs mt-1 truncate max-w-[120px]">
                                {fileName}
        </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div 
                          className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-600 cursor-pointer"
                          onClick={() => window.open(fileUrl, '_blank')}
                        >
                          <div className="text-center p-2">
                            <div className="text-gray-500 text-xs font-medium">
                              {fileName.split('.').pop()?.toUpperCase() || 'FILE'}
                            </div>
                            <div className="text-gray-400 text-xs mt-1 truncate max-w-[120px]">
                              {fileName}
                            </div>
                          </div>
          </div>
        )}
                    </div>
                    <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            file_urls: prev.file_urls.filter((_, i) => i !== index)
                          }));
                        }}
                        className="p-1 bg-red-500 rounded-full text-white hover:bg-red-600 shadow-lg"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>,
  ];

  return (
    <div className="non-fatal-form">
      <h1 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Non Fatal Report</h1>
      {submitted ? (
        <div className="bg-green-50 dark:bg-green-900 p-4 rounded-md mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800 dark:text-green-200">Success!</h3>
              <div className="mt-2 text-sm text-green-700 dark:text-green-300">
                <p>Your non fatal report has been successfully submitted and saved.</p>
              </div>
            </div>
          </div>
        </div>
      ) : null}
      <BaseForm
        steps={formSteps}
        currentStep={currentStep}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onSubmit={handleSubmit}
        onCancel={onClose}
        submitButtonProps={{
          className: submitted ? 'bg-green-600 hover:bg-green-700 text-white' : undefined,
          disabled: submitted,
          children: submitted ? 'Submitted' : undefined,
        }}
      >
        {stepContent[currentStep]}
        {error && (
          <div className="mt-4 text-sm text-red-600 dark:text-red-400 text-center">{error}</div>
        )}
      </BaseForm>
    </div>
  );
} 