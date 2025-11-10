import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';

// Define interface for API response hazards
interface ApiHazard {
  title: string;
  whoMightBeHarmed: string;
  howMightBeHarmed: string;
  likelihood?: number;
  severity?: number;
  controlMeasures: string[];
  afterLikelihood?: number;
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

interface AIRAMSHazardHelperProps {
  isOpen: boolean;
  onClose: () => void;
  onAddHazards: (hazards: HazardItem[]) => void;
  ramsDetails: {
    description?: string;
    tools_equipment?: string;
    plant_equipment?: string;
    sequence?: string;
    site_hours?: string;
    lighting?: string;
    services?: string;
    access_equipment?: string;
    hazardous_equipment?: string;
    welfare_first_aid?: string;
    fire_action_plan?: string;
    protection_of_public?: string;
    clean_up?: string;
    order_of_works_safety?: string;
    order_of_works_custom?: string;
    delivery_info?: string;
    groundworks_info?: string;
    ppe?: string[];
  };
}

export function AIRAMSHazardHelper({ isOpen, onClose, onAddHazards, ramsDetails }: AIRAMSHazardHelperProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiPrompt, setAiPrompt] = useState('');
  const [suggestedHazards, setSuggestedHazards] = useState<HazardItem[]>([]);
  const [selectedHazards, setSelectedHazards] = useState<Set<string>>(new Set());
  const [aiResponse, setAiResponse] = useState<string | null>(null);

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAiPrompt(e.target.value);
  };

  const generateDefaultPrompt = () => {
    const { 
      description, 
      tools_equipment, 
      plant_equipment, 
      sequence, 
      site_hours, 
      lighting, 
      services, 
      access_equipment, 
      hazardous_equipment, 
      welfare_first_aid, 
      fire_action_plan, 
      protection_of_public, 
      clean_up, 
      order_of_works_safety, 
      order_of_works_custom, 
      delivery_info, 
      groundworks_info, 
      ppe 
    } = ramsDetails;
    
    let prompt = `Generate a comprehensive list of potential hazards for a RAMS (Risk Assessment and Method Statement) based on the following project details:\n`;
    
    if (description) {
      prompt += `\nDescription of Works: ${description}\n`;
    }
    
    if (tools_equipment) {
      prompt += `\nTools and Equipment: ${tools_equipment}\n`;
    }
    
    if (plant_equipment) {
      prompt += `\nPlant Equipment: ${plant_equipment}\n`;
    }
    
    if (sequence) {
      prompt += `\nOperational Sequence: ${sequence}\n`;
    }
    
    if (site_hours) {
      prompt += `\nSite Hours: ${site_hours}\n`;
    }
    
    if (lighting) {
      prompt += `\nLighting: ${lighting}\n`;
    }
    
    if (services) {
      prompt += `\nServices: ${services}\n`;
    }
    
    if (access_equipment) {
      prompt += `\nAccess Equipment: ${access_equipment}\n`;
    }
    
    if (hazardous_equipment) {
      prompt += `\nHazardous Equipment: ${hazardous_equipment}\n`;
    }
    
    if (welfare_first_aid) {
      prompt += `\nWelfare and First Aid: ${welfare_first_aid}\n`;
    }
    
    if (fire_action_plan) {
      prompt += `\nFire Action Plan: ${fire_action_plan}\n`;
    }
    
    if (protection_of_public) {
      prompt += `\nProtection of Public: ${protection_of_public}\n`;
    }
    
    if (clean_up) {
      prompt += `\nClean Up: ${clean_up}\n`;
    }
    
    if (order_of_works_safety) {
      prompt += `\nOrder of Works Safety: ${order_of_works_safety}\n`;
    }
    
    if (order_of_works_custom) {
      prompt += `\nCustom Order of Works: ${order_of_works_custom}\n`;
    }
    
    if (delivery_info) {
      prompt += `\nDelivery Information: ${delivery_info}\n`;
    }
    
    if (groundworks_info) {
      prompt += `\nGroundworks Information: ${groundworks_info}\n`;
    }
    
    if (ppe && ppe.length > 0) {
      prompt += `\nPPE Requirements: ${ppe.join(', ')}\n`;
    }
    
    prompt += `\nFor each hazard, please provide:\n`;
    prompt += `1. A specific hazard title\n`;
    prompt += `2. Who might be harmed (specific groups of people at risk)\n`;
    prompt += `3. How they might be harmed (specific injuries or health effects)\n`;
    prompt += `4. A likelihood rating BEFORE control measures (1-5, where 1 is very unlikely and 5 is almost certain)\n`;
    prompt += `5. A severity rating (1-5, where 1 is minor injury and 5 is fatal)\n`;
    prompt += `6. Detailed control measures to mitigate the risk\n`;
    prompt += `7. A likelihood rating AFTER control measures are implemented (1-5, considering how the control measures reduce the probability of the hazard occurring)\n`;
    
    prompt += `\nEvaluate all the provided information and generate hazards that are specifically relevant to the work activities, equipment, site conditions, and operational procedures described. Ensure all recommendations are compliant with HSE UK regulations and current safety standards.`;
    
    return prompt;
  };

  const handleGenerateHazards = async () => {
    setLoading(true);
    setError(null);
    setAiResponse(null);
    setSuggestedHazards([]);
    
    try {
      const prompt = aiPrompt || generateDefaultPrompt();
      
      // Make the actual API call to OpenAI
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(import.meta as any).env.VITE_OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: "You are a UK construction health and safety expert specializing in Risk Assessment and Method Statements (RAMS). Your task is to identify potential hazards for construction and building work activities based on comprehensive project information. You must evaluate all provided project details including work description, equipment, site conditions, operational procedures, and safety measures to generate a thorough hazard assessment.\n\nFor each hazard, you must identify:\n1. A clear hazard title\n2. Who might be harmed (specific groups of people at risk)\n3. How they might be harmed (specific injuries or health effects)\n4. A likelihood rating BEFORE control measures (1-5, where 1 is very unlikely and 5 is almost certain)\n5. A severity rating (1-5, where 1 is minor injury and 5 is fatal)\n6. Detailed control measures to mitigate the risk\n7. A likelihood rating AFTER control measures are implemented (1-5, considering how the control measures reduce the probability of the hazard occurring)\n\nYour response must be thorough, practical, and fully compliant with HSE UK regulations, CDM regulations, and current UK construction health and safety standards. Focus on the most significant hazards relevant to the specific work activities, equipment, site conditions, and operational procedures described. Consider site-specific risks, interaction with other trades, the construction environment, and all safety measures already in place.\n\nFormat your response as JSON with the following structure: { text: 'your detailed explanation of the hazard assessment approach', hazards: [{ title: 'hazard title', whoMightBeHarmed: 'who might be harmed', howMightBeHarmed: 'how they might be harmed', likelihood: number from 1-5, severity: number from 1-5, controlMeasures: ['measure 1', 'measure 2', ...], afterLikelihood: number from 1-5 }] }"
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.7,
          response_format: { type: "json_object" }
        })
      });
      
      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Parse the response
      const aiResponseContent = data.choices[0].message.content;
      const parsedResponse = JSON.parse(aiResponseContent);
      
      setAiResponse(parsedResponse.text);
      
      // Convert the AI response to hazard items
      const hazards = parsedResponse.hazards.map((hazard: ApiHazard) => {
        const beforeLikelihood = hazard.likelihood || 3;
        const severity = hazard.severity || 3;
        const afterLikelihood = hazard.afterLikelihood || Math.max(1, beforeLikelihood - 1); // Use AI provided or default to reduced likelihood
        
        return {
          id: crypto.randomUUID(),
          title: hazard.title.toUpperCase(), // CAPITALIZE THE HAZARD TITLE
          whoMightBeHarmed: hazard.whoMightBeHarmed,
          howMightBeHarmed: hazard.howMightBeHarmed,
          beforeLikelihood: beforeLikelihood,
          beforeSeverity: severity,
          beforeTotal: beforeLikelihood * severity,
          controlMeasures: hazard.controlMeasures.map((measure: string) => ({
            id: crypto.randomUUID(),
            description: measure
          })),
          afterLikelihood: afterLikelihood, // Use AI-provided after-control-measures likelihood
          afterSeverity: severity, // Severity remains the same
          afterTotal: afterLikelihood * severity // Recalculated total with AI-provided likelihood
        };
      });
      
      setSuggestedHazards(hazards);
    } catch (err) {
      console.error('Error generating hazards:', err);
      setError('Failed to generate hazards. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleHazardSelection = (hazardId: string) => {
    setSelectedHazards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(hazardId)) {
        newSet.delete(hazardId);
      } else {
        newSet.add(hazardId);
      }
      return newSet;
    });
  };

  const handleAddSelectedHazards = () => {
    const hazardsToAdd = suggestedHazards.filter(hazard => 
      selectedHazards.has(hazard.id)
    );
    
    if (hazardsToAdd.length > 0) {
      onAddHazards(hazardsToAdd);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 dark:bg-gray-900 dark:bg-opacity-50 z-50"></div>
      <div className="fixed inset-0 overflow-y-auto h-full w-full flex items-center justify-center z-50">
        <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-lg-xl p-6 max-w-4xl w-full m-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">AI RAMS Hazard Assistant</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Use AI to help identify potential hazards and control measures for your RAMS based on the project details.
            </p>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Customize your prompt (optional)
              </label>
              <textarea
                value={aiPrompt}
                onChange={handlePromptChange}
                placeholder={generateDefaultPrompt()}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            
            <button
              onClick={handleGenerateHazards}
              disabled={loading}
              className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating Hazards...
                </>
              ) : (
                'Generate Hazards with AI'
              )}
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-md flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {aiResponse && (
            <div className="mb-4">
              <h3 className="text-md font-medium text-gray-900 dark:text-white mb-2">AI Response</h3>
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap max-h-40 overflow-y-auto">
                {aiResponse}
              </div>
            </div>
          )}

          {suggestedHazards.length > 0 && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-md font-medium text-gray-900 dark:text-white">Suggested Hazards</h3>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedHazards.size} of {suggestedHazards.length} selected
                </span>
              </div>
              
              <div className="max-h-60 overflow-y-auto mb-4">
                {suggestedHazards.map(hazard => (
                  <div 
                    key={hazard.id}
                    className={`p-3 mb-2 rounded-md border cursor-pointer ${
                      selectedHazards.has(hazard.id)
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                    onClick={() => toggleHazardSelection(hazard.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white">{hazard.title}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          <span className="font-medium">Who might be harmed:</span> {hazard.whoMightBeHarmed}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          <span className="font-medium">How:</span> {hazard.howMightBeHarmed}
                        </p>
                        
                        {hazard.controlMeasures.length > 0 && (
                          <div className="mt-2">
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Control Measures:</p>
                            <ul className="text-sm text-gray-600 dark:text-gray-400 list-disc pl-5 mt-1">
                              {hazard.controlMeasures.map((measure, index) => (
                                <li key={index}>{measure.description}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                      
                      <div className={`h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                        selectedHazards.has(hazard.id)
                          ? 'bg-indigo-500 text-white'
                          : 'border-2 border-gray-300 dark:border-gray-600'
                      }`}>
                        {selectedHazards.has(hazard.id) && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddSelectedHazards}
                  disabled={selectedHazards.size === 0}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Selected Hazards
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
