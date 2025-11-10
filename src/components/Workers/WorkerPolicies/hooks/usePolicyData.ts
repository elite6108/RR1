import { useState, useEffect } from 'react';
import { supabase } from '../../../../lib/supabase';

interface PolicyData {
  id: string;
  name: string;
  source: 'other_policy_files' | 'hs_policy_files';
  created_at: string;
  last_signed: string | null;
  display_name?: string;
  file_name?: string;
  type?: string;
  content?: string;
  policy_number?: number;
  description?: string;
}

interface UserData {
  id: string;
  email: string;
  full_name?: string;
  [key: string]: any;
}

export const usePolicyData = () => {
  const [policies, setPolicies] = useState<PolicyData[]>([]);
  const [user, setUser] = useState<UserData | null>(null);
  const [companyName, setCompanyName] = useState<string>('Worker Portal');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setError('User not authenticated');
        return;
      }

      let userData = { ...user };

      // Fetch worker details
      const { data: workerData, error: workerError } = await supabase
        .from('workers')
        .select('*')
        .eq('email', user.email)
        .maybeSingle();

      if (!workerError && workerData) {
        userData = { ...userData, ...workerData };
      }

      // Use full_name from worker data or fallback to email
      if (!userData.full_name) {
        userData.full_name = user.email || 'Unknown User';
      }

      setUser(userData);
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setError('Failed to load user profile');
    }
  };

  const fetchPolicies = async () => {
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

      // Fetch from policy tables (matching the admin components approach)
      const [otherPoliciesResult, hsPoliciesResult, signaturesResult] = await Promise.all([
        // Fetch other_policy_files (matching OtherPolicies.tsx approach)
        supabase
          .from('other_policy_files')
          .select('*, policy_number')
          .order('created_at', { ascending: false }),
        // Fetch hs_policy_files (matching HSPolicy.tsx approach)
        supabase
          .from('hs_policy_files')
          .select('*')
          .order('created_at', { ascending: false }),
        // Fetch all signatures for the current worker
        currentWorkerId ? supabase
          .from('workers_policy_signatures')
          .select('*')
          .eq('worker_id', currentWorkerId) : Promise.resolve({ data: [], error: null })
      ]);

      // Check for errors
      if (otherPoliciesResult.error) throw otherPoliciesResult.error;
      if (hsPoliciesResult.error) throw hsPoliciesResult.error;
      if (signaturesResult.error) throw signaturesResult.error;

      // Combine all policies and add signature status
      const allPolicies = [
        ...(otherPoliciesResult.data || []).map(policy => ({ 
          ...policy, 
          source: 'other_policy_files' as const,
          name: policy.display_name || policy.file_name || 'Unknown Policy'
        })),
        ...(hsPoliciesResult.data || []).map(policy => ({ 
          ...policy, 
          source: 'hs_policy_files' as const,
          name: policy.display_name || policy.file_name || 'Unknown Policy'
        }))
      ];

      // Create a map of signatures by policy ID and source
      const signaturesMap = new Map();
      (signaturesResult.data || []).forEach((sig: any) => {
        if (sig.other_policy_file_id) {
          signaturesMap.set(`other_policy_files-${sig.other_policy_file_id}`, sig);
        }
        if (sig.hs_policy_file_id) {
          signaturesMap.set(`hs_policy_files-${sig.hs_policy_file_id}`, sig);
        }
      });

      // Process the data to get the last signed date for current worker
      const processedData = allPolicies.map(policy => {
        const signatureKey = `${policy.source}-${policy.id}`;
        const signature = signaturesMap.get(signatureKey);
        
        return {
          ...policy,
          last_signed: signature?.signed_at || null
        };
      });

      // Sort by created_at descending
      processedData.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      
      setPolicies(processedData);
    } catch (err) {
      console.error('Error fetching policies:', err);
      setError(err instanceof Error ? err.message : 'Failed to load policies');
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
    fetchPolicies();
    fetchUserProfile();
    fetchCompanyName();
  }, []);

  return {
    policies,
    user,
    companyName,
    loading,
    error,
    refetchPolicies: fetchPolicies,
    refetchUserProfile: fetchUserProfile
  };
};