import React, { useState } from 'react';
import { Plus, Trash2, ChevronDown } from 'lucide-react';
import type { CPPFormData } from '../../../../../types/cpp';
import { ImportModal } from '../ImportModal';

interface Step14HazardsProps {
  data: CPPFormData;
  onChange: (data: Partial<CPPFormData>) => void;
}

export function Step14Hazards({ data, onChange }: Step14HazardsProps) {
  const [showImportDropdown, setShowImportDropdown] = useState(false);
  const [importSource, setImportSource] = useState<'cpp' | 'risk_assessments' | null>(null);

  const addHazard = () => {
    const newHazard = {
      id: crypto.randomUUID(),
      title: '',
      whoMightBeHarmed: '',
      howMightBeHarmed: '',
      beforeLikelihood: 1,
      beforeSeverity: 1,
      beforeTotal: 1,
      controlMeasures: [],
      afterLikelihood: 1,
      afterSeverity: 1,
      afterTotal: 1
    };

    onChange({
      hazards: [...(data.hazards || []), newHazard]
    });
  };

  const handleImportHazards = (importedHazards: any[]) => {
    const newHazards = importedHazards.map(h => ({ ...h, id: crypto.randomUUID() }));
    onChange({
      hazards: [...(data.hazards || []), ...newHazards]
    });
    setImportSource(null);
  };

  const handleImportHazard = (importedHazard: any) => {
    const newHazard = { ...importedHazard, id: crypto.randomUUID() };
    onChange({
      hazards: [...(data.hazards || []), newHazard]
    });
    setImportSource(null);
  };

  const updateHazard = (id: string, updates: Partial<typeof data.hazards[0]>) => {
    onChange({
      hazards: (data.hazards || []).map(hazard =>
        hazard.id === id
          ? {
              ...hazard,
              ...updates,
              beforeTotal: updates.beforeLikelihood !== undefined || updates.beforeSeverity !== undefined
                ? (updates.beforeLikelihood || hazard.beforeLikelihood) * (updates.beforeSeverity || hazard.beforeSeverity)
                : hazard.beforeTotal,
              afterTotal: updates.afterLikelihood !== undefined || updates.afterSeverity !== undefined
                ? (updates.afterLikelihood || hazard.afterLikelihood) * (updates.afterSeverity || hazard.afterSeverity)
                : hazard.afterTotal
            }
          : hazard
      )
    });
  };

  const removeHazard = (id: string) => {
    onChange({
      hazards: (data.hazards || []).filter(hazard => hazard.id !== id)
    });
  };

  const addControlMeasure = (hazardId: string) => {
    onChange({
      hazards: (data.hazards || []).map(hazard =>
        hazard.id === hazardId
          ? {
              ...hazard,
              controlMeasures: [
                ...hazard.controlMeasures,
                { id: crypto.randomUUID(), description: '' }
              ]
            }
          : hazard
      )
    });
  };

  const updateControlMeasure = (hazardId: string, measureId: string, description: string) => {
    onChange({
      hazards: (data.hazards || []).map(hazard =>
        hazard.id === hazardId
          ? {
              ...hazard,
              controlMeasures: hazard.controlMeasures.map(measure =>
                measure.id === measureId
                  ? { ...measure, description }
                  : measure
              )
            }
          : hazard
      )
    });
  };

  const removeControlMeasure = (hazardId: string, measureId: string) => {
    onChange({
      hazards: (data.hazards || []).map(hazard =>
        hazard.id === hazardId
          ? {
              ...hazard,
              controlMeasures: hazard.controlMeasures.filter(measure => measure.id !== measureId)
            }
          : hazard
      )
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Hazards</h3>
        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowImportDropdown(!showImportDropdown)}
              className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Import Hazard
              <ChevronDown className="h-4 w-4 ml-1" />
            </button>
            {showImportDropdown && (
              <div className="absolute z-10 mt-1 w-48 bg-white border border-gray-300 rounded-md shadow-lg">
                <button
                  onClick={() => { setImportSource('cpp'); setShowImportDropdown(false); }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  From previous CPP
                </button>
                <button
                  onClick={() => { setImportSource('risk_assessments'); setShowImportDropdown(false); }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  From Risk Assessment
                </button>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={addHazard}
            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Hazard
          </button>
        </div>
      </div>

      {importSource && (
        <ImportModal
          show={!!importSource}
          onClose={() => setImportSource(null)}
          onImportHazards={handleImportHazards}
          onImportHazard={handleImportHazard}
          source={importSource}
        />
      )}

      <div className="space-y-8 max-h-[400px] overflow-y-auto pr-4">
        {(data.hazards || []).map((hazard) => (
          <div key={hazard.id} className="bg-gray-50 p-6 rounded-lg space-y-6">
            <div className="flex justify-between">
              <h4 className="text-lg font-medium text-gray-900">Hazard Details</h4>
              <button
                type="button"
                onClick={() => removeHazard(hazard.id)}
                className="text-red-600 hover:text-red-900"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hazard Title
                </label>
                <input
                  type="text"
                  value={hazard.title}
                  onChange={(e) => updateHazard(hazard.id, { title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Who Might Be Harmed
                </label>
                <input
                  type="text"
                  value={hazard.whoMightBeHarmed}
                  onChange={(e) => updateHazard(hazard.id, { whoMightBeHarmed: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  How Might They Be Harmed
                </label>
                <textarea
                  value={hazard.howMightBeHarmed}
                  onChange={(e) => updateHazard(hazard.id, { howMightBeHarmed: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2">
                  Risk Calculation (Before Control Measures)
                </h5>
                <div className="flex items-center space-x-4">
                  <div>
                    <label className="block text-xs text-gray-500">Likelihood</label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={hazard.beforeLikelihood}
                      onChange={(e) => updateHazard(hazard.id, { beforeLikelihood: parseInt(e.target.value) })}
                      className="w-20 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500">Severity</label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={hazard.beforeSeverity}
                      onChange={(e) => updateHazard(hazard.id, { beforeSeverity: parseInt(e.target.value) })}
                      className="w-20 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500">Total Risk</label>
                    <input
                      type="number"
                      value={hazard.beforeTotal}
                      disabled
                      className="w-20 px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50"
                    />
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <h5 className="text-sm font-medium text-gray-700">Control Measures</h5>
                  <button
                    type="button"
                    onClick={() => addControlMeasure(hazard.id)}
                    className="inline-flex items-center px-2 py-1 text-sm font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Measure
                  </button>
                </div>
                <div className="space-y-2">
                  {hazard.controlMeasures.map((measure) => (
                    <div key={measure.id} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={measure.description}
                        onChange={(e) => updateControlMeasure(hazard.id, measure.id, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Enter control measure"
                      />
                      <button
                        type="button"
                        onClick={() => removeControlMeasure(hazard.id, measure.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2">
                  Risk Calculation (After Control Measures)
                </h5>
                <div className="flex items-center space-x-4">
                  <div>
                    <label className="block text-xs text-gray-500">Likelihood</label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={hazard.afterLikelihood}
                      onChange={(e) => updateHazard(hazard.id, { afterLikelihood: parseInt(e.target.value) })}
                      className="w-20 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500">Severity</label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={hazard.afterSeverity}
                      onChange={(e) => updateHazard(hazard.id, { afterSeverity: parseInt(e.target.value) })}
                      className="w-20 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500">Total Risk</label>
                    <input
                      type="number"
                      value={hazard.afterTotal}
                      disabled
                      className="w-20 px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {!data.hazards?.length && (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">Click "Add Hazard" to start adding hazards</p>
          </div>
        )}
      </div>
    </div>
  );
}