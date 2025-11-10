import { useState, useEffect } from 'react';
import { supabase } from '../../../../lib/supabase';
import { Worker } from '../types';
import { getSignedImageUrl } from '../utils';

export const useWorkers = () => {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWorkers = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('workers')
        .select(`
          *,
          workers_safety_handbook (
            *
          ),
          workers_annual_training (
            *
          ),
          workers_risk_assessment_signatures (
            *,
            risk_assessments (
              ra_id,
              name
            )
          ),
          workers_policy_signatures (
            *
          )
        `)
        .order('full_name');

      if (error) throw error;

      if (data && data.length > 0) {
        const workersWithUrls = await Promise.all(
          data.map(async (worker: any) => {
            if (worker.photo_filename) {
              try {
                const signedUrl = await getSignedImageUrl(worker.photo_filename);
                return { ...worker, photo_url: signedUrl };
              } catch (err) {
                console.error('Error getting signed URL for worker:', worker.full_name, err);
                return { ...worker, photo_url: null };
              }
            }
            return worker;
          })
        );
        
        setWorkers(workersWithUrls || []);
      } else {
        setWorkers([]);
      }
    } catch (err) {
      console.error('Error fetching workers:', err);
      setError('Failed to load workers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const deleteWorker = async (workerId: string) => {
    try {
      setLoading(true);

      // First, get the worker data for photo cleanup
      const { data: workerData } = await supabase
        .from('workers')
        .select('photo_filename')
        .eq('id', workerId)
        .single();

      // Delete related records from worker_site_access table first
      const { error: siteAccessError } = await supabase
        .from('worker_site_access')
        .delete()
        .eq('worker_id', workerId);

      if (siteAccessError) {
        console.error('Error deleting worker site access:', siteAccessError);
        // Continue with worker deletion even if site access deletion fails
      }
      
      // Now delete the worker
      const { error } = await supabase
        .from('workers')
        .delete()
        .eq('id', workerId);

      if (error) throw error;
      
      // Clean up the photo from storage if it exists
      if (workerData?.photo_filename) {
        const { error: storageError } = await supabase.storage
          .from('workers')
          .remove([workerData.photo_filename]);
          
        if (storageError) {
          console.error('Error deleting worker photo:', storageError);
        }
      }

      await fetchWorkers();
    } catch (err) {
      console.error('Error deleting worker:', err);
      setError('Failed to delete worker. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkers();
  }, []);

  return {
    workers,
    loading,
    error,
    fetchWorkers,
    deleteWorker,
    setError
  };
};
