
import { useState } from 'react';
import { Plus, ChevronDown } from 'lucide-react';
import { ImportModal } from '../../../CPP/components/ImportModal';
import { HazardForm } from '../HazardForm';
import { AIHazardHelper } from '../AIHazardHelper';

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



interface HazardsScreenProps {
  data: {
    hazards: HazardItem[];
    name?: string;
    location?: string;
    assessor?: string;
    selectedPPE?: string[];
    guidelines?: string;
    workingMethods?: { id: string; number: number; description: string }[];
  };
  onChange: (data: Partial<{ hazards: HazardItem[] }>) => void;
}

export function HazardsScreen({ data, onChange }: HazardsScreenProps) {
  const [collapsedHazards, setCollapsedHazards] = useState<Set<string>>(new Set());
  const [showImportModal, setShowImportModal] = useState(false);
  const [showAIHelper, setShowAIHelper] = useState(false);

  const toggleHazardCollapse = (hazardId: string) => {
    setCollapsedHazards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(hazardId)) {
        newSet.delete(hazardId);
      } else {
        newSet.add(hazardId);
      }
      return newSet;
    });
  };

  const handleImportHazards = (importedHazards: HazardItem[]) => {
    onChange({
      hazards: [...data.hazards, ...importedHazards]
    });
    setShowImportModal(false);
  };

  const handleImportHazard = (importedHazard: HazardItem) => {
    onChange({
      hazards: [...data.hazards, importedHazard]
    });
    setShowImportModal(false);
  };

  const addHazard = () => {
    const newHazard: HazardItem = {
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
      hazards: [...data.hazards, newHazard]
    });
  };

  const updateHazard = (id: string, updates: Partial<HazardItem>) => {
    onChange({
      hazards: data.hazards.map(hazard =>
        hazard.id === id
          ? {
              ...hazard,
              ...updates,
              // If beforeSeverity is being updated, also update afterSeverity to match
              afterSeverity: updates.beforeSeverity !== undefined ? updates.beforeSeverity : hazard.afterSeverity,
              beforeTotal: updates.beforeLikelihood !== undefined || updates.beforeSeverity !== undefined
                ? (updates.beforeLikelihood || hazard.beforeLikelihood) * (updates.beforeSeverity || hazard.beforeSeverity)
                : hazard.beforeTotal,
              afterTotal: updates.afterLikelihood !== undefined || updates.beforeSeverity !== undefined
                ? (updates.afterLikelihood || hazard.afterLikelihood) * (updates.beforeSeverity !== undefined ? updates.beforeSeverity : hazard.afterSeverity)
                : hazard.afterTotal
            }
          : hazard
      )
    });
  };

  const removeHazard = (id: string) => {
    onChange({
      hazards: data.hazards.filter(hazard => hazard.id !== id)
    });
  };

  const addControlMeasure = (hazardId: string) => {
    onChange({
      hazards: data.hazards.map(hazard =>
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
      hazards: data.hazards.map(hazard =>
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
      hazards: data.hazards.map(hazard =>
        hazard.id === hazardId
          ? {
              ...hazard,
              controlMeasures: hazard.controlMeasures.filter(measure => measure.id !== measureId)
            }
          : hazard
      )
    });
  };

  const handleImportClick = () => {
    setShowImportModal(true);
  };
  
  const handleAIClick = () => {
    setShowAIHelper(true);
  };
  
  const handleAddAIHazards = (aiHazards: HazardItem[]) => {
    onChange({
      hazards: [...data.hazards, ...aiHazards]
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h3 className="text-lg font-medium text-gray-900">Hazards *</h3>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative">
            <button
              type="button"
              onClick={handleImportClick}
              className="w-full sm:w-auto inline-flex items-center justify-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Import Hazard
              <ChevronDown className="h-4 w-4 ml-1" />
            </button>
            
            {showImportModal && (
              <ImportModal
                show={showImportModal}
                onClose={() => setShowImportModal(false)}
                onImportHazards={handleImportHazards}
                onImportHazard={handleImportHazard}
                source="risk_assessments"
              />
            )}
          </div>
          
          <button
            type="button"
            onClick={handleAIClick}
            className="w-full sm:w-auto inline-flex items-center justify-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            AI Assist
          </button>
          
          <button
            type="button"
            onClick={addHazard}
            className="w-full sm:w-auto inline-flex items-center justify-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Hazard
          </button>
        </div>
      </div>

      <div className="max-h-[calc(100vh-16rem)] overflow-y-auto pr-2">
        <div className="space-y-8">
          {data.hazards.map((hazard) => (
            <HazardForm
              key={hazard.id}
              hazard={hazard}
              isCollapsed={collapsedHazards.has(hazard.id)}
              onToggleCollapse={() => toggleHazardCollapse(hazard.id)}
              onUpdate={(updates) => updateHazard(hazard.id, updates)}
              onRemove={() => removeHazard(hazard.id)}
              onAddControlMeasure={() => addControlMeasure(hazard.id)}
              onUpdateControlMeasure={(measureId, description) => updateControlMeasure(hazard.id, measureId, description)}
              onRemoveControlMeasure={(measureId) => removeControlMeasure(hazard.id, measureId)}
            />
          ))}

          {data.hazards.length === 0 && (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500">Click "Add Hazard" to start adding hazards</p>
            </div>
          )}
        </div>
      </div>
      
      {/* AI Hazard Helper Modal */}
      <AIHazardHelper
        isOpen={showAIHelper}
        onClose={() => setShowAIHelper(false)}
        onAddHazards={handleAddAIHazards}
        assessmentDetails={{
          name: data.name || '',
          location: data.location || '',
          assessor: data.assessor || '',
          selectedPPE: data.selectedPPE || [],
          guidelines: data.guidelines || '',
          workingMethods: data.workingMethods || []
        }}
      />
    </div>
  );
}
