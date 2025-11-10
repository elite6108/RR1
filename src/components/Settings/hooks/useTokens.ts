import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { generateToken } from '../utils/constants';
import type { Token } from '../types';

export function useTokens(isAuthenticated: boolean) {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTokens = async () => {
    try {
      const { data, error } = await supabase
        .from('tokens')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTokens(data || []);
    } catch (error) {
      console.error('Error fetching tokens:', error);
    }
  };

  const handleGenerateToken = async (domainName: string) => {
    try {
      setLoading(true);
      const newToken = generateToken();

      const { data: existingTokens } = await supabase
        .from('tokens')
        .select('id')
        .eq('domain_name', domainName);

      if (existingTokens && existingTokens.length > 0) {
        const { error } = await supabase
          .from('tokens')
          .update({
            token: newToken,
            updated_at: new Date().toISOString()
          })
          .eq('domain_name', domainName);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('tokens')
          .insert([{
            domain_name: domainName,
            token: newToken
          }]);

        if (error) throw error;
      }

      await fetchTokens();
    } catch (error) {
      console.error('Error generating token:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchTokens();
    }
  }, [isAuthenticated]);

  return {
    tokens,
    loading,
    handleGenerateToken,
    refetchTokens: fetchTokens
  };
}