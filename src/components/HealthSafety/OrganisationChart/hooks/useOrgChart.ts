import { useState, useEffect } from 'react';
import { Employee } from '../types';
import { supabase } from '../../../../lib/supabase';
import { buildOrgChart } from '../utils/employeeUtils';

export const useOrgChart = () => {
  const [orgData, setOrgData] = useState<Employee>({
    id: crypto.randomUUID(),
    name: '',  // Empty name since this is just a container
    title: '', // Empty title since this is just a container
    children: [],
    reportsTo: [],
    user_id: '',
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const clearAndInitialize = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get the current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error('User not authenticated');

      // Delete all existing organization chart entries for this user
      const { error: deleteError } = await supabase
        .from('organization_chart')
        .delete()
        .eq('user_id', user.id);

      if (deleteError) throw deleteError;

      // Delete all reporting lines
      const { error: deleteReportingError } = await supabase
        .from('reporting_lines')
        .delete()
        .eq('user_id', user.id);

      if (deleteReportingError) throw deleteReportingError;

      // Create new root node
      const { data: newRoot, error: insertError } = await supabase
        .from('organization_chart')
        .insert({
          name: '',
          title: '',
          parent_id: null,
          user_id: user.id
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // Set initial state with empty root
      setOrgData({
        id: newRoot.id,
        name: '',
        title: '',
        children: [],
        reportsTo: [],
        user_id: user.id
      });
      
      // Show success message
      setSuccessMessage("Chart cleared successfully");
      setTimeout(() => setSuccessMessage(null), 3000);

    } catch (err) {
      console.error('Error clearing organization chart:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while clearing the organization chart');
    } finally {
      setLoading(false);
    }
  };

  const fetchOrgChart = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get the current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error('User not authenticated');

      // Fetch organization chart data
      const { data: orgData, error: orgError } = await supabase
        .from('organization_chart')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (orgError) throw orgError;

      // Debug: Log the fetched data
      console.log('Fetched orgData:', orgData);

      // Fetch reporting lines
      const { data: reportingLines, error: reportingError } = await supabase
        .from('reporting_lines')
        .select('*')
        .eq('user_id', user.id);

      if (reportingError) throw reportingError;

      console.log('Fetched reportingLines:', reportingLines);

      // Find the root node (has parent_id === null and empty name/title)
      const rootNode = orgData?.find((emp: any) => emp.parent_id === null && emp.name === '' && emp.title === '');
      console.log('Root node:', rootNode);
      
      if (rootNode) {
        // Get all directors (have parent_id === null but with actual names/titles)
        const directors = orgData?.filter((emp: any) => emp.parent_id === null && emp.name !== '' && emp.title !== '') || [];
        console.log('Directors:', directors);
        
        // Build the tree structure for each director
        const directorsWithChildren = directors.map((director: any) => ({
          ...director,
          children: buildOrgChart(orgData || [], reportingLines || [], director.id),
          reportsTo: reportingLines
            ?.filter((rl: any) => rl.employee_id === director.id)
            .map((rl: any) => rl.manager_id) || [],
        }));

        console.log('Directors with children:', directorsWithChildren);

        setOrgData({
          id: rootNode.id,
          name: '',
          title: '',
          children: directorsWithChildren,
          reportsTo: [],
          user_id: user.id
        });
      } else {
        console.log('No root node found, checking if we have any directors without a root');
        // Check if we have directors but no root node
        const directorsWithoutRoot = orgData?.filter((emp: any) => emp.parent_id === null && emp.name !== '' && emp.title !== '') || [];
        
        if (directorsWithoutRoot.length > 0) {
          console.log('Found directors without root node:', directorsWithoutRoot);
          // Create a temporary root and use existing directors
          const tempRootId = crypto.randomUUID();
          const directorsWithChildren = directorsWithoutRoot.map((director: any) => ({
            ...director,
            children: buildOrgChart(orgData || [], reportingLines || [], director.id),
            reportsTo: reportingLines
              ?.filter((rl: any) => rl.employee_id === director.id)
              .map((rl: any) => rl.manager_id) || [],
          }));

          setOrgData({
            id: tempRootId,
            name: '',
            title: '',
            children: directorsWithChildren,
            reportsTo: [],
            user_id: user.id,
          });
        } else {
          console.log('No data found, creating empty state');
          // If no root node exists, create the initial empty state
          setOrgData({
            id: crypto.randomUUID(),
            name: '',
            title: '',
            children: [],
            reportsTo: [],
            user_id: user.id,
          });
        }
      }
    } catch (err) {
      console.error('Error fetching organization chart:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while fetching the organization chart');
    } finally {
      setLoading(false);
    }
  };

  const reloadChart = async () => {
    try {
      // Clear the current state first
      setOrgData({
        id: crypto.randomUUID(),
        name: '',
        title: '',
        children: [],
        reportsTo: [],
        user_id: '',
      });
      
      // Wait for a tick to ensure state is cleared
      await new Promise(resolve => setTimeout(resolve, 0));
      
      // Then fetch new data
      await fetchOrgChart();
    } catch (err) {
      console.error('Error reloading chart:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while reloading the chart');
    }
  };

  useEffect(() => {
    fetchOrgChart();
  }, []);

  return {
    orgData,
    setOrgData,
    loading,
    setLoading,
    error,
    setError,
    successMessage,
    setSuccessMessage,
    clearAndInitialize,
    fetchOrgChart,
    reloadChart
  };
};
