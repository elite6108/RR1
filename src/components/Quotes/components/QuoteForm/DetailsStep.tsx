import React from 'react';
import { FormField, TextInput, Select, DateInput } from '../../../../utils/form';
import type { Project, Customer } from '../../types';

interface DetailsStepProps {
  createdByName: string;
  formData: {
    project_id: string;
    customer_id: string;
    project_location: string;
    status: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  projects: Project[];
  customers: Customer[];
  disableProjectSelection?: boolean;
}

export const DetailsStep = ({
  createdByName,
  formData,
  setFormData,
  projects,
  customers,
  disableProjectSelection = false
}) => {
  const projectOptions = [
    { value: '', label: 'Select a project' },
    ...projects.map(project => ({ value: project.id, label: project.name }))
  ];

  const statusOptions = [
    { value: 'new', label: 'New' },
    { value: 'accepted', label: 'Accepted' },
    { value: 'rejected', label: 'Rejected' }
  ];

  const customerOptions = [
    { value: '', label: 'Select a customer' },
    ...customers.map(customer => ({
      value: customer.id,
      label: customer.company_name ? `${customer.company_name} (${customer.customer_name})` : customer.customer_name
    }))
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FormField label="Created By" required>
          <TextInput
            value={createdByName}
            onChange={() => {}}
            disabled
            className="bg-gray-50 text-gray-500"
          />
        </FormField>

        <FormField label="Quote Date" required>
          <TextInput
            value={new Date().toISOString().split('T')[0]}
            onChange={() => {}}
            disabled
            className="bg-gray-50 text-gray-500"
          />
        </FormField>

        <FormField
          label="Project"
          required
          description={disableProjectSelection ? "Project is preselected and cannot be changed." : undefined}
        >
          <Select
            value={formData.project_id}
            onChange={(e) => setFormData(prev => ({ ...prev, project_id: e.target.value }))}
            options={projectOptions}
            disabled={disableProjectSelection}
            className={disableProjectSelection ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''}
          />
        </FormField>

        <FormField label="Status" required>
          <Select
            value={formData.status}
            onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
            options={statusOptions}
          />
        </FormField>

        <FormField label="Customer" required>
          <Select
            value={formData.customer_id}
            onChange={(e) => setFormData(prev => ({ ...prev, customer_id: e.target.value }))}
            options={customerOptions}
          />
        </FormField>

        <FormField label="Project Location" required>
          <TextInput
            value={formData.project_location}
            onChange={(e) => setFormData(prev => ({ ...prev, project_location: e.target.value }))}
            placeholder="Enter project location"
          />
        </FormField>
      </div>
    </div>
  );
};
