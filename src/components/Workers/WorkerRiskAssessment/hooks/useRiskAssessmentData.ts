import { useState, useEffect } from 'react';
import { supabase } from '../../../../lib/supabase';
import { RiskAssessmentData } from '../utils/riskAssessmentUtils';

interface UserData {
  id: string;
  email: string;
  full_name?: string;
  [key: string]: any;
}

export const useRiskAssessmentData = () => {
  const [riskAssessments, setRiskAssessments] = useState<RiskAssessmentData[]>([]);
  const [user, setUser] = useState<UserData | null>(null);
  const [companyName, setCompanyName] = useState<string>('Worker Portal');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Fetch worker details from the workers table using email
        const { data: workerData, error: workerError } = await supabase
          .from('workers')
          .select('*')
          .eq('email', user.email)
          .single();

        if (workerError) throw workerError;
        setUser(workerData);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const fetchRiskAssessments = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get current user's worker ID for filtering signatures
      const { data: { user: authUser } } = await supabase.auth.getUser();
      let currentWorkerId = null;
      
      if (authUser?.email) {
        const { data: workerData } = await supabase
          .from('workers')
          .select('id')
          .eq('email', authUser.email)
          .maybeSingle();
        
        if (workerData) {
          currentWorkerId = workerData.id;
        }
      }

      const { data, error } = await supabase
        .from('risk_assessments')
        .select(`
          *,
          signatures:workers_risk_assessment_signatures(
            signed_at,
            worker_id
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Process the data to get the last signed date for current worker
      const processedData = (data || []).map(assessment => {
        const userSignatures = assessment.signatures?.filter(
          (sig: any) => sig.worker_id === currentWorkerId
        ) || [];
        
        const lastSigned = userSignatures.length > 0 
          ? userSignatures.sort((a: any, b: any) => 
              new Date(b.signed_at).getTime() - new Date(a.signed_at).getTime()
            )[0].signed_at
          : null;

        return {
          ...assessment,
          last_signed: lastSigned
        };
      });
      
      setRiskAssessments(processedData);
    } catch (err) {
      console.error('Error fetching risk assessments:', err);
      setError(err instanceof Error ? err.message : 'Failed to load risk assessments');
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanyName = async () => {
    try {
      const { data, error } = await supabase
        .from('company_settings')
        .select('name')
        .limit(1)
        .single();

      if (error) throw error;
      if (data?.name) {
        setCompanyName(data.name);
      }
    } catch (err) {
      console.error('Error fetching company name:', err);
    }
  };

  useEffect(() => {
    fetchRiskAssessments();
    fetchUserProfile();
    fetchCompanyName();
  }, []);

  return {
    riskAssessments,
    user,
    companyName,
    loading,
    error,
    refetchRiskAssessments: fetchRiskAssessments,
    refetchUserProfile: fetchUserProfile
  };
};