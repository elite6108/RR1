import { useState, useEffect } from 'react';
import { supabase } from '../../../../lib/supabase';
import { Subcontractor } from '../types';

export const useSubcontractors = () => {
  const [subcontractors, setSubcontractors] = useState<Subcontractor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContractors = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('subcontractors').select('*, token');

      if (error) throw error;

      // Fetch reviews for each contractor
      const contractorsWithReviews = await Promise.all(
        data.map(async (contractor: any) => {
          const { data: reviewData, error: reviewError } = await supabase
            .from('contractor_reviews')
            .select('*')
            .eq('contractor_id', contractor.id)
            .order('review_date', { ascending: false })
            .limit(1);

          if (reviewError) {
            console.error('Error fetching review:', reviewError);
            return {
              ...contractor,
              review: null,
            };
          }

          return {
            ...contractor,
            review: reviewData && reviewData.length > 0 ? reviewData[0] : null,
          };
        })
      );

      // Generate signed URLs for all stored files
      const contractorsWithSignedUrls = await Promise.all(
        contractorsWithReviews.map(async (contractor: any) => {
          const contractorWithUrls = { ...contractor };
          
          // Create signed URLs for SWMS files
          if (contractor.swms_url) {
            const path = contractor.swms_url.split('/').pop();
            if (path) {
              const { data } = await supabase.storage
                .from('subcontractor-files')
                .createSignedUrl(path, 60 * 60); // 1 hour expiry
                
              if (data?.signedUrl) {
                contractorWithUrls.swms_url = data.signedUrl;
              }
            }
          }
          
          // Create signed URLs for Health & Safety Policy files
          if (contractor.health_safety_policy_url) {
            const path = contractor.health_safety_policy_url.split('/').pop();
            if (path) {
              const { data } = await supabase.storage
                .from('subcontractor-files')
                .createSignedUrl(path, 60 * 60); // 1 hour expiry
                
              if (data?.signedUrl) {
                contractorWithUrls.health_safety_policy_url = data.signedUrl;
              }
            }
          }
          
          // Create signed URLs for additional files
          if (contractor.additional_files_urls && contractor.additional_files_urls.length > 0) {
            const signedUrls = await Promise.all(
              contractor.additional_files_urls.map(async (url: string) => {
                const path = url.split('/').pop();
                if (path) {
                  const { data } = await supabase.storage
                    .from('subcontractor-files')
                    .createSignedUrl(path, 60 * 60); // 1 hour expiry
                    
                  return data?.signedUrl || url;
                }
                return url;
              })
            );
            
            contractorWithUrls.additional_files_urls = signedUrls;
          }
          
          return contractorWithUrls;
        })
      );

      setSubcontractors(contractorsWithSignedUrls);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching contractors:', err);
      setError('Failed to fetch contractors');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContractors();
  }, []);

  return {
    subcontractors,
    loading,
    error,
    refetch: fetchContractors,
  };
};
