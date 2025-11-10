import { useState, useEffect } from 'react';
import { supabase } from '../../../../lib/supabase';
import { ActionPlanItem } from '../types';

export const useActionPlans = () => {
  const [actionPlans, setActionPlans] = useState<ActionPlanItem[]>([]);

  const fetchActionPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('action_plan')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setActionPlans(data || []);
    } catch (error) {
      console.error('Error fetching action plans:', error);
    }
  };

  const addActionPlan = async (actionPlanData: Partial<ActionPlanItem>): Promise<boolean> => {
    try {
      console.log('Attempting to add action plan:', actionPlanData);
      
      // Validate required fields
      if (!actionPlanData.section || !actionPlanData.item || !actionPlanData.type || !actionPlanData.interval_months) {
        alert('Please fill in all required fields (Section, Item, Type, Interval Months)');
        return false;
      }
      
      const dataToInsert = {
        ...actionPlanData,
        last_done: actionPlanData.last_done || null,
        next_due: actionPlanData.next_due || null,
      };
      
      const { data, error } = await supabase
        .from('action_plan')
        .insert([dataToInsert])
        .select();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Action plan added successfully:', data);
      setActionPlans([...(data || []), ...actionPlans]);
      return true;
    } catch (error) {
      console.error('Error adding action plan:', error);
      alert('Failed to save action plan. Please check the console for details.');
      return false;
    }
  };

  const updateActionPlan = async (id: string, actionPlanData: Partial<ActionPlanItem>): Promise<boolean> => {
    try {
      // Validate required fields
      if (!actionPlanData.section || !actionPlanData.item || !actionPlanData.type || !actionPlanData.interval_months) {
        alert('Please fill in all required fields (Section, Item, Type, Interval Months)');
        return false;
      }
      
      const updateData = {
        ...actionPlanData,
        last_done: actionPlanData.last_done || null,
        next_due: actionPlanData.next_due || null,
      };
      
      const { error } = await supabase
        .from('action_plan')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      setActionPlans(
        actionPlans.map((plan) =>
          plan.id === id ? { ...plan, ...updateData } : plan
        )
      );
      return true;
    } catch (error) {
      console.error('Error updating action plan:', error);
      return false;
    }
  };

  const deleteActionPlan = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('action_plan')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setActionPlans(actionPlans.filter((plan) => plan.id !== id));
      return true;
    } catch (error) {
      console.error('Error deleting action plan:', error);
      return false;
    }
  };

  useEffect(() => {
    fetchActionPlans();
  }, []);

  return {
    actionPlans,
    addActionPlan,
    updateActionPlan,
    deleteActionPlan,
    fetchActionPlans
  };
};
