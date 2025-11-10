import { useState, useEffect } from 'react';
import { supabase } from '../../../../lib/supabase';
import { WorkerUser, SiteCheckIn } from '../types/workerDashboardTypes';

export const useWorkerDashboardData = () => {
  const [user, setUser] = useState<WorkerUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [siteCheckIns, setSiteCheckIns] = useState<SiteCheckIn[]>([]);
  const [dataError, setDataError] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState<string>('Worker Portal');

  // Signature status states
  const [handbookSignedDate, setHandbookSignedDate] = useState<string | null>(null);
  const [annualTrainingSignedDate, setAnnualTrainingSignedDate] = useState<string | null>(null);
  
  // Policy and Risk Assessment counts
  const [policyCounts, setPolicyCounts] = useState<{signed: number, unsigned: number}>({signed: 0, unsigned: 0});
  const [riskAssessmentCounts, setRiskAssessmentCounts] = useState<{signed: number, unsigned: number}>({signed: 0, unsigned: 0});

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (authUser) {
        // Fetch worker details from the workers table using email
        const { data: workerData, error: workerError } = await supabase
          .from('workers')
          .select('*')
          .eq('email', authUser.email)
          .single();

        if (workerError) throw workerError;
        setUser(workerData);

        // Fetch signature statuses for this worker
        await fetchSignatureStatuses(authUser.email || '');
        // Fetch policy and risk assessment counts
        await fetchPolicyAndRiskAssessmentCounts(authUser.email || '');
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setDataError('Failed to load user profile');
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

  const fetchSignatureStatuses = async (userEmail: string) => {
    try {
      // Get the worker's ID from the workers table using the email
      const { data: workerData, error: workerError } = await supabase
        .from('workers')
        .select('id')
        .eq('email', userEmail)
        .single();

      if (workerError || !workerData) {
        console.error('Error fetching worker data for signatures:', workerError);
        return;
      }

      // Fetch handbook signature status
      const { data: handbookData, error: handbookError } = await supabase
        .from('workers_safety_handbook')
        .select('signed_at')
        .eq('worker_id', workerData.id)
        .order('signed_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!handbookError && handbookData?.signed_at) {
        setHandbookSignedDate(handbookData.signed_at);
      } else {
        setHandbookSignedDate(null);
      }

      // Fetch annual training signature status
      const { data: trainingData, error: trainingError } = await supabase
        .from('workers_annual_training')
        .select('signed_at')
        .eq('worker_id', workerData.id)
        .order('signed_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!trainingError && trainingData?.signed_at) {
        setAnnualTrainingSignedDate(trainingData.signed_at);
      } else {
        setAnnualTrainingSignedDate(null);
      }
    } catch (error) {
      console.error('Error fetching signature statuses:', error);
    }
  };

  const fetchPolicyAndRiskAssessmentCounts = async (userEmail: string) => {
    try {
      // Get the worker's ID from the workers table using the email
      const { data: workerData, error: workerError } = await supabase
        .from('workers')
        .select('id')
        .eq('email', userEmail)
        .single();

      if (workerError || !workerData) {
        console.error('Error fetching worker data for counts:', workerError);
        return;
      }

      // Fetch policy counts
      const [otherPoliciesResult, hsPoliciesResult, policySignaturesResult] = await Promise.all([
        supabase.from('other_policy_files').select('id'),
        supabase.from('hs_policy_files').select('id'),
        supabase
          .from('workers_policy_signatures')
          .select('other_policy_file_id, hs_policy_file_id')
          .eq('worker_id', workerData.id)
      ]);

      if (!otherPoliciesResult.error && !hsPoliciesResult.error && !policySignaturesResult.error) {
        const totalPolicies = (otherPoliciesResult.data?.length || 0) + (hsPoliciesResult.data?.length || 0);
        const signedPolicies = policySignaturesResult.data?.length || 0;
        const unsignedPolicies = totalPolicies - signedPolicies;
        
        setPolicyCounts({
          signed: signedPolicies,
          unsigned: unsignedPolicies
        });
      }

      // Fetch risk assessment counts
      const [riskAssessmentsResult, raSignaturesResult] = await Promise.all([
        supabase.from('risk_assessments').select('id'),
        supabase
          .from('workers_risk_assessment_signatures')
          .select('risk_assessment_id')
          .eq('worker_id', workerData.id)
      ]);

      if (!riskAssessmentsResult.error && !raSignaturesResult.error) {
        const totalRiskAssessments = riskAssessmentsResult.data?.length || 0;
        const signedRiskAssessments = raSignaturesResult.data?.length || 0;
        const unsignedRiskAssessments = totalRiskAssessments - signedRiskAssessments;
        
        setRiskAssessmentCounts({
          signed: signedRiskAssessments,
          unsigned: unsignedRiskAssessments
        });
      }
    } catch (error) {
      console.error('Error fetching policy and risk assessment counts:', error);
    }
  };

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('darkMode', String(newMode));
    
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    fetchUserProfile();
    fetchCompanyName();

    // Check for saved dark mode preference
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    }

    return () => clearInterval(timer);
  }, []);

  return {
    user,
    loading,
    currentTime,
    isDarkMode,
    siteCheckIns,
    setSiteCheckIns,
    dataError,
    setDataError,
    companyName,
    handbookSignedDate,
    annualTrainingSignedDate,
    policyCounts,
    riskAssessmentCounts,
    fetchUserProfile,
    fetchCompanyName,
    fetchSignatureStatuses,
    fetchPolicyAndRiskAssessmentCounts,
    toggleDarkMode
  };
};