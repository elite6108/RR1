import React from 'react';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

interface HazardItem {
  id: string;
  title: string;
  whoMightBeHarmed: string;
  howMightBeHarmed: string;
  beforeLikelihood: number;
  beforeSeverity: number;
  beforeTotal: number;
  controlMeasures: { id: string; description: string }[];
  afterLikelihood: number;
  afterSeverity: number;
  afterTotal: number;
}

interface HazardFormProps {
  hazard: HazardItem;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onUpdate: (updates: Partial<HazardItem>) => void;
  onRemove: () => void;
  onAddControlMeasure: () => void;
  onUpdateControlMeasure: (measureId: string, description: string) => void;
  onRemoveControlMeasure: (measureId: string) => void;
}

export function HazardForm({
  hazard,
  isCollapsed,
  onToggleCollapse,
  onUpdate,
  onRemove,
  onAddControlMeasure,
  onUpdateControlMeasure,
  onRemoveControlMeasure
}: HazardFormProps) {
  return (
    <div className="bg-gray-50 p-6 rounded-lg space-y-6">
      <div className="flex justify-between">
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={onToggleCollapse}
            className="text-gray-500 hover:text-gray-700"
          >
            {isCollapsed ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </button>
          <h4 className="text-lg font-medium text-gray-900">
            {hazard.title || 'Hazard Details'}
          </h4>
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="text-red-600 hover:text-red-900"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>

      {!isCollapsed && (
        <div className="space-y-4 max-h-[200px] overflow-y-auto pr-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hazard Title *
            </label>
            <input
              type="text"
              value={hazard.title}
              onChange={(e) => onUpdate({ title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Who Might Be Harmed *
            </label>
            <input
              type="text"
              value={hazard.whoMightBeHarmed}
              onChange={(e) => onUpdate({ whoMightBeHarmed: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              How Might They Be Harmed *
            </label>
            <textarea
              value={hazard.howMightBeHarmed}
              onChange={(e) => onUpdate({ howMightBeHarmed: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <h5 className="text-sm font-medium text-gray-700 mb-2">
              Risk Calculation (Before Control Measures) *
            </h5>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="w-full sm:w-auto flex flex-col gap-1">
                <label className="block text-xs text-gray-500">Likelihood *</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={hazard.beforeLikelihood}
                  onChange={(e) => onUpdate({ beforeLikelihood: parseInt(e.target.value) })}
                  className="w-full sm:w-20 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div className="w-full sm:w-auto flex flex-col gap-1">
                <label className="block text-xs text-gray-500">Severity *</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={hazard.beforeSeverity}
                  onChange={(e) => onUpdate({ beforeSeverity: parseInt(e.target.value) })}
                  className="w-full sm:w-20 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div className="w-full sm:w-auto flex flex-col gap-1">
                <label className="block text-xs text-gray-500">Total Risk</label>
                <input
                  type="number"
                  value={hazard.beforeTotal}
                  disabled
                  className="w-full sm:w-20 px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50"
                />
              </div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <h5 className="text-sm font-medium text-gray-700">Control Measures *</h5>
            </div>
            <div className="max-h-[300px] overflow-y-auto pr-2">
              <div className="space-y-2">
                {hazard.controlMeasures.map((measure) => (
                  <div key={measure.id} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={measure.description}
                      onChange={(e) => onUpdateControlMeasure(measure.id, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Enter control measure *"
                    />
                    <button
                      type="button"
                      onClick={() => onRemoveControlMeasure(measure.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <button
              type="button"
              onClick={onAddControlMeasure}
              className="mt-2 inline-flex items-center px-2 py-1 text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Measure
            </button>
          </div>

          <div>
            <h5 className="text-sm font-medium text-gray-700 mb-2">
              Risk Calculation (After Control Measures) *
            </h5>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="w-full sm:w-auto flex flex-col gap-1">
                <label className="block text-xs text-gray-500">Likelihood *</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={hazard.afterLikelihood}
                  onChange={(e) => onUpdate({ afterLikelihood: parseInt(e.target.value) })}
                  className="w-full sm:w-20 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div className="w-full sm:w-auto flex flex-col gap-1">
                <label className="block text-xs text-gray-500">Severity *</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={hazard.afterSeverity}
                  disabled
                  className="w-full sm:w-20 px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50"
                />
              </div>
              <div className="w-full sm:w-auto flex flex-col gap-1">
                <label className="block text-xs text-gray-500">Total Risk</label>
                <input
                  type="number"
                  value={hazard.afterTotal}
                  disabled
                  className="w-full sm:w-20 px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
