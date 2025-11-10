import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { CPPFormData } from '../../../../../types/cpp';

interface Step8ArrangementsProps {
  data: CPPFormData;
  onChange: (data: Partial<CPPFormData>) => void;
}

const ARRANGEMENT_TYPES = [
  'Ensuring co-operation & co-ordination between project team members and the works',
  'Sub-contractor & their workers involvement',
  'Existing structures containing hazardous materials',
  'Ongoing liaison with the Principal Designer, including requests for design changes',
  'Site Induction requirements',
  'The control of high-risk activities (Permit to Works)',
  'Site Drugs & Alcohol Policy',
  'Transport arrangements including Traffic Management Plan',
  'Emergency response including site layout',
  'Information on existing utility providers',
  'Site Security and protection of the public',
  'Working near schools, playgrounds, or other public areas',
  'Unexploded Ordnance (UXO)',
  'Slips, trips & falls',
  'Prevent falls from height',
  'Control of lifting operations',
  'Work on or near \'LIVE\' railways',
  'Maintenance of plant and equipment',
  'Waste Management',
  'Deliveries and storage of materials'
] as const;

export function Step8Arrangements({ data, onChange }: Step8ArrangementsProps) {
  const [newArrangement, setNewArrangement] = useState({
    type: '',
    cover: ''
  });

  const addArrangement = () => {
    if (!newArrangement.type || !newArrangement.cover) return;

    onChange({
      arrangements: {
        ...data.arrangements,
        items: [...(data.arrangements.items || []), {
          id: crypto.randomUUID(),
          type: newArrangement.type,
          cover: newArrangement.cover
        }]
      }
    });

    setNewArrangement({ type: '', cover: '' });
  };

  const removeArrangement = (id: string) => {
    onChange({
      arrangements: {
        ...data.arrangements,
        items: (data.arrangements.items || []).filter(item => item.id !== id)
      }
    });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Arrangements</h3>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Arrangement Type
            </label>
            <select
              value={newArrangement.type}
              onChange={(e) => setNewArrangement(prev => ({ ...prev, type: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select arrangement type</option>
              {ARRANGEMENT_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Arrangement Cover
            </label>
            <div className="flex space-x-2">
              <textarea
                value={newArrangement.cover}
                onChange={(e) => setNewArrangement(prev => ({ ...prev, cover: e.target.value }))}
                rows={3}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter arrangement details..."
              />
              <button
                type="button"
                onClick={addArrangement}
                disabled={!newArrangement.type || !newArrangement.cover}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-4">
          {(data.arrangements?.items || []).map((arrangement) => (
            <div key={arrangement.id} className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900">{arrangement.type}</h4>
                  <p className="mt-1 text-sm text-gray-600 whitespace-pre-wrap">{arrangement.cover}</p>
                </div>
                <button
                  type="button"
                  onClick={() => removeArrangement(arrangement.id)}
                  className="ml-4 text-red-600 hover:text-red-900"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}

          {!data.arrangements?.items?.length && (
            <div className="text-center py-4 text-gray-500 bg-gray-50 rounded-lg">
              No arrangements added yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}