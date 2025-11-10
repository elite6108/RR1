import React, { useEffect, useState } from 'react';
import { supabase } from '../../../../../lib/supabase';
import type { RAMSFormData } from '../../../../../types/rams';

interface Customer {
  id: string;
  company_name: string | null;
  customer_name: string;
}

interface Project {
  id: string;
  name: string;
  customer_id: string;
}

interface ProjectInformationProps {
  data: RAMSFormData;
  onChange: (data: Partial<RAMSFormData>) => void;
}

export function ProjectInformation({ data, onChange }: ProjectInformationProps) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (field: keyof RAMSFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    onChange({ [field]: e.target.value });
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) throw error;
        if (user?.user_metadata?.display_name) {
          onChange({ assessor: user.user_metadata.display_name });
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
      }
    };

    const fetchCustomers = async () => {
      setLoading(true);
      try {
        const { data: customersData, error } = await supabase
          .from('customers')
          .select('id, company_name, customer_name')
          .order('customer_name');

        if (error) throw error;
        setCustomers(customersData || []);
      } catch (err) {
        console.error('Error fetching customers:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
    fetchCustomers();
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      if (!data.client_id) {
        setProjects([]);
        return;
      }

      setLoading(true);
      try {
        const { data: projectsData, error } = await supabase
          .from('projects')
          .select('id, name, customer_id')
          .eq('customer_id', data.client_id)
          .order('name');

        if (error) throw error;
        setProjects(projectsData || []);
      } catch (err) {
        console.error('Error fetching projects:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [data.client_id]);

  // Handle customer selection
  const handleCustomerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const customerId = e.target.value;
    const selectedCustomer = customers.find(c => c.id === customerId);
    
    // Update both client_id for internal reference and client_name for display
    onChange({ 
      client_id: customerId,
      client_name: selectedCustomer ? 
        (selectedCustomer.company_name ? 
          `${selectedCustomer.company_name} (${selectedCustomer.customer_name})` : 
          selectedCustomer.customer_name) : '',
      project_id: '', // Reset project when customer changes
    });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Project Information</h3>
      
      <div>
        <label htmlFor="reference" className="block text-sm font-medium text-gray-700 mb-2">
          Reference *
        </label>
        <input
          type="text"
          id="reference"
          value={data.reference}
          onChange={handleChange('reference')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="client_id" className="block text-sm font-medium text-gray-700 mb-2">
          Client *
        </label>
        <select
          id="client_id"
          value={data.client_id || ''}
          onChange={handleCustomerChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="">Select a client</option>
          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.company_name ? `${customer.company_name} (${customer.customer_name})` : customer.customer_name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="project_id" className="block text-sm font-medium text-gray-700 mb-2">
          Project <span className="text-gray-400 text-xs">(optional)</span>
        </label>
        <select
          id="project_id"
          value={data.project_id || ''}
          onChange={handleChange('project_id')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          disabled={!data.client_id}
        >
          <option value="">Select a project</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="site_manager" className="block text-sm font-medium text-gray-700 mb-2">
          Site Manager *
        </label>
        <input
          type="text"
          id="site_manager"
          value={data.site_manager}
          onChange={handleChange('site_manager')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="assessor" className="block text-sm font-medium text-gray-700 mb-2">
          Assessor *
        </label>
        <input
          type="text"
          id="assessor"
          value={data.assessor}
          disabled
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-500"
          placeholder="Loading assessor name..."
        />
      </div>

      <div>
        <label htmlFor="approved_by" className="block text-sm font-medium text-gray-700 mb-2">
          Approved By *
        </label>
        <input
          type="text"
          id="approved_by"
          value={data.approved_by}
          disabled
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-500"
        />
      </div>
    </div>
  );
}