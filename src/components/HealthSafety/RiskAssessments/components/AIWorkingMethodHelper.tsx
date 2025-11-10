import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';

// Define interface for API response working methods
interface ApiWorkingMethod {
  number: number;
  description: string;
}

interface WorkingMethodItem {
  id: string;
  number: number;
  description: string;
}

interface AIWorkingMethodHelperProps {
  isOpen: boolean;
  onClose: () => void;
  onAddWorkingMethods: (methods: WorkingMethodItem[]) => void;
  assessmentDetails: {
    name: string;
    location: string;
    assessor: string;
    selectedPPE: string[];
    guidelines?: string;
  };
}

function AIWorkingMethodHelper({ isOpen, onClose, onAddWorkingMethods, assessmentDetails }: AIWorkingMethodHelperProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiPrompt, setAiPrompt] = useState('');
  const [suggestedMethods, setSuggestedMethods] = useState<WorkingMethodItem[]>([]);
  const [selectedMethods, setSelectedMethods] = useState<Set<string>>(new Set());
  const [aiResponse, setAiResponse] = useState<string | null>(null);

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAiPrompt(e.target.value);
  };

  const generateDefaultPrompt = () => {
    const { name, location, selectedPPE, guidelines } = assessmentDetails;
    
    let prompt = `Generate a comprehensive list of step-by-step working methods for a workplace task with the following details:\n`;
    prompt += `Task/Activity: ${name}\n`;
    prompt += `Location: ${location}\n`;
    
    if (selectedPPE.length > 0) {
      prompt += `\nPPE in use: ${selectedPPE.join(', ')}\n`;
    }
    
    if (guidelines) {
      prompt += `\nSafety Guidelines: ${guidelines}\n`;
    }
    
    prompt += `\nPlease provide a detailed, sequential list of working methods/steps that should be followed to complete this task safely and efficiently. Each step should be:\n`;
    prompt += `1. Clear and specific\n`;
    prompt += `2. Actionable and practical\n`;
    prompt += `3. Safety-conscious\n`;
    prompt += `4. Logically ordered\n`;
    prompt += `5. Appropriate for the skill level of workers\n`;
    
    prompt += `\nFocus on the most important steps that ensure both safety and quality completion of the work.`;
    
    return prompt;
  };

  const handleGenerateWorkingMethods = async () => {
    setLoading(true);
    setError(null);
    setAiResponse(null);
    setSuggestedMethods([]);
    
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
              content: "You are a health and safety expert specializing in developing safe work procedures. Your task is to generate step-by-step working methods for workplace tasks that prioritize safety, efficiency, and compliance with regulations.\n\nFor each working method sequence, you need to provide:\n1. Clear, sequential steps that are easy to follow\n2. Safety considerations integrated into each step\n3. Logical progression from start to completion\n4. Practical and actionable instructions\n5. Appropriate level of detail for the task complexity\n\nYour response must be thorough, practical, and compliant with health and safety standards. Focus on creating working methods that minimize risk while ensuring task completion.\n\nFormat your response as JSON with the following structure: { text: 'your detailed explanation of the approach', workingMethods: [{ number: sequential number starting from 1, description: 'detailed step description' }] }"
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
      
      // Convert the AI response to working method items
      const methods = parsedResponse.workingMethods.map((method: ApiWorkingMethod) => ({
        id: crypto.randomUUID(),
        number: method.number,
        description: method.description
      }));
      
      setSuggestedMethods(methods);
    } catch (err) {
      console.error('Error generating working methods:', err);
      setError('Failed to generate working methods. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleMethodSelection = (methodId: string) => {
    setSelectedMethods(prev => {
      const newSet = new Set(prev);
      if (newSet.has(methodId)) {
        newSet.delete(methodId);
      } else {
        newSet.add(methodId);
      }
      return newSet;
    });
  };

  const handleAddSelectedMethods = () => {
    const methodsToAdd = suggestedMethods.filter(method => 
      selectedMethods.has(method.id)
    );
    
    if (methodsToAdd.length > 0) {
      onAddWorkingMethods(methodsToAdd);
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
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">AI Working Methods Assistant</h2>
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
              Use AI to help generate step-by-step working methods for your task.
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
              onClick={handleGenerateWorkingMethods}
              disabled={loading}
              className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating Working Methods...
                </>
              ) : (
                'Generate Working Methods with AI'
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

          {suggestedMethods.length > 0 && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-md font-medium text-gray-900 dark:text-white">Suggested Working Methods</h3>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedMethods.size} of {suggestedMethods.length} selected
                </span>
              </div>
              
              <div className="max-h-60 overflow-y-auto mb-4">
                {suggestedMethods.map(method => (
                  <div 
                    key={method.id}
                    className={`p-3 mb-2 rounded-md border cursor-pointer ${
                      selectedMethods.has(method.id)
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                    onClick={() => toggleMethodSelection(method.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1 flex items-start space-x-3">
                        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-600 rounded-full">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">#{method.number}</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-800 dark:text-gray-200">{method.description}</p>
                        </div>
                      </div>
                      
                      <div className={`h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0 ml-3 ${
                        selectedMethods.has(method.id)
                          ? 'bg-indigo-500 text-white'
                          : 'border-2 border-gray-300 dark:border-gray-600'
                      }`}>
                        {selectedMethods.has(method.id) && (
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
                  onClick={handleAddSelectedMethods}
                  disabled={selectedMethods.size === 0}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Selected Methods
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export { AIWorkingMethodHelper };
export default AIWorkingMethodHelper;
