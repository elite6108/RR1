import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { CPPFormData } from '../../../../../types/cpp';

interface Step6ManagementStructureProps {
  data: CPPFormData;
  onChange: (data: Partial<CPPFormData>) => void;
}

const ROLES = [
  'Site Manager',
  'Site Supervisor',
  'Contractor Supervisor',
  'Health and Safety Advisor',
  'Health and Safety Manager',
  'Other'
] as const;

export function Step6ManagementStructure({ data, onChange }: Step6ManagementStructureProps) {
  const addStructureItem = () => {
    const newItem = {
      id: crypto.randomUUID(),
      role: '',
      name: '',
      contact: ''
    };

    onChange({
      managementStructure: {
        ...data.managementStructure,
        roles: [...(data.managementStructure.roles || []), newItem]
      }
    });
  };

  const updateStructureItem = (id: string, field: string, value: string) => {
    onChange({
      managementStructure: {
        ...data.managementStructure,
        roles: (data.managementStructure.roles || []).map(item =>
          item.id === id ? { ...item, [field]: value } : item
        )
      }
    });
  };

  const removeStructureItem = (id: string) => {
    onChange({
      managementStructure: {
        ...data.managementStructure,
        roles: (data.managementStructure.roles || []).filter(item => item.id !== id)
      }
    });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Management Structure</h3>
      
      <div>
        <div className="flex justify-between items-center mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Structure Items
          </label>
          <button
            type="button"
            onClick={addStructureItem}
            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Item
          </button>
        </div>

        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-4">
          {(data.managementStructure.roles || []).map(item => (
            <div key={item.id} className="flex items-start space-x-4 bg-gray-50 p-4 rounded-lg">
              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <select
                    value={item.role}
                    onChange={(e) => updateStructureItem(item.id, 'role', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Select a role</option>
                    {ROLES.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => updateStructureItem(item.id, 'name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Contact Number
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                      +44
                    </span>
                    <input
                      type="tel"
                      value={item.contact}
                      onChange={(e) => updateStructureItem(item.id, 'contact', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-none rounded-r-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => removeStructureItem(item.id)}
                className="text-red-600 hover:text-red-900"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          ))}

          {!data.managementStructure.roles?.length && (
            <div className="text-center py-4 text-gray-500 bg-gray-50 rounded-lg">
              Click "Add Item" to add structure items
            </div>
          )}
        </div>
      </div>
    </div>
  );
}