import React from 'react';
import { FormField, TextInput, Select } from '../../../../../utils/form';
import type { FormStepProps } from '../../types';

export function Step1Details({
  formData,
  projects = [],
  suppliers = [],
  loading = false,
  error,
  createdByName = '',
  companyPrefix = '',
  disableProjectSelection = false,
  handleProjectChange,
  handleSupplierChange,
  handleInputChange,
}: FormStepProps) {
  const projectOptions = [
    { value: '', label: 'Select a project...' },
    ...projects.map(project => ({ value: project.id, label: project.name }))
  ];

  const supplierOptions = [
    { value: '', label: 'Select a supplier...' },
    ...suppliers.map(supplier => ({ value: supplier.id, label: supplier.name }))
  ];

  const createProjectChangeHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (handleProjectChange) {
      handleProjectChange({ ...e, target: { ...e.target, name: 'project_id' } });
    }
  };

  const createSupplierChangeHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (handleSupplierChange) {
      handleSupplierChange({ ...e, target: { ...e.target, name: 'supplier_id' } });
    }
  };

  const createInputChangeHandler = (fieldName: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (handleInputChange) {
      handleInputChange({ ...e, target: { ...e.target, name: fieldName } });
    }
  };

  return (
    <div className="space-y-6">
      <FormField
        label="Project"
        required
        description={disableProjectSelection ? "Project is preselected and cannot be changed." : undefined}
      >
        <Select
          value={formData.project_id}
          onChange={createProjectChangeHandler}
          options={projectOptions}
          disabled={disableProjectSelection || loading}
          className={disableProjectSelection ? 'bg-gray-100 dark:bg-gray-600' : ''}
        />
      </FormField>

      <FormField label="Supplier" required>
        <Select
          value={formData.supplier_id}
          onChange={createSupplierChangeHandler}
          options={supplierOptions}
          disabled={loading}
        />
      </FormField>

      <FormField label="Delivery Address" required>
        <TextInput
          value={formData.delivery_to}
          onChange={createInputChangeHandler('delivery_to')}
          placeholder="Enter delivery address"
          disabled={loading}
        />
      </FormField>

      {createdByName && (
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Created by:</span>
            <span className="text-gray-900 dark:text-white font-medium">{createdByName}</span>
          </div>
        </div>
      )}
    </div>
  );
}