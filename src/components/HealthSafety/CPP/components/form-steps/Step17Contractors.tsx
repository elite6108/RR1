import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { CPPFormData } from '../../../../../types/cpp';

interface Step17ContractorsProps {
  data: CPPFormData;
  onChange: (data: Partial<CPPFormData>) => void;
}

const TRADES = [
  'Air-Conditioning',
  'Apprentice',
  'Asbestos',
  'Bathroom/Shower installation',
  'Bricklayer',
  'Building Trades',
  'Cabinetry',
  'Carpentry/Joinery',
  'Carpet/Flooring Installation',
  'Cladding',
  'Cleaning',
  'Concreting',
  'Consultant/Representative',
  'Crane/Hoist',
  'Lift Operators',
  'Demolition',
  'Dogger/Rigger',
  'Drainage',
  'Drywalling',
  'Electrical',
  'Estimator',
  'Excavation',
  'Fencing',
  'Fire Services',
  'Garage Door Installer',
  'Gardening',
  'Glazing',
  'Insulation',
  'Kitchen Installation',
  'Labourer',
  'Landscaping',
  'Mobile Plant Operator',
  'Painter',
  'Plasterer',
  'Plumber',
  'Project Management',
  'Rendering',
  'Roofer',
  'Safety Nets',
  'Safety Services',
  'Scaffolding',
  'Security',
  'Service Technician',
  'Shower/Bathroom Installer',
  'Spouting',
  'Steel Works',
  'Stone Mason',
  'Supplier/Delivery Driver',
  'Surveyor',
  'Tiler',
  'Trenching and Excavation',
  'Waste Removal',
  'Waterproofing',
  'Welding'
] as const;

export function Step17Contractors({ data, onChange }: Step17ContractorsProps) {
  const addContractor = () => {
    const newContractor = {
      id: crypto.randomUUID(),
      companyName: '',
      trade: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: ''
    };

    onChange({
      contractors: [...(data.contractors || []), newContractor]
    });
  };

  const updateContractor = (id: string, field: string, value: string) => {
    onChange({
      contractors: (data.contractors || []).map(contractor =>
        contractor.id === id ? { ...contractor, [field]: value } : contractor
      )
    });
  };

  const removeContractor = (id: string) => {
    onChange({
      contractors: (data.contractors || []).filter(contractor => contractor.id !== id)
    });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Contractors</h3>
      
      <div>
        <div className="flex justify-between items-center mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Add Contractors
          </label>
          <button
            type="button"
            onClick={addContractor}
            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Contractor
          </button>
        </div>

        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-4">
          {(data.contractors || []).map(contractor => (
            <div key={contractor.id} className="bg-gray-50 p-4 rounded-lg space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={contractor.companyName}
                    onChange={(e) => updateContractor(contractor.id, 'companyName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Trade
                  </label>
                  <select
                    value={contractor.trade}
                    onChange={(e) => updateContractor(contractor.id, 'trade', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Select a trade</option>
                    {TRADES.map(trade => (
                      <option key={trade} value={trade}>{trade}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="bg-white p-4 rounded-md">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Main Contact</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={contractor.firstName}
                      onChange={(e) => updateContractor(contractor.id, 'firstName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={contractor.lastName}
                      onChange={(e) => updateContractor(contractor.id, 'lastName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={contractor.email}
                      onChange={(e) => updateContractor(contractor.id, 'email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={contractor.phone}
                      onChange={(e) => updateContractor(contractor.id, 'phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => removeContractor(contractor.id)}
                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Remove
                </button>
              </div>
            </div>
          ))}

          {!data.contractors?.length && (
            <div className="text-center py-4 text-gray-500 bg-gray-50 rounded-lg">
              Click "Add Contractor" to add contractors to the project
            </div>
          )}
        </div>
      </div>
    </div>
  );
}