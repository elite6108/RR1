import React, { useState } from 'react';
import { Plus, Trash2, ChevronDown, Check, X } from 'lucide-react';
import { createPortal } from 'react-dom';
import { supabase } from '../../../../../lib/supabase';
import type { RAMSFormData } from '../../../../../types/rams';
import { AIRAMSHazardHelper } from '../AIRAMSHazardHelper';

interface RisksAndHazardsProps {
  data: RAMSFormData;
  onChange: (data: Partial<RAMSFormData>) => void;
}

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

interface PreviousRAMS {
  id: string;
  rams_number: string;
  reference: string;
  client_name: string;
  created_at: string;
  hazards: HazardItem[];
}

interface PreviousRiskAssessment {
  id: string;
  ra_id: string;
  name: string;
  location: string;
  created_at: string;
  hazards: HazardItem[];
}

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  hazardCount: number;
}

function SuccessModal({
  isOpen,
  onClose,
  title,
  message,
  hazardCount,
}: SuccessModalProps) {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        ></div>

        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
          <div>
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <div className="mt-3 text-center sm:mt-5">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {title}
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500">{message}</p>
                <div className="mt-3 p-3 bg-green-50 rounded-md">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <Check className="h-5 w-5 text-green-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-green-800">
                        {hazardCount} hazard{hazardCount !== 1 ? 's' : ''}{' '}
                        imported successfully
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-5 sm:mt-6">
            <button
              type="button"
              className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
              onClick={onClose}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
}

function ErrorModal({ isOpen, onClose, message }: ErrorModalProps) {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        ></div>

        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
          <div>
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
              <X className="h-6 w-6 text-red-600" />
            </div>
            <div className="mt-3 text-center sm:mt-5">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Import Failed
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500">{message}</p>
              </div>
            </div>
          </div>
          <div className="mt-5 sm:mt-6">
            <button
              type="button"
              className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

export function RisksAndHazards({ data, onChange }: RisksAndHazardsProps) {
  const [showImportDropdown, setShowImportDropdown] = useState(false);
  const [previousRAMS, setPreviousRAMS] = useState<PreviousRAMS[]>([]);
  const [previousRiskAssessments, setPreviousRiskAssessments] = useState<
    PreviousRiskAssessment[]
  >([]);
  const [loadingRAMS, setLoadingRAMS] = useState(false);
  const [loadingRiskAssessments, setLoadingRiskAssessments] = useState(false);
  const [selectedRAMS, setSelectedRAMS] = useState<string | null>(null);
  const [selectedRiskAssessments, setSelectedRiskAssessments] = useState<
    string[]
  >([]);
  const [importType, setImportType] = useState<'rams' | 'risk_assessment'>(
    'rams'
  );
  const [importLoading, setImportLoading] = useState(false);
  const [showAIHelper, setShowAIHelper] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successModalData, setSuccessModalData] = useState({
    title: '',
    message: '',
    hazardCount: 0,
  });
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

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
      afterTotal: 1,
    };

    onChange({
      hazards: [...(data.hazards || []), newHazard],
    });
  };

  const updateHazard = (id: string, updates: Partial<HazardItem>) => {
    onChange({
      hazards: (data.hazards || []).map((hazard) =>
        hazard.id === id
          ? {
              ...hazard,
              ...updates,
              beforeTotal:
                updates.beforeLikelihood !== undefined ||
                updates.beforeSeverity !== undefined
                  ? (updates.beforeLikelihood || hazard.beforeLikelihood) *
                    (updates.beforeSeverity || hazard.beforeSeverity)
                  : hazard.beforeTotal,
              afterTotal:
                updates.afterLikelihood !== undefined ||
                updates.afterSeverity !== undefined
                  ? (updates.afterLikelihood || hazard.afterLikelihood) *
                    (updates.afterSeverity || hazard.afterSeverity)
                  : hazard.afterTotal,
            }
          : hazard
      ),
    });
  };

  const removeHazard = (id: string) => {
    onChange({
      hazards: (data.hazards || []).filter((hazard) => hazard.id !== id),
    });
  };

  const addControlMeasure = (hazardId: string) => {
    onChange({
      hazards: (data.hazards || []).map((hazard) =>
        hazard.id === hazardId
          ? {
              ...hazard,
              controlMeasures: [
                ...hazard.controlMeasures,
                { id: crypto.randomUUID(), description: '' },
              ],
            }
          : hazard
      ),
    });
  };

  const updateControlMeasure = (
    hazardId: string,
    measureId: string,
    description: string
  ) => {
    onChange({
      hazards: (data.hazards || []).map((hazard) =>
        hazard.id === hazardId
          ? {
              ...hazard,
              controlMeasures: hazard.controlMeasures.map(
                (measure: { id: string; description: string }) =>
                  measure.id === measureId
                    ? { ...measure, description }
                    : measure
              ),
            }
          : hazard
      ),
    });
  };

  const removeControlMeasure = (hazardId: string, measureId: string) => {
    onChange({
      hazards: (data.hazards || []).map((hazard) =>
        hazard.id === hazardId
          ? {
              ...hazard,
              controlMeasures: hazard.controlMeasures.filter(
                (measure: { id: string; description: string }) =>
                  measure.id !== measureId
              ),
            }
          : hazard
      ),
    });
  };

  const fetchPreviousRAMS = async () => {
    setLoadingRAMS(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data: ramsData, error } = await supabase
        .from('rams')
        .select('id, rams_number, reference, client_name, created_at, hazards')
        .eq('user_id', user.id)
        .not('hazards', 'is', null)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Filter out RAMS that don't have hazards or have empty hazards array
      const validRAMS = (ramsData || []).filter(
        (rams: any) =>
          rams.hazards && Array.isArray(rams.hazards) && rams.hazards.length > 0
      );

      setPreviousRAMS(validRAMS);
    } catch (error) {
      console.error('Error fetching previous RAMS:', error);
      setErrorMessage('Failed to fetch previous RAMS');
      setShowErrorModal(true);
    } finally {
      setLoadingRAMS(false);
    }
  };

  const fetchPreviousRiskAssessments = async () => {
    setLoadingRiskAssessments(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data: riskAssessmentData, error } = await supabase
        .from('risk_assessments')
        .select('id, ra_id, name, location, created_at, hazards')
        .eq('user_id', user.id)
        .not('hazards', 'is', null)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Filter out Risk Assessments that don't have hazards or have empty hazards array
      const validRiskAssessments = (riskAssessmentData || []).filter(
        (ra: any) =>
          ra.hazards && Array.isArray(ra.hazards) && ra.hazards.length > 0
      );

      setPreviousRiskAssessments(validRiskAssessments);
    } catch (error) {
      console.error('Error fetching previous Risk Assessments:', error);
      setErrorMessage('Failed to fetch previous Risk Assessments');
      setShowErrorModal(true);
    } finally {
      setLoadingRiskAssessments(false);
    }
  };

  const handleImportClick = async () => {
    if (!showImportDropdown) {
      await Promise.all([fetchPreviousRAMS(), fetchPreviousRiskAssessments()]);
    }
    setShowImportDropdown(!showImportDropdown);
  };

  const importHazards = async () => {
    if (!selectedRAMS && selectedRiskAssessments.length === 0) return;

    setImportLoading(true);
    try {
      let sourceData: any = null;
      let sourceName = '';

      if (importType === 'rams' && selectedRAMS) {
        sourceData = previousRAMS.find((rams) => rams.id === selectedRAMS);
        if (!sourceData || !sourceData.hazards) {
          throw new Error('Selected RAMS not found or has no hazards');
        }
        sourceName = sourceData.reference || sourceData.rams_number;
      } else if (
        importType === 'risk_assessment' &&
        selectedRiskAssessments.length > 0
      ) {
        const sourceNames: string[] = [];
        let allImportedHazards: any[] = [];

        for (const raId of selectedRiskAssessments) {
          const sourceData = previousRiskAssessments.find(
            (ra) => ra.id === raId
          );
          if (!sourceData || !sourceData.hazards) {
            console.warn(
              `Risk Assessment ${raId} not found or has no hazards, skipping`
            );
            continue;
          }

          sourceNames.push(`${sourceData.ra_id} - ${sourceData.name}`);

          // Import hazards with new IDs to avoid conflicts
          const importedHazards = sourceData.hazards.map((hazard: any) => ({
            ...hazard,
            id: crypto.randomUUID(), // Generate new ID
            controlMeasures: hazard.controlMeasures.map((measure: any) => ({
              ...measure,
              id: crypto.randomUUID(), // Generate new ID for control measures
            })),
          }));

          allImportedHazards = [...allImportedHazards, ...importedHazards];
        }

        sourceName =
          selectedRiskAssessments.length === 1
            ? sourceNames[0]
            : `${selectedRiskAssessments.length} Risk Assessments`;

        if (allImportedHazards.length === 0) {
          throw new Error('No hazards found to import');
        }

        // Add imported hazards to current hazards
        onChange({
          hazards: [...(data.hazards || []), ...allImportedHazards],
        });

        // Reset import state
        setShowImportDropdown(false);
        setSelectedRAMS(null);
        setSelectedRiskAssessments([]);

        setSuccessModalData({
          title: 'Import Successful!',
          message: `Hazards imported from ${sourceName}`,
          hazardCount: allImportedHazards.length,
        });
        setShowSuccessModal(true);
        return; // Early return to avoid duplicate execution
      } else {
        throw new Error('No valid selection made');
      }

      // This handles RAMS import
      // Import hazards with new IDs to avoid conflicts
      const importedHazards = sourceData.hazards.map((hazard: any) => ({
        ...hazard,
        id: crypto.randomUUID(), // Generate new ID
        controlMeasures: hazard.controlMeasures.map((measure: any) => ({
          ...measure,
          id: crypto.randomUUID(), // Generate new ID for control measures
        })),
      }));

      // Add imported hazards to current hazards
      onChange({
        hazards: [...(data.hazards || []), ...importedHazards],
      });

      // Reset import state
      setShowImportDropdown(false);
      setSelectedRAMS(null);
      setSelectedRiskAssessments([]);

      setSuccessModalData({
        title: 'Import Successful!',
        message: `Hazards imported from ${sourceName}`,
        hazardCount: importedHazards.length,
      });
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error importing hazards:', error);
      setErrorMessage(
        error instanceof Error ? error.message : 'Failed to import hazards'
      );
      setShowErrorModal(true);
    } finally {
      setImportLoading(false);
    }
  };

  const handleAIClick = () => {
    setShowAIHelper(true);
  };

  // Helper function to normalize hazard titles for comparison
  const normalizeTitle = (title: string): string => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s]/g, '');
  };

  // Helper function to check if two hazards are similar
  const areSimilarHazards = (title1: string, title2: string): boolean => {
    const normalized1 = normalizeTitle(title1);
    const normalized2 = normalizeTitle(title2);

    // Check if titles are identical after normalization
    if (normalized1 === normalized2) return true;

    // Check if one title contains the other (for partial matches)
    if (normalized1.includes(normalized2) || normalized2.includes(normalized1))
      return true;

    // Check for common keywords (e.g., "heights", "ladders", "electrical", etc.)
    const words1 = normalized1.split(/\s+/);
    const words2 = normalized2.split(/\s+/);

    // If they share significant keywords (at least 2, or 1 if titles are short)
    const commonWords = words1.filter(
      (word) => word.length > 3 && words2.includes(word)
    );
    const threshold = Math.min(words1.length, words2.length) <= 2 ? 1 : 2;

    return commonWords.length >= threshold;
  };

  const handleAddAIHazards = (aiHazards: HazardItem[]) => {
    const existingHazards = [...(data.hazards || [])];
    const newHazards: HazardItem[] = [];

    aiHazards.forEach((aiHazard) => {
      // Try to find a matching existing hazard
      const matchingHazardIndex = existingHazards.findIndex((existing) =>
        areSimilarHazards(existing.title, aiHazard.title)
      );

      if (matchingHazardIndex !== -1) {
        // Update existing hazard instead of creating duplicate
        const existingHazard = existingHazards[matchingHazardIndex];

        // Merge control measures, avoiding duplicates
        const existingMeasureTexts = new Set(
          existingHazard.controlMeasures.map((m) =>
            m.description.toLowerCase().trim()
          )
        );

        const newControlMeasures = aiHazard.controlMeasures.filter(
          (measure) =>
            !existingMeasureTexts.has(measure.description.toLowerCase().trim())
        );

        // Merge "how might be harmed" - append if different
        let updatedHowMightBeHarmed = existingHazard.howMightBeHarmed;
        if (
          aiHazard.howMightBeHarmed &&
          !existingHazard.howMightBeHarmed
            .toLowerCase()
            .includes(aiHazard.howMightBeHarmed.toLowerCase())
        ) {
          updatedHowMightBeHarmed = existingHazard.howMightBeHarmed
            ? `${existingHazard.howMightBeHarmed}\n${aiHazard.howMightBeHarmed}`
            : aiHazard.howMightBeHarmed;
        }

        // Update the existing hazard with merged data
        existingHazards[matchingHazardIndex] = {
          ...existingHazard,
          howMightBeHarmed: updatedHowMightBeHarmed,
          controlMeasures: [
            ...existingHazard.controlMeasures,
            ...newControlMeasures.map((m) => ({
              id: crypto.randomUUID(),
              description: m.description,
            })),
          ],
          // Update "who might be harmed" if it was empty
          whoMightBeHarmed:
            existingHazard.whoMightBeHarmed || aiHazard.whoMightBeHarmed,
          // Keep the more conservative (higher) risk scores
          beforeLikelihood: Math.max(
            existingHazard.beforeLikelihood,
            aiHazard.beforeLikelihood
          ),
          beforeSeverity: Math.max(
            existingHazard.beforeSeverity,
            aiHazard.beforeSeverity
          ),
          beforeTotal: Math.max(
            existingHazard.beforeTotal,
            aiHazard.beforeTotal
          ),
        };
      } else {
        // No match found, add as new hazard
        newHazards.push(aiHazard);
      }
    });

    // Update the hazards list with merged existing hazards and new unique hazards
    onChange({
      hazards: [...existingHazards, ...newHazards],
    });
  };

  return (
    <div
      className="space-y-6"
      onSubmit={(e: React.FormEvent) => e.preventDefault()}
    >
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h3 className="text-lg font-medium text-gray-900">Risks & Hazards *</h3>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative">
            <button
              type="button"
              onClick={handleImportClick}
              className="w-full sm:w-auto inline-flex items-center justify-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Import Hazards
              <ChevronDown className="h-4 w-4 ml-1" />
            </button>

            {showImportDropdown && (
              <div className="absolute z-10 mt-1 w-full sm:w-80 bg-white border border-gray-300 rounded-md shadow-lg">
                <div className="p-4 space-y-4">
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-700">
                      Import From:
                    </div>
                    <div className="flex space-x-4">
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="importType"
                          value="rams"
                          checked={importType === 'rams'}
                          onChange={(
                            e: React.ChangeEvent<HTMLInputElement>
                          ) => {
                            setImportType(
                              e.target.value as 'rams' | 'risk_assessment'
                            );
                            setSelectedRAMS(null);
                            setSelectedRiskAssessments([]);
                          }}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                        />
                        <span className="text-sm text-gray-700">
                          Previous RAMS
                        </span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="importType"
                          value="risk_assessment"
                          checked={importType === 'risk_assessment'}
                          onChange={(
                            e: React.ChangeEvent<HTMLInputElement>
                          ) => {
                            setImportType(
                              e.target.value as 'rams' | 'risk_assessment'
                            );
                            setSelectedRAMS(null);
                            setSelectedRiskAssessments([]);
                          }}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                        />
                        <span className="text-sm text-gray-700">
                          Risk Assessments
                        </span>
                      </label>
                    </div>
                  </div>

                  <div className="text-sm font-medium text-gray-700">
                    Select{' '}
                    {importType === 'rams'
                      ? 'Previous RAMS'
                      : 'Risk Assessments'}
                    {importType === 'risk_assessment' &&
                      selectedRiskAssessments.length > 0 && (
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                          {selectedRiskAssessments.length} selected
                        </span>
                      )}
                  </div>

                  {importType === 'rams' ? (
                    loadingRAMS ? (
                      <div className="text-sm text-gray-500">
                        Loading previous RAMS...
                      </div>
                    ) : previousRAMS.length === 0 ? (
                      <div className="text-sm text-gray-500">
                        No previous RAMS with hazards found
                      </div>
                    ) : (
                      <div className="max-h-48 overflow-y-auto space-y-2">
                        {previousRAMS.map((rams) => (
                          <label
                            key={rams.id}
                            className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                          >
                            <input
                              type="radio"
                              name="selectedItem"
                              value={rams.id}
                              checked={selectedRAMS === rams.id}
                              onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                              ) => setSelectedRAMS(e.target.value)}
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-gray-900 truncate">
                                {rams.reference || rams.rams_number}
                              </div>
                              <div className="text-xs text-gray-500 truncate">
                                {rams.client_name} • {rams.hazards.length}{' '}
                                hazards
                              </div>
                              <div className="text-xs text-gray-400">
                                {new Date(rams.created_at).toLocaleDateString()}
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>
                    )
                  ) : loadingRiskAssessments ? (
                    <div className="text-sm text-gray-500">
                      Loading Risk Assessments...
                    </div>
                  ) : previousRiskAssessments.length === 0 ? (
                    <div className="text-sm text-gray-500">
                      No Risk Assessments with hazards found
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                        <span className="text-xs text-gray-500">
                          {previousRiskAssessments.length} Risk Assessment
                          {previousRiskAssessments.length !== 1 ? 's' : ''}{' '}
                          available
                        </span>
                        <div className="flex space-x-2">
                          <button
                            type="button"
                            onClick={() =>
                              setSelectedRiskAssessments(
                                previousRiskAssessments.map((ra) => ra.id)
                              )
                            }
                            className="text-xs text-indigo-600 hover:text-indigo-800"
                          >
                            Select All
                          </button>
                          <span className="text-xs text-gray-300">|</span>
                          <button
                            type="button"
                            onClick={() => setSelectedRiskAssessments([])}
                            className="text-xs text-indigo-600 hover:text-indigo-800"
                          >
                            Clear
                          </button>
                        </div>
                      </div>
                      <div className="max-h-48 overflow-y-auto space-y-2">
                        {previousRiskAssessments.map((ra) => (
                          <label
                            key={ra.id}
                            className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              value={ra.id}
                              checked={selectedRiskAssessments.includes(ra.id)}
                              onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                              ) => {
                                if (e.target.checked) {
                                  setSelectedRiskAssessments([
                                    ...selectedRiskAssessments,
                                    ra.id,
                                  ]);
                                } else {
                                  setSelectedRiskAssessments(
                                    selectedRiskAssessments.filter(
                                      (id) => id !== ra.id
                                    )
                                  );
                                }
                              }}
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-gray-900 truncate">
                                {ra.ra_id} - {ra.name}
                              </div>
                              <div className="text-xs text-gray-500 truncate">
                                {ra.location} • {ra.hazards.length} hazards
                              </div>
                              <div className="text-xs text-gray-400">
                                {new Date(ra.created_at).toLocaleDateString()}
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {(importType === 'rams' && previousRAMS.length > 0) ||
                  (importType === 'risk_assessment' &&
                    previousRiskAssessments.length > 0) ? (
                    <div className="flex justify-end space-x-2 pt-2 border-t">
                      <button
                        type="button"
                        onClick={() => {
                          setShowImportDropdown(false);
                          setSelectedRAMS(null);
                          setSelectedRiskAssessments([]);
                        }}
                        className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={importHazards}
                        disabled={
                          (!selectedRAMS &&
                            selectedRiskAssessments.length === 0) ||
                          importLoading
                        }
                        className="px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {importLoading ? 'Importing...' : 'Import'}
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleAIClick}
            className="w-full sm:w-auto inline-flex items-center justify-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
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

      <div className="space-y-8">
        {(data.hazards || []).map((hazard) => (
          <div key={hazard.id} className="bg-gray-50 p-6 rounded-lg space-y-6">
            <div className="flex justify-between">
              <h4 className="text-lg font-medium text-gray-900">
                Hazard Details
              </h4>
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
                  Hazard Title *
                </label>
                <input
                  type="text"
                  value={hazard.title}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    updateHazard(hazard.id, { title: e.target.value })
                  }
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
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    updateHazard(hazard.id, {
                      whoMightBeHarmed: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  How Might They Be Harmed *
                </label>
                <textarea
                  value={hazard.howMightBeHarmed}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    updateHazard(hazard.id, {
                      howMightBeHarmed: e.target.value,
                    })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2">
                  Risk Calculation (Before Control Measures) *
                </h5>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="w-full sm:w-auto">
                    <label className="block text-xs text-gray-500">
                      Likelihood
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={hazard.beforeLikelihood}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        updateHazard(hazard.id, {
                          beforeLikelihood: parseInt(e.target.value),
                        })
                      }
                      className="w-full sm:w-20 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div className="w-full sm:w-auto">
                    <label className="block text-xs text-gray-500">
                      Severity
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={hazard.beforeSeverity}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        updateHazard(hazard.id, {
                          beforeSeverity: parseInt(e.target.value),
                        })
                      }
                      className="w-full sm:w-20 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div className="w-full sm:w-auto">
                    <label className="block text-xs text-gray-500">
                      Total Risk
                    </label>
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
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-2">
                  <h5 className="text-sm font-medium text-gray-700">
                    Control Measures *
                  </h5>
                  <button
                    type="button"
                    onClick={() => addControlMeasure(hazard.id)}
                    className="w-full sm:w-auto inline-flex items-center justify-center px-2 py-1 text-sm font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Measure
                  </button>
                </div>
                <div className="max-h-[300px] overflow-y-auto pr-2">
                  <div className="space-y-2">
                    {hazard.controlMeasures.map(
                      (measure: { id: string; description: string }) => (
                        <div
                          key={measure.id}
                          className="flex items-center space-x-2"
                        >
                          <input
                            type="text"
                            value={measure.description}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) =>
                              updateControlMeasure(
                                hazard.id,
                                measure.id,
                                e.target.value
                              )
                            }
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Enter control measure"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              removeControlMeasure(hazard.id, measure.id)
                            }
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2">
                  Risk Calculation (After Control Measures) *
                </h5>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="w-full sm:w-auto">
                    <label className="block text-xs text-gray-500">
                      Likelihood
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={hazard.afterLikelihood}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        updateHazard(hazard.id, {
                          afterLikelihood: parseInt(e.target.value),
                        })
                      }
                      className="w-full sm:w-20 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div className="w-full sm:w-auto">
                    <label className="block text-xs text-gray-500">
                      Severity
                    </label>
                    <input
                      type="number"
                      value={hazard.afterSeverity}
                      disabled
                      className="w-full sm:w-20 px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50"
                    />
                  </div>
                  <div className="w-full sm:w-auto">
                    <label className="block text-xs text-gray-500">
                      Total Risk
                    </label>
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
          </div>
        ))}

        {(data.hazards || []).length === 0 && (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">
              Click "Add Hazard" to start adding hazards, "AI Assist" to
              generate hazards with AI, or "Import Hazards" to import existing
              hazards from previous RAMS or Risk Assessments
            </p>
          </div>
        )}
      </div>

      {/* AI RAMS Hazard Helper Modal */}
      <AIRAMSHazardHelper
        isOpen={showAIHelper}
        onClose={() => setShowAIHelper(false)}
        onAddHazards={handleAddAIHazards}
        ramsDetails={{
          description: data.description || '',
          tools_equipment: data.tools_equipment || '',
          plant_equipment: data.plant_equipment || '',
          sequence: data.sequence || '',
          site_hours: data.site_hours || '',
          lighting: data.lighting || '',
          services: data.services || '',
          access_equipment: data.access_equipment || '',
          hazardous_equipment: data.hazardous_equipment || '',
          welfare_first_aid: data.welfare_first_aid || '',
          fire_action_plan: data.fire_action_plan || '',
          protection_of_public: data.protection_of_public || '',
          clean_up: data.clean_up || '',
          order_of_works_safety: data.order_of_works_safety || '',
          order_of_works_custom: data.order_of_works_custom || '',
          delivery_info: data.delivery_info || '',
          groundworks_info: data.groundworks_info || '',
          ppe: data.ppe || [],
        }}
      />

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title={successModalData.title}
        message={successModalData.message}
        hazardCount={successModalData.hazardCount}
      />

      {/* Error Modal */}
      <ErrorModal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        message={errorMessage}
      />
    </div>
  );
}
