import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import type { Domain } from '../types';

export function useDomains(isAuthenticated: boolean) {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [newDomain, setNewDomain] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchDomains = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('domains')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDomains(data || []);
    } catch (error) {
      console.error('Error fetching domains:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDomain = async () => {
    if (!newDomain) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('domains')
        .insert([{ domain_name: newDomain }])
        .select();

      if (error) throw error;

      if (data) {
        setDomains([...data, ...domains]);
        setNewDomain('');
      }
    } catch (error) {
      console.error('Error adding domain:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDomain = async (domainName: string) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('domains')
        .delete()
        .eq('domain_name', domainName);

      if (error) throw error;

      setDomains(domains.filter((d) => d.domain_name !== domainName));
    } catch (error) {
      console.error('Error deleting domain:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchDomains();
    }
  }, [isAuthenticated]);

  return {
    domains,
    newDomain,
    setNewDomain,
    loading,
    handleAddDomain,
    handleDeleteDomain,
    refetchDomains: fetchDomains
  };
}