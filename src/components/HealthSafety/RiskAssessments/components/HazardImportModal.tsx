import React, { useState } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { supabase } from '../../../../lib/supabase';

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

interface PreviousRiskAssessment {
  id: string;
  ra_id: string;
  name: string;
  location: string;
  created_at: string;
  hazards: HazardItem[];
}

interface HazardImportModalProps {
  show: boolean;
  onClose: () => void;
  onImportHazards: (hazards: HazardItem[]) => void;
  onImportHazard: (hazard: HazardItem) => void;
}

export function HazardImportModal({ show, onClose, onImportHazards, onImportHazard }: HazardImportModalProps) {
  const [previousRiskAssessments, setPreviousRiskAssessments] = useState<PreviousRiskAssessment[]>([]);
  const [loadingRiskAssessments, setLoadingRiskAssessments] = useState(false);
  const [selectedRiskAssessment, setSelectedRiskAssessment] = useState<string | null>(null);
  const [showImportOptions, setShowImportOptions] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const fetchPreviousRiskAssessments = async () => {
    setLoadingRiskAssessments(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data: riskAssessmentData, error } = await supabase
        .from('risk_assessments')
        .select('id, ra_id, name, location, created_at, hazards')
        .eq('user_id', user.id)
        .not('hazards', 'is', null)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Filter out risk assessments that don't have hazards or have empty hazards array
      const validRiskAssessments = (riskAssessmentData || []).filter(ra => 
        ra.hazards && 
        Array.isArray(ra.hazards) && 
        ra.hazards.length > 0
      );

      setPreviousRiskAssessments(validRiskAssessments);
    } catch (error) {
      console.error('Error fetching previous risk assessments:', error);
      alert('Failed to fetch previous risk assessments');
    } finally {
      setLoadingRiskAssessments(false);
    }
  };

  const handleRiskAssessmentSelect = (raId: string) => {
    setSelectedRiskAssessment(raId);
    setShowImportOptions(true);
  };

  const importAllHazards = async () => {
    if (!selectedRiskAssessment) return;

    setImportLoading(true);
    try {
      const selectedRA = previousRiskAssessments.find(ra => ra.id === selectedRiskAssessment);
      if (!selectedRA || !selectedRA.hazards) {
        throw new Error('Selected risk assessment not found or has no hazards');
      }

      // Import hazards with new IDs to avoid conflicts
      const importedHazards = selectedRA.hazards.map(hazard => ({
        ...hazard,
        id: crypto.randomUUID(), // Generate new ID
        controlMeasures: hazard.controlMeasures.map(measure => ({
          ...measure,
          id: crypto.randomUUID() // Generate new ID for control measures
        }))
      }));

      onImportHazards(importedHazards);
      
      // Show success modal
      setSuccessMessage(`Successfully imported ${importedHazards.length} hazards from ${selectedRA.name}`);
      setShowSuccessModal(true);
      
      // Reset state
      setSelectedRiskAssessment(null);
      setShowImportOptions(false);
    } catch (error) {
      console.error('Error importing hazards:', error);
      alert('Failed to import hazards');
    } finally {
      setImportLoading(false);
    }
  };

  const importSpecificHazard = async (hazardId: string) => {
    if (!selectedRiskAssessment) return;

    setImportLoading(true);
    try {
      const selectedRA = previousRiskAssessments.find(ra => ra.id === selectedRiskAssessment);
      if (!selectedRA || !selectedRA.hazards) {
        throw new Error('Selected risk assessment not found or has no hazards');
      }

      const hazardToImport = selectedRA.hazards.find(h => h.id === hazardId);
      if (!hazardToImport) {
        throw new Error('Selected hazard not found');
      }

      // Import hazard with new ID to avoid conflicts
      const importedHazard = {
        ...hazardToImport,
        id: crypto.randomUUID(), // Generate new ID
        controlMeasures: hazardToImport.controlMeasures.map(measure => ({
          ...measure,
          id: crypto.randomUUID() // Generate new ID for control measures
        }))
      };

      onImportHazard(importedHazard);
      
      // Show success modal
      setSuccessMessage(`Successfully imported hazard "${hazardToImport.title}" from ${selectedRA.name}`);
      setShowSuccessModal(true);
      
      // Reset state
      setSelectedRiskAssessment(null);
      setShowImportOptions(false);
    } catch (error) {
      console.error('Error importing hazard:', error);
      alert('Failed to import hazard');
    } finally {
      setImportLoading(false);
    }
  };

  const handleOpen = async () => {
    await fetchPreviousRiskAssessments();
  };

  React.useEffect(() => {
    if (show) {
      handleOpen();
    }
  }, [show]);

  if (!show) return null;

  return (
    <>
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md md:max-w-6xl w-full mx-4 md:h-[89vh] md:flex md:flex-col">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                <div className="bg-green-100 rounded-full p-2 mr-3">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900">Import Successful</h3>
              </div>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="md:flex-1 md:flex md:flex-col md:justify-center">
              <p className="text-sm text-gray-600 mb-4 md:text-center md:text-lg">{successMessage}</p>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setShowSuccessModal(false)}
                className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Import Modal */}
      <div className="absolute z-10 mt-1 w-full sm:w-80 bg-white border border-gray-300 rounded-md shadow-lg">
        <div className="p-4 space-y-4">
          <div className="text-sm font-medium text-gray-700">Select Risk Assessment</div>
          
          {loadingRiskAssessments ? (
            <div className="text-sm text-gray-500">Loading previous risk assessments...</div>
          ) : previousRiskAssessments.length === 0 ? (
            <div className="text-sm text-gray-500">No previous risk assessments with hazards found</div>
          ) : (
            <>
              <div className="max-h-48 overflow-y-auto space-y-2">
                {previousRiskAssessments.map((ra) => (
                  <button
                    key={ra.id}
                    type="button"
                    onClick={() => handleRiskAssessmentSelect(ra.id)}
                    className={`w-full text-left p-2 hover:bg-gray-50 rounded cursor-pointer border ${
                      selectedRiskAssessment === ra.id ? 'border-indigo-500 bg-indigo-50' : 'border-transparent'
                    }`}
                  >
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {ra.name}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {ra.ra_id} • {ra.location} • {ra.hazards.length} hazards
                    </div>
                    <div className="text-xs text-gray-400">
                      {new Date(ra.created_at).toLocaleDateString()}
                    </div>
                  </button>
                ))}
              </div>
              
              {showImportOptions && selectedRiskAssessment && (
                <div className="border-t pt-4">
                  <div className="text-sm font-medium text-gray-700 mb-3">Import Options</div>
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={importAllHazards}
                      disabled={importLoading}
                      className="w-full px-3 py-2 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {importLoading ? 'Importing...' : 'Import All Hazards'}
                    </button>
                    <div className="text-xs text-gray-500 mb-2">Or select specific hazard:</div>
                    <div className="max-h-32 overflow-y-auto space-y-1">
                      {previousRiskAssessments
                        .find(ra => ra.id === selectedRiskAssessment)
                        ?.hazards.map((hazard) => (
                        <button
                          key={hazard.id}
                          type="button"
                          onClick={() => importSpecificHazard(hazard.id)}
                          disabled={importLoading}
                          className="w-full text-left px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {hazard.title || 'Untitled Hazard'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex justify-end space-x-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    setShowImportOptions(false);
                    setSelectedRiskAssessment(null);
                  }}
                  className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
