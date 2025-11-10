import { useState, useEffect } from 'react';
import { supabase } from '../../../../../lib/supabase';
import type { FirstAidRiskAssessment } from '../types';
import type { FirstAidNeedsAssessment } from '../types/FirstAidNeedsAssessment';
import { transformFormDataForDatabase, transformDatabaseDataForForm } from '../utils/fieldMapping';

// Helper function to map assessment status to risk assessment status
function mapStatusToRiskAssessmentStatus(status: string): 'draft' | 'active' | 'under_review' | 'expired' {
  switch (status) {
    case 'completed':
      return 'active';
    case 'in_progress':
    case 'draft':
      return 'draft';
    case 'under_review':
      return 'under_review';
    default:
      return 'draft';
  }
}

// Helper function to determine risk level based on assessment data
function determineRiskLevel(assessment: any): 'low' | 'medium' | 'high' | 'critical' {
  // Simple logic to determine risk level based on available data
  // In a real scenario, this would be more sophisticated
  
  // Check if review date is overdue
  if (assessment.review_date && new Date(assessment.review_date) < new Date()) {
    return 'high'; // Overdue assessments are high risk
  }
  
  // For now, default to low risk for completed assessments, medium for others
  if (assessment.status === 'completed') {
    return 'low';
  }
  
  return 'medium';
}

export function useFirstAidRiskAssessments() {
  const [assessments, setAssessments] = useState<FirstAidRiskAssessment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssessments = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('first_aid_needs_assessments')
          .select(`
            id,
            assessment_id,
            assessment_title,
            assessor_name,
            assessment_date,
            review_date,
            status,
            nature_of_business,
            additional_considerations,
            created_at,
            updated_at
          `)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching assessments:', error);
          setAssessments([]);
          return;
        }

        // Transform Supabase data to match FirstAidRiskAssessment interface
        const transformedAssessments: FirstAidRiskAssessment[] = (data || []).map((assessment: any) => ({
          id: assessment.id,
          title: assessment.assessment_title || 'Untitled Assessment',
          description: assessment.additional_considerations || 'First Aid Needs Assessment',
          assessmentType: 'workplace' as const,
          location: assessment.nature_of_business || 'Not specified',
          assessor: assessment.assessor_name || 'Unknown',
          assessmentDate: assessment.assessment_date || new Date().toISOString().split('T')[0],
          reviewDate: assessment.review_date || new Date().toISOString().split('T')[0],
          status: mapStatusToRiskAssessmentStatus(assessment.status),
          riskLevel: determineRiskLevel(assessment),
          hazards: [], // We don't have hazards in the same format for needs assessments
          controlMeasures: [],
          emergencyProcedures: [],
          firstAidRequirements: [],
          createdAt: assessment.created_at,
          updatedAt: assessment.updated_at
        }));

        setAssessments(transformedAssessments);
      } catch (error) {
        console.error('Error fetching first aid needs assessments:', error);
        setAssessments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAssessments();
  }, []);

  const addAssessment = async (assessmentData: FirstAidNeedsAssessment) => {
    try {
      // Transform camelCase field names to snake_case for database
      const transformedData = await transformFormDataForDatabase(assessmentData);
      
      const { data, error } = await supabase
        .from('first_aid_needs_assessments')
        .insert([transformedData])
        .select()
        .single();

      if (error) {
        console.error('Error adding assessment:', error);
        throw error;
      }

      // Refresh the assessments list
      const { data: refreshData, error: refreshError } = await supabase
        .from('first_aid_needs_assessments')
        .select(`
          id,
          assessment_id,
          assessment_title,
          assessor_name,
          assessment_date,
          review_date,
          status,
          nature_of_business,
          additional_considerations,
          created_at,
          updated_at
        `)
        .order('created_at', { ascending: false });

      if (!refreshError && refreshData) {
        const transformedAssessments: FirstAidRiskAssessment[] = refreshData.map((assessment: any) => ({
          id: assessment.id,
          title: assessment.assessment_title || 'Untitled Assessment',
          description: assessment.additional_considerations || 'First Aid Needs Assessment',
          assessmentType: 'workplace' as const,
          location: assessment.nature_of_business || 'Not specified',
          assessor: assessment.assessor_name || 'Unknown',
          assessmentDate: assessment.assessment_date || new Date().toISOString().split('T')[0],
          reviewDate: assessment.review_date || new Date().toISOString().split('T')[0],
          status: mapStatusToRiskAssessmentStatus(assessment.status),
          riskLevel: determineRiskLevel(assessment),
          hazards: [],
          controlMeasures: [],
          emergencyProcedures: [],
          firstAidRequirements: [],
          createdAt: assessment.created_at,
          updatedAt: assessment.updated_at
        }));
        setAssessments(transformedAssessments);
      }

      return data;
    } catch (error) {
      console.error('Error adding assessment:', error);
      throw error;
    }
  };

  const updateAssessment = async (id: string, updates: Partial<FirstAidNeedsAssessment>) => {
    try {
      // Transform camelCase field names to snake_case for database
      const transformedUpdates = await transformFormDataForDatabase(updates);
      
      const { error } = await supabase
        .from('first_aid_needs_assessments')
        .update(transformedUpdates)
        .eq('id', id);

      if (error) {
        console.error('Error updating assessment:', error);
        throw error;
      }

      // Refresh the assessments list
      const { data: refreshData, error: refreshError } = await supabase
        .from('first_aid_needs_assessments')
        .select(`
          id,
          assessment_id,
          assessment_title,
          assessor_name,
          assessment_date,
          review_date,
          status,
          nature_of_business,
          additional_considerations,
          created_at,
          updated_at
        `)
        .order('created_at', { ascending: false });

      if (!refreshError && refreshData) {
        const transformedAssessments: FirstAidRiskAssessment[] = refreshData.map((assessment: any) => ({
          id: assessment.id,
          title: assessment.assessment_title || 'Untitled Assessment',
          description: assessment.additional_considerations || 'First Aid Needs Assessment',
          assessmentType: 'workplace' as const,
          location: assessment.nature_of_business || 'Not specified',
          assessor: assessment.assessor_name || 'Unknown',
          assessmentDate: assessment.assessment_date || new Date().toISOString().split('T')[0],
          reviewDate: assessment.review_date || new Date().toISOString().split('T')[0],
          status: mapStatusToRiskAssessmentStatus(assessment.status),
          riskLevel: determineRiskLevel(assessment),
          hazards: [],
          controlMeasures: [],
          emergencyProcedures: [],
          firstAidRequirements: [],
          createdAt: assessment.created_at,
          updatedAt: assessment.updated_at
        }));
        setAssessments(transformedAssessments);
      }
    } catch (error) {
      console.error('Error updating assessment:', error);
      throw error;
    }
  };

  const deleteAssessment = async (id: string) => {
    try {
      const { error } = await supabase
        .from('first_aid_needs_assessments')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting assessment:', error);
        throw error;
      }

      // Remove from local state
      setAssessments(prev => prev.filter(assessment => assessment.id !== id));
    } catch (error) {
      console.error('Error deleting assessment:', error);
      throw error;
    }
  };

  const getAssessmentById = async (id: string): Promise<FirstAidNeedsAssessment | null> => {
    try {
      const { data, error } = await supabase
        .from('first_aid_needs_assessments')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching assessment by ID:', error);
        return null;
      }

      // Use the proper transformation function to handle all fields including dynamic ones
      const transformedData = transformDatabaseDataForForm(data);

      return transformedData;
    } catch (error) {
      console.error('Error fetching assessment by ID:', error);
      return null;
    }
  };

  const refetch = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('first_aid_needs_assessments')
        .select(`
          id,
          assessment_id,
          assessment_title,
          assessor_name,
          assessment_date,
          review_date,
          status,
          nature_of_business,
          additional_considerations,
          created_at,
          updated_at
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error refetching assessments:', error);
        return;
      }

      const transformedAssessments: FirstAidRiskAssessment[] = (data || []).map((assessment: any) => ({
        id: assessment.id,
        title: assessment.assessment_title || 'Untitled Assessment',
        description: assessment.additional_considerations || 'First Aid Needs Assessment',
        assessmentType: 'workplace' as const,
        location: assessment.nature_of_business || 'Not specified',
        assessor: assessment.assessor_name || 'Unknown',
        assessmentDate: assessment.assessment_date || new Date().toISOString().split('T')[0],
        reviewDate: assessment.review_date || new Date().toISOString().split('T')[0],
        status: mapStatusToRiskAssessmentStatus(assessment.status),
        riskLevel: determineRiskLevel(assessment),
        hazards: [],
        controlMeasures: [],
        emergencyProcedures: [],
        firstAidRequirements: [],
        createdAt: assessment.created_at,
        updatedAt: assessment.updated_at
      }));

      setAssessments(transformedAssessments);
    } catch (error) {
      console.error('Error refetching assessments:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    assessments,
    loading,
    addAssessment,
    updateAssessment,
    deleteAssessment,
    getAssessmentById,
    refetch
  };
}
