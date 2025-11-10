import { useState, useEffect } from 'react';
import { supabase } from '../../../../lib/supabase';
import { verifyAdminPassword } from '../../../../utils/adminPassword';
import { DSEAssessment, DSEHookResult } from '../types';
import { formatDate } from '../utils/constants';
import { handlePdfGeneration } from '../utils/pdfUtils';

export const useDSEAssessments = (): DSEHookResult => {
  const [assessments, setAssessments] = useState<DSEAssessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdminView, setIsAdminView] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [generatingPDF, setGeneratingPDF] = useState(false);

  useEffect(() => {
    fetchAssessments();
  }, [isAdminView]);

  const fetchAssessments = async (): Promise<void> => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      let query = supabase
        .from('dse_assessments')
        .select('id, full_name, submitted_date, next_due_date, user_id')
        .order('submitted_date', { ascending: false });

      if (!isAdminView) {
        query = query.eq('user_id', user.id);
      }

      const { data, error } = await query;

      if (error) throw error;
      setAssessments(data || []);
    } catch (error) {
      console.error('Error fetching assessments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdminPasswordSubmit = async (password: string): Promise<void> => {
    setLoading(true);
    
    const isValid = await verifyAdminPassword(password);
    if (isValid) {
      setIsAdminView(true);
      setShowAdminModal(false);
      setAdminPassword('');
      setPasswordError('');
    } else {
      setPasswordError('Incorrect password');
    }
    setLoading(false);
  };

  const handleExitAdminView = (): void => {
    setIsAdminView(false);
  };

  const handleViewAssessment = async (assessment: DSEAssessment): Promise<void> => {
    await handlePdfGeneration(
      assessment,
      () => setGeneratingPDF(true),
      () => setGeneratingPDF(false),
      (error: string) => {
        setGeneratingPDF(false);
        alert(error);
      }
    );
  };

  return {
    assessments,
    loading,
    isAdminView,
    showAdminModal,
    adminPassword,
    passwordError,
    generatingPDF,
    setShowAdminModal,
    setAdminPassword,
    setPasswordError,
    handleAdminPasswordSubmit,
    handleExitAdminView,
    handleViewAssessment,
    fetchAssessments,
    formatDate,
  };
};
