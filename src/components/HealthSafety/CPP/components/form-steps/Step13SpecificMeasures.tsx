import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { CPPFormData } from '../../../../../types/cpp';

interface Step13SpecificMeasuresProps {
  data: CPPFormData;
  onChange: (data: Partial<CPPFormData>) => void;
}

const SPECIFIC_MEASURES = {
  SM1: {
    title: "Burial or falling from height",
    description: "Work which puts workers at risk of burial under earth falls, engulfment in swampland or falling from height, where the risk is aggravated by the nature of the work or processes used or the environment at the place or work or site.",
    category: "Physical"
  },
  SM2: {
    title: "Chemical or biological substances",
    description: "Work which puts the workers at risk from chemical or biological substances constituting a particular danger to the health or safety of workers and others or involving a legal requirement for health monitoring",
    category: "Health"
  },
  SM3: {
    title: "Ionising radiation",
    description: "Work with ionising radiation requiring the designation of controlled or supervised areas under regulation 16 of the Ionising Radiations Regulations 1999",
    category: "Health"
  },
  SM4: {
    title: "High voltage power lines",
    description: "Work on or near high voltage power lines",
    category: "Physical"
  },
  SM5: {
    title: "Drowning",
    description: "Work exposing workers to the risk of drowning",
    category: "Physical"
  },
  SM6: {
    title: "Wells, underground and tunnels",
    description: "Work on wells, underground earthworks and tunnels",
    category: "Physical"
  },
  SM7: {
    title: "Divers",
    description: "Work carried out by divers having a system of air supply",
    category: "Physical"
  },
  SM8: {
    title: "Caissons, compressed air atmospheres",
    description: "Work carried out by workers in caissons with compressed air atmospheres",
    category: "Physical"
  },
  SM9: {
    title: "Explosives",
    description: "Work involving the use of explosives",
    category: "Physical"
  },
  SM10: {
    title: "Heavy prefabricated elements",
    description: "Work involving the assembly or dismantling of heavy prefabricated elements",
    category: "Physical"
  }
} as const;

export function Step13SpecificMeasures({ data, onChange }: Step13SpecificMeasuresProps) {
  const addMeasure = () => {
    const newMeasure = {
      id: crypto.randomUUID(),
      code: '',
      title: '',
      description: '',
      category: '',
      controlMeasure: ''
    };

    onChange({
      specificMeasures: {
        ...data.specificMeasures,
        items: [...(data.specificMeasures.items || []), newMeasure]
      }
    });
  };

  const updateMeasure = (id: string, field: string, value: string) => {
    onChange({
      specificMeasures: {
        ...data.specificMeasures,
        items: (data.specificMeasures.items || []).map(item => {
          if (item.id === id) {
            if (field === 'code' && value in SPECIFIC_MEASURES) {
              // Prefill fields based on selected code
              const preset = SPECIFIC_MEASURES[value as keyof typeof SPECIFIC_MEASURES];
              return {
                ...item,
                code: value,
                title: preset.title,
                description: preset.description,
                category: preset.category
              };
            }
            return { ...item, [field]: value };
          }
          return item;
        })
      }
    });
  };

  const removeMeasure = (id: string) => {
    onChange({
      specificMeasures: {
        ...data.specificMeasures,
        items: (data.specificMeasures.items || []).filter(item => item.id !== id)
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Specific Measures</h3>
        <button
          type="button"
          onClick={addMeasure}
          className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Measure
        </button>
      </div>

      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-4">
        {(data.specificMeasures?.items || []).map((measure) => (
          <div key={measure.id} className="bg-gray-50 p-6 rounded-lg space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Code
                </label>
                <select
                  value={measure.code}
                  onChange={(e) => updateMeasure(measure.id, 'code', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select a code</option>
                  {Object.keys(SPECIFIC_MEASURES).map(code => (
                    <option key={code} value={code}>{code}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <input
                  type="text"
                  value={measure.category}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={measure.title}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={measure.description}
                  readOnly
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Control Measure
                </label>
                <textarea
                  value={measure.controlMeasure}
                  onChange={(e) => updateMeasure(measure.id, 'controlMeasure', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter control measures..."
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => removeMeasure(measure.id)}
                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Remove
              </button>
            </div>
          </div>
        ))}

        {!data.specificMeasures?.items?.length && (
          <div className="text-center py-4 text-gray-500 bg-gray-50 rounded-lg">
            Click "Add Measure" to add specific measures
          </div>
        )}
      </div>
    </div>
  );
}