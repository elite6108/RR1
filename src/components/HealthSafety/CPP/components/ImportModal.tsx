import React, { useState } from 'react';
import { X } from 'lucide-react';
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

interface PreviousAssessment {
  id: string;
  name: string;
  created_at: string;
  hazards: HazardItem[];
}

interface HazardImportModalProps {
  show: boolean;
  onClose: () => void;
  onImportHazards: (hazards: HazardItem[]) => void;
  onImportHazard: (hazard: HazardItem) => void;
  source: 'risk_assessments' | 'cpp';
}

export function ImportModal({ show, onClose, onImportHazards, onImportHazard, source }: HazardImportModalProps) {
  const [previousAssessments, setPreviousAssessments] = useState<PreviousAssessment[]>([]);
  const [loadingAssessments, setLoadingAssessments] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState<string | null>(null);
  const [showImportOptions, setShowImportOptions] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchPreviousAssessments = async () => {
    setLoadingAssessments(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      let query;
      if (source === 'cpp') {
        query = supabase
          .from('cpp')
          .select('id, project_name as name, created_at, hazards')
          .eq('user_id', user.id);
      } else {
        query = supabase
          .from('risk_assessments')
          .select('id, name, created_at, hazards')
          .eq('user_id', user.id);
      }
      
      const { data: assessmentData, error } = await query
        .not('hazards', 'is', null)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const validAssessments = (assessmentData || []).filter(ra => 
        ra.hazards && 
        Array.isArray(ra.hazards) && 
        ra.hazards.length > 0
      );

      setPreviousAssessments(validAssessments);
    } catch (error) {
      console.error(`Error fetching previous ${source}:`, error);
      setErrorMessage(`Failed to fetch previous ${source}. Please try again.`);
      setShowErrorModal(true);
    } finally {
      setLoadingAssessments(false);
    }
  };

  const handleAssessmentSelect = (raId: string) => {
    setSelectedAssessment(raId);
    setShowImportOptions(true);
  };

  const importAllHazards = async () => {
    if (!selectedAssessment) return;

    setImportLoading(true);
    try {
      const selectedRA = previousAssessments.find(ra => ra.id === selectedAssessment);
      if (!selectedRA || !selectedRA.hazards) {
        throw new Error('Selected assessment not found or has no hazards');
      }

      const importedHazards = selectedRA.hazards.map(hazard => ({
        ...hazard,
        id: crypto.randomUUID(),
        controlMeasures: hazard.controlMeasures.map(measure => ({
          ...measure,
          id: crypto.randomUUID()
        }))
      }));

      onImportHazards(importedHazards);
      
      setSuccessMessage(`Successfully imported ${importedHazards.length} hazards from ${selectedRA.name}`);
      setShowSuccessModal(true);
      
      setSelectedAssessment(null);
      setShowImportOptions(false);
    } catch (error) {
      console.error('Error importing hazards:', error);
      setErrorMessage('Failed to import hazards. Please try again.');
      setShowErrorModal(true);
    } finally {
      setImportLoading(false);
    }
  };

  const importSpecificHazard = async (hazardId: string) => {
    if (!selectedAssessment) return;

    setImportLoading(true);
    try {
      const selectedRA = previousAssessments.find(ra => ra.id === selectedAssessment);
      if (!selectedRA || !selectedRA.hazards) {
        throw new Error('Selected assessment not found or has no hazards');
      }

      const hazardToImport = selectedRA.hazards.find(h => h.id === hazardId);
      if (!hazardToImport) {
        throw new Error('Selected hazard not found');
      }

      const importedHazard = {
        ...hazardToImport,
        id: crypto.randomUUID(),
        controlMeasures: hazardToImport.controlMeasures.map(measure => ({
          ...measure,
          id: crypto.randomUUID()
        }))
      };

      onImportHazard(importedHazard);
      
      setSuccessMessage(`Successfully imported hazard "${hazardToImport.title}" from ${selectedRA.name}`);
      setShowSuccessModal(true);
      
      setSelectedAssessment(null);
      setShowImportOptions(false);
    } catch (error) {
      console.error('Error importing hazard:', error);
      setErrorMessage('Failed to import hazard. Please try again.');
      setShowErrorModal(true);
    } finally {
      setImportLoading(false);
    }
  };

  React.useEffect(() => {
    if (show) {
      fetchPreviousAssessments();
    }
  }, [show, source]);

  if (!show) return null;

  return (
    <>
      {showErrorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full m-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-red-600">Error</h3>
              <button onClick={() => setShowErrorModal(false)}><X className="h-5 w-5" /></button>
            </div>
            <p>{errorMessage}</p>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowErrorModal(false)}
                className="px-4 py-2 bg-red-600 text-white rounded-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full m-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Import Successful</h3>
              <button onClick={() => setShowSuccessModal(false)}><X className="h-5 w-5" /></button>
            </div>
            <p>{successMessage}</p>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowSuccessModal(false)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="absolute z-10 mt-1 w-full sm:w-96 bg-white border border-gray-300 rounded-md shadow-lg">
        <div className="p-4 space-y-4">
          <div className="text-sm font-medium text-gray-700">Select {source === 'cpp' ? 'CPP' : 'Risk Assessment'}</div>
          
          {loadingAssessments ? (
            <div>Loading...</div>
          ) : previousAssessments.length === 0 ? (
            <div>No previous {source} with hazards found</div>
          ) : (
            <>
              <div className="max-h-48 overflow-y-auto space-y-2">
                {previousAssessments.map((ra) => (
                  <button
                    key={ra.id}
                    type="button"
                    onClick={() => handleAssessmentSelect(ra.id)}
                    className={`w-full text-left p-2 hover:bg-gray-50 rounded cursor-pointer border ${
                      selectedAssessment === ra.id ? 'border-indigo-500 bg-indigo-50' : 'border-transparent'
                    }`}
                  >
                    <div className="font-medium">{ra.name}</div>
                    <div className="text-xs text-gray-500">{ra.hazards.length} hazards • {new Date(ra.created_at).toLocaleDateString()}</div>
                  </button>
                ))}
              </div>
              
              {showImportOptions && selectedAssessment && (
                <div className="border-t pt-4">
                  <div className="text-sm font-medium mb-3">Import Options</div>
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={importAllHazards}
                      disabled={importLoading}
                      className="w-full p-2 text-sm bg-indigo-600 text-white rounded"
                    >
                      {importLoading ? 'Importing...' : 'Import All Hazards'}
                    </button>
                    <div className="text-xs text-center my-1">Or</div>
                    <div className="max-h-32 overflow-y-auto space-y-1">
                      {previousAssessments
                        .find(ra => ra.id === selectedAssessment)
                        ?.hazards.map((hazard) => (
                        <button
                          key={hazard.id}
                          type="button"
                          onClick={() => importSpecificHazard(hazard.id)}
                          disabled={importLoading}
                          className="w-full text-left p-1 text-sm hover:bg-gray-100 rounded"
                        >
                          {hazard.title || 'Untitled Hazard'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex justify-end pt-2 border-t">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    setShowImportOptions(false);
                    setSelectedAssessment(null);
                  }}
                  className="p-2 text-sm"
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
