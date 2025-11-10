import { useState } from 'react';
import { Employee } from '../types';
import { supabase } from '../../../../lib/supabase';
import { findEmployee, findAllReportsTo } from '../utils/employeeUtils';

export const useReportingLines = (
  orgData: Employee,
  setOrgData: (data: Employee) => void,
  setLoading: (loading: boolean) => void,
  setError: (error: string | null) => void,
  fetchOrgChart: () => Promise<void>
) => {
  const [linkingMode, setLinkingMode] = useState(false);
  const [linkingFromId, setLinkingFromId] = useState<string | null>(null);

  const addReportingLine = async (managerId: string, employeeId: string) => {
    try {
      setLoading(true);
      setError(null);

      // Get the current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error('User not authenticated');

      // Don't allow linking to root node
      if (managerId === orgData.id) {
        setError('Cannot create reporting line to Board of Directors');
        setLinkingMode(false);
        setLinkingFromId(null);
        return;
      }

      // Check if reporting line already exists
      const { data: existingLines, error: checkError } = await supabase
        .from('reporting_lines')
        .select('*')
        .eq('employee_id', employeeId)
        .eq('manager_id', managerId)
        .eq('user_id', user.id);

      if (checkError) throw checkError;

      // If reporting line already exists, just return
      if (existingLines && existingLines.length > 0) {
        setLinkingMode(false);
        setLinkingFromId(null);
        return;
      }

      // Check if this would create a circular reference
      const managerReportsTo = findAllReportsTo(managerId, orgData);
      if (managerReportsTo.has(employeeId)) {
        setError('Cannot create circular reporting relationships');
        setLinkingMode(false);
        setLinkingFromId(null);
        return;
      }

      // Insert reporting line
      const { error: insertError } = await supabase
        .from('reporting_lines')
        .insert({
          employee_id: employeeId,
          manager_id: managerId,
          user_id: user.id
        });

      if (insertError) throw insertError;

      // Refresh chart data instead of page reload
      await fetchOrgChart();
      setLinkingMode(false);
      setLinkingFromId(null);

    } catch (err) {
      console.error('Error adding reporting line:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while adding the reporting line');
    } finally {
      setLoading(false);
    }
  };

  const removeReportingLine = async (managerId: string, employeeId: string) => {
    try {
      setLoading(true);
      setError(null);

      // Get the current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error('User not authenticated');

      // Delete reporting line
      const { error: deleteError } = await supabase
        .from('reporting_lines')
        .delete()
        .eq('employee_id', employeeId)
        .eq('manager_id', managerId)
        .eq('user_id', user.id);

      if (deleteError) throw deleteError;

      // Update local state
      const updateTree = (employee: Employee): Employee => {
        if (employee.id === employeeId) {
          const newReportsTo = employee.reportsTo.filter(id => id !== managerId);
          const primaryManagerChanged = employee.reportsTo[0] === managerId;
          
          if (primaryManagerChanged && newReportsTo.length > 0) {
            const newPrimaryManager = findEmployee(newReportsTo[0], orgData);
            if (newPrimaryManager) {
              moveEmployeeToManager(employee.id, newPrimaryManager.id);
            }
          }

          return {
            ...employee,
            reportsTo: newReportsTo,
          };
        }

        return {
          ...employee,
          children: employee.children.map(updateTree),
        };
      };

      setOrgData(updateTree(orgData));

      // Refresh chart data instead of page reload
      await fetchOrgChart();

    } catch (err) {
      console.error('Error removing reporting line:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while removing the reporting line');
    } finally {
      setLoading(false);
    }
  };

  const moveEmployeeToManager = async (employeeId: string, newManagerId: string) => {
    try {
      setLoading(true);
      setError(null);

      // Get the current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error('User not authenticated');

      // Update employee's parent in database
      const { error: updateError } = await supabase
        .from('organization_chart')
        .update({ parent_id: newManagerId })
        .eq('id', employeeId)
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      // Update local state
      let employeeToMove: Employee | null = null;

      const removeFromOldParent = (employee: Employee): Employee => {
        return {
          ...employee,
          children: employee.children
            .filter(child => {
              if (child.id === employeeId) {
                employeeToMove = child;
                return false;
              }
              return true;
            })
            .map(removeFromOldParent),
        };
      };

      const addToNewParent = (employee: Employee): Employee => {
        if (employee.id === newManagerId && employeeToMove) {
          return {
            ...employee,
            children: [...employee.children, employeeToMove],
          };
        }
        return {
          ...employee,
          children: employee.children.map(addToNewParent),
        };
      };

      const updatedOrg = addToNewParent(removeFromOldParent(orgData));
      setOrgData(updatedOrg);
    } catch (err) {
      console.error('Error moving employee:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while moving the employee');
    } finally {
      setLoading(false);
    }
  };

  return {
    linkingMode,
    setLinkingMode,
    linkingFromId,
    setLinkingFromId,
    addReportingLine,
    removeReportingLine,
    moveEmployeeToManager
  };
};
