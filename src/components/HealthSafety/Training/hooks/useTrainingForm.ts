import { useState, useEffect } from 'react';
import { supabase } from '../../../../lib/supabase';
import type { 
  Staff, 
  User, 
  Worker, 
  CombinedStaffUser, 
  TrainingRecord, 
  CardTicket, 
  Certificate, 
  FilePreview, 
  TrainingMatrixItem 
} from '../types';

interface UseTrainingFormProps {
  onClose: () => void;
  editData?: TrainingMatrixItem;
}

export function useTrainingForm({ onClose, editData }: UseTrainingFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [combinedStaffUsers, setCombinedStaffUsers] = useState<CombinedStaffUser[]>([]);
  const [selectedStaff, setSelectedStaff] = useState<string>('');
  const [trainingRecords, setTrainingRecords] = useState<TrainingRecord[]>([]);
  const [cardTickets, setCardTickets] = useState<CardTicket[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [expandedTrainingItems, setExpandedTrainingItems] = useState<number[]>([]);
  const [expandedCards, setExpandedCards] = useState<number[]>([]);
  const [filePreviews, setFilePreviews] = useState<FilePreview[]>([]);

  useEffect(() => {
    fetchStaff();
    fetchUsers();
    fetchWorkers();
  }, []);

  useEffect(() => {
    // Combine staff, users, and workers when any list changes
    if (staff.length > 0 || users.length > 0 || workers.length > 0) {
      combineStaffUsersAndWorkers();
    }
  }, [staff, users, workers]);

  useEffect(() => {
    if (editData) {
      // Pre-fill form with existing data
      setSelectedStaff(editData.name);
      
      if (editData.training_records) {
        setTrainingRecords(editData.training_records);
      }
      
      if (editData.cards_tickets) {
        setCardTickets(editData.cards_tickets);
      }
      
      if (editData.certificates && editData.certificates.length > 0) {
        // Load existing certificates with their file paths
        setCertificates(editData.certificates.map((cert: any) => ({
          certificate_name: cert.certificate_name,
          file: null, // We can't restore the file object, but we have the path
          date_added: cert.date_added,
          date_expires: cert.date_expires || '',
          file_path: cert.file_path // Preserve the file path
        })));

        // Create file previews for existing certificates with signed URLs
        loadExistingFiles(editData.certificates);
      }
    }
  }, [editData]);

  const fetchStaff = async () => {
    const { data, error } = await supabase
      .from('staff')
      .select('id, name, position')
      .order('name');
    
    if (data) {
      setStaff(data);
    }
  };

  const fetchUsers = async () => {
    try {
      console.log('Fetching all verified users via Edge Function...');
      
      // Get current session to pass authorization header
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        console.log('No valid session found');
        setUsers([]);
        return;
      }

      // Call the Edge Function to get all verified users
      const { data, error } = await supabase.functions.invoke('get-all-users', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        console.error('Edge function error:', error);
        // Fallback to current user only if Edge Function fails
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUsers([{
            id: user.id,
            full_name: user.user_metadata?.display_name || user.user_metadata?.full_name || user.email || 'Current User',
            email: user.email || ''
          }]);
          console.log('Fallback: Using current authenticated user only:', user.email);
        } else {
          setUsers([]);
        }
        return;
      }

      if (data?.users) {
        setUsers(data.users.map((user: any) => ({
          id: user.id,
          full_name: user.full_name,
          email: user.email
        })));
        console.log(`Successfully fetched ${data.users.length} verified users:`, data.users.map((u: any) => u.email));
      } else {
        console.log('No users returned from Edge Function');
        setUsers([]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      // Fallback to current user only if there's an error
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUsers([{
            id: user.id,
            full_name: user.user_metadata?.display_name || user.user_metadata?.full_name || user.email || 'Current User',
            email: user.email || ''
          }]);
          console.log('Error fallback: Using current authenticated user only:', user.email);
        } else {
          setUsers([]);
        }
      } catch (fallbackError) {
        console.error('Fallback error:', fallbackError);
        setUsers([]);
      }
    }
  };

  const fetchWorkers = async () => {
    const { data, error } = await supabase
      .from('workers')
      .select('id, full_name, email, company, phone, is_active')
      .order('full_name');
    
    if (data) {
      setWorkers(data);
    }
  };

  const combineStaffUsersAndWorkers = () => {
    const combined: CombinedStaffUser[] = [
      // Add staff members
      ...staff.map(staffMember => ({
        id: `staff_${staffMember.id}`,
        name: staffMember.name,
        type: 'staff' as const,
        original_id: staffMember.id,
        email: '', // Staff might not have email in this context
        position: staffMember.position
      })),
      // Add users, but exclude those who already exist as staff
      ...users.filter(user => !staff.some(staffMember => staffMember.name === user.full_name))
        .map(user => ({
          id: `user_${user.id}`,
          name: user.full_name || user.email || 'Unknown User',
          type: 'user' as const,
          original_id: user.id,
          email: user.email
        })),
      // Add workers, but exclude those who already exist as staff or users
      ...workers.filter(worker => !staff.some(staffMember => staffMember.name === worker.full_name) && !users.some(user => user.full_name === worker.full_name))
        .map(worker => ({
          id: `worker_${worker.id}`,
          name: worker.full_name || worker.email || 'Unknown Worker',
          type: 'worker' as const,
          original_id: worker.id,
          email: worker.email,
          company: worker.company,
          phone: worker.phone,
          is_active: worker.is_active
        }))
    ];
    
    setCombinedStaffUsers(combined);
  };

  const loadExistingFiles = async (existingCertificates: any[]) => {
    if (!existingCertificates || existingCertificates.length === 0) return;
    
    const existingFilePreviews = await Promise.all(
      existingCertificates
        .filter((cert: any) => cert.file_path)
        .map(async (cert: any) => {
          try {
            let filePath = cert.file_path;
            
            // Check if file_path is a full URL (legacy format) and extract just the filename
            if (filePath.includes('/storage/v1/object/public/training/')) {
              filePath = filePath.split('/storage/v1/object/public/training/')[1];
            } else if (filePath.includes('/object/public/training/')) {
              filePath = filePath.split('/object/public/training/')[1];
            }
            
            // Generate signed URL for private bucket access
            const { data: signedUrlData, error } = await supabase.storage
              .from('training')
              .createSignedUrl(filePath, 3600); // 1 hour expiry
            
            if (error) {
              console.error('Error creating signed URL:', error);
              console.error('Attempted file path:', filePath);
              return null;
            }

            return {
              id: `existing-${Math.random().toString(36).substr(2, 9)}`,
              name: cert.certificate_name,
              url: signedUrlData.signedUrl,
              file: null, // No actual file object for existing files
              isExisting: true // Flag to identify existing files
            };
          } catch (error) {
            console.error('Error processing existing file:', error);
            return null;
          }
        })
    );
    
    // Filter out any null results from failed URL generation
    const validPreviews = existingFilePreviews.filter(preview => preview !== null);
    setFilePreviews(validPreviews);
  };

  const addTrainingRecord = () => {
    setTrainingRecords([
      ...trainingRecords,
      {
        training_item_id: '',
        stage: 'booked_in',
        date_added: new Date().toISOString().split('T')[0],
        expiry_date: '',
        status: 'no_training'
      }
    ]);
  };

  const addCardTicket = () => {
    setCardTickets([
      ...cardTickets,
      {
        issuer: '',
        card_type: '',
        card_number: '',
        date_added: new Date().toISOString().split('T')[0],
        date_expires: ''
      }
    ]);
  };

  const addCertificate = () => {
    setCertificates([
      ...certificates,
      {
        certificate_name: '',
        file: null,
        date_added: new Date().toISOString(),
        date_expires: '',
        file_path: ''
      }
    ]);
  };

  const toggleTrainingItem = (index: number) => {
    setExpandedTrainingItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const toggleCard = (index: number) => {
    setExpandedCards(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newPreviews = await Promise.all(
      files.map(async (file) => {
        const previewUrl = URL.createObjectURL(file);
        return {
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          url: previewUrl,
          file,
          isExisting: false
        };
      })
    );
    setFilePreviews(prev => [...prev, ...newPreviews]);
  };

  const removeFile = (id: string) => {
    const fileToRemove = filePreviews.find(file => file.id === id);
    
    // Remove from file previews
    setFilePreviews(prev => prev.filter(file => file.id !== id));
    
    // If it's an existing file, also remove it from certificates
    if (fileToRemove && fileToRemove.isExisting) {
      setCertificates(prev => prev.filter(cert => cert.certificate_name !== fileToRemove.name));
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    try {
      // Validate staff selection
      if (!selectedStaff || selectedStaff.trim() === '') {
        alert('Please select a staff member before saving');
        return;
      }

      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        alert('No user found. Please log in and try again.');
        return;
      }

      // Find the selected staff member to get their information
      const selectedStaffMember = combinedStaffUsers.find(member => member.name === selectedStaff);
      if (!selectedStaffMember) {
        alert('Selected staff member not found. Please refresh and try again.');
        return;
      }

      // Upload certificates first to get their file paths
      const certificatesWithUrls = await Promise.all(
        filePreviews
          .filter(preview => !preview.isExisting && preview.file) // Only upload new files
          .map(async (preview) => {
            if (!preview.file) return null; // Additional safety check
            const fileExt = preview.file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const { error: uploadError } = await supabase.storage
              .from('training')
              .upload(fileName, preview.file);
            
            if (uploadError) throw uploadError;

            // Store the file path, not the public URL (since bucket is private)
            return {
              certificate_name: preview.name,
              file_path: fileName, // Store just the file path for private bucket
              date_added: new Date().toISOString(),
              date_expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() // 1 year from now
            };
          })
      );

      // Filter out any null results and combine existing certificates with new ones
      const validCertificatesWithUrls = certificatesWithUrls.filter(cert => cert !== null);
      const allCertificates = [
        ...certificates.filter(cert => cert.file === null && cert.file_path).map(cert => {
          let filePath = cert.file_path;
          
          // Convert full URLs to just file paths for consistency
          if (filePath.includes('/storage/v1/object/public/training/')) {
            filePath = filePath.split('/storage/v1/object/public/training/')[1];
          } else if (filePath.includes('/object/public/training/')) {
            filePath = filePath.split('/object/public/training/')[1];
          }
          
          return {
            ...cert,
            file_path: filePath // Store clean file path
          };
        }), // Existing certificates with cleaned file paths
        ...validCertificatesWithUrls // New uploaded certificates
      ];

      if (editData) {
        // Update existing record
        const { error: updateError } = await supabase
          .from('training_matrix')
          .update({ 
            staff_id: selectedStaffMember.type === 'staff' ? selectedStaffMember.original_id : null,
            name: selectedStaff,
            position: selectedStaffMember.position || '',
            training_records: trainingRecords,
            cards_tickets: cardTickets,
            certificates: allCertificates
          })
          .eq('id', editData.id);

        if (updateError) {
          console.error('Update Error:', updateError);
          alert(`Error updating training data: ${updateError.message}`);
          return;
        }
      } else {
        // Create new training matrix entry
        const { data: matrixData, error: matrixError } = await supabase
          .from('training_matrix')
          .insert([{ 
            user_id: user.id,
            staff_id: selectedStaffMember.type === 'staff' ? selectedStaffMember.original_id : null,
            name: selectedStaff,
            position: selectedStaffMember.position || '',
            training_records: trainingRecords,
            cards_tickets: cardTickets,
            certificates: allCertificates
          }])
          .select()
          .single();

        if (matrixError) {
          console.error('Matrix Error:', matrixError);
          alert(`Error creating training data: ${matrixError.message}`);
          return;
        }

        if (!matrixData) {
          alert('Failed to create training matrix entry. Please try again.');
          return;
        }
      }

      onClose();
    } catch (error: any) {
      console.error('Error saving training data:', error);
      alert(`Error saving training data: ${error.message || 'Unknown error'}`);
    }
  };

  return {
    // State
    currentStep,
    staff,
    users,
    workers,
    combinedStaffUsers,
    selectedStaff,
    trainingRecords,
    cardTickets,
    certificates,
    expandedTrainingItems,
    expandedCards,
    filePreviews,

    // Actions
    setCurrentStep,
    setSelectedStaff,
    setTrainingRecords,
    setCardTickets,
    setCertificates,
    setExpandedTrainingItems,
    setExpandedCards,
    setFilePreviews,
    addTrainingRecord,
    addCardTicket,
    addCertificate,
    toggleTrainingItem,
    toggleCard,
    handleFileUpload,
    removeFile,
    handleSubmit
  };
}