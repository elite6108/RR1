import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { X, AlertCircle } from 'lucide-react';
import type { Project } from '../../types/database';

interface Customer {
  id: string;
  company_name: string;
  customer_name: string;
}

interface ProjectFormProps {
  onClose: () => void;
  onSuccess: () => void;
  projectToEdit?: Project | null;
}

export function ProjectForm({
  onClose,
  onSuccess,
  projectToEdit,
}: ProjectFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState(projectToEdit?.name || '');
  const [projectManager, setProjectManager] = useState(projectToEdit?.project_manager || '');
  const [customerId, setCustomerId] = useState(projectToEdit?.customer_id || '');
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      const { data, error } = await supabase
        .from('customers')
        .select('id, company_name, customer_name')
        .order('company_name');
      
      if (error) {
        console.error('Error fetching customers:', error);
        return;
      }
      
      setCustomers(data || []);
    };

    fetchCustomers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      let error;
      if (projectToEdit) {
        // Update existing project
        ({ error } = await supabase
          .from('projects')
          .update({ name, project_manager: projectManager, customer_id: customerId })
          .eq('id', projectToEdit.id));
      } else {
        // Create new project
        ({ error } = await supabase
          .from('projects')
          .insert([{ name, project_manager: projectManager, customer_id: customerId, user_id: user.id }]));
      }

      if (error) throw error;

      onSuccess();
      onClose();
    } catch (err) {
      console.error('Error saving project:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 dark:bg-gray-900 dark:bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 max-w-md w-full m-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {projectToEdit ? 'Edit Project' : 'New Project'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 focus:outline-none"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Project Name
            </label>
            <input
              type="text"
              id="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400"
              placeholder="Enter project name"
            />
          </div>

          <div className="mt-4">
            <label
              htmlFor="projectManager"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Project Manager
            </label>
            <input
              type="text"
              id="projectManager"
              value={projectManager}
              onChange={(e) => setProjectManager(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400"
              placeholder="Enter project manager name"
            />
          </div>

          <div className="mt-4">
            <label
              htmlFor="customerId"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Customer
            </label>
            <select
              id="customerId"
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400"
            >
              <option value="">Select a customer</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.company_name} ({customer.customer_name})
                </option>
              ))}
            </select>
          </div>

          {error && (
            <div className="mt-4 flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-4 rounded-md">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <div className="mt-6 flex flex-col sm:flex-row justify-between space-y-3 sm:space-y-0">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:text-gray-200 dark:bg-gray-700 dark:hover:bg-red-600 dark:hover:text-white"
            >
              Cancel
            </button>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading
                  ? 'Saving...'
                  : projectToEdit
                  ? 'Save Changes'
                  : 'Create Project'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
