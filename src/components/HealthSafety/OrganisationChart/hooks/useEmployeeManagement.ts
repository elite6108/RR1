import { useState } from 'react';
import { Employee } from '../types';
import { supabase } from '../../../../lib/supabase';
import { findEmployee } from '../utils/employeeUtils';

export const useEmployeeManagement = (
  orgData: Employee,
  setOrgData: (data: Employee) => void,
  setLoading: (loading: boolean) => void,
  setError: (error: string | null) => void,
  setSuccessMessage: (message: string | null) => void,
  fetchOrgChart: () => Promise<void>
) => {
  const [pendingChanges, setPendingChanges] = useState<Map<string, { name: string; title: string }>>(new Map());

  const addEmployee = async (parentId: string, name: string, position: string, isDirector: boolean) => {
    // Validate that both name and position are not empty or just whitespace
    if (!name.trim() || !position.trim()) {
      setError('Please enter both a name and position');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Get the current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error('User not authenticated');

      // For root level (parentId === orgData.id), set parent_id to null
      const actualParentId = isDirector ? null : parentId;

      // Insert new employee
      const { data: newEmployee, error: insertError } = await supabase
        .from('organization_chart')
        .insert({
          name: name.trim(),
          title: position.trim(),
          parent_id: actualParentId,
          user_id: user.id
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // Update local state
      const updateTree = (employee: Employee): Employee => {
        if (employee.id === parentId) {
          return {
            ...employee,
            children: [...employee.children, {
              ...newEmployee,
              children: [],
              reportsTo: actualParentId ? [parentId] : [],
              user_id: user.id
            }],
          };
        }

        return {
          ...employee,
          children: employee.children.map(updateTree),
        };
      };

      setOrgData(updateTree(orgData));
      
      // Show success message
      setSuccessMessage(isDirector ? "Director added successfully" : "Employee added successfully");
      setTimeout(() => setSuccessMessage(null), 3000);
      
    } catch (err) {
      console.error('Error adding employee:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while adding the employee');
    } finally {
      setLoading(false);
    }
  };

  const removeEmployee = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      // Get the current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error('User not authenticated');

      // Check if employee exists and has valid data
      const employee = findEmployee(id, orgData);
      if (!employee) {
        setError('Employee not found');
        return;
      }

      // Check if employee has subordinates
      if (employee.children.length > 0) {
        setError('Please remove all employees under this position before deleting it.');
        return;
      }

      // Get the employee's database record to check if they're a director
      const { data: employeeRecord, error: employeeError } = await supabase
        .from('organization_chart')
        .select('parent_id')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (employeeError) throw employeeError;

      // Check if this is a director (has null parent_id) and if it's the last one
      const isDirector = employeeRecord?.parent_id === null;
      
      if (isDirector) {
        const { data: directors, error: directorsError } = await supabase
          .from('organization_chart')
          .select('id')
          .eq('user_id', user.id)
          .is('parent_id', null)
          .neq('id', orgData.id); // Exclude the root node

        if (directorsError) throw directorsError;

        if (directors && directors.length <= 1) {
          setError('Cannot remove the last director. Organizations must have at least one director.');
          return;
        }
      }

      // First, delete all reporting lines where this employee is involved
      const { error: reportingError } = await supabase
        .from('reporting_lines')
        .delete()
        .or(`employee_id.eq.${id},manager_id.eq.${id}`)
        .eq('user_id', user.id);

      if (reportingError) throw reportingError;

      // Then delete the employee from database
      const { error: deleteError } = await supabase
        .from('organization_chart')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (deleteError) throw deleteError;

      // Update local state
      const updateTree = (employee: Employee): Employee => {
        return {
          ...employee,
          children: employee.children
            .filter(child => child.id !== id)
            .map(updateTree),
        };
      };

      setOrgData(updateTree(orgData));
      
      // Clear any pending changes for this employee
      const newPendingChanges = new Map(pendingChanges);
      newPendingChanges.delete(id);
      setPendingChanges(newPendingChanges);

      // Refresh the chart to ensure all relationships are updated
      await fetchOrgChart();
      
    } catch (err) {
      console.error('Error removing employee:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while removing the employee');
    } finally {
      setLoading(false);
    }
  };

  const handleEditChange = (id: string, name: string, title: string) => {
    // Don't proceed if values are empty
    if (!name || !title) return;

    // Update pending changes
    const newPendingChanges = new Map(pendingChanges);
    newPendingChanges.set(id, { name, title });
    setPendingChanges(newPendingChanges);

    // Update local state immediately for instant feedback
    const updateEmployeeInTree = (employee: Employee): Employee => {
      if (employee.id === id) {
        return {
          ...employee,
          name,
          title,
          children: employee.children,
          reportsTo: employee.reportsTo,
          user_id: employee.user_id
        };
      }
      return {
        ...employee,
        children: employee.children.map(updateEmployeeInTree)
      };
    };

    setOrgData(updateEmployeeInTree(orgData));
  };

  const saveAllChanges = async () => {
    if (pendingChanges.size === 0) {
      setSuccessMessage("No changes to save");
      setTimeout(() => setSuccessMessage(null), 3000);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Get the current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error('User not authenticated');

      // Save all pending changes
      for (const [id, changes] of pendingChanges) {
        const { error: updateError } = await supabase
          .from('organization_chart')
          .update({
            name: changes.name,
            title: changes.title,
          })
          .eq('id', id)
          .eq('user_id', user.id);

        if (updateError) throw updateError;
      }

      // Clear pending changes after successful save
      setPendingChanges(new Map());
      
      // Show success message
      setSuccessMessage("Changes saved successfully");
      setTimeout(() => setSuccessMessage(null), 3000);
      
      // Refresh data to ensure everything is in sync
      await fetchOrgChart();
    } catch (err) {
      console.error('Error saving changes:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while saving changes');
    } finally {
      setLoading(false);
    }
  };

  return {
    pendingChanges,
    setPendingChanges,
    addEmployee,
    removeEmployee,
    handleEditChange,
    saveAllChanges
  };
};
