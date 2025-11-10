import { useState, useEffect } from 'react';
import { supabase } from '../../../../lib/supabase';
import type { TrainingMatrixItem } from '../types';

export function useTrainingMatrix() {
  const [trainingData, setTrainingData] = useState<TrainingMatrixItem[]>([]);
  const [filteredData, setFilteredData] = useState<TrainingMatrixItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showTrainingModal, setShowTrainingModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTraining, setSelectedTraining] = useState<TrainingMatrixItem | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [trainingToDelete, setTrainingToDelete] = useState<string | null>(null);
  const [certificateUrls, setCertificateUrls] = useState<{[key: string]: string}>({});

  useEffect(() => {
    fetchTrainingData();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredData(trainingData);
    } else {
      const lowercaseQuery = searchQuery.toLowerCase();
      const filtered = trainingData.filter(item => 
        item.name.toLowerCase().includes(lowercaseQuery) || 
        item.position.toLowerCase().includes(lowercaseQuery)
      );
      setFilteredData(filtered);
    }
  }, [searchQuery, trainingData]);

  const fetchTrainingData = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data, error } = await supabase
        .from('training_matrix')
        .select('id, name, position, created_at, user_id, staff_id, training_records, cards_tickets, certificates')
        .order('name', { ascending: true });

      if (error) throw error;
      setTrainingData(data || []);
      setFilteredData(data || []);
    } catch (error) {
      console.error('Error fetching training data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewTraining = async (training: TrainingMatrixItem) => {
    setSelectedTraining(training);
    
    // Generate signed URLs for certificates
    if (training.certificates && training.certificates.length > 0) {
      const urlMap: {[key: string]: string} = {};
      
      await Promise.all(
        training.certificates.map(async (cert: any, index: number) => {
          if (cert.file_path) {
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
              } else {
                urlMap[`cert-${index}`] = signedUrlData.signedUrl;
              }
            } catch (error) {
              console.error('Error processing certificate file:', error);
            }
          }
        })
      );
      
      setCertificateUrls(urlMap);
    }
    
    setShowViewModal(true);
  };

  const handleEditTraining = (training: TrainingMatrixItem) => {
    setSelectedTraining(training);
    setShowEditModal(true);
  };

  const handleDeleteTraining = (trainingId: string, trainingName: string) => {
    setTrainingToDelete(trainingId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!trainingToDelete) return;
    
    try {
      // Get the current user
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { error } = await supabase
        .from('training_matrix')
        .delete()
        .eq('id', trainingToDelete)
        .eq('user_id', user.id);

      if (error) throw error;
      
      // Refresh the data
      fetchTrainingData();
      setShowDeleteModal(false);
      setTrainingToDelete(null);
    } catch (error) {
      console.error('Error deleting training record:', error);
      alert('Failed to delete training record');
    }
  };

  const handleAddTraining = () => {
    setSelectedTraining(null);
    setShowTrainingModal(true);
  };

  const handleTrainingSuccess = () => {
    setShowTrainingModal(false);
    fetchTrainingData();
  };

  const handleEditSuccess = () => {
    setShowEditModal(false);
    setSelectedTraining(null);
    fetchTrainingData();
  };

  const closeViewModal = () => {
    setShowViewModal(false);
    setCertificateUrls({});
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setTrainingToDelete(null);
  };

  return {
    // State
    trainingData,
    filteredData,
    loading,
    searchQuery,
    showTrainingModal,
    showEditModal,
    selectedTraining,
    showViewModal,
    showDeleteModal,
    trainingToDelete,
    certificateUrls,

    // Actions
    setSearchQuery,
    fetchTrainingData,
    handleViewTraining,
    handleEditTraining,
    handleDeleteTraining,
    confirmDelete,
    handleAddTraining,
    handleTrainingSuccess,
    handleEditSuccess,
    closeViewModal,
    cancelDelete
  };
}